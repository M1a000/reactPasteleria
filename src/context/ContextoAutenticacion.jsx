import { createContext, useState } from 'react';

export const ContextoAutenticacion = createContext();

// --- FUNCIONES AUXILIARES DE "ENCRIPTACION" (Base64) ---

// Esta funcion toma los datos sensibles y los convierte en un string Base64
const _empaquetarDatos = (datos) => {
  const { password, fechaNacimiento, telefono, codigoPromo } = datos;
  const datosSensibles = { password, fechaNacimiento, telefono, codigoPromo };
  // btoa() = "Binary to ASCII" -> Codifica a Base64
  return btoa(JSON.stringify(datosSensibles));
};

// Esta funcion toma el string Base64 y lo vuelve a convertir en un objeto
const _desempaquetarDatos = (datosBase64) => {
  if (!datosBase64) return {}; // Si no hay datos, devuelve objeto vacio
  // atob() = "ASCII to Binary" -> Decodifica desde Base64
  return JSON.parse(atob(datosBase64));
};

// Funcion para convertir imagen (la dejamos igual)
const convertirBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
// ---------------------------------------------------


export default function ProveedorAutenticacion({ children }) {
  
  // --- Estados de Autenticacion ---
  const [usuario, setUsuario] = useState(() => {
    const savedUserJSON = localStorage.getItem('usuarioLogueado');
    if (!savedUserJSON) return null;
    
    // 1. Leemos el usuario "empaquetado" de localStorage
    const usuarioGuardado = JSON.parse(savedUserJSON);
    // 2. "Desempaquetamos" los datos sensibles y los unimos al objeto
    const datosSensibles = _desempaquetarDatos(usuarioGuardado.datosSeguros);
    
    // Retornamos el objeto de usuario completo (desempaquetado)
    return { ...usuarioGuardado, ...datosSensibles };
  });

  const [usuariosRegistrados, setUsuariosRegistrados] = useState(() => {
    const savedUsersJSON = localStorage.getItem('usuariosRegistrados');
    if (!savedUsersJSON) return [];
    
    // Hacemos lo mismo para la lista de todos los usuarios
    const listaGuardada = JSON.parse(savedUsersJSON);
    return listaGuardada.map(u => {
      const datosSensibles = _desempaquetarDatos(u.datosSeguros);
      return { ...u, ...datosSensibles };
    });
  });

  const [mensaje, setMensaje] = useState(null);


  // --- FUNCION INTERNA PARA GUARDAR CAMBIOS ---
  const _guardarActualizacion = (usuarioActualizado) => {
    // 1. "Empaquetamos" los datos sensibles
    const datosSeguros = _empaquetarDatos(usuarioActualizado);

    // 2. Creamos el objeto que se guardara en localStorage
    // (sin los datos sensibles, solo con el paquete)
    const usuarioParaGuardar = {
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      fotoPerfil: usuarioActualizado.fotoPerfil,
      datosSeguros: datosSeguros // <-- El string "encriptado"
    };

    // 3. Actualiza el estado de React (con el objeto completo)
    setUsuario(usuarioActualizado);
    // 4. Actualiza el localStorage de la sesion (con el objeto empaquetado)
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioParaGuardar));
    
    // 5. Actualiza la lista completa de usuarios registrados
    const emailOriginal = usuario.email; 
    const listaActualizada = usuariosRegistrados.map(u => 
      (u.email === emailOriginal) ? usuarioActualizado : u
    );
    
    // 6. "Empaquetamos" la lista antes de guardarla
    const listaParaGuardar = listaActualizada.map(u => {
      const datosSeguros = _empaquetarDatos(u);
      return {
        nombre: u.nombre,
        email: u.email,
        fotoPerfil: u.fotoPerfil,
        datosSeguros: datosSeguros
      };
    });
    
    setUsuariosRegistrados(listaActualizada); // Estado de React (completo)
    localStorage.setItem('usuariosRegistrados', JSON.stringify(listaParaGuardar)); // localStorage (empaquetado)
  };

  // --- FUNCION INTERNA PARA VALIDAR PASSWORD ---
  // (Esta funcion no cambia, porque opera sobre el estado de React,
  // que ya esta "desempaquetado")
  const validarPassword = (passwordActual) => {
    if (usuario.password !== passwordActual) {
      setMensaje('Error: La contraseña actual es incorrecta.');
      return false;
    }
    setMensaje(null);
    return true;
  };


  // --- Funciones de Autenticacion (Modificadas) ---

  const registrarUsuario = (datosUsuario) => {
    setMensaje(null);
    
    // Buscamos en la lista (desempaquetada)
    if (usuariosRegistrados.find(u => u.email === datosUsuario.email)) {
      setMensaje('Error: El email ya está registrado.');
      return false; 
    }

    const nuevoUsuario = { 
      ...datosUsuario, 
      telefono: '', 
      fotoPerfil: null 
    };
    
    const nuevosUsuarios = [...usuariosRegistrados, nuevoUsuario];
    
    // Empaquetamos el usuario nuevo antes de guardarlo
    const datosSeguros = _empaquetarDatos(nuevoUsuario);
    const usuarioParaGuardar = {
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      fotoPerfil: nuevoUsuario.fotoPerfil,
      datosSeguros: datosSeguros
    };

    // Empaquetamos la lista nueva antes de guardarla
    const listaParaGuardar = nuevosUsuarios.map(u => {
      const datosSeguros = _empaquetarDatos(u);
      return {
        nombre: u.nombre,
        email: u.email,
        fotoPerfil: u.fotoPerfil,
        datosSeguros: datosSeguros
      };
    });

    setUsuariosRegistrados(nuevosUsuarios); // Estado React
    setUsuario(nuevoUsuario); // Estado React
    localStorage.setItem('usuariosRegistrados', JSON.stringify(listaParaGuardar)); // localStorage
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioParaGuardar)); // localStorage
    
    return true;
  };

  const iniciarSesion = (email, password) => {
    setMensaje(null);

    // Buscamos en la lista (desempaquetada)
    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      // Empaquetamos antes de guardar en la sesion
      const datosSeguros = _empaquetarDatos(usuarioEncontrado);
      const usuarioParaGuardar = {
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        fotoPerfil: usuarioEncontrado.fotoPerfil,
        datosSeguros: datosSeguros
      };

      setUsuario(usuarioEncontrado); // Estado React
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioParaGuardar)); // localStorage
      return true;
    }

    setMensaje('Error: Email o contraseña incorrectos.');
    return false;
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioLogueado');
    setMensaje(null);
  };

  const limpiarMensaje = () => {
    setMensaje(null);
  };

  // --- Funciones de Actualizacion (no cambian) ---
  // (Operan sobre el estado de React (desempaquetado) y 
  // luego llaman a _guardarActualizacion, que si empaqueta)

  const actualizarDatos = (nuevosDatos, passwordActual) => {
    if (!validarPassword(passwordActual)) {
      return false;
    }
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    _guardarActualizacion(usuarioActualizado);
    return true;
  };

  const actualizarPassword = (passwordActual, passwordNueva) => {
    if (!validarPassword(passwordActual)) {
      return false;
    }
    const usuarioActualizado = { ...usuario, password: passwordNueva };
    _guardarActualizacion(usuarioActualizado);
    return true;
  };

  const actualizarFoto = async (archivoFoto, passwordActual) => {
    if (!validarPassword(passwordActual)) {
      return false;
    }

    try {
      const fotoBase64 = await convertirBase64(archivoFoto);
      const usuarioActualizado = { ...usuario, fotoPerfil: fotoBase64 };
      _guardarActualizacion(usuarioActualizado);
      return true;
    } catch (error) {
      console.error("Error al convertir imagen a Base64:", error);
      setMensaje("Error al procesar la imagen. Intenta con otra.");
      return false;
    }
  };


  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        usuariosRegistrados,
        mensaje,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        limpiarMensaje,
        actualizarDatos,
        actualizarPassword,
        actualizarFoto
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}
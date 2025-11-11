// ...existing code...
import { createContext, useState, useContext } from 'react';

export const ContextoAutenticacion = createContext(null);

// --- FUNCIONES AUXILIARES DE "ENCRIPTACION" (Base64) ---
const _empaquetarDatos = (datos) => {
  const { password, fechaNacimiento, telefono, codigoPromo } = datos;
  const datosSensibles = { password, fechaNacimiento, telefono, codigoPromo };
  return btoa(JSON.stringify(datosSensibles));
};

const _desempaquetarDatos = (datosBase64) => {
  if (!datosBase64) return {};
  try {
    return JSON.parse(atob(datosBase64));
  } catch {
    return {};
  }
};

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
  const [usuario, setUsuario] = useState(() => {
    const savedUserJSON = localStorage.getItem('usuarioLogueado');
    if (!savedUserJSON) return null;

    const usuarioGuardado = JSON.parse(savedUserJSON);
    const datosSensibles = _desempaquetarDatos(usuarioGuardado.datosSeguros);

    // Restauramos el usuario combinando datos no sensibles + datos desempaquetados
    const { datosSeguros, ...rest } = usuarioGuardado;
    return { ...rest, ...datosSensibles };
  });

  const [usuariosRegistrados, setUsuariosRegistrados] = useState(() => {
    const savedUsersJSON = localStorage.getItem('usuariosRegistrados');
    if (!savedUsersJSON) return [];

    const listaGuardada = JSON.parse(savedUsersJSON);
    return listaGuardada.map(u => {
      const datosSensibles = _desempaquetarDatos(u.datosSeguros);
      const { datosSeguros, ...rest } = u;
      return { ...rest, ...datosSensibles };
    });
  });

  const [mensaje, setMensaje] = useState(null);

  // --- FUNCION INTERNA PARA GUARDAR CAMBIOS ---
  const _guardarActualizacion = (usuarioActualizado) => {
    const datosSeguros = _empaquetarDatos(usuarioActualizado);

    const usuarioParaGuardar = {
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      fotoPerfil: usuarioActualizado.fotoPerfil,
      rol: usuarioActualizado.rol,
      datosSeguros: datosSeguros
    };

    setUsuario(usuarioActualizado);
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioParaGuardar));

    const emailOriginal = usuario?.email ?? usuarioActualizado.email;
    const listaActualizada = usuariosRegistrados.map(u =>
      (u.email === emailOriginal) ? usuarioActualizado : u
    );

    const listaParaGuardar = listaActualizada.map(u => {
      const datosSeguros = _empaquetarDatos(u);
      return {
        nombre: u.nombre,
        email: u.email,
        fotoPerfil: u.fotoPerfil,
        rol: u.rol,
        datosSeguros: datosSeguros
      };
    });

    setUsuariosRegistrados(listaActualizada);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(listaParaGuardar));
  };

  // --- FUNCION INTERNA PARA VALIDAR PASSWORD ---
  const validarPassword = (passwordActual) => {
    if (!usuario) {
      setMensaje('Error: No hay usuario logueado.');
      return false;
    }
    if (usuario.password !== passwordActual) {
      setMensaje('Error: La contraseña actual es incorrecta.');
      return false;
    }
    setMensaje(null);
    return true;
  };

  // --- Funciones de Autenticacion ---
  const registrarUsuario = (datosUsuario) => {
    setMensaje(null);

    if (usuariosRegistrados.find(u => u.email === datosUsuario.email)) {
      setMensaje('Error: El email ya está registrado.');
      return false;
    }

    const nuevoUsuario = {
      ...datosUsuario,
      telefono: datosUsuario.telefono ?? '',
      fotoPerfil: datosUsuario.fotoPerfil ?? null,
      rol: 'cliente' // rol por defecto
    };

    const nuevosUsuarios = [...usuariosRegistrados, nuevoUsuario];

    const datosSeguros = _empaquetarDatos(nuevoUsuario);
    const usuarioParaGuardar = {
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      fotoPerfil: nuevoUsuario.fotoPerfil,
      rol: nuevoUsuario.rol,
      datosSeguros: datosSeguros
    };

    const listaParaGuardar = nuevosUsuarios.map(u => {
      const datosSeguros = _empaquetarDatos(u);
      return {
        nombre: u.nombre,
        email: u.email,
        fotoPerfil: u.fotoPerfil,
        rol: u.rol,
        datosSeguros: datosSeguros
      };
    });

    setUsuariosRegistrados(nuevosUsuarios);
    setUsuario(nuevoUsuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(listaParaGuardar));
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioParaGuardar));

    return true;
  };

  const iniciarSesion = (email, password) => {
    setMensaje(null);

    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      const usuarioConRol = { ...usuarioEncontrado };

      // Asigna rol admin si coincide el email (ajusta según tu necesidad)
      if (usuarioConRol.email === 'admin@pasteleria.com') {
        usuarioConRol.rol = 'admin';
      } else {
        usuarioConRol.rol = usuarioConRol.rol ?? 'cliente';
      }

      const datosSeguros = _empaquetarDatos(usuarioConRol);
      const usuarioParaGuardar = {
        nombre: usuarioConRol.nombre,
        email: usuarioConRol.email,
        fotoPerfil: usuarioConRol.fotoPerfil,
        rol: usuarioConRol.rol,
        datosSeguros: datosSeguros
      };

      setUsuario(usuarioConRol);
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioParaGuardar));
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

  // --- Funciones de Actualizacion ---
  const actualizarDatos = (nuevosDatos, passwordActual) => {
    if (!validarPassword(passwordActual)) return false;
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    _guardarActualizacion(usuarioActualizado);
    return true;
  };

  const actualizarPassword = (passwordActual, passwordNueva) => {
    if (!validarPassword(passwordActual)) return false;
    const usuarioActualizado = { ...usuario, password: passwordNueva };
    _guardarActualizacion(usuarioActualizado);
    return true;
  };

  const actualizarFoto = async (archivoFoto, passwordActual) => {
    if (!validarPassword(passwordActual)) return false;

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

// Hook para consumir el contexto desde otros componentes
export const useAutenticacion = () => {
  const ctx = useContext(ContextoAutenticacion);
  if (!ctx) throw new Error('useAutenticacion debe usarse dentro de ProveedorAutenticacion');
  return ctx;
};
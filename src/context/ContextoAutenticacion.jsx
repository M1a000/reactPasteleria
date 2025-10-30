import { createContext, useState } from 'react';

export const ContextoAutenticacion = createContext();

export default function ProveedorAutenticacion({ children }) {
  
  // --- Estados de Autenticacion ---
  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem('usuarioLogueado');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usuariosRegistrados, setUsuariosRegistrados] = useState(() => {
    const savedUsers = localStorage.getItem('usuariosRegistrados');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [mensaje, setMensaje] = useState(null);

  // --- Funciones de Autenticacion ---

  const registrarUsuario = (datosUsuario) => {
    setMensaje(null);
    
    if (usuariosRegistrados.find(u => u.email === datosUsuario.email)) {
      setMensaje('Error: El email ya esta registrado.');
      return false; 
    }

    // --- ¡CAMBIO 1: Añadimos telefono y fotoPerfil vacios al registrar! ---
    const nuevoUsuario = { 
      ...datosUsuario, 
      telefono: '', 
      fotoPerfil: null 
    };
    
    const nuevosUsuarios = [...usuariosRegistrados, nuevoUsuario];
    setUsuariosRegistrados(nuevosUsuarios);
    setUsuario(nuevoUsuario); 

    localStorage.setItem('usuariosRegistrados', JSON.stringify(nuevosUsuarios));
    localStorage.setItem('usuarioLogueado', JSON.stringify(nuevoUsuario));
    
    return true;
  };

  const iniciarSesion = (email, password) => {
    setMensaje(null);

    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
      return true;
    }

    setMensaje('Error: Email o contrasena incorrectos.');
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

  // --- ¡CAMBIO 2: 'actualizarUsuario' ahora guarda la fotoPerfil! ---
  const actualizarUsuario = (nuevosDatos) => {
    // 1. Actualizamos el usuario de la sesion actual
    // (nuevosDatos ahora incluye 'fotoPerfil')
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    setUsuario(usuarioActualizado);
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado));

    // 2. Actualizamos la lista principal de usuarios registrados
    const emailOriginal = usuario.email; 
    
    const listaActualizada = usuariosRegistrados.map(u => {
      if (u.email === emailOriginal) {
        // Reemplazamos el usuario con los nuevos datos (preservando la contraseña)
        return { ...u, ...nuevosDatos };
      }
      return u;
    });

    setUsuariosRegistrados(listaActualizada);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(listaActualizada));
    
    return true; 
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
        actualizarUsuario 
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}


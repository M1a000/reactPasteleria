import { createContext, useState } from 'react';

export const ContextoAutenticacion = createContext();

export default function ProveedorAutenticacion({ children }) {
  
  // --- Estados de Autenticación ---
  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem('usuarioLogueado');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usuariosRegistrados, setUsuariosRegistrados] = useState(() => {
    const savedUsers = localStorage.getItem('usuariosRegistrados');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // --- ¡CAMBIO 1: Nuevo estado para mensajes! ---
  // (Guardará mensajes de error)
  const [mensaje, setMensaje] = useState(null);

  // --- Funciones de Autenticación ---

  const registrarUsuario = (datosUsuario) => {
    // Limpiamos mensajes de error anteriores
    setMensaje(null);
    
    // Comprobamos si el email ya existe
    if (usuariosRegistrados.find(u => u.email === datosUsuario.email)) {
      // --- ¡CAMBIO 2: Usamos setMensaje en lugar de alert()! ---
      setMensaje('Error: El email ya está registrado.');
      return false; // Detenemos la función
    }

    // Si no existe, lo agregamos
    const nuevosUsuarios = [...usuariosRegistrados, datosUsuario];
    setUsuariosRegistrados(nuevosUsuarios);
    setUsuario(datosUsuario); // Logueamos al usuario nuevo

    localStorage.setItem('usuariosRegistrados', JSON.stringify(nuevosUsuarios));
    localStorage.setItem('usuarioLogueado', JSON.stringify(datosUsuario));
    
    return true; // Registro exitoso
  };

  const iniciarSesion = (email, password) => {
    // Limpiamos mensajes de error anteriores
    setMensaje(null);

    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
      return true; // Inicio de sesión exitoso
    }

    // --- ¡CAMBIO 3: Usamos setMensaje en lugar de alert()! ---
    setMensaje('Error: Email o contraseña incorrectos.');
    return false; // Inicio de sesión fallido
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioLogueado');
    setMensaje(null); // Limpiamos mensajes al cerrar sesión
  };

  // --- ¡CAMBIO 4: Nueva función para limpiar mensajes! ---
  const limpiarMensaje = () => {
    setMensaje(null);
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        usuariosRegistrados,
        mensaje, // Exportamos el mensaje
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        limpiarMensaje // Exportamos la función de limpiar
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}


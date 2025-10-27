import { createContext, useState, useEffect } from 'react';

// 1. Creamos el Contexto
export const ContextoAutenticacion = createContext();

// 2. Creamos el "Proveedor" (Provider) del contexto
export default function ProveedorAutenticacion({ children }) {
  // 3. Estado para el usuario.
  // Intentamos leer el usuario desde localStorage al iniciar
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario_pasteleria');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // 4. Efecto para guardar en localStorage cada vez que 'usuario' cambie
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario_pasteleria', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario_pasteleria');
    }
  }, [usuario]);

  // 5. Función para registrar (simulada)
  const registrarUsuario = (datosUsuario) => {
    // Aquí iría la lógica para guardar en una BD, por ahora solo lo "logueamos"
    setUsuario(datosUsuario);
    console.log("Usuario registrado y logueado:", datosUsuario);
  };

  // 6. Función para iniciar sesión (simulada)
  const iniciarSesion = (email, password) => {
    // Lógica de inicio de sesión...
    // Como es simulado, buscaremos si el email existe en localStorage 
    // (en un proyecto real, esto lo valida un backend)
    // Esta es una simulación MUY simple
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario_pasteleria'));

    if (usuarioGuardado && usuarioGuardado.email === email && usuarioGuardado.password === password) {
      setUsuario(usuarioGuardado);
      console.log("Inicio de sesión exitoso:", usuarioGuardado);
      return true; // Éxito
    } else {
      console.error("Error de inicio de sesión: email o contraseña incorrectos");
      return false; // Error
    }
  };

  // 7. Función para cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
    console.log("Sesión cerrada.");
  };

  // 8. Proveemos los valores al resto de la app
  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario, // El estado del usuario (null si no está logueado)
        registrarUsuario,
        iniciarSesion,
        cerrarSesion
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}


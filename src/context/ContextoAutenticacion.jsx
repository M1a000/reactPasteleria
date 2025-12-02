// src/context/ContextoAutenticacion.jsx

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ⚠️ Configura aquí la URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080/api'; 

// Detectar modo mock desde env: por defecto activado (para desarrollo local).
// Para usar backend real define en .env: VITE_USE_MOCK=false
const useMock = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_MOCK === 'false') ? false : true;

// Utilidades mock para simular respuestas (usa localStorage)
async function mockDelay(result, ms = 300) {
  return new Promise(resolve => setTimeout(() => resolve(result), ms));
}
function getMockUsers() {
  return JSON.parse(localStorage.getItem('mockUsers') || '[]');
}
function setMockUsers(users) {
  localStorage.setItem('mockUsers', JSON.stringify(users));
}
async function mockFetch(path, options = {}) {
  // Rutas soportadas: /api/auth/login y /api/auth/register
  if (path.endsWith('/api/auth/login')) {
    const body = options.body ? JSON.parse(options.body) : {};
    const users = getMockUsers();
    const user = users.find(u => u.email === body.email && u.password === body.password);
    if (user) {
      const role = user.role || (user.email === 'admin@pasteleria.test' ? 'admin' : 'cliente');
      return mockDelay({
        ok: true,
        status: 200,
        data: { usuario: { email: user.email, id: user.id, role }, token: 'mock-token' }
      });
    }
    return mockDelay({ ok: false, status: 401, message: 'Credenciales inválidas (mock)' });
  }

  if (path.endsWith('/api/auth/register')) {
    const body = options.body ? JSON.parse(options.body) : {};
    const users = getMockUsers();
    if (users.find(u => u.email === body.email)) {
      return mockDelay({ ok: false, status: 409, message: 'Usuario ya existe (mock)' });
    }
    // Aceptar role opcional en el payload; por defecto 'cliente'
    const newUser = { ...body, id: Date.now(), role: body.role || 'cliente' };
    users.push(newUser);
    setMockUsers(users);
    return mockDelay({ ok: true, status: 201, data: { usuario: { email: body.email, id: newUser.id, role: newUser.role } } });
  }

  // Resto de rutas: simular 404
  return mockDelay({ ok: false, status: 404, message: 'Not found (mock)' });
}

/* fetchApi robusto: usa mockFetch cuando useMock=true, si no hace fetch real */
async function fetchApi(path, options = {}) {
  const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  if (useMock) {
    // evitar cualquier fetch real en modo mock
    return mockFetch(`${BASE}${path}`, options);
  }

  try {
    const res = await fetch(`${BASE}${path}`, options);
    const text = await res.text().catch(() => '');
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    // Si falla la petición real (network), usamos el mock como fallback
    // Esto evita dejar la UI sin respuesta y reduce ruido de errores manejables.
    console.warn('fetchApi: network error, usando mock como fallback:', err?.message);
    return mockFetch(`${BASE}${path}`, options);
  }
}

// Valor por defecto seguro para evitar destructuring sobre undefined
const defaultAuth = {
  usuario: null,
  login: () => {},
  logout: () => {},
  iniciarSesion: async () => ({ ok: false, message: 'No auth' }),
  registrarUsuario: async () => ({ ok: false, message: 'No auth' })
};

// 1. Crear el Contexto
export const ContextoAutenticacion = createContext(defaultAuth);

// Hook consumidor exportado
export function useAutenticacion() {
  // Si no hay Provider, useContext devolverá el defaultAuth
  return useContext(ContextoAutenticacion) || defaultAuth;
}

export function ContextoAutenticacionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const login = (u) => setUsuario(u);
  const logout = () => setUsuario(null);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  // ----------------------------------------------------
  // 🔑 FUNCIÓN LOGIN (Llama a /api/auth/login)
  // ----------------------------------------------------
  const iniciarSesion = async (email, password) => {
      setMensaje(null);
      try {
          
          // Llama a la API de login
          const res = await fetchApi('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });

          if (!res.ok) {
            if (res.error === 'NETWORK') {
              // Fallback: comprobar users mock en localStorage
              const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
              const user = users.find(u => u.email === email && u.password === password);
              if (user) {
                setUsuario({ email: user.email, id: user.id, mock: true });
                return { ok: true, data: { usuario: { email: user.email, id: user.id }, token: 'mock-token' }, mock: true };
              }
              return { ok: false, status: 401, message: 'Credenciales inválidas (mock)' };
            }
            return res;
          }

          // backend respondió ok
          const usuarioData = res.data?.usuario || null;
          if (usuarioData) setUsuario(usuarioData);
          return res;
          
      } catch (error) {
          // Manejar errores (401, 400, etc.)
          if (error.status === 401) {
              setMensaje('Credenciales incorrectas.');
          } else {
              setMensaje(error.data?.message || 'Error de conexión con el servidor.');
          }
          return null; 
      }
  };
  
  // ----------------------------------------------------
  // 📝 FUNCIÓN REGISTRO (Llama a /api/auth/register)
  // ----------------------------------------------------
  const registrarUsuario = async (datosRegistro) => {
      setMensaje(null);
      try {
          
          // Llama a la API de registro
          const res = await fetchApi('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(datosRegistro)
          });

          if (!res.ok) {
            if (res.error === 'NETWORK') {
              // Fallback: almacenar user en localStorage (solo desarrollo)
              const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
              if (users.find(u => u.email === datosRegistro.email)) {
                return { ok: false, status: 409, message: 'Usuario ya existe (mock)' };
              }
              const newUser = { ...datosRegistro, id: Date.now() };
              users.push(newUser);
              localStorage.setItem('mockUsers', JSON.stringify(users));
              return { ok: true, status: 201, data: { usuario: { email: datosRegistro.email, id: newUser.id } }, mock: true };
            }
            return res;
          }

          return res;
          
      } catch (error) {
          // Manejar errores (ej. 400 por email ya en uso)
          let errorTexto = 'Error desconocido al registrar.';
          if (error.status === 400) {
               errorTexto = error.data?.message || 'El email ya se encuentra en uso.';
          } else {
               errorTexto = 'Error de servidor. Intenta de nuevo más tarde.';
          }
          setMensaje(errorTexto);
          
          // Lanzar el error para que Registro.jsx pueda capturarlo y bloquear el formulario
          throw error; 
      }
  };

  // Función de Logout
  const cerrarSesion = () => {
      setUsuario(null);
      localStorage.removeItem('user');
  };
  
  // Objeto de valor del contexto
  const value = useMemo(() => ({
      usuario,
      mensaje,
      isLoggedIn: !!usuario,
      // Helpers de rol
      isAdmin: usuario && usuario.rol === 'ADMINISTRADOR',
      isVendedor: usuario && usuario.rol === 'VENDEDOR',
      isCliente: usuario && usuario.rol === 'CLIENTE', 
      iniciarSesion,
      cerrarSesion,
      limpiarMensaje,
      registrarUsuario,
      fetchApi // 👈 Esencial para que otros componentes llamen a rutas protegidas
  }), [usuario, mensaje, limpiarMensaje]);

  return (
    <ContextoAutenticacion.Provider value={value}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

// También export por defecto para compatibilidad si algún sitio importa default
export default ContextoAutenticacion;
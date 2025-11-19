// src/context/ContextoAutenticacion.jsx

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ⚠️ Configura aquí la URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080/api'; 

// 1. Crear el Contexto
const AuthContext = createContext();

// Hook personalizado para usar la autenticación
export const useAutenticacion = () => {
    return useContext(AuthContext);
};

// ----------------------------------------------------------------------
// --- FUNCIÓN CENTRAL: CUSTOM FETCH API (Reemplaza a Axios) ---
// ----------------------------------------------------------------------
// Esta función gestiona las llamadas HTTP, inyectando el token JWT si está disponible.
export const fetchApi = async (endpoint, options = {}) => {
    
    // Obtener el usuario/token del almacenamiento local
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user ? user.token : null;
    
    // Configuración de encabezados por defecto
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 💡 Inyectar el Token JWT si existe y si la llamada NO es de autenticación
    if (token && !endpoint.startsWith('/auth')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: headers,
        method: options.method || 'GET'
    };

    // Ejecutar Fetch
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 🚨 Manejo Manual de Errores: Lanzar un error si el estado no es 2xx
    if (!response.ok) {
        let errorData;
        try {
            // Intenta parsear el cuerpo del error (ej. mensaje de error de Spring)
            errorData = await response.json();
        } catch (e) {
            // Si el cuerpo no es JSON (ej. error 500 simple)
            errorData = { message: response.statusText || 'Error desconocido del servidor.' };
        }
        // Lanza un objeto de error para que el try/catch del Login/Registro lo capture
        throw { status: response.status, data: errorData };
    }

    // Si la respuesta es 204 No Content (DELETE), no intentes parsear JSON
    if (response.status === 204) return null;
    
    // Parsear JSON manualmente y devolver los datos
    return response.json();
};

// ----------------------------------------------------------------------
// 2. Componente Proveedor (Provider)
// ----------------------------------------------------------------------
export const ProveedorAutenticacion = ({ children }) => {
  
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            // Inicializar el estado del usuario desde localStorage al cargar la app
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Error al recuperar usuario de localStorage", e);
            return null;
        }
    });

    const [mensaje, setMensaje] = useState(null);

    const limpiarMensaje = useCallback(() => setMensaje(null), []);

    // ----------------------------------------------------
    // 🔑 FUNCIÓN LOGIN (Llama a /api/auth/login)
    // ----------------------------------------------------
    const iniciarSesion = async (email, password) => {
        setMensaje(null);
        try {
            
            // Llama a la API de login
            const responseData = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            
            // API devuelve: { token, id, nombreUsuario, email, rol }
            const { token, nombreUsuario, rol, id } = responseData; 
            
            const newUser = { id, nombreUsuario, email, rol, token };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            
            return newUser; 
            
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
            await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify(datosRegistro),
            });
            
            // Si es exitoso, lanzamos un mensaje (el usuario debe ir a login)
            setMensaje("Registro exitoso. Serás redirigido para iniciar sesión.");

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
        setUser(null);
        localStorage.removeItem('user');
    };
    
    // Objeto de valor del contexto
    const value = useMemo(() => ({
        user,
        mensaje,
        isLoggedIn: !!user,
        // Helpers de rol
        isAdmin: user && user.rol === 'ADMINISTRADOR',
        isVendedor: user && user.rol === 'VENDEDOR',
        isCliente: user && user.rol === 'CLIENTE', 
        iniciarSesion,
        cerrarSesion,
        limpiarMensaje,
        registrarUsuario,
        fetchApi // 👈 Esencial para que otros componentes llamen a rutas protegidas
    }), [user, mensaje, limpiarMensaje]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
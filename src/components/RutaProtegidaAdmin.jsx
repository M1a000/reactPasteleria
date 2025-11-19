// components/RutaProtegidaAdmin.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAutenticacion } from '../context/ContextoAutenticacion';

const RutaProtegidaAdmin = () => {
  const { user, isLoggedIn, isAdmin } = useAutenticacion();
  
  if (!isLoggedIn) {
    // Si no está logueado, lo envía a la página de login
    return <Navigate to="/login" replace />;
  }
  
  // 💡 CLAVE: Si está logueado pero NO es administrador, lo envía a otra página (ej: inicio o error 403)
  if (!isAdmin) {
    return <Navigate to="/" replace />; // O a una página de "Acceso Denegado"
  }

  // Si es ADMINISTRADOR, renderiza el componente hijo
  return <Outlet />;
};

export default RutaProtegidaAdmin;
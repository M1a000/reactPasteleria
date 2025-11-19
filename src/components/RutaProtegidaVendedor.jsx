// src/components/RutaProtegidaVendedor.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAutenticacion } from '../context/ContextoAutenticacion';

const RutaProtegidaVendedor = () => {
  // Asegúrate de extraer isAdmin e isVendedor de useAutenticacion()
  const { isLoggedIn, isAdmin, isVendedor } = useAutenticacion();
  
  // 1. Si no está logueado, lo envía al Login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. 💡 CLAVE: Si está logueado pero NO tiene los roles permitidos:
  // (Si NO es Administrador Y NO es Vendedor)
  if (!isAdmin && !isVendedor) {
    // Lo envía a la página principal o a una de "Acceso Denegado"
    return <Navigate to="/" replace />;
  }

  // 3. Si tiene el rol adecuado (Admin o Vendedor), renderiza el componente hijo
  return <Outlet />;
};

export default RutaProtegidaVendedor;
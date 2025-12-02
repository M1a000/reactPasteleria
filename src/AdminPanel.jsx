import React from 'react';
import { useAutenticacion } from './context/ContextoAutenticacion.jsx';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
  const { usuario } = useAutenticacion() || {};
  if (!usuario || usuario.role !== 'admin') return <Navigate to="/" replace />;
  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>
      <p>Acceso restringido a administradores.</p>
      {/* agregar funcionalidades de admin aquí */}
    </div>
  );
}

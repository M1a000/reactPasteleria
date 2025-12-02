import React from 'react';
import { useAutenticacion } from './context/ContextoAutenticacion.jsx';

export default function MiPerfil() {
  const { usuario } = useAutenticacion() || {};

  if (!usuario) {
    return (
      <div className="container mt-4">
        <h2>Mi Perfil</h2>
        <p>No has iniciado sesión. Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Mi Perfil</h2>
      <div className="card p-3">
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>ID:</strong> {usuario.id}</p>
        <p><strong>Role:</strong> {usuario.role}</p>
      </div>
    </div>
  );
}

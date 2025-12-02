import React, { useState } from 'react';
import { useAutenticacion } from './context/ContextoAutenticacion.jsx';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const auth = useAutenticacion();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const payload = {
      email: e.target.email?.value,
      password: e.target.password?.value,
      // opcional: role (solo dev/mock)
      role: e.target.role?.value || undefined
    };

    const resultado = await auth.registrarUsuario(payload);
    console.log('[Registro] resultado:', resultado);

    if (!resultado || !resultado.ok) {
      setError(resultado?.message || 'Error al registrar usuario');
      return;
    }

    setSuccess('Registro exitoso' + (resultado.mock ? ' (modo mock)' : ''));
    // opcional: redirigir a login
    navigate('/login');
  }

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        {/* ...existing form fields... */}
        <button type="submit">Registrar</button>
      </form>
      {/* Mostrar mensajes */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </div>
  );
}

export default Registro;
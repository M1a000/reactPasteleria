import React, { useState } from 'react';
import { useAutenticacion } from './context/ContextoAutenticacion.jsx';
import { useNavigate } from 'react-router-dom';

function Login() {
  const auth = useAutenticacion();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const email = e.target.email?.value;
    const password = e.target.password?.value;

    const resultado = await auth.iniciarSesion({ email, password });
    console.log('[Login] iniciarSesion resultado:', resultado);

    if (!resultado || !resultado.ok) {
      setError(resultado?.message || 'Fallo al iniciar sesión');
      return;
    }

    const usuarioResp = resultado.data?.usuario;
    if (usuarioResp) auth.login(usuarioResp);

    const role = usuarioResp?.role || auth.usuario?.role;
    if (role === 'admin') navigate('/admin', { replace: true });
    else navigate('/', { replace: true });
  }

  return (
    <div>
      {/* ...existing JSX... */}
      {/* Mostrar error si existe: */}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default Login;
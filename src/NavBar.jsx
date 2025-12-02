import React from 'react';
import { Link } from 'react-router-dom';
import { useAutenticacion } from './context/ContextoAutenticacion.jsx';

const NavBar = () => {
  const { usuario } = useAutenticacion() || {}; // evita "Cannot destructure ... of undefined"

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Pastelería</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">Acerca de</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">Contacto</a>
            </li>
            {usuario && usuario.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Panel</Link>
              </li>
            )}
            {usuario ? (
              <li className="nav-item">
                <Link className="nav-link" to="/mi-perfil">Mi Perfil</Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Iniciar Sesión</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
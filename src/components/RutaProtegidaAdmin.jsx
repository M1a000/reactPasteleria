import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// ¡CORRECCIÓN AQUÍ! (Quitando la extensión .jsx)
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';
import { Container, Spinner, Alert } from 'react-bootstrap';

// Este componente es el "guardia de seguridad"
export default function RutaProtegidaAdmin({ children }) {
  const { usuario } = useContext(ContextoAutenticacion);

  // 1. Caso de Carga (opcional, pero buena practica si el contexto fuera async)
  // En este caso, 'usuario' es síncrono, asi que o es 'null' o es un objeto.
  // Pero si 'usuario' fuera 'undefined' (cargando), esto lo manejaría.
  if (usuario === undefined) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  // 2. Caso No Autenticado (No ha iniciado sesión)
  if (!usuario) {
    // Lo redirigimos a la página de login
    // 'replace' evita que pueda volver atrás con el botón del navegador
    return <Navigate to="/login" replace />;
  }

  // 3. Caso Autenticado, PERO NO es Admin
  if (usuario.rol !== 'admin') {
    // Lo redirigimos a la página principal (o al catálogo)
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Acceso Denegado</Alert.Heading>
          <p>
            No tienes los permisos necesarios para acceder a esta página.
          </p>
        </Alert>
        <Navigate to="/catalogo" replace />
      </Container>
    );
  }

  // 4. Caso Exitoso (Autenticado Y es Admin)
  // Renderiza el componente que se le pasó (ej. <AdminDashboard />)
  return children;
}
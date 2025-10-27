import { useContext } from 'react';
// 1. Importamos NavLink en lugar de Link para que muestre la ruta activa
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
// 2. Importamos ambos contextos
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';
import { PasteleriaContext } from '../context/PasteleriaContext';

// 3. ¡LA LÍNEA CLAVE! Asegúrate de que diga "export default function..."
export default function NavBar() {
  // 4. Obtenemos los datos de los contextos
  const { usuario, cerrarSesion } = useContext(ContextoAutenticacion);
  const { total } = useContext(PasteleriaContext);

  // 5. Estilo para el link activo (se verá más blanco y subrayado)
  const activeClassName = ({ isActive }) => (isActive ? 'text-white text-decoration-underline fw-bold' : 'text-white');

  return (
    <Navbar 
      expand="lg" 
      // 6. Usamos el color Chocolate
      style={{ backgroundColor: '#8B4513' }} 
      variant="dark" 
      sticky="top"
      className="shadow-sm"
    >
      <Container>
        {/* 7. Título principal con la fuente Pacifico */}
        <Navbar.Brand as={NavLink} to="/" style={{ fontFamily: 'Pacifico, cursive', fontSize: '1.5rem' }}>
          Pastelería Mil Sabores
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className={activeClassName} end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" className={activeClassName}>
              Catálogo
            </Nav.Link>
          </Nav>
          
          {/* 8. Lógica para mostrar links de usuario */}
          <Nav className="ms-auto align-items-center">
            {usuario ? (
              // --- VISTA SI ESTÁ LOGUEADO ---
              <>
                <Nav.Link as={NavLink} to="/carrito" className={activeClassName}>
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                <Navbar.Text className="text-white mx-2">
                  Hola, {usuario.email}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={cerrarSesion}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              // --- VISTA SI NO ESTÁ LOGUEADO ---
              <>
                <Nav.Link as={NavLink} to="/carrito" className={activeClassName}>
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" className={activeClassName}>
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro" className={activeClassName}>
                  Regístrate
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


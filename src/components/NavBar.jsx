import { useContext } from 'react';
// 1. Importamos NavLink y AHORA TAMBIÉN useNavigate
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
// 2. Importamos ambos contextos
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';
import { PasteleriaContext } from '../context/PasteleriaContext';

export default function NavBar() {
  // 3. Obtenemos los datos y el hook de navegación
  const { usuario, cerrarSesion } = useContext(ContextoAutenticacion);
  const { total } = useContext(PasteleriaContext);
  const navigate = useNavigate(); // Hook para redirigir

  // 4. Estilo para el link activo
  const activeClassName = ({ isActive }) => (isActive ? 'text-white text-decoration-underline fw-bold' : 'text-white');

  // 5. ¡NUEVA FUNCIÓN! para manejar el cierre de sesión
  const handleCerrarSesion = () => {
    cerrarSesion(); // Llama a la función del contexto
    // Redirige a Home y le pasa un mensaje de estado
    navigate('/', { state: { mensaje: 'Has cerrado sesión exitosamente.' } });
  };

  return (
    <Navbar 
      expand="lg" 
      style={{ backgroundColor: '#8B4513' }} 
      variant="dark" 
      sticky="top"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" style={{ fontFamily: 'Pacifico, cursive', fontSize: '1.5rem' }}>
          Pastelería Mil Sabores
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className={activeClassName} end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" className={activeClassName}>
              Catálogo
            </Nav.Link>
          </Nav>
          
          {/* 6. Alineamos a la derecha en pantallas grandes, y al final en móviles */}
          <Nav className="ms-lg-auto align-items-lg-center">
            {usuario ? (
              // --- VISTA SI ESTÁ LOGUEADO ---
              <>
                <Nav.Link as={NavLink} to="/carrito" className={`${activeClassName} text-end text-lg-start`}>
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                <Navbar.Text className="text-white mx-lg-2 text-end text-lg-start">
                  Hola, {usuario.nombre}
                </Navbar.Text>
                {/* 7. El botón ahora llama a la nueva función */}
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleCerrarSesion} 
                  className="mt-2 mt-lg-0 ms-lg-2 w-100 w-lg-auto"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              // --- VISTA SI NO ESTÁ LOGUEADO ---
              <>
                <Nav.Link as={NavLink} to="/carrito" className={`${activeClassName} text-end text-lg-start`}>
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" className={`${activeClassName} text-end text-lg-start`}>
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro" className={`${activeClassName} text-end text-lg-start`}>
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


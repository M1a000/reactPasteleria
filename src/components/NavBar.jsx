import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
// Importamos ambos contextos
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';
import { PasteleriaContext } from '../context/PasteleriaContext';

export default function NavBar() {
  const { usuario, cerrarSesion } = useContext(ContextoAutenticacion);
  const { total } = useContext(PasteleriaContext);
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/', { state: { mensaje: 'Has cerrado sesion exitosamente.' } });
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
          Pasteleria Mil Sabores
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          
          <Nav className="me-auto w-100 align-items-lg-center">
            
            {/* --- LINKS DE LA IZQUIERDA --- */}
            <Nav.Link 
              as={NavLink} 
              to="/" 
              className={({isActive}) => `nav-link-custom ${isActive ? 'active' : ''}`} 
              end
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/catalogo" 
              className={({isActive}) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              Catalogo
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/sobre-nosotros" 
              className={({isActive}) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              Sobre Nosotros
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/contacto" 
              className={({isActive}) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              Contacto
            </Nav.Link>
            
            {/* --- LINKS DE LA DERECHA (con logica de usuario) --- */}
            {usuario ? (
              // --- VISTA SI ESTÁ LOGUEADO ---
              // Añadimos 'ms-lg-auto' para empujar todo este bloque a la derecha en desktop
              // Y 'align-items-center' para centrar verticalmente los items del usuario/boton
              <div className="d-flex align-items-center ms-lg-auto mt-2 mt-lg-0">
                <Nav.Link 
                  as={NavLink} 
                  to="/carrito" 
                  className={({isActive}) => `nav-link-custom me-3 ${isActive ? 'active' : ''}`}
                >
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleCerrarSesion} 
                  className="me-3" // Margen a la derecha del boton
                >
                  Cerrar Sesion
                </Button>

                <Nav.Link 
                  as={NavLink} 
                  to="/mi-perfil" 
                  className={({isActive}) => `nav-link-custom d-flex flex-column align-items-center px-lg-2 ${isActive ? 'active' : ''}`}
                  title="Ir a Mi Perfil" 
                >
                  <Image
                    src={usuario.fotoPerfil || 'https://placehold.co/30x30/FFF5E1/5D4037?text=Perfil'}
                    roundedCircle
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    className="mb-1" // Margen abajo
                  />
                  {/* --- ¡CAMBIO AQUI! --- Color blanco forzado */}
                  <span style={{ fontSize: '0.75rem', color: 'white' }}>{usuario.nombre}</span>
                </Nav.Link>
                
              </div>
            ) : (
              // --- VISTA SI NO ESTÁ LOGUEADO ---
              <>
                <Nav.Link 
                  as={NavLink} 
                  to="/carrito" 
                  className={({isActive}) => `nav-link-custom ms-lg-auto ${isActive ? 'active' : ''}`}
                >
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/login" 
                  className={({isActive}) => `nav-link-custom ${isActive ? 'active' : ''}`}
                >
                  Iniciar Sesion
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/registro" 
                  className={({isActive}) => `nav-link-custom ${isActive ? 'active' : ''}`}
                >
                  Registrate
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


import { useContext } from 'react';
// 1. Ya no necesitamos 'useNavigate' ni 'Button' aqui
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
// Importamos ambos contextos
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';
import { PasteleriaContext } from '../context/PasteleriaContext';

export default function NavBar() {
  // 2. Ya no necesitamos 'cerrarSesion' aqui
  const { usuario } = useContext(ContextoAutenticacion);
  const { total } = useContext(PasteleriaContext);

  // 3. Funcion para estilos activos/inactivos (usando la clase CSS)
  const activeClassName = ({ isActive }) => (
    isActive ? 'nav-link-custom active' : 'nav-link-custom' 
  );
  
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
              className={activeClassName} 
              end
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/catalogo" 
              className={activeClassName}
            >
              Catalogo
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/sobre-nosotros" 
              className={activeClassName}
            >
              Sobre Nosotros
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/contacto" 
              className={activeClassName}
            >
              Contacto
            </Nav.Link>
            
            {/* --- LINK DE ADMIN (CONDICIONAL) --- */}
            {usuario && usuario.rol === 'ADMIN' && (
              <Nav.Link 
                as={NavLink} 
                to="/admin" // Ruta base del panel de admin
                className={activeClassName}
              >
                Panel Admin
              </Nav.Link>
            )}

            
            {/* --- LINKS DE LA DERECHA --- */}
            {usuario ? (
              // --- VISTA LOGUEADO ---
              // Usamos d-flex para alinear horizontalmente en desktop
              // ms-lg-auto empuja todo este grupo a la derecha en desktop
              <div className="d-lg-flex align-items-center ms-lg-auto mt-2 mt-lg-0">
                <Nav.Link 
                  as={NavLink} 
                  to="/carrito" 
                  className={activeClassName}
                >
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                
                {/* 4. BOTON "CERRAR SESION" YA NO ESTA AQUI */}

                {/* 5. Link de Perfil */}
                <Nav.Link 
                  as={NavLink} 
                  to="/mi-perfil" 
                  // Margen a la izquierda en desktop
                  className={`${activeClassName} d-flex flex-column align-items-center mt-2 mt-lg-0 ms-lg-2`}
                  title="Ir a Mi Perfil" 
                >
                  <Image
                    src={usuario.fotoPerfil || 'https://placehold.co/30x30/FFF5E1/5D4037?text=Perfil'}
                    roundedCircle
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    className="mb-1"
                  />
                  {/* 6. Nombre con color blanco forzado */}
                  <span className="text-white" style={{ fontSize: '0.75rem' }}>{usuario.nombre}</span>
                </Nav.Link>
              </div>
            ) : (
              // --- VISTA NO LOGUEADO ---
              // Usamos ms-lg-auto para empujar este grupo a la derecha en desktop
              <div className="d-lg-flex align-items-center ms-lg-auto mt-2 mt-lg-0">
                <Nav.Link 
                  as={NavLink} 
                  to="/carrito" 
                  className={activeClassName}
                >
                  🛒 Carrito (${total.toLocaleString('es-CL')})
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/login" 
                  className={activeClassName}
                >
                  Iniciar Sesion
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/registro" 
                  className={activeClassName}
                >
                  Registrate
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
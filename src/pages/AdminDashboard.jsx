import { useContext } from 'react'; // <-- ¡CORREGIDO!
import { Navigate, NavLink } from 'react-router-dom'; // Importamos NavLink
import { ContextoAutenticacion } from '../../context/ContextoAutenticacion';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';

// Este es el layout principal del panel de admin
export default function AdminDashboard() {
  const { usuario } = useContext(ContextoAutenticacion);

  // --- RUTA PROTEGIDA ---
  // 1. Verificamos si hay un usuario
  if (!usuario) {
    // Si no hay usuario, lo mandamos a Login
    return <Navigate to="/login" state={{ mensaje: 'Debes iniciar sesion para ver esta pagina.' }} />;
  }
  // 2. Verificamos si el usuario es ADMIN
  if (usuario.rol !== 'ADMIN') {
    // Si no es ADMIN, lo mandamos al Home
    return <Navigate to="/" />;
  }
  
  // --- Si es ADMIN, mostramos el panel ---
  
  // Funcion para estilos activos/inactivos de la sidebar
  const activeClassName = ({ isActive }) => (
    isActive ? 'nav-link text-white fw-bold' : 'nav-link text-white opacity-75' 
  );
  
  return (
    <Container fluid>
      <Row>
        {/* --- 1. BARRA LATERAL (SIDEBAR) --- */}
        {/* Basado en la imagen que subiste */}
        <Col md={3} lg={2} className="bg-dark text-white p-3" style={{ minHeight: 'calc(100vh - 72px)' }}> {/* 72px es el alto aprox de la navbar */}
          <h4 className="mb-3">Panel Admin</h4>
          <Nav className="flex-column">
            {/* Usamos Nav.Link de Bootstrap + NavLink de React Router */}
            <Nav.Link 
              as={NavLink}
              to="/admin" // Ruta base
              className={activeClassName}
              end // 'end' es importante para que no quede activo en sub-rutas
            >
              Dashboard (Estadisticas)
            </Nav.Link>
            <Nav.Link 
              as={NavLink}
              to="/admin/productos" // (Ruta futura)
              className={activeClassName}
            >
              Gestionar Productos
            </Nav.Link>
            <Nav.Link 
              as={NavLink}
              to="/admin/usuarios" // (Ruta futura)
              className={activeClassName}
            >
              Gestionar Usuarios
            </Nav.Link>
            <Nav.Link 
              as={NavLink}
              to="/admin/ordenes" // (Ruta futura)
              className={activeClassName}
            >
              Ver Ordenes
            </Nav.Link>
          </Nav>
        </Col>

        {/* --- 2. CONTENIDO PRINCIPAL --- */}
        <Col md={9} lg={10} className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <h1 style={{ fontFamily: 'Pacifico, cursive' }}>Dashboard</h1>
          <p className="lead text-muted">Bienvenido, {usuario.nombre}.</p>
          
          {/* Tarjetas de estadisticas (como en tu imagen) */}
          <Row>
            <Col md={4} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Ventas Totales (Simulado)</Card.Title>
                  <Card.Text className="fs-3 fw-bold">$ 1.234.567</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Usuarios Registrados</Card.Title>
                  {/* (Este dato es simulado, luego lo conectaremos) */}
                  <Card.Text className="fs-3 fw-bold">12</Card.Text> 
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Ordenes Pendientes (Simulado)</Card.Title>
                  <Card.Text className="fs-3 fw-bold">3</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* (Aqui iran los graficos y mas contenido) */}

        </Col>
      </Row>
    </Container>
  );
}
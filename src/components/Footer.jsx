import { Container, Row, Col, Nav } from 'react-bootstrap';

// Creamos un componente Footer
export default function Footer() {
  return (
    <footer 
      // mt-auto (margen-top: auto) ayuda a empujar el footer al fondo
      // pt-4 (padding-top) y pb-2 (padding-bottom)
      className="text-white pt-4 pb-2 mt-auto" 
      // Usamos el mismo color Chocolate de la Navbar
      style={{ backgroundColor: '#8B4513' }} 
    >
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <h5 style={{ fontFamily: 'Pacifico, cursive', color: '#FFC0CB'  }}>Pastelería Mil Sabores</h5>
            {/* Texto con el color Crema Pastel para un contraste más suave */}
            <p className="small" style={{ color: '#FFF5E1' }}>
              © {new Date().getFullYear()} Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <h5 style={{color: '#FFC0CB'}}>Redes Sociales</h5>
            <Nav className="justify-content-center justify-content-md-end">
              {/* Usamos 'text-white' para que los links se vean */}
              <Nav.Link href="https://facebook.com" target="_blank" className="text-white">
                Facebook
              </Nav.Link>
              <Nav.Link href="https://instagram.com" target="_blank" className="text-white">
                Instagram
              </Nav.Link>
              <Nav.Link href="https://twitter.com" target="_blank" className="text-white">
                Twitter
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

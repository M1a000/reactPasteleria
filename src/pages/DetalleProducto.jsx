import { useContext } from 'react';
// 1. Importamos Link para el boton de "Volver"
import { useParams, Link } from 'react-router-dom';
import { PasteleriaContext } from '../context/PasteleriaContext';
import { Container, Row, Col, Image, Button, Alert } from 'react-bootstrap';

export default function DetalleProducto() {
  const { id } = useParams();
  const { productos, agregarAlCarrito } = useContext(PasteleriaContext);

  // Buscamos el producto usando el 'id' de la URL
  const producto = productos.find((p) => p.id === id);

  // Si el producto no se encuentra (por ej, URL manual incorrecta)
  if (!producto) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">Producto no encontrado.</Alert>
        <Button as={Link} to="/catalogo" variant="primary">
          Volver al Catalogo
        </Button>
      </Container>
    );
  }

  // Si el producto se encuentra, mostramos los detalles
  return (
    <Container className="my-5">
      <Row className="justify-content-center bg-light p-4 p-md-5 rounded shadow-sm">
        {/* Columna de la Imagen */}
        <Col md={6}>
          <Image src={producto.img} rounded fluid alt={producto.nombre} />
        </Col>
        
        {/* Columna del Texto */}
        <Col md={6} className="d-flex flex-column justify-content-center mt-4 mt-md-0">
          <h1 style={{ fontFamily: 'Pacifico, cursive' }}>{producto.nombre}</h1>
          
          {/* Aplicamos la clase de texto secundario (gris) */}
          <p className="lead text-secundario">{producto.descripcion}</p>

          <h3 className="fw-bold my-3">
            Precio: ${producto.precio.toLocaleString('es-CL')}
          </h3>

          <Button 
            variant="secondary" 
            size="lg" 
            className="fw-bold mb-3"
            onClick={() => agregarAlCarrito(producto)}
          >
            Añadir al Carrito
          </Button>

          {/* --- ¡SOLUCION! Boton para volver al catalogo --- */}
          <Button 
            as={Link} 
            to="/catalogo" 
            variant="outline-secondary"
            className="mt-2"
          >
            ← Volver al Catalogo
          </Button>
          
        </Col>
      </Row>
    </Container>
  );
}


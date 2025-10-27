import { useContext } from 'react';
// 1. Importamos los hooks necesarios
import { useParams, useNavigate } from 'react-router-dom';
// 2. Importamos el contexto de la pastelería
import { PasteleriaContext } from '../context/PasteleriaContext';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

export default function DetalleProducto() {
  // 3. Obtenemos el 'id' de la URL
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 4. Obtenemos los productos y la función de agregar
  const { productos, agregarAlCarrito } = useContext(PasteleriaContext);

  // 5. Buscamos el producto específico
  const producto = productos.find((p) => p.id === id);

  // 6. Manejo si el producto no se encuentra
  if (!producto) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">
          <h3>¡Oh no!</h3>
          <p>El producto que buscas no existe.</p>
          <Button variant="secondary" onClick={() => navigate('/catalogo')}>
            Volver al Catálogo
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center align-items-center">
        {/* Columna de la Imagen */}
        <Col md={12} lg={6} className="text-center mb-4 mb-lg-0">
          <img 
            src={producto.img} 
            alt={producto.nombre} 
            className="img-fluid rounded shadow-sm" 
            style={{maxHeight: '500px', objectFit: 'cover'}}
          />
        </Col>

        {/* Columna del Texto */}
        <Col md={12} lg={6}>
          <h1 style={{ fontFamily: 'Pacifico, cursive' }}>{producto.nombre}</h1>
          <hr />
          
          {/* 7. ¡AQUÍ ESTÁ EL CAMBIO! Aplicamos la clase de texto secundario */}
          <p className="lead text-secundario">{producto.descripcion}</p>
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h2 className="mb-0" style={{color: '#8B4000'}}>
              ${producto.precio.toLocaleString('es-CL')}
            </h2>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => agregarAlCarrito(producto)}
              className="fw-bold"
            >
              Añadir al Carrito
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}


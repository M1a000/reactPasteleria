import { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, ListGroup } from 'react-bootstrap';
// 1. Importamos useNavigate para redirigir
import { useNavigate, Navigate, Link } from 'react-router-dom'; 
import { ContextoAutenticacion } from '../context/ContextoAutenticacion'; 
import { PasteleriaContext } from '../context/PasteleriaContext';

export default function Checkout() {
  const { usuario } = useContext(ContextoAutenticacion);
  const { carrito, total, vaciarCarrito } = useContext(PasteleriaContext);
  const navigate = useNavigate(); // Hook para redirigir

  // Estados locales para el formulario (simulacion)
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [telefono, setTelefono] = useState(usuario ? (usuario.telefono || '') : ''); // Usamos el del perfil si existe
  
  // Estado para mensajes
  const [mensaje, setMensaje] = useState(null);

  // --- RUTA PROTEGIDA ---
  if (!usuario) {
    return <Navigate to="/login" state={{ mensaje: 'Debes iniciar sesion para finalizar la compra.' }} />;
  }
  if (carrito.length === 0) {
      return <Navigate to="/catalogo" state={{ mensaje: 'Tu carrito esta vacio.' }} />;
  }

  // 2. Modificamos la funcion handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje(null);

    // Validacion simple
    if (!direccion || !ciudad || !telefono) {
      setMensaje({ tipo: 'danger', texto: 'Por favor, completa todos los campos de envio.' });
      return;
    }

    // --- ¡CAMBIO AQUI! ---
    // En lugar de vaciar el carrito, redirigimos a la pagina de PayPal
    navigate('/pago-paypal'); 
    
    // La logica de vaciarCarrito ahora se hara DESPUES de que PayPal confirme el pago.
  };
  
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        {/* Columna del Formulario */}
        <Col md={6}>
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Finalizar Compra
          </h2>
          <p className="text-center text-muted">
            Ingresa tus datos de envio.
          </p>

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            
            {mensaje && <Alert variant={mensaje.tipo} className="mb-3">{mensaje.texto}</Alert>}

            <Form.Group className="mb-3" controlId="formDireccion">
              <Form.Label>Direccion de Envio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Calle Falsa 123"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCiudad">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Santiago"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formTelefonoEnvio">
              <Form.Label>Telefono de Contacto</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Ej: 912345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </Form.Group>

            {/* 3. Cambiamos el texto del boton */}
            <Button variant="secondary" type="submit" className="w-100 fw-bold">
              Continuar al Pago con PayPal
            </Button>
          </Form>
        </Col>

        {/* Columna del Resumen del Carrito */}
        <Col md={4} className="mt-4 mt-md-0 ms-md-4">
          <h4 className="mb-3">Resumen de tu Pedido</h4>
          <ListGroup variant="flush">
            {carrito.map(item => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">{item.nombre}</h6>
                  <small className="text-muted">Cantidad: {item.cantidad}</small>
                </div>
                <span className="text-muted">${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
              </ListGroup.Item>
            ))}
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Total (CLP)</span>
              <strong>${total.toLocaleString('es-CL')}</strong>
            </ListGroup.Item>
          </ListGroup>
           <Button 
            as={Link} 
            to="/carrito" 
            variant="outline-secondary"
            className="w-100 mt-3"
          >
            Modificar Carrito
          </Button>
        </Col>
      </Row>
    </Container>
  );
}


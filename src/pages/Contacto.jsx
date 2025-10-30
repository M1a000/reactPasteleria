import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

// Pagina de Contacto
export default function Contacto() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  // Estado para el mensaje de exito
  const [exito, setExito] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validacion simple
    if (!nombre || !email || !mensaje) {
      setExito({ tipo: 'danger', texto: 'Por favor, rellena todos los campos.' });
      return;
    }
    
    // --- Simulacion de envio ---
    // En un proyecto real, aqui llamarias a una API o servicio de email
    console.log("Formulario enviado:", { nombre, email, mensaje });
    
    // Mostramos mensaje de exito
    setExito({ tipo: 'success', texto: '¡Mensaje enviado! Gracias por contactarnos, te responderemos pronto.' });
    
    // Limpiamos el formulario
    setNombre('');
    setEmail('');
    setMensaje('');
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Contactanos
          </h2>
          <p className="text-center text-muted mb-4">
            ¿Tienes alguna duda o un pedido especial? Escribenos.
          </p>

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            
            {/* Mensaje de exito/error */}
            {exito && <Alert variant={exito.tipo} className="mb-3">{exito.texto}</Alert>}

            <Form.Group className="mb-3" controlId="formNombreContacto">
              <Form.Label>Tu Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmailContacto">
              <Form.Label>Tu Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMensajeContacto">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Escribe tu consulta aqui..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="secondary" 
              type="submit" 
              className="w-100 fw-bold"
              // Deshabilitamos el boton si se acaba de enviar
              disabled={exito?.tipo === 'success'}
            >
              Enviar Mensaje
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

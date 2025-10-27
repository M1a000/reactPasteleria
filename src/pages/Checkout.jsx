import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Corregido
import { PasteleriaContext } from '../context/PasteleriaContext';
import { ContextoAutenticacion } from '../context/ContextoAutenticacion'; // Corregido
import { Container, Row, Col, Form, Button, Alert, ListGroup } from 'react-bootstrap';

// Reutilizamos las funciones de cálculo del Carrito.jsx
// (En un proyecto más grande, esto estaría en un archivo 'helpers' o 'utils')
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const [year, month, day] = fechaNacimiento.split('-').map(Number);
  const fechaNac = new Date(year, month - 1, day);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
};
const esCumpleanos = (fechaNacimiento) => {
  if (!fechaNacimiento) return false;
  const [year, month, day] = fechaNacimiento.split('-').map(Number);
  const fechaNac = new Date(year, month - 1, day);
  const hoy = new Date();
  return hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() === fechaNac.getDate();
};


export default function Checkout() {
  const { carrito, total, vaciarCarrito } = useContext(PasteleriaContext);
  const { usuario } = useContext(ContextoAutenticacion);
  const navigate = useNavigate();

  // Estados para el formulario de envío
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorForm, setErrorForm] = useState(null);

  // --- Protección de la Ruta ---
  useEffect(() => {
    // 1. Si no hay usuario, redirigir a login
    if (!usuario) {
      alert("Debes iniciar sesión para finalizar tu compra.");
      navigate('/login');
    }
    // 2. Si el carrito está vacío, redirigir a catálogo
    else if (carrito.length === 0) {
      alert("Tu carrito está vacío, no puedes finalizar la compra.");
      navigate('/catalogo');
    }
  }, [usuario, carrito, navigate]);

  // --- Recálculo de Descuentos (igual que en Carrito.jsx) ---
  let descuento = 0;
  let motivoDescuento = null;

  if (usuario) {
    const edad = calcularEdad(usuario.fechaNacimiento);
    if (edad > 50) {
      descuento = total * 0.50;
      motivoDescuento = "Descuento 50 Aniversario (+50 años): 50%";
    } else if (usuario.codigoPromo === 'FELICES50') {
      descuento = total * 0.10;
      motivoDescuento = "Descuento Código 'FELICES50': 10%";
    } else if (usuario.email.toLowerCase().endsWith('@duoc.cl') && esCumpleanos(usuario.fechaNacimiento)) {
      descuento = total;
      motivoDescuento = "¡Feliz Cumpleaños! Por ser de Duoc, tu pedido es GRATIS.";
    }
  }
  const totalFinal = total - descuento;
  // --- Fin Recálculo ---


  // --- Manejador del Formulario ---
  const handleConfirmarPedido = (e) => {
    e.preventDefault();
    setErrorForm(null);

    // Validación simple del formulario
    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setErrorForm("Por favor, completa todos los campos de envío.");
      return;
    }

    // --- Simulación de Pedido ---
    console.log("----- PEDIDO CONFIRMADO -----");
    console.log("CLIENTE:", usuario.email, nombre);
    console.log("DIRECCIÓN:", direccion, telefono);
    console.log("CARRITO:", carrito);
    console.log("TOTAL PAGADO:", totalFinal);
    console.log("-----------------------------");

    // 1. Vaciar el carrito
    vaciarCarrito();
    
    // 2. Mostrar alerta de éxito
    alert(`¡Gracias por tu compra, ${nombre}!\nTu pedido ha sido confirmado.\nTotal pagado: $${totalFinal.toLocaleString('es-CL')}`);

    // 3. Redirigir al Home
    navigate('/');
  };
  
  // Si el usuario no está (aún cargando) o el carrito está vacío, no mostrar nada
  if (!usuario || carrito.length === 0) {
    return null; // O un componente de "Cargando..."
  }

  // --- Renderizado del Componente ---
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        {/* Columna del Formulario de Envío */}
        <Col md={6} className="p-4 bg-light rounded shadow-sm">
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Finalizar Compra
          </h2>
          <Form onSubmit={handleConfirmarPedido}>
            <h4 className="mb-3">Información de Envío</h4>
            
            {errorForm && <Alert variant="danger">{errorForm}</Alert>}

            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu nombre y apellido"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formDireccion">
              <Form.Label>Dirección de Envío</Form.Label>
              <Form.Control
                type="text"
                placeholder="Calle, Número, Comuna"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTelefono">
              <Form.Label>Teléfono de Contacto</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+56912345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </Form.Group>
            
            <hr className="my-4" />
            
            <Button variant="success" size="lg" type="submit" className="w-100 fw-bold">
              Confirmar Pedido y Pagar
            </Button>
          </Form>
        </Col>

        {/* Columna del Resumen del Pedido */}
        <Col md={4} className="ms-md-4 mt-4 mt-md-0">
          <h4 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Resumen de tu Pedido
          </h4>
          <ListGroup variant="flush">
            {carrito.map(item => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between">
                <div>
                  <h6 className="my-0">{item.nombre}</h6>
                  <small className="text-muted">Cantidad: {item.cantidad}</small>
                </div>
                <span className="text-muted">${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
              </ListGroup.Item>
            ))}

            <ListGroup.Item className="d-flex justify-content-between fw-bold">
              <span>Subtotal</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </ListGroup.Item>
            
            {descuento > 0 && (
              <ListGroup.Item className="d-flex justify-content-between text-success">
                <span>{motivoDescuento}</span>
                <span>-${descuento.toLocaleString('es-CL')}</span>
              </ListGroup.Item>
            )}

            <ListGroup.Item className="d-flex justify-content-between fw-bold fs-5">
              <span>Total Final</span>
              <span>${totalFinal.toLocaleString('es-CL')}</span>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}


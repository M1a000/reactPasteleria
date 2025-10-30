import { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
// Importamos useNavigate para redirigir y useLocation para recibir el total
import { useNavigate, useLocation, Navigate } from 'react-router-dom'; 
// Importamos los contextos para verificar usuario y vaciar carrito
import { ContextoAutenticacion } from '../context/ContextoAutenticacion'; 
import { PasteleriaContext } from '../context/PasteleriaContext';

// Pagina que simula el pago con PayPal
export default function PagoPaypal() {
  const { usuario } = useContext(ContextoAutenticacion);
  // Obtenemos 'carrito' ademas de 'total' y 'vaciarCarrito'
  const { carrito, total, vaciarCarrito } = useContext(PasteleriaContext); 
  const navigate = useNavigate();
  const location = useLocation();

  const [pagando, setPagando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // --- RUTA PROTEGIDA ---
  if (!usuario) {
    return <Navigate to="/login" state={{ mensaje: 'Debes iniciar sesion para proceder al pago.' }} />;
  }
  // Corregimos: usamos carrito.length para verificar si esta vacio
  if (carrito.length === 0) { 
      // Si llegamos aqui con carrito vacio (despues de un pago exitoso, por ejemplo), 
      // no redirigimos, podria confundir. Mejor no hacer nada o ir a Home.
      // Si el total es 0 pero el carrito no, dejamos pasar (podria haber descuento total)
      if (total <= 0 && carrito.length === 0) { // Solo redirige si AMBOS son 0
        return <Navigate to="/catalogo" state={{ mensaje: 'Tu carrito esta vacio.' }} />;
      }
  }

  const handlePagar = () => {
    setPagando(true); 
    setMensaje(null); 

    const carritoAlPagar = [...carrito]; 
    const totalAlPagar = total; 

    setTimeout(() => {
      const pagoExitoso = Math.random() > 0.1; 

      if (pagoExitoso) {
        vaciarCarrito(); 
        setMensaje({ tipo: 'success', texto: '¡Pago realizado con exito! Redirigiendo a la confirmacion...' });
        
        // --- ¡CAMBIO AQUI! ---
        // Redirigimos a '/confirmacion-pedido' en lugar de '/'
        setTimeout(() => {
           navigate('/confirmacion-pedido', { // <-- Nueva ruta
             state: { 
               // Pasamos los datos de la boleta
               boleta: { 
                 items: carritoAlPagar,
                 total: totalAlPagar 
               }
             } 
           });
        }, 2000);
      } else {
        setMensaje({ tipo: 'danger', texto: 'Error: El pago no pudo ser procesado. Intenta de nuevo.' });
        setPagando(false); 
      }
    }, 3000); 
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Col md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Header 
            className="text-white text-center" 
            style={{ backgroundColor: '#003087' }} 
          >
            <h4 className="my-2" style={{ fontFamily: 'Arial, sans-serif' }}>
              Pagar con PayPal
            </h4>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <img 
                src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
                alt="PayPal Logo" 
                className="mb-3"
              />
              <p className="text-muted">Seras redirigido a PayPal para completar tu pago.</p>
              {/* Mostramos el total que viene del contexto */}
              <h5 className="fw-bold">Total a Pagar: ${total.toLocaleString('es-CL')}</h5>
            </div>
            
            {mensaje && <Alert variant={mensaje.tipo} className="mb-3">{mensaje.texto}</Alert>}

            <Button 
              style={{ backgroundColor: '#ffc439', borderColor: '#ffc439', color: '#003087' }} 
              className="w-100 fw-bold" 
              onClick={handlePagar}
              disabled={pagando} 
            >
              {pagando ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Procesando...
                </>
              ) : (
                'Pagar Ahora'
              )}
            </Button>
            
            <Button 
              variant="link" 
              className="w-100 mt-2 text-muted" 
              // Volvemos al checkout si cancelamos
              onClick={() => navigate('/checkout')} 
              disabled={pagando}
            >
              Cancelar y volver
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}


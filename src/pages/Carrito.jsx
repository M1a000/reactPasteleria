import { useContext } from 'react';
// 1. Importamos Link para el boton de "Ir a Pagar"
import { Link } from 'react-router-dom'; 
import { Container, ListGroup, Button, Alert, Row, Col, Image } from 'react-bootstrap';
// Importamos ambos contextos
import { PasteleriaContext } from '../context/PasteleriaContext';
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

// Funcion para calcular la edad (necesaria para el descuento)
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const cumple = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - cumple.getFullYear();
  const m = hoy.getMonth() - cumple.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
    edad--;
  }
  return edad;
}

// Funcion para verificar si es el cumpleanos (necesaria para el descuento)
function esSuCumple(fechaNacimiento) {
    if (!fechaNacimiento) return false;
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    return hoy.getDate() === cumple.getDate() && hoy.getMonth() === cumple.getMonth();
}

export default function Carrito() {
  // Obtenemos datos de los contextos
  const { carrito, total, incrementar, decrementar } = useContext(PasteleriaContext);
  const { usuario } = useContext(ContextoAutenticacion);

  // --- LOGICA DE DESCUENTOS ---
  let descuento = 0;
  let motivoDescuento = null;
  const PRECIO_TORTA_GRATIS = 40000; // Definimos el valor de la torta gratis

  if (usuario) {
    const edad = calcularEdad(usuario.fechaNacimiento);
    
    // 1. Descuento +50 Anos (50%)
    if (edad > 50) {
      descuento = total * 0.50;
      motivoDescuento = "Descuento +50 Anos (50%)";
    } 
    // 2. Codigo FELICES50 (10%) - Solo si no aplica el de +50
    else if (usuario.codigoPromo === 'FELICES50') {
      descuento = total * 0.10;
      motivoDescuento = "Descuento codigo FELICES50 (10%)";
    }
    // 3. Torta gratis Duoc (Cumpleanos y email @duoc) - Solo si no aplican los anteriores
    else if (usuario.email && (usuario.email.endsWith('@duoc.cl') || usuario.email.endsWith('@duocuc.cl') || usuario.email.endsWith('@profesor.duoc.cl')) && esSuCumple(usuario.fechaNacimiento)) {
      if (total >= PRECIO_TORTA_GRATIS) {
        descuento = PRECIO_TORTA_GRATIS;
        motivoDescuento = `¡Feliz Cumpleanos Duoc! Torta Gratis (-$${PRECIO_TORTA_GRATIS.toLocaleString('es-CL')})`;
      } else {
        motivoDescuento = "¡Feliz Cumpleanos Duoc! Agrega mas productos para tu torta gratis.";
      }
    }
  }
  
  const totalFinal = Math.max(0, total - descuento); 
  // ------------------------------

  return (
    <Container className="my-5">
      <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
        Mi Carrito de Compras
      </h2>
      
      {carrito.length === 0 ? (
        <Alert variant="info" className="text-center">
          Tu carrito esta vacio. ¡<Link to="/catalogo">Mira nuestro catalogo</Link>!
        </Alert>
      ) : (
        <Row>
          {/* Columna Lista de Productos */}
          <Col md={8}>
            <ListGroup variant="flush">
              {carrito.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center flex-wrap">
                  {/* Imagen y Nombre */}
                  <div className="d-flex align-items-center mb-2 mb-md-0 col-12 col-md-5">
                    <Image 
                      src={item.img} 
                      alt={item.nombre} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }} 
                      rounded 
                    />
                    <span className="fw-bold">{item.nombre}</span>
                  </div>
                  {/* Controles de Cantidad */}
                  <div className="d-flex align-items-center justify-content-end justify-content-md-start col-6 col-md-3">
                    <Button variant="outline-secondary" size="sm" onClick={() => decrementar(item.id)}>-</Button>
                    <span className="mx-2">{item.cantidad}</span>
                    <Button variant="outline-secondary" size="sm" onClick={() => incrementar(item.id)}>+</Button>
                  </div>
                  {/* Precio Total Item */}
                  <div className="fw-bold col-6 col-md-3 text-end">
                    ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Columna Resumen y Pagar */}
          <Col md={4} className="mt-4 mt-md-0">
            <div className="bg-light p-3 rounded shadow-sm">
              <h4 className="mb-3">Resumen</h4>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-CL')}</span>
                </ListGroup.Item>
                
                {descuento > 0 && (
                  <ListGroup.Item className="d-flex justify-content-between text-success">
                    <span>{motivoDescuento}</span>
                    <span>-${descuento.toLocaleString('es-CL')}</span>
                  </ListGroup.Item>
                )}
                 {motivoDescuento && descuento === 0 && motivoDescuento.includes("Duoc") && (
                     <ListGroup.Item className="text-info small">
                        {motivoDescuento}
                     </ListGroup.Item>
                 )}

                <ListGroup.Item className="d-flex justify-content-between fw-bold">
                  <span>Total a Pagar</span>
                  <span>${totalFinal.toLocaleString('es-CL')}</span>
                </ListGroup.Item>
              </ListGroup>

              {/* --- ¡CAMBIO AQUI! --- */}
              {/* El boton ahora lleva a /checkout */}
              <Button 
                as={Link} 
                // Cambiamos 'to' de "/pago-paypal" a "/checkout"
                to="/checkout" 
                variant="success" 
                size="lg" 
                className="w-100 mt-3 fw-bold"
              >
                Ir a Pagar
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}


import { useContext } from 'react';
import { PasteleriaContext } from '../context/PasteleriaContext';
// 1. Importamos el contexto de autenticación y el Link
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';
import { Link } from 'react-router-dom';
import { ListGroup, Button, Alert } from 'react-bootstrap';


// --- Funciones de Ayuda para Descuentos ---
// (Las ponemos fuera del componente para que no se re-creen en cada render)

/**
 * Calcula la edad de un usuario a partir de su fecha de nacimiento.
 * @param {string} fechaNacimiento - La fecha en formato YYYY-MM-DD.
 */
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  // Creamos un objeto Date ajustado a la zona horaria local
  const [year, month, day] = fechaNacimiento.split('-').map(Number);
  const fechaNac = new Date(year, month - 1, day);

  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  
  // Ajuste si aún no ha sido el cumpleaños este año
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
};

/**
 * Verifica si hoy es el cumpleaños del usuario.
 * @param {string} fechaNacimiento - La fecha en formato YYYY-MM-DD.
 */
const esCumpleanos = (fechaNacimiento) => {
  if (!fechaNacimiento) return false;
  // Creamos un objeto Date ajustado
  const [year, month, day] = fechaNacimiento.split('-').map(Number);
  const fechaNac = new Date(year, month - 1, day);

  const hoy = new Date();
  
  // Comparamos solo mes y día
  return hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() === fechaNac.getDate();
};
// --- Fin de Funciones de Ayuda ---


export default function Carrito() {
  const { carrito, total, incrementar, decrementar } = useContext(PasteleriaContext);
  // 2. Obtenemos el usuario del contexto de autenticación
  const { usuario } = useContext(ContextoAutenticacion);

  // --- LÓGICA DE DESCUENTOS ---
  let descuento = 0;
  let motivoDescuento = null;

  // 3. Aplicar descuentos solo si el usuario está logueado
  if (usuario) {
    const edad = calcularEdad(usuario.fechaNacimiento);

    // Requisito 1: > 50 años (50% desc)
    if (edad > 50) {
      descuento = total * 0.50;
      motivoDescuento = "Descuento 50 Aniversario (+50 años): 50%";
    }
    // Requisito 2: Código FELICES50 (10% desc)
    else if (usuario.codigoPromo === 'FELICES50') {
      descuento = total * 0.10;
      motivoDescuento = "Descuento Código 'FELICES50': 10%";
    }
    // Requisito 3: Estudiante Duoc en su cumpleaños (Torta gratis)
    else if (usuario.email.toLowerCase().endsWith('@duoc.cl') && esCumpleanos(usuario.fechaNacimiento)) {
      // (Simplificación: "Torta gratis" se interpreta como 100% de descuento en el pedido)
      descuento = total; 
      motivoDescuento = "¡Feliz Cumpleaños! Por ser de Duoc, tu pedido es GRATIS.";
    }
  }

  // 4. Calculamos el total final
  const totalFinal = total - descuento;
  // --- Fin Lógica Descuentos ---

  // 5. Verificamos si el carrito está vacío
  if (carrito.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <Alert variant="info">
          <h2 style={{ fontFamily: 'Pacifico, cursive' }}>Tu carrito está vacío</h2>
          <p>Añade algunos productos deliciosos de nuestro catálogo.</p>
        </Alert>
      </div>
    );
  }

  // 6. Si hay productos, los mostramos
  return (
    <div className="container mt-5 p-4 bg-light rounded shadow-sm">
      <h1 className="text-center" style={{ fontFamily: 'Pacifico, cursive' }}>Detalle de tu Pedido</h1>
      
      <ListGroup variant="flush">
        {carrito.map((item, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex align-items-center">
              <img src={item.img} alt={item.nombre} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
              <div className="ms-3">
                <h5 className="mb-0">{item.nombre}</h5>
                <small className="text-muted">${(item.precio).toLocaleString('es-CL')}</small>
              </div>
            </div>
            
            <div className="d-flex align-items-center mt-2 mt-md-0">
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => decrementar(item.id)}
                className="me-2 fw-bold"
              >
                -
              </Button>
              <span className="fw-bold mx-2">{item.cantidad}</span>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => incrementar(item.id)}
                className="ms-2 fw-bold"
              >
                +
              </Button>
              <span className="fw-bold ms-4" style={{ width: '100px', textAlign: 'right' }}>
                ${(item.precio * item.cantidad).toLocaleString('es-CL')}
              </span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* 7. Sección de Totales (Actualizada) */}
      <div className="mt-4">
        {/* 8. Mostrar aviso si no está logueado */}
        {!usuario && (
          <Alert variant="info" className="text-start p-3 mt-3">
            <Alert.Heading as="h5" style={{fontFamily: 'Pacifico, cursive'}}>¡Inicia sesión para ver tus descuentos!</Alert.Heading>
            <p className="mb-0">
              Podrías tener descuentos por tu cumpleaños, edad o códigos promocionales.
            </p>
            <Button as={Link} to="/login" variant="primary" className="mt-2 fw-bold">Iniciar Sesión</Button>
          </Alert>
        )}
        
        {/* 9. Mostrar el descuento aplicado si existe */}
        {descuento > 0 && (
          <Alert variant="success" className="text-start p-3 mt-3">
            <Alert.Heading as="h5" style={{fontFamily: 'Pacifico, cursive'}}>¡Descuento Aplicado!</Alert.Heading>
            <p className="mb-0">{motivoDescuento}</p>
          </Alert>
        )}

        <hr/>
        <div className="text-end">
          <h3 className="fw-normal">Subtotal: ${(total).toLocaleString('es-CL')}</h3>
          {descuento > 0 && (
            <h4 className="text-danger">Descuento: -${(descuento).toLocaleString('es-CL')}</h4>
          )}
          <h2 className="fw-bold mt-2">Total a Pagar: ${(totalFinal).toLocaleString('es-CL')}</h2>
          <Button variant="success" size="lg" className="mt-2 fw-bold">
            Ir a Pagar
          </Button>
        </div>
      </div>
    </div>
  );
}


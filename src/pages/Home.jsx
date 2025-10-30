import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';

export default function Home() {
  const location = useLocation();
  
  // 1. Estados locales para mensajes y datos de la boleta
  const [mensajeExito, setMensajeExito] = useState(null); // Mensaje verde
  const [datosBoleta, setDatosBoleta] = useState(null);   // Datos del carrito pagado

  // 2. Leemos los datos que llegan desde PagoPaypal.jsx o NavBar.jsx
  useEffect(() => {
    // Verificamos si hay un mensaje general (ej: logout)
    if (location.state?.mensaje) {
      setMensajeExito(location.state.mensaje);
      // Limpiamos despues de 5 segundos
      const timer = setTimeout(() => setMensajeExito(null), 5000);
      return () => clearTimeout(timer);
    }
    
    // Verificamos si hay datos de boleta (pedido confirmado)
    if (location.state?.boleta) {
      setDatosBoleta(location.state.boleta);
      setMensajeExito(location.state.mensaje || '¡Tu pedido ha sido confirmado!'); // Mensaje por defecto si no viene
      
      // IMPORTANTE: Limpiamos el state de la navegacion para que la boleta
      // no reaparezca si el usuario navega a otra pagina y vuelve a Home.
      window.history.replaceState({}, document.title) 
    }
    
  }, [location.state]); // Se ejecuta si location.state cambia

  // 3. Funcion para generar y descargar la boleta .txt
  const descargarBoleta = () => {
    if (!datosBoleta) return; // Seguridad por si acaso

    // Construimos el contenido del archivo .txt
    let contenido = `--- BOLETA PASTELERIA 1000 SABORES ---\n\n`;
    contenido += `Fecha: ${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL')}\n`;
    contenido += `---------------------------------------\n\n`;
    contenido += `Productos:\n`;
    
    datosBoleta.items.forEach(item => {
      contenido += `- ${item.nombre} (x${item.cantidad}) : $${(item.precio * item.cantidad).toLocaleString('es-CL')}\n`;
    });
    
    contenido += `\n---------------------------------------\n`;
    // Aqui podriamos añadir descuentos si los pasaramos desde PagoPaypal
    contenido += `TOTAL PAGADO: $${datosBoleta.total.toLocaleString('es-CL')}\n\n`;
    contenido += `¡Gracias por tu compra!\n`;
    
    // Creamos un elemento 'a' invisible para simular la descarga
    const elemento = document.createElement('a');
    const archivo = new Blob([contenido], {type: 'text/plain;charset=utf-8'});
    elemento.href = URL.createObjectURL(archivo);
    elemento.download = "boleta_pasteleria.txt"; // Nombre del archivo
    document.body.appendChild(elemento); // Necesario para Firefox
    elemento.click();
    document.body.removeChild(elemento); // Limpiamos
  };

  return (
    <div>
      {/* Seccion de Bienvenida (Hero) */}
      <Container 
        fluid 
        className="text-center p-5" 
        style={{ 
          backgroundColor: '#FFF5E1', 
          borderBottom: '2px solid #8B4513'
        }}
      >
        <h1 
          className="display-3" 
          style={{ fontFamily: 'Pacifico, cursive', color: '#8B4513' }}
        >
          ¡Bienvenido a 1000 Sabores!
        </h1>
        <p className="lead" style={{ color: '#5D4037' }}>
          Celebrando 50 anos de tradicion y dulzura.
        </p>
        <p style={{ color: '#5D4037' }}>
          Descubre por que somos un referente en la reposteria chilena.
        </p>
        <Button 
          as={Link} 
          to="/catalogo" 
          variant="secondary" 
          size="lg"
          className="fw-bold"
        >
          Ver Catalogo
        </Button>
      </Container>
      
      {/* 4. Contenedor para mostrar mensajes y boton de boleta */}
      <Container className="mt-4" style={{ maxWidth: '600px' }}>
        {/* Mensaje de Exito (Logout o Pedido Confirmado) */}
        {mensajeExito && (
          <Alert variant="success" onClose={() => setMensajeExito(null)} dismissible>
            {mensajeExito}
          </Alert>
        )}
        
        {/* Boton para Descargar Boleta (solo si hay datos de boleta) */}
        {datosBoleta && (
          <div className="text-center mt-3">
             <Button 
               variant="primary" 
               onClick={descargarBoleta}
               className="fw-bold"
              >
               Descargar Boleta (.txt)
             </Button>
          </div>
        )}
      </Container>
      
    </div>
  );
}


import { useEffect, useState } from 'react';
// 1. Importamos Link y useLocation
import { Link, useLocation } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';

export default function Home() {
  // 2. Usamos useLocation para acceder al 'state' que nos pasó el NavBar
  const location = useLocation();
  
  // 3. Creamos un estado local para el mensaje
  const [mensaje, setMensaje] = useState(null);

  // 4. Usamos useEffect para leer el mensaje cuando la página carga
  useEffect(() => {
    // Si location.state tiene un mensaje, lo ponemos en nuestro estado local
    if (location.state?.mensaje) {
      setMensaje(location.state.mensaje);
      
      // Opcional: Limpiamos el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 5000); // 5000 milisegundos = 5 segundos

      // Limpiamos el temporizador si el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [location.state]); // Se ejecuta cada vez que 'location.state' cambia

  return (
    <div>
      {/* Sección de Bienvenida (Hero) */}
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
          ¡Bienvenido a Mil Sabores!
        </h1>
        <p className="lead" style={{ color: '#5D4037' }}>
          Celebrando 50 años de tradición y dulzura.
        </p>
        <p style={{ color: '#5D4037' }}>
          Descubre por qué somos un referente en la repostería chilena.
        </p>
        <Button 
          as={Link} 
          to="/catalogo" 
          variant="secondary" 
          size="lg"
          className="fw-bold"
        >
          Ver Catálogo
        </Button>
      </Container>
      
      {/* 5. Contenedor para mostrar el mensaje de "Cierre de Sesión" */}
      <Container className="mt-4" style={{ maxWidth: '600px' }}>
        {mensaje && (
          <Alert variant="success" onClose={() => setMensaje(null)} dismissible>
            {mensaje}
          </Alert>
        )}
      </Container>
      
      {/* (Aquí podrías agregar más contenido al Home, como productos destacados) */}
    </div>
  );
}


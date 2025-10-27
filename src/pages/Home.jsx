import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function Home() {
  return (
    <div 
      className="text-center p-5 rounded-3" 
      style={{
        background: 'linear-gradient(rgba(255, 245, 225, 0.8), rgba(255, 245, 225, 0.8)), url("https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}
    >
      <h1 
        className="display-3" 
        style={{ 
          fontFamily: 'Pacifico, cursive', 
          color: '#8B4513' // Color Chocolate
        }}
      >
        ¡Bienvenidos a Pastelería Mil Sabores!
      </h1>
      
      <p className="lead" style={{ color: '#5D4037' }}>
        Celebrando 50 años de tradición y dulzura.
      </p>
      
      <hr className="my-4" />
      
      <p style={{ color: '#5D4037' }}>
        Descubre nuestras tortas, postres y pastelería tradicional hechos con amor.
      </p>
      
      {/* Botón que usa 'Link' de react-router-dom para navegar */}
      <Button 
        as={Link} 
        to="/catalogo" 
        variant="secondary" 
        size="lg"
      >
        Ver Nuestro Catálogo
      </Button>
    </div>
  );
}

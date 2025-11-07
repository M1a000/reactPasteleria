import { useEffect, useState, useContext } from 'react'; // 1. Importamos useContext
import { Link, useLocation, useNavigate } from 'react-router-dom'; // 2. Importamos useNavigate
import { Container, Button, Alert, Row, Col } from 'react-bootstrap'; // 3. Importamos Row y Col
import { PasteleriaContext } from '../context/PasteleriaContext'; // 4. Importamos el Contexto
import Card from '../components/Card'; // 5. Importamos la Tarjeta

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate(); // 6. Inicializamos navigate

  // 7. Obtenemos los productos y la funcion de agregar
  const { productos, agregarAlCarrito } = useContext(PasteleriaContext);

  // 8. Creamos una lista solo con los primeros 4 productos
  const productosDestacados = productos.slice(0, 4);
  
  const [mensajeExito, setMensajeExito] = useState(null);
  const [datosBoleta, setDatosBoleta] = useState(null);

  useEffect(() => {
    if (location.state?.mensaje) {
      setMensajeExito(location.state.mensaje);
      const timer = setTimeout(() => setMensajeExito(null), 5000);
      return () => clearTimeout(timer);
    }
    
    if (location.state?.boleta) {
      setDatosBoleta(location.state.boleta);
      setMensajeExito(location.state.mensaje || '¡Tu pedido ha sido confirmado!');
      window.history.replaceState({}, document.title) 
    }
  }, [location.state]);

  const descargarBoleta = () => {
    // ... (la funcion de descargar boleta sigue igual)
    if (!datosBoleta) return;
    let contenido = `--- BOLETA PASTELERIA MIL SABORES ---\n\n`;
    contenido += `Fecha: ${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL')}\n`;
    contenido += `---------------------------------------\n\n`;
    contenido += `Productos:\n`;
    datosBoleta.items.forEach(item => {
      const nombreCorto = item.nombre.length > 25 ? item.nombre.substring(0, 22) + '...' : item.nombre;
      const lineaProducto = `${nombreCorto} (x${item.cantidad})`;
      const lineaPrecio = `$${(item.precio * item.cantidad).toLocaleString('es-CL')}`;
      contenido += alinearTexto(lineaProducto, lineaPrecio, 45) + '\n';
    });
    contenido += `\n---------------------------------------\n`;
    contenido += alinearTexto('TOTAL PAGADO:', `$${datosBoleta.total.toLocaleString('es-CL')}`, 45) + '\n';
    contenido += `---------------------------------------\n\n`;
    contenido += `        ¡Gracias por tu compra!\n`;
    contenido += `---------------------------------------\n`;
    const elemento = document.createElement('a');
    const archivo = new Blob([contenido], {type: 'text/plain;charset=utf-8'});
    elemento.href = URL.createObjectURL(archivo);
    elemento.download = "boleta_pasteleria.txt";
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  };
  
  // Funcion auxiliar (la necesitamos aqui si la usamos en descargarBoleta)
  const alinearTexto = (textoIzq, textoDer, anchoTotal) => {
    const espaciosNecesarios = anchoTotal - textoIzq.length - textoDer.length;
    const espacios = ' '.repeat(Math.max(0, espaciosNecesarios));
    return textoIzq + espacios + textoDer;
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
          {/* Corregido a "Mil" */}
          ¡Bienvenido a Mil Sabores!
        </h1>
        {/* Corregidas tildes */}
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
          {/* Corregida tilde */}
          Ver Catalogo
        </Button>
      </Container>
      
      {/* Contenedor para mostrar mensajes y boton de boleta */}
      <Container className="mt-4" style={{ maxWidth: '600px' }}>
        {mensajeExito && (
          <Alert variant="success" onClose={() => setMensajeExito(null)} dismissible>
            {mensajeExito}
          </Alert>
        )}
        
        {datosBoleta && (
          <div className="text-center mt-3">
             <Button 
               variant="primary" 
               onClick={descargarBoleta}
               className="fw-bold"
              >
               Descargar Boleta
             </Button>
          </div>
        )}
      </Container>

      {/* --- 9. ¡NUEVA SECCION! Productos Destacados --- */}
      <Container className="my-5">
        <h2 
          className="text-center mb-4" 
          style={{ fontFamily: 'Pacifico, cursive', color: '#8B4513' }}
        >
          Nuestros Productos Destacados
        </h2>
        <Row className="justify-content-center g-4">
          {productosDestacados.map((prod) => (
            // Mostramos 4 por fila en desktop (lg-3), 2 en tablet (md-6)
            <Col md={6} lg={3} key={prod.id} className="d-flex justify-content-center">
              <Card
                // Pasamos los props al componente Card
                img={prod.img}
                nombre={prod.nombre}
                precio={prod.precio}
                
                // Creamos las funciones para los botones
                verMas={() => navigate(`/producto/${prod.id}`)}
                agregar={() => agregarAlCarrito(prod)}
              />
            </Col>
          ))}
        </Row>
      </Container>
      
    </div>
  );
}
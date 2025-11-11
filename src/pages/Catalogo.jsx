import { useContext, useState, useMemo } from 'react'; // 1. Importamos useState y useMemo
import { useNavigate } from 'react-router-dom';
// 2. Importamos Nav para los botones de filtro
import { Container, Row, Col, Nav } from 'react-bootstrap'; 
import { PasteleriaContext } from '../context/PasteleriaContext';
import Card from '../components/Card';

export default function Catalogo() {
  const { productos, agregarAlCarrito } = useContext(PasteleriaContext);
  const navigate = useNavigate();
  
  // 3. Creamos un estado para guardar el filtro seleccionado
  const [filtroActual, setFiltroActual] = useState('Todos'); // Inicia en 'Todos'

  // 4. Obtenemos la lista de categorias unicas (usamos useMemo para eficiencia)
  const categorias = useMemo(() => {
    const categoriasUnicas = new Set(productos.map(p => p.categoria));
    return ['Todos', ...categoriasUnicas]; // Añadimos 'Todos' al inicio
  }, [productos]); // Se recalcula solo si 'productos' cambia

  // 5. Filtramos los productos que se van a mostrar
  const productosFiltrados = useMemo(() => {
    // Si el filtro es 'Todos', mostramos todos los productos
    if (filtroActual === 'Todos') {
      return productos;
    }
    // Si no, filtramos por la categoria seleccionada
    return productos.filter(p => p.categoria === filtroActual);
  }, [filtroActual, productos]); // Se recalcula si cambia el filtro o los productos

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>
        Nuestro Catalogo
      </h1>

      {/* --- 6. ¡NUEVA SECCION! Filtros de Categoria --- */}
      {/* Usamos Nav pills para los botones, centrados y con wrap */}
      <Nav variant="pills" className="justify-content-center mb-4 flex-wrap">
        {categorias.map(cat => (
          <Nav.Item key={cat} className="m-1">
            <Nav.Link
              // 'active' se pone true si la categoria es la misma del estado
              active={filtroActual === cat}
              onClick={() => setFiltroActual(cat)}
              // Aplicamos estilos de la paleta de colores
              style={filtroActual === cat ? 
                { backgroundColor: '#ff7d93ff', color: '#ffffffff' } : 
                { backgroundColor: '#89465263', color: '#ffffffff'}
              }
              className="fw-bold"
            >
              {cat}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      {/* --- Fin de la seccion de Filtros --- */}

      <Row className="justify-content-center g-4">
        {/* 7. Mapeamos la lista de PRODUCTOS FILTRADOS (no la lista completa) */}
        {productosFiltrados.map((prod) => (
          <Col md={6} lg={4} key={prod.id} className="d-flex justify-content-center">
            <Card
              img={prod.img}
              nombre={prod.nombre}
              precio={prod.precio}
              verMas={() => navigate(`/producto/${prod.id}`)}
              agregar={() => agregarAlCarrito(prod)}
            />
          </Col>
        ))}
        
        {/* Mensaje por si el filtro no devuelve productos */}
        {productosFiltrados.length === 0 && (
          <Col xs={12} className="text-center">
            <p className="lead text-muted">No se encontraron productos en esta categoria.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
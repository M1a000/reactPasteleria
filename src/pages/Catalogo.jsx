import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importamos el contexto
import { PasteleriaContext } from '../context/PasteleriaContext';
// 2. Importamos el componente Card
import Card from '../components/Card';

export default function Catalogo() {
  // 4. Obtenemos los productos y la función de agregar del contexto
  const { productos, agregarAlCarrito } = useContext(PasteleriaContext);
  
  // 5. El hook para navegar
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>
        Nuestro Dulce Catálogo
      </h1>
      <div className="row justify-content-center g-4">
        {productos.map((prod) => (
          // 6. Usamos 'col-md-4' para 3 tarjetas por fila en escritorio
          // y 'col-lg-3' para 4 por fila en pantallas más grandes
          <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center" key={prod.id}>
            <Card
              // Pasamos los props al componente Card
              img={prod.img}
              nombre={prod.nombre}
              precio={prod.precio}
              
              // 7. Creamos las funciones para los botones
              verMas={() => navigate(`/producto/${prod.id}`)}
              agregar={() => agregarAlCarrito(prod)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


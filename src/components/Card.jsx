
import { Button } from 'react-bootstrap';

function Card(props) {
  // 'props' contiene: img, nombre, precio, verMas, agregar
  
  return (
    <div className="card h-100 shadow-sm" style={{width: "18rem"}}>
      
      {}
      <img 
        src={props.img} 
        alt={props.nombre} 
        className="card-img-top card-img-fixed-height" 
      />
      
      {/* Usamos 'd-flex flex-column' para que el cuerpo de la card
        pueda crecer y empujar los botones al fondo (con 'mt-auto')
      */}
      <div className="card-body d-flex flex-column">
        {/* Usamos la fuente Pacifico para el titulo */}
        <h3 className="card-title" style={{fontFamily: 'Pacifico, cursive'}}>{props.nombre}</h3>
        
        {/* Mostramos el precio */}
        <p className="card-text fs-4 fw-bold">
          ${props.precio.toLocaleString('es-CL')}
        </p>
        
        {}
        <div className="d-flex justify-content-around mt-auto">
          {/* Botones de E-commerce. Las funciones vienen de props */}
          <Button variant="primary" onClick={props.verMas}>
            Ver Mas
          </Button>
          <Button variant="secondary" onClick={props.agregar}>
            Añadir
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Card;


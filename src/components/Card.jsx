import React from 'react';

// Este es el nuevo componente Card.jsx
// Nota cómo los 'props' ahora coinciden con los campos de 'productos.json'
// (props.nombre, props.precio, props.img, etc.)
// También cambiamos los botones.

function Card(props) {
  return (
    <div className="card mb-4 shadow-sm" style={{ width: "18rem" }}>
      
      {/* Usamos props.img (la URL de placeholder de productos.json) */}
      <img 
        src={props.img} 
        alt={props.nombre} 
        className="card-img-top" 
      />
      
      <div className="card-body">
        
        {/* Usamos props.nombre y la fuente 'Pacifico' para el título */}
        <h3 
          className="card-title" 
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          {props.nombre}
        </h3>
        
        {/* Usamos props.precio y le damos formato de moneda chilena */}
        <p className="card-text fs-4 fw-bold">
          ${props.precio.toLocaleString('es-CL')}
        </p>

        {/* Estos son los nuevos botones para un E-Commerce.
          Las funciones 'verMas' y 'agregar' vendrán como props desde App.jsx
          (¡Lo haremos en el siguiente paso!)
        */}
        <div className="d-flex justify-content-around">
          <button 
            className="btn btn-primary" 
            onClick={() => props.verMas(props.id)}
          >
            Ver Más
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => props.agregar(props.producto)}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;

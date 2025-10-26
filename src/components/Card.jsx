//Vamos a crear una card en React

function Card(props){
    return (
        <div className="card mb-3" style={ {width:"18rem"} }>
            {/*Se agrega header de la Card para mostrar el Número del Pokemon*/}
            <h2 className="card-header">NÚMERO: {props.numero}</h2>
            {props.imagen && (
                <img src={props.imagen} alt={props.titulo} className="card-img-top"/>
            )}
            <div className="card-body">
                <h3 className="card-title">{props.titulo}</h3>
                <p className="card-text">{props.contenido}</p>
                <div className="d-flex justify-content-around">
                    <button className="btn btn-warning" onClick={props.modificar}>Editar</button>
                    <button className="btn btn-danger" onClick={props.eliminar}>Eliminar</button>
                </div>
            </div>
        </div>
    )
}

export default Card;
import { useEffect, useState } from 'react'
import './App.css'
import Card from './components/Card'
import FormularioPokemon from './components/FormularioPokemon'

function App() {
  const [pokemones, setPokemones] = useState([])
  const [pokemonModificar, setPokemonModificar] = useState(null)

  //useEffect carga datos desde lugares externo:
  useEffect(()=>{
    fetch("src/data/pokemones.json")
      .then((res)=>res.json())
      .then((data)=>setPokemones(data))
      .catch((ex)=>console.error("Error al obtener pokemones:",ex))
  },[])

  const agregarPokemon = (pokemon) =>{
    //Se agregó validación para validar si existe el ID que se agrega
    const pokemonExiste = pokemones.find(po => po.numero===pokemon.numero)
    if (pokemonExiste){
      alert("Pokemon ya existe!")
      return;
    }
    setPokemones( [...pokemones,pokemon] )
  }

  const eliminarPokemon = (numero)=>{
    //Se agregó validación para eliminar o no
    const resp = confirm(`¿Seguro que deseas eliminar el pokemon de número ${numero}?`)
    if(resp){
      setPokemones( pokemones.filter(po=> po.numero !== numero) )
    }
  }

  const editarPokemon = (pokemonActualizado) => {
    setPokemones( pokemones.map(po => po.numero===pokemonActualizado.numero ? pokemonActualizado : po) )
  }

  return (
    <div className='container mt-3'>
      <h1>Formulario Ingreso Pokemones</h1>
      <FormularioPokemon agregar={agregarPokemon}
        pokemonEditando={pokemonModificar} 
        editar={editarPokemon}
        setPokemonEditando={setPokemonModificar}/>

      {pokemones.length === 0 && <p>No hay pokemones disponibles</p>}
      {pokemones.length>5 && <p>Tienes una gran colección</p>}

      <div className='row'>
        {
          pokemones.map(pokemon => (
            <div className='col-md-4' key={pokemon.numero}>
              <Card numero={pokemon.numero}
                titulo={pokemon.titulo} 
                contenido={pokemon.contenido}
                imagen={pokemon.imagen}
                eliminar={()=>eliminarPokemon(pokemon.numero)}
                modificar={()=> setPokemonModificar(pokemon)} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App

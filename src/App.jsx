import { Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes
import NavBar from './components/NavBar';

// Páginas
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Checkout from './pages/Checkout'; // 1. Importamos la nueva página

function App() {
  return (
    <div>
      <NavBar />
      
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} /> {/* 2. Añadimos la nueva ruta */}
        </Routes>
      </main>
    </div>
  );
}

export default App;


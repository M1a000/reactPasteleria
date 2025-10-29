import { Routes, Route } from 'react-router-dom';
import './App.css';

// 1. Importamos los componentes de layout
import NavBar from './components/NavBar';
import Footer from './components/Footer'; // <-- ¡NUEVA IMPORTACIÓN!

// 2. Importamos todas las páginas
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Checkout from './pages/Checkout';

function App() {
  return (
    // 3. ¡NUEVA ESTRUCTURA!
    // Usamos flexbox para crear un layout "sticky footer"
    // d-flex: activa flexbox
    // flex-column: apila los elementos verticalmente
    // min-vh-100: asegura que el contenedor ocupe al menos el 100% de la altura de la pantalla
    <div className="d-flex flex-column min-vh-100">
      <NavBar />

      {/* 4. Usamos <main> y 'flex-grow-1' para que el contenido principal
          ocupe todo el espacio disponible, empujando el footer hacia abajo */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      {/* 5. Añadimos el Footer al final */}
      <Footer />
    </div>
  );
}

export default App;


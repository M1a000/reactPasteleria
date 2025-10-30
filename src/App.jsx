import { Routes, Route } from 'react-router-dom';
import './App.css';

// 1. Importamos los componentes de layout
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// 2. Importamos todas las paginas
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import SobreNosotros from './pages/SobreNosotros';
import Contacto from './pages/Contacto';
import MiPerfil from './pages/MiPerfil';
import PagoPaypal from './pages/PagoPaypal';
import ConfirmacionPedido from './pages/ConfirmacionPedido'; // <-- ¡NUEVA IMPORTACION!

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/pago-paypal" element={<PagoPaypal />} />
          <Route path="/confirmacion-pedido" element={<ConfirmacionPedido />} /> {/* <-- ¡NUEVA RUTA! */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;


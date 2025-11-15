import { Routes, Route } from 'react-router-dom';
import './App.css';

// 1. Componentes de layout
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// 2. Paginas
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
import ConfirmacionPedido from './pages/ConfirmacionPedido';

// --- ¡NUEVAS IMPORTACIONES! ---
// 3. Importamos el dashboard y la ruta protegida
import AdminPanel from './pages/AdminPanel';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin';
// ------------------------------

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />

      <main className="flex-grow-1">
        <Routes>
          {/* --- Rutas Públicas --- */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          
          {/* --- Rutas de Usuario Logueado (Idealmente tambien protegidas) --- */}
          {/* (Por ahora las dejamos asi, pero podrias crear una 'RutaProtegidaCliente') */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/pago-paypal" element={<PagoPaypal />} />
          <Route path="/confirmacion-pedido" element={<ConfirmacionPedido />} />

          {/* --- ¡NUEVA RUTA DE ADMIN! --- */}
          <Route 
            path="/admin/*" 
            element={
              <RutaProtegidaAdmin>
                <AdminPanel />
              </RutaProtegidaAdmin>
            } 
          />
          {/* ------------------------------ */}

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
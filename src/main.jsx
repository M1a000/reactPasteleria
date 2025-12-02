import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ContextoAutenticacionProvider } from './context/ContextoAutenticacion.jsx';

// --- ¡CAMBIO IMPORTANTE AQUI! ---
// 1. Importamos Bootstrap PRIMERO (los estilos base)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Importamos TUS estilos DESPUES (para que sobrescriban a Bootstrap)
import './index.css'; 

// El resto de las importaciones
import { BrowserRouter } from 'react-router-dom';
import PasteleriaProvider from './context/PasteleriaContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 3. ¡LA SOLUCION! Envolvemos la App con AMBOS proveedores */}
      {/* El de Autenticacion primero (mas general) */}
      <ContextoAutenticacionProvider>
        {/* El de la Pasteleria despues (depende del otro) */}
        <PasteleriaProvider>
          <App />
        </PasteleriaProvider>
      </ContextoAutenticacionProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
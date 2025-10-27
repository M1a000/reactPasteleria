import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. Importamos el Router
import { BrowserRouter } from 'react-router-dom';

// 2. Importamos AMBOS proveedores
import PasteleriaProvider from './context/PasteleriaContext.jsx';
import ProveedorAutenticacion from './context/ContextoAutenticacion.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 3. ¡LA SOLUCIÓN! Envolvemos la App con AMBOS proveedores */}
      {/* El de Autenticación primero (más general) */}
      <ProveedorAutenticacion>
        {/* El de la Pastelería después (depende del otro) */}
        <PasteleriaProvider>
          <App />
        </PasteleriaProvider>
      </ProveedorAutenticacion>
    </BrowserRouter>
  </React.StrictMode>,
)


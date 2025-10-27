Pastelería Mil Sabores

Este proyecto es una plataforma de e-commerce funcional construida con React para la "Pastelería 1000 Sabores", celebrando su 50 aniversario. La aplicación permite a los usuarios navegar por un catálogo de productos, gestionar un carrito de compras, registrarse, iniciar sesión y recibir descuentos dinámicos basados en reglas de negocio.

*Características Principales

Navegación Multi-página: Sitio web completo con rutas para Inicio, Catálogo, Detalle de Producto, Carrito, Registro y Login, gestionado con react-router-dom.

Catálogo de Productos: Los productos se cargan dinámicamente desde un archivo productos.json local.

Carrito de Compras Funcional:

Añadir productos desde el Catálogo o la página de Detalle.

Incrementar y decrementar la cantidad de productos.

Cálculo de subtotal y total en tiempo real.

Sistema de Autenticación de Usuarios:

Registro de nuevos usuarios (simulado con localStorage).

Inicio de Sesión y Cierre de Sesión.

Barra de navegación dinámica que cambia según el estado de autenticación.

Sistema de Descuentos Dinámicos (Requisito Clave):

Descuento +50 Años: 50% de descuento en el total de la compra si el usuario registrado es mayor de 50 años.

Descuento "FELICES50": 10% de descuento si el usuario se registró con el código FELICES50.

Descuento Cumpleaños Duoc: Torta gratis (descuento de $40.000 CLP) si el email termina en @duoc.cl (o similar) y es el cumpleaños del usuario.

Flujo de Compra Completo (Checkout):

Página de /checkout protegida (requiere inicio de sesión y que el carrito no esté vacío).

Formulario de simulación de envío.

Botón de "Confirmar Pedido" que vacía el carrito y redirige al inicio.

*Diseño Visual

El proyecto sigue la paleta de colores y tipografía definida en los requisitos:

*Colores:

Fondo: Crema Pastel (#FFF5E1)

Acentos: Rosa Suave (#FFC0CB) y Chocolate (#8B4513)

Tipografía:

Títulos: Pacifico (cursiva)

Texto: Lato (sans-serif)

*Cómo Ejecutar el Proyecto

Este proyecto fue creado con Vite.

Clonar o descargar el repositorio

*Instalar las dependencias:

npm install
npm install react-router-dom react-bootstrap bootstrap

Ejecutar el servidor de desarrollo:

npm run dev


Abrir en el navegador:
Abre la URL que te indica la terminal

*Tecnologías Utilizadas

React
Vite
React Router DOM
React Bootstrap
Bootstrap
React Context

*Estructura del Proyecto

REACTPASTELERIA/
├── public/
├── src/
│   ├── assets/
│   ├── components/       # Componentes reutilizables (Card, NavBar)
│   ├── context/          # Estado global (PasteleriaContext, ContextoAutenticacion)
│   ├── data/             # JSON de productos (productos.json)
│   ├── pages/            # Vistas/Páginas (Home, Catalogo, Carrito, etc.)
│   ├── App.css           # (Vacío)
│   ├── App.jsx           # Contenedor principal de Rutas
│   ├── index.css         # Estilos globales (colores, fuentes)
│   └── main.jsx          # Punto de entrada (Render, Router, Providers)
├── .gitignore
├── index.html
├── package.json
└── README.md

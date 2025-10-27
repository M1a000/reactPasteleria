import { createContext, useState, useEffect } from "react";

// 1. Exportamos el contexto para que pueda ser importado
export const PasteleriaContext = createContext();

// 2. Exportamos el Proveedor
export default function PasteleriaProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  // Cargar productos desde tu JSON
  useEffect(() => {
    // 3. ¡LA CORRECCIÓN ESTÁ AQUÍ!
    // La ruta debe ser relativa a 'src', igual que tu proyecto original.
    // Usamos "src/data/productos.json"
    fetch("src/data/productos.json") 
      .then((res) => {
        // Añadimos un chequeo por si la respuesta no es OK
        if (!res.ok) {
          throw new Error("Error al cargar productos.json. ¿Existe el archivo en src/data/?");
        }
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((ex) => console.error("Error al obtener productos:", ex));
  }, []);

  // --- Lógica del Carrito ---

  const agregarAlCarrito = (producto) => {
    // Buscamos si el producto ya está en el carrito
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      // Si existe, actualizamos la cantidad
      const nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      // Si no existe, lo agregamos con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const incrementar = (id) => {
    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    setCarrito(nuevoCarrito);
  };

  const decrementar = (id) => {
    const nuevoCarrito = carrito
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      // Filtramos el item si su cantidad llega a 0
      .filter((item) => item.cantidad > 0);
    setCarrito(nuevoCarrito);
  };
  
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Calculamos el total del carrito
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <PasteleriaContext.Provider
      value={{
        productos,
        carrito,
        total,
        agregarAlCarrito,
        incrementar,
        decrementar,
        vaciarCarrito
      }}
    >
      {children}
    </PasteleriaContext.Provider>
  );
}


import { useContext, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
// 1. Importaciones necesarias de react-pdf
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

// Funcion auxiliar para formatear numeros a CLP
const formatoCLP = (valor) => valor.toLocaleString('es-CL');

// --- 2. Definicion del Componente PDF ---
// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica', // Fuente basica compatible
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 3,
  },
  itemName: {
    width: '70%',
  },
  itemQuantity: {
    width: '10%',
    textAlign: 'center',
  },
  itemPrice: {
    width: '20%',
    textAlign: 'right',
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      color: 'grey',
      fontSize: 10,
  }
});

// Componente que define el documento PDF
const BoletaPDF = ({ datosBoleta, usuario }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* --- ¡CAMBIO AQUI! --- */}
      {/* Cambiamos "1000" por "MIL" */}
      <Text style={styles.header}>PASTELERIA MIL SABORES - Boleta</Text>
      
      <View style={styles.section}>
        <Text>Fecha: {new Date().toLocaleDateString('es-CL')} {new Date().toLocaleTimeString('es-CL')}</Text>
        {/* Podriamos añadir datos del cliente */}
        {/* <Text>Cliente: {usuario?.nombre || 'N/A'}</Text> */}
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Detalle de Compra:</Text>
        {datosBoleta.items.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemName}>{item.nombre}</Text>
            <Text style={styles.itemQuantity}>x{item.cantidad}</Text>
            <Text style={styles.itemPrice}>${formatoCLP(item.precio * item.cantidad)}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.total}>Total Pagado: ${formatoCLP(datosBoleta.total)}</Text>

      <Text style={styles.footer}>¡Gracias por tu compra!</Text>
    </Page>
  </Document>
);
// --- Fin Definicion PDF ---


export default function ConfirmacionPedido() {
  const location = useLocation();
  const { usuario } = useContext(ContextoAutenticacion);

  const datosBoleta = location.state?.boleta;

  // --- RUTA PROTEGIDA ---
  if (!usuario) {
    return <Navigate to="/login" state={{ mensaje: 'Debes iniciar sesion para ver esta pagina.' }} />;
  }
  if (!datosBoleta) {
      console.warn("Se intento acceder a ConfirmacionPedido sin datos de boleta.");
      return <Navigate to="/" />; 
  }

  // 3. Ya no necesitamos la funcion descargarBoleta (.txt) ni alinearTexto
  
  // Limpiamos el state de la navegacion al cargar
  useEffect(() => {
    window.history.replaceState({}, document.title)
  }, []);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm text-center">
            <Card.Header className="bg-success text-white">
              <h4 className="my-2">¡Pedido Confirmado!</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Alert variant="success">
                Tu compra ha sido procesada exitosamente. ¡Gracias por elegirnos!
              </Alert>
              
              <h5 className="mt-4 mb-3" style={{ fontFamily: 'Pacifico, cursive' }}>Resumen de tu Compra</h5>
              <ListGroup variant="flush" className="text-start mb-4">
                 {datosBoleta.items.map(item => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between lh-sm">
                    <div>
                      <h6 className="my-0">{item.nombre}</h6>
                      <small className="text-muted">Cantidad: {item.cantidad}</small>
                    </div>
                    <span className="text-muted">${formatoCLP(item.precio * item.cantidad)}</span>
                  </ListGroup.Item>
                 ))}
                 <ListGroup.Item className="d-flex justify-content-between fw-bold">
                    <span>Total Pagado</span>
                    <span>${formatoCLP(datosBoleta.total)}</span>
                 </ListGroup.Item>
              </ListGroup>

              {/* --- 4. Usamos PDFDownloadLink en lugar del Button --- */}
              <PDFDownloadLink 
                document={<BoletaPDF datosBoleta={datosBoleta} usuario={usuario} />} 
                fileName="boleta_pasteleria.pdf"
                // Le damos estilo de boton Bootstrap
                className="btn btn-primary fw-bold w-100 mb-2" 
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Generando PDF...' : 'Descargar Boleta (PDF)'
                }
              </PDFDownloadLink>
              
              {/* Boton para volver al Catalogo */}
              <Button 
                as={Link} 
                to="/catalogo" 
                variant="outline-secondary"
                className="w-100"
              >
                Seguir Comprando
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}


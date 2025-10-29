import { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// 1. Importamos useNavigate
import { useNavigate } from 'react-router-dom';
// 2. Importamos nuestro contexto
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

export default function Login() {
  // 3. Obtenemos las funciones y mensajes del contexto
  const { iniciarSesion, mensaje, limpiarMensaje } = useContext(ContextoAutenticacion);
  const navigate = useNavigate();

  // 4. Estados locales para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 5. Estado local para el mensaje de ÉXITO
  const [exito, setExito] = useState(null);

  // 6. Limpiamos los mensajes de error cuando el componente se carga/desmonta
  useEffect(() => {
    // Limpia el mensaje de error del contexto al cargar la página
    limpiarMensaje();
    // Limpia el mensaje de error cuando el usuario sale de esta página
    return () => {
      limpiarMensaje();
    };
  }, [limpiarMensaje]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setExito(null); // Limpiamos mensajes de éxito previos
    limpiarMensaje(); // Limpiamos mensajes de error previos

    // 7. Llamamos a iniciarSesion y comprobamos el resultado
    const inicioExitoso = iniciarSesion(email, password);

    if (inicioExitoso) {
      // 8. Mostramos un mensaje verde de éxito
      setExito({ tipo: 'success', texto: '¡Inicio de sesión exitoso! Redirigiendo...' });
      
      // Redirigimos al catálogo después de 2 segundos
      setTimeout(() => {
        navigate('/catalogo');
      }, 2000);

    } 
    // Si (inicioExitoso === false), el contexto ya ha establecido el 'mensaje' de error
    // y se mostrará automáticamente (ver JSX abajo).
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Iniciar Sesión
          </h2>
          
          {/* 9. Mostramos el mensaje de ÉXITO (local) */}
          {exito && <Alert variant={exito.tipo}>{exito.texto}</Alert>}

          {/* 10. Mostramos el mensaje de ERROR (del Contexto) */}
          {mensaje && <Alert variant="danger">{mensaje}</Alert>}

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Deshabilitamos el botón si el inicio de sesión fue exitoso */}
            <Button variant="secondary" type="submit" className="w-100 fw-bold" disabled={exito?.tipo === 'success'}>
              Ingresar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}


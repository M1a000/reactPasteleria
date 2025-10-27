import { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// 1. Importamos useNavigate para redirigir
import { useNavigate, Link } from 'react-router-dom';
// 2. Importamos nuestro contexto de autenticación
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

export default function Login() {
  // 3. Obtenemos la función 'iniciarSesion' del contexto
  const { iniciarSesion } = useContext(ContextoAutenticacion);
  const navigate = useNavigate(); // Hook para redirigir

  // 4. Estados locales para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para errores
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores previos

    // 5. Llamamos a la función del contexto
    const exito = iniciarSesion(email, password);

    // 6. Verificamos si el inicio de sesión fue exitoso
    if (exito) {
      // 7. Mostramos un aviso y redirigimos al Catálogo
      alert('¡Inicio de sesión exitoso! Serás redirigido al catálogo.');
      navigate('/catalogo');
    } else {
      // 8. Mostramos un error
      setError('Email o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Iniciar Sesión
          </h2>
          <p className="text-center text-muted">
            Ingresa a tu cuenta para ver tus descuentos.
          </p>

          {/* 9. Mostramos el error si existe */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="tu@email.com"
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

            <Button variant="secondary" type="submit" className="w-100 fw-bold">
              Ingresar
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}


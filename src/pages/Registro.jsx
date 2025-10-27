import { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// 1. Importamos el useNavigate para redirigir
import { useNavigate } from 'react-router-dom';
// 2. Importamos nuestro contexto de autenticación
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

export default function Registro() {
  // 3. Obtenemos la función 'registrarUsuario' del contexto
  const { registrarUsuario } = useContext(ContextoAutenticacion);
  const navigate = useNavigate(); // Hook para redirigir

  // 4. Estados locales para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [codigoPromo, setCodigoPromo] = useState('');
  
  // Estados para errores
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores previos

    // 5. Validaciones
    if (password !== passwordConfirm) {
      return setError('Las contraseñas no coinciden.');
    }
    if (!email || !password || !fechaNacimiento) {
      return setError('Email, contraseña y fecha de nacimiento son obligatorios.');
    }
    // (Podrías añadir más validaciones: formato de email, largo de contraseña, etc.)

    // 6. Creamos el objeto de usuario
    const datosUsuario = {
      email,
      password, // En un proyecto real, NUNCA guardaríamos la contraseña así
      fechaNacimiento,
      codigoPromo
    };

    // 7. Llamamos a la función del contexto
    registrarUsuario(datosUsuario);

    // 8. Mostramos un aviso y redirigimos al Catálogo
    alert('¡Registro exitoso! Serás redirigido al catálogo.');
    navigate('/catalogo');
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Crea tu cuenta
          </h2>
          <p className="text-center text-muted">
            Y accede a beneficios exclusivos como descuentos y más.
          </p>

          {/* 9. Mostramos el error si existe */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Si eres Duoc, usa tu email institucional"
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
            
            <Form.Group className="mb-3" controlId="formPasswordConfirm">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repite tu contraseña"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </Form.Group> {/* <-- ¡AQUÍ ESTABA EL ERROR! */}
            
            <Form.Group className="mb-3" controlId="formFechaNacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Necesaria para aplicar tu descuento de cumpleaños o +50 años.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCodigo">
              <Form.Label>Código Promocional (Opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: FELICES50"
                value={codigoPromo}
                onChange={(e) => setCodigoPromo(e.target.value.toUpperCase())} // Convertimos a mayúsculas
              />
            </Form.Group>

            <Button variant="secondary" type="submit" className="w-100 fw-bold">
              Registrarse
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}


import { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

export default function Registro() {
  const { registrarUsuario, mensaje, limpiarMensaje } = useContext(ContextoAutenticacion);
  const navigate = useNavigate();

  // --- ¡CAMBIO 1: Añadimos estado para el nombre! ---
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [codigoPromo, setCodigoPromo] = useState('');
  
  const [exito, setExito] = useState(null);

  useEffect(() => {
    limpiarMensaje();
    return () => {
      limpiarMensaje();
    };
  }, [limpiarMensaje]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setExito(null); 
    limpiarMensaje(); 

    // --- ¡CAMBIO 2: Añadimos validación para el nombre! ---
    if (password !== passwordConfirm) {
      return setExito({ tipo: 'danger', texto: 'Las contraseñas no coinciden.' });
    }
    if (!nombre || !email || !password || !fechaNacimiento) {
      return setExito({ tipo: 'danger', texto: 'Nombre, email, contraseña y fecha de nacimiento son obligatorios.' });
    }

    // --- ¡CAMBIO 3: Añadimos el nombre a los datos del usuario! ---
    const datosUsuario = {
      nombre,
      email,
      password,
      fechaNacimiento,
      codigoPromo
    };

    const registroExitoso = registrarUsuario(datosUsuario);

    if (registroExitoso) {
      setExito({ tipo: 'success', texto: '¡Registro exitoso! Redirigiendo al catálogo...' });
      
      setTimeout(() => {
        navigate('/catalogo');
      }, 2000);

    } 
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

          {exito && <Alert variant={exito.tipo}>{exito.texto}</Alert>}
          {mensaje && <Alert variant="danger">{mensaje}</Alert>}

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            
            {/* --- ¡CAMBIO 4: Añadimos el campo Nombre al formulario! --- */}
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

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
            </Form.Group>
            
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
                onChange={(e) => setCodigoPromo(e.target.value.toUpperCase())}
              />
            </Form.Group>

            <Button variant="secondary" type="submit" className="w-100 fw-bold" disabled={exito?.tipo === 'success'}>
              Registrarse
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}


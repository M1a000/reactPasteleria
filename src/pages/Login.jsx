import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();
  const { iniciarSesion, mensaje, limpiarMensaje } = useAutenticacion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertLocal, setAlertLocal] = useState(null);

  useEffect(() => {
    return () => limpiarMensaje();
  }, [limpiarMensaje]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertLocal(null);
    const mail = (email || "").trim();
    const pass = (password || "").trim();
    if (!mail || !pass) {
      setAlertLocal({ variant: "warning", text: "Completa email y contraseña." });
      return;
    }

    const resultado = iniciarSesion(mail, pass); // devuelve objeto o null
    console.log("[Login] iniciarSesion resultado:", resultado);

    if (resultado) {
      setAlertLocal({ variant: "success", text: "Inicio de sesión correcto." });

      // forzar navegación al panel admin si tiene rol admin
      if (resultado.rol === "admin") {
        console.log("[Login] redirigiendo a /admin");
        navigate("/admin", { replace: true });
        return;
      }

      console.log("[Login] redirigiendo a / (cliente)");
      navigate("/", { replace: true });
      return;
    }

    if (mensaje) {
      setAlertLocal({ variant: "danger", text: mensaje });
    } else {
      setAlertLocal({ variant: "danger", text: "No se pudo iniciar sesión." });
    }
  };

  return (
    <Container style={{ maxWidth: 520 }} className="my-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 style={{ fontFamily: "Pacifico, cursive" }} className="text-center mb-4">
            Iniciar Sesión
          </h2>

          {alertLocal && <Alert variant={alertLocal.variant}>{alertLocal.text}</Alert>}
          {mensaje && !alertLocal && <Alert variant="danger">{mensaje}</Alert>}

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 fw-bold">
              Ingresar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
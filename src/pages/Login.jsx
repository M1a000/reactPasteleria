import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoAutenticacion } from "../context/ContextoAutenticacion";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();
  const { iniciarSesion, mensaje, limpiarMensaje } = useContext(ContextoAutenticacion);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertLocal, setAlertLocal] = useState(null);

  useEffect(() => {
    // Limpia el mensaje de error cuando el componente se desmonta
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

    const ok = iniciarSesion(mail, pass);
    if (ok) {
      // leer el usuario guardado (el contexto guarda en localStorage)
      const saved = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
      const rol = saved?.rol ?? "cliente";

      setAlertLocal({ variant: "success", text: "Inicio de sesión correcto." });

      // redirigir según rol
      if (rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      return;
    }

    // iniciarSesion establece mensaje en el contexto; mostrarlo localmente si existe
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

          {/* 9. Mostramos el mensaje de ÉXITO (local) */}
          {alertLocal && <Alert variant={alertLocal.variant}>{alertLocal.text}</Alert>}

          {/* 10. Mostramos el mensaje de ERROR (del Contexto) */}
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


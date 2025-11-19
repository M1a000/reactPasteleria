// src/pages/Login.jsx (Versión corregida)

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion"; // Asegúrate que esta ruta sea correcta
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

export default function Login() {
    const navigate = useNavigate();
    const { iniciarSesion, mensaje, limpiarMensaje } = useAutenticacion();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para deshabilitar botón
    const [alertLocal, setAlertLocal] = useState(null);

    useEffect(() => {
        return () => limpiarMensaje();
    }, [limpiarMensaje]);

    // 💡 CAMBIO CLAVE: handleSubmit DEBE ser ASÍNCRONO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertLocal(null);
        limpiarMensaje();
        setIsSubmitting(true); // Deshabilita el botón

        const mail = (email || "").trim();
        const pass = (password || "").trim();

        if (!mail || !pass) {
            setAlertLocal({ variant: "warning", text: "Completa email y contraseña." });
            setIsSubmitting(false);
            return;
        }

        try {
            // 💡 CAMBIO CRÍTICO: Usar AWAIT para esperar la respuesta del Backend
            const resultado = await iniciarSesion(mail, pass); 
            console.log("[Login] iniciarSesion resultado:", resultado);

            if (resultado) {
                // Login exitoso, el resultado es el objeto del usuario
                setAlertLocal({ variant: "success", text: "Inicio de sesión correcto." });

                // Redirección basada en el rol que viene del Backend (ADMINISTRADOR, VENDEDOR)
                // Recuerda que los roles del Backend son en MAYÚSCULAS
                if (resultado.rol === "ADMINISTRADOR") {
                    console.log("[Login] redirigiendo a /admin");
                    navigate("/admin", { replace: true });
                    // No necesitas return aquí, navigate ya detiene el flujo
                } else if (resultado.rol === "VENDEDOR") {
                    console.log("[Login] redirigiendo a /vendedor");
                    navigate("/vendedor", { replace: true });
                } else {
                    console.log("[Login] redirigiendo a / (cliente)");
                    navigate("/", { replace: true });
                }
            } else {
                // Si 'iniciarSesion' retorna null o undefined (fallo)
                // El mensaje de error ya está en el estado 'mensaje' del contexto
                setAlertLocal({ variant: "danger", text: mensaje || "No se pudo iniciar sesión. Verifica tus credenciales." });
            }
        } catch (error) {
            // Esto solo se ejecuta si la promesa falló por un error grave de red.
            console.error("Error al iniciar sesión:", error);
            setAlertLocal({ variant: "danger", text: "Fallo de conexión con el servidor." });
        } finally {
            setIsSubmitting(false); // Vuelve a habilitar el botón
        }
    };

    return (
        <Container style={{ maxWidth: 520 }} className="my-4">
            <Row className="justify-content-md-center">
                <Col md={12}> {/* Usar md=12 o sin Col para que el contenedor use el ancho maximo de 520 */}
                    <h2 style={{ fontFamily: "Pacifico, cursive" }} className="text-center mb-4">
                        Iniciar Sesión
                    </h2>

                    {/* Mensajes de Alerta */}
                    {alertLocal && <Alert variant={alertLocal.variant}>{alertLocal.text}</Alert>}
                    {/* Mostrar mensaje del contexto si existe y no hay un mensaje local activo */}
                    {!alertLocal && mensaje && <Alert variant="danger">{mensaje}</Alert>} 

                    <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa tu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting} // Deshabilita durante el envío
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
                                disabled={isSubmitting} // Deshabilita durante el envío
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100 fw-bold" disabled={isSubmitting}>
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
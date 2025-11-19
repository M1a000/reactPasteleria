// src/pages/Registro.jsx (Código Corregido)

import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

export default function Registro() {
    // Necesitas una función registrarUsuario ASÍNCRONA en tu contexto
    const { registrarUsuario, mensaje, limpiarMensaje } = useContext(ContextoAutenticacion);
    const navigate = useNavigate();

    // 🚨 ESTADOS ACTUALIZADOS PARA SINCRONIZAR CON EL BACKEND (RegisterRequest.java)
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState(''); // 👈 NUEVO CAMPO
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [direccion, setDireccion] = useState('');   // 👈 NUEVO CAMPO
    const [telefono, setTelefono] = useState('');     // 👈 NUEVO CAMPO
    
    // Estados de control
    const [exito, setExito] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        limpiarMensaje();
        return () => {
            limpiarMensaje();
        };
    }, [limpiarMensaje]);


    const handleSubmit = async (e) => { // 💡 DEBE SER ASÍNCRONA
        e.preventDefault();
        setIsSubmitting(true);
        setExito(null); 
        limpiarMensaje(); 

        // 1. Validaciones locales
        if (password !== passwordConfirm) {
            setIsSubmitting(false);
            return setExito({ tipo: 'danger', texto: 'Las contraseñas no coinciden.' });
        }
        
        // Validar que los campos críticos del DTO estén llenos
        if (!nombre || !apellido || !email || !password || !direccion || !telefono) {
            setIsSubmitting(false);
            return setExito({ tipo: 'danger', texto: 'Todos los campos marcados son obligatorios.' });
        }

        // 2. Datos sincronizados con el Backend (RegisterRequest)
        const datosUsuario = {
            nombre,
            apellido,
            email,
            password,
            direccion,
            telefono
        };

        try {
            // 3. 🚨 Llamada ASÍNCRONA a la función del contexto
            await registrarUsuario(datosUsuario); 
            
            // Si llega aquí, significa que registrarUsuario no lanzó un error (registro exitoso)
            setExito({ tipo: 'success', texto: '¡Registro exitoso! Serás redirigido al login en 5 segundos...' }); 
            
            setTimeout(() => {
                navigate('/login'); // Redirigir al login
            }, 5000); 

        } catch (error) {
            // Manejar errores si registrarUsuario falla (ej: email ya existe)
            // La función registrarUsuario debe manejar el mensaje de error en el contexto
            console.error("Fallo el registro:", error);
            // El mensaje de error lo mostrará el Alert del estado 'mensaje' del contexto
        } finally {
            setIsSubmitting(false);
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

                    {exito && <Alert variant={exito.tipo} className="mb-3">{exito.texto}</Alert>}
                    {/* El mensaje de error del Backend viene del Contexto */}
                    {mensaje && <Alert variant="danger" className="mb-3">{mensaje}</Alert>} 

                    <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
                        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={isSubmitting} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formApellido">
                                <Form.Label>Apellido</Form.Label> {/* 👈 AGREGADO */}
                                <Form.Control type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required disabled={isSubmitting} />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Ingresa tu email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formPasswordConfirm">
                                <Form.Label>Confirmar Contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Repite contraseña" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required disabled={isSubmitting} />
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formDireccion">
                                <Form.Label>Dirección</Form.Label> {/* 👈 AGREGADO */}
                                <Form.Control type="text" placeholder="Calle y número" value={direccion} onChange={(e) => setDireccion(e.target.value)} required disabled={isSubmitting} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formTelefono">
                                <Form.Label>Teléfono</Form.Label> {/* 👈 AGREGADO */}
                                <Form.Control type="tel" placeholder="Ej: 912345678" value={telefono} onChange={(e) => setTelefono(e.target.value)} required disabled={isSubmitting} />
                            </Form.Group>
                        </Row>
                        
                        {/* 🚨 CAMPOS ELIMINADOS: fechaNacimiento y codigoPromo */}
                        <div className="text-center text-muted mb-3">
                            <small>Si deseas ingresar Fecha de Nacimiento o Código Promocional, podrás hacerlo desde tu perfil más adelante.</small>
                        </div>
                        
                        <Button variant="secondary" type="submit" className="w-100 fw-bold" disabled={isSubmitting || exito?.tipo === 'success'}>
                            {isSubmitting ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
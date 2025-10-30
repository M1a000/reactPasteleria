import { useState, useContext, useEffect } from 'react';
// 1. Importamos 'Image' para la vista previa
import { Form, Button, Container, Row, Col, Alert, Image } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom'; 
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

export default function MiPerfil() {
  const { usuario, actualizarUsuario, limpiarMensaje, mensaje } = useContext(ContextoAutenticacion);
  const navigate = useNavigate();

  // Estados locales para el formulario
  const [nombre, setNombre] = useState(usuario ? usuario.nombre : '');
  const [email, setEmail] = useState(usuario ? usuario.email : '');
  const [telefono, setTelefono] = useState(usuario ? (usuario.telefono || '') : '');
  // 2. Nuevo estado para la imagen (guardaremos el string Base64)
  const [fotoPerfil, setFotoPerfil] = useState(usuario ? usuario.fotoPerfil : null);
  
  const [exito, setExito] = useState(null);

  useEffect(() => {
    limpiarMensaje();
    return () => limpiarMensaje();
  }, [limpiarMensaje]);

  if (!usuario) {
    return <Navigate to="/login" state={{ mensaje: 'Debes iniciar sesion para ver tu perfil.' }} />;
  }
  
  // 3. Nueva funcion para manejar la subida del archivo
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convertimos el archivo de imagen a un string Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // Guardamos el string Base64 en el estado
        setFotoPerfil(reader.result);
      };
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setExito(null);
    limpiarMensaje();

    // 4. Añadimos la 'fotoPerfil' a los datos a guardar
    const nuevosDatos = {
      nombre,
      email,
      telefono,
      fotoPerfil // <-- El nuevo string de la imagen
    };

    const actualizacionExitosa = actualizarUsuario(nuevosDatos);

    if (actualizacionExitosa) {
      setExito({ tipo: 'success', texto: '¡Perfil actualizado exitosamente!' });
      setTimeout(() => setExito(null), 3000);
    }
  };
  
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Mi Perfil
          </h2>
          <p className="text-center text-muted">
            Actualiza tu informacion personal.
          </p>
          
          {/* 5. Vista previa de la imagen */}
          <div className="text-center mb-3">
            <Image
              // Si hay fotoPerfil, la usamos. Si no, un placeholder.
              src={fotoPerfil || 'https://placehold.co/150x150/FFF5E1/5D4037?text=Perfil'}
              roundedCircle
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #8B4513' }}
              alt="Vista previa de perfil"
            />
          </div>

          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
            
            {exito && <Alert variant={exito.tipo} className="mb-3">{exito.texto}</Alert>}
            {mensaje && <Alert variant="danger" className="mb-3">{mensaje}</Alert>}

            {/* 6. Nuevo campo para subir la foto */}
            <Form.Group className="mb-3" controlId="formPerfilFoto">
              <Form.Label>Foto de Perfil (Opcional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*" // Solo aceptamos imagenes
                onChange={handleFotoChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPerfilNombre">
              <Form.Label>Nombre (Opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPerfilEmail">
              <Form.Label>Email (Opcional)</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formPerfilTelefono">
              <Form.Label>Telefono (Opcional)</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Ej: 912345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </Form.Group>

            <Button variant="secondary" type="submit" className="w-100 fw-bold">
              Guardar Cambios
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}


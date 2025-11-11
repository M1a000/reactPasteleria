import { useState, useContext, useEffect } from 'react';
// 1. Importamos los componentes necesarios: Modal, ListGroup, InputGroup
import { Form, Button, Container, Row, Col, Alert, Image, Modal, ListGroup, InputGroup } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom'; 
import { ContextoAutenticacion } from '../context/ContextoAutenticacion';

export default function MiPerfil() {
  // 2. Traemos las nuevas funciones del contexto (las crearemos en el Paso 2)
  const { 
    usuario, 
    limpiarMensaje, 
    mensaje, 
    cerrarSesion, 
    actualizarDatos, 
    actualizarPassword,
    actualizarFoto 
  } = useContext(ContextoAutenticacion);
  
  const navigate = useNavigate();

  // 3. Estados para manejar los modales
  const [showModal, setShowModal] = useState(null); // 'nombre', 'email', 'telefono', 'password', 'foto'
  const [exito, setExito] = useState(null); // Mensaje de exito general
  
  // 4. Estados para los campos de los modales
  const [nuevoNombre, setNuevoNombre] = useState(usuario ? usuario.nombre : '');
  const [nuevoEmail, setNuevoEmail] = useState(usuario ? usuario.email : '');
  const [nuevoTelefono, setNuevoTelefono] = useState(usuario ? (usuario.telefono || '') : '');
  const [nuevaFoto, setNuevaFoto] = useState(null); // Para el archivo de imagen
  const [vistaPreviaFoto, setVistaPreviaFoto] = useState(usuario ? usuario.fotoPerfil : null);
  
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordNuevaConfirm, setPasswordNuevaConfirm] = useState('');


  // Limpiamos mensajes al cargar
  useEffect(() => {
    limpiarMensaje();
    return () => limpiarMensaje();
  }, [limpiarMensaje]);

  // Ruta protegida
  if (!usuario) {
    return <Navigate to="/login" state={{ mensaje: 'Debes iniciar sesion para ver tu perfil.' }} />;
  }
  
  // --- MANEJO DE MODALES ---

  // Funcion para abrir un modal
  const handleAbrirModal = (tipo) => {
    limpiarMensaje(); // Limpia errores viejos
    setExito(null); // Limpia exitos viejos
    setPasswordActual(''); // Resetea el campo de contraseña
    setShowModal(tipo); // Muestra el modal (ej: 'nombre')
  };

  // Funcion para cerrar todos los modales
  const handleCerrarModal = () => {
    setShowModal(null);
  };
  
  // Funcion para manejar la subida de la foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaFoto(file); // Guardamos el *archivo*
      // Creamos la vista previa
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setVistaPreviaFoto(reader.result);
      };
    }
  };

  // Funcion para manejar el envio del formulario del modal
  const handleSubmitModal = async () => {
    limpiarMensaje();
    setExito(null);

    let resultadoExitoso = false;

    // Logica para cada tipo de modal
    if (showModal === 'datos') {
      const nuevosDatos = { nombre: nuevoNombre, email: nuevoEmail, telefono: nuevoTelefono };
      resultadoExitoso = actualizarDatos(nuevosDatos, passwordActual);
    } 
    
    if (showModal === 'password') {
      if (passwordNueva !== passwordNuevaConfirm) {
        return setExito({ tipo: 'danger', texto: 'Las nuevas contraseñas no coinciden.' });
      }
      resultadoExitoso = actualizarPassword(passwordActual, passwordNueva);
    }
    
    if (showModal === 'foto') {
      if (!nuevaFoto) {
        return setExito({ tipo: 'danger', texto: 'Por favor, selecciona una imagen primero.' });
      }
      // La funcion de actualizarFoto (que crearemos) debe manejar la conversion a Base64
      resultadoExitoso = await actualizarFoto(nuevaFoto, passwordActual);
      // Actualizamos la vista previa principal si el guardado fue exitoso
      if (resultadoExitoso) setVistaPreviaFoto(usuario.fotoPerfil); 
    }

    // Si la operacion (actualizarDatos, actualizarPassword, etc.) fue exitosa...
    if (resultadoExitoso) {
      setExito({ tipo: 'success', texto: '¡Datos actualizados exitosamente!' });
      setTimeout(() => {
        handleCerrarModal();
        setExito(null); // Limpiamos el mensaje de exito
      }, 2000);
    }
    // Si fallo (ej. contraseña incorrecta), el Contexto pondra el 'mensaje' de error
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/', { state: { mensaje: 'Has cerrado sesion exitosamente.' } });
  };
  
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          
          <h2 style={{ fontFamily: 'Pacifico, cursive' }} className="text-center mb-4">
            Mi Perfil
          </h2>

          {/* --- ¡REQUERIMIENTO 4! (Imagen y Texto de carga) --- */}
          <div className="text-center mb-3">
            <Image
              src={vistaPreviaFoto || 'https://placehold.co/150x150/FFF5E1/5D4037?text=Perfil'}
              roundedCircle
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #8B4513' }}
              alt="Foto de perfil"
            />
          </div>
          <div className="text-center mb-4">
            {/* Texto (link simulado) para cambiar la foto */}
            <Button variant="link" onClick={() => handleAbrirModal('foto')} style={{color: '#8B4513'}}>
              Cambiar foto de perfil
            </Button>
          </div>
          
          {/* Mostramos mensaje de exito general (si cerramos un modal) */}
          {exito && showModal === null && <Alert variant={exito.tipo}>{exito.texto}</Alert>}

          {/* --- ¡REQUERIMIENTO 1 y 2! (Lista de Datos) --- */}
          <ListGroup className="shadow-sm">
            <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
              <div>
                <strong className="d-block">Nombre</strong>
                <span className="text-muted">{usuario.nombre || 'No definido'}</span>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => handleAbrirModal('datos')}>
                Editar
              </Button>
            </ListGroup.Item>
            
            <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
              <div>
                <strong className="d-block">Email</strong>
                <span className="text-muted">{usuario.email}</span>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => handleAbrirModal('datos')}>
                Editar
              </Button>
            </ListGroup.Item>
            
            <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
              <div>
                <strong className="d-block">Telefono</strong>
                <span className="text-muted">{usuario.telefono || 'No definido'}</span>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => handleAbrirModal('datos')}>
                Editar
              </Button>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
              <div>
                <strong className="d-block">Contraseña</strong>
                <span className="text-muted">********</span>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => handleAbrirModal('password')}>
                Cambiar
              </Button>
            </ListGroup.Item>
          </ListGroup>

          {/* Boton de Cerrar Sesion */}
          <Button 
            variant="outline-danger" 
            className="w-100 fw-bold mt-4" 
            onClick={handleCerrarSesion}
          >
            Cerrar Sesión
          </Button>

        </Col>
      </Row>

      {/* --- EL MODAL (Dinamico) --- */}
      
      {/* Modal para DATOS (Nombre, Email, Telefono) */}
      <Modal show={showModal === 'datos'} onHide={handleCerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Pacifico, cursive' }}>Actualizar Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mensajes de error/exito DENTRO del modal */}
          {exito && <Alert variant={exito.tipo}>{exito.texto}</Alert>}
          {mensaje && <Alert variant="danger">{mensaje}</Alert>}
          
          <Form>
            <Form.Group className="mb-3" controlId="modalNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="modalEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={nuevoEmail}
                onChange={(e) => setNuevoEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="modalTelefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="tel"
                value={nuevoTelefono}
                onChange={(e) => setNuevoTelefono(e.target.value)}
              />
            </Form.Group>
            
            {/* --- ¡REQUERIMIENTO 3! (Validacion) --- */}
            <hr />
            <Form.Group className="mb-3" controlId="modalPassActualDatos">
              <Form.Label className="fw-bold">Contrasena Actual</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contrasena actual para confirmar"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCerrarModal}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleSubmitModal}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal para CONTRASEÑA */}
      <Modal show={showModal === 'password'} onHide={handleCerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Pacifico, cursive' }}>Cambiar Contrasena</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {exito && <Alert variant={exito.tipo}>{exito.texto}</Alert>}
          {mensaje && <Alert variant="danger">{mensaje}</Alert>}
          
          <Form>
            <Form.Group className="mb-3" controlId="modalPassNueva">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="modalPassConfirm">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={passwordNuevaConfirm}
                onChange={(e) => setPasswordNuevaConfirm(e.target.value)}
              />
            </Form.Group>
            
            <hr />
            <Form.Group className="mb-3" controlId="modalPassActualPass">
              <Form.Label className="fw-bold">Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña actual para confirmar"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCerrarModal}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleSubmitModal}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para FOTO DE PERFIL */}
      <Modal show={showModal === 'foto'} onHide={handleCerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Pacifico, cursive' }}>Actualizar Foto de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {exito && <Alert variant={exito.tipo}>{exito.texto}</Alert>}
          {mensaje && <Alert variant="danger">{mensaje}</Alert>}
          
          <div className="text-center mb-3">
            <Image
              src={vistaPreviaFoto || 'https://placehold.co/150x150/FFF5E1/5D4037?text=Perfil'}
              roundedCircle
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              alt="Vista previa de perfil"
            />
          </div>

          <Form>
            <Form.Group className="mb-3" controlId="modalFoto">
              <Form.Label>Seleccionar nueva imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
              />
            </Form.Group>
            
            <hr />
            <Form.Group className="mb-3" controlId="modalPassActualFoto">
              <Form.Label className="fw-bold">Contrasena Actual</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contrasena actual para confirmar"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCerrarModal}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleSubmitModal}>
            Guardar Foto
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
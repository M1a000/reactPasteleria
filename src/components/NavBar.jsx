import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { useAutenticacion } from "../context/ContextoAutenticacion";

export default function NavBar() {
  const { usuario, cerrarSesion } = useAutenticacion();

  return (
    <Navbar expand="lg" variant="dark" style={{ backgroundColor: "#7A3B16" }} className="shadow-sm">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-white"
          style={{ fontFamily: "Pacifico, cursive" }}
        >
          Pasteleria Mil Sabores
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end className="text-light">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" className="text-light">Catalogo</Nav.Link>
            <Nav.Link as={NavLink} to="/sobre-nosotros" className="text-light">Sobre Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto" className="text-light">Contacto</Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/carrito" className="text-light">
              <span role="img" aria-label="carrito">🛒</span> Carrito
            </Nav.Link>

            {usuario ? (
              <>
                {usuario.rol === "admin" && (
                  <Nav.Link as={NavLink} to="/admin" className="fw-bold ms-2 text-light">
                    Panel Admin
                  </Nav.Link>
                )}

                <Nav.Link as={NavLink} to="/mi-perfil" className="d-flex align-items-center ms-3 text-light">
                  {usuario.fotoPerfil ? (
                    <Image
                      src={usuario.fotoPerfil}
                      roundedCircle
                      style={{ width: 32, height: 32, objectFit: "cover", marginRight: 8 }}
                    />
                  ) : (
                    <span
                      className="rounded-circle bg-secondary text-white d-inline-flex justify-content-center align-items-center"
                      style={{ width: 32, height: 32, marginRight: 8 }}
                    >
                      {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "P"}
                    </span>
                  )}
                  <span className="d-none d-lg-inline text-light">{usuario.nombre || "Perfil"}</span>
                </Nav.Link>

                <Button variant="outline-light" size="sm" onClick={cerrarSesion} className="ms-2">
                  Cerrar
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/registro" className="ms-2 text-light">Registro</Nav.Link>
                <Nav.Link as={NavLink} to="/login" className="ms-2 text-light">Ingresar</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
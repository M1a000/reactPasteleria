import React from "react";
import { Button } from "react-bootstrap";

const headerStyle = {
  background: "#fff8f2",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
  padding: "0.75rem 1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: 6
};

export default function AdminHeader({ onNuevo }) {
  return (
    <header style={headerStyle} className="mb-3">
      <div>
        <h3 style={{ margin: 0, fontFamily: "Pacifico, cursive", color: "#7A3B16" }}>Panel de Administrador</h3>
        <small className="text-muted">Gestiona productos, pedidos y contenido</small>
      </div>
      <div>
        <Button variant="outline-primary" onClick={onNuevo}>
          Nuevo producto
        </Button>
      </div>
    </header>
  );
}
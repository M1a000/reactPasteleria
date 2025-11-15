import React from "react";
import { Card, Row, Col } from "react-bootstrap";

export default function DashboardStats({ productos = [] }) {
  const totalProductos = productos.length;
  const valorTotal = productos.reduce((s, p) => s + (Number(p.precio) || 0), 0);
  const precioPromedio = totalProductos ? valorTotal / totalProductos : 0;

  const statCard = (title, value, hint) => (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="text-muted small">{title}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
          </div>
          <div className="text-end text-muted small">{hint}</div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Row className="g-3 mb-3">
      <Col md={4}>{statCard("Productos totales", totalProductos, "Ítems")}</Col>
      <Col md={4}>{statCard("Valor total inventario", `$ ${valorTotal.toFixed(2)}`, "CLP")}</Col>
      <Col md={4}>{statCard("Precio promedio", `$ ${precioPromedio.toFixed(2)}`, "Promedio")}</Col>
    </Row>
  );
}
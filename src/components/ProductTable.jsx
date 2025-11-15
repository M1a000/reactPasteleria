import React from "react";
import { Table, Button, Image, Badge } from "react-bootstrap";

/*
  Tabla con aspecto similar al template:
  - thumbnails a la izquierda
  - columnas: nombre, descripción, precio, acciones
  - botones compactos y badges si aplica
*/

export default function ProductTable({ productos = [], onEdit, onDelete }) {
  return (
    <Table hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th style={{ width: 120 }}>Producto</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th style={{ width: 140 }}>Precio</th>
          <th style={{ width: 170 }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.id}>
            <td>
              {p.imagenBase64 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Image src={p.imagenBase64} rounded style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                </div>
              ) : (
                <div className="text-muted">Sin imagen</div>
              )}
            </td>

            <td>
              <div style={{ fontWeight: 600 }}>{p.nombre || "Sin nombre"}</div>
              {p.categoria && <Badge bg="secondary" className="mt-1">{p.categoria}</Badge>}
            </td>

            <td style={{ maxWidth: 420 }}>
              <div className="text-muted" style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {p.descripcion || <em>No tiene descripción</em>}
              </div>
            </td>

            <td>
              <div style={{ fontWeight: 700 }}>${Number(p.precio).toFixed(2)}</div>
            </td>

            <td>
              <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => onEdit(p)}>
                Editar
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onDelete(p.id)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
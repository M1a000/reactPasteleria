import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import productosSeed from "../data/productos.json";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import DashboardStats from "../components/DashboardStats";
import ProductTable from "../components/ProductTable";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
  Image,
} from "react-bootstrap";

const STORAGE_KEY = "productos";
const _normalizeSeed = (seedArray) =>
  seedArray.map((p) => ({
    id: p.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nombre: p.nombre || p.title || "",
    descripcion: p.descripcion || p.description || "",
    precio: Number(p.precio) || Number(p.price) || 0,
    imagenBase64: p.img || p.imagen || p.imagenBase64 || null,
    categoria: p.categoria || "",
  }));

const leerProductos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const inicial = _normalizeSeed(productosSeed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
      return inicial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const guardarProductos = (lista) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
};

export default function AdminPanel() {
  const { usuario } = useAutenticacion();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    if (usuario && usuario.rol !== "admin") {
      navigate("/not-authorized");
      return;
    }
  }, [usuario, navigate]);

  const [productos, setProductos] = useState(() => leerProductos());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagenBase64: null,
    _file: null,
    categoria: ""
  });

  useEffect(() => {
    guardarProductos(productos);
  }, [productos]);

  const limpiarAlerta = () => setTimeout(() => setAlerta(null), 2200);

  const abrirNuevo = () => {
    setEditing(null);
    setForm({ nombre: "", descripcion: "", precio: "", imagenBase64: null, _file: null, categoria: "" });
    setShowModal(true);
  };

  const abrirEditar = (p) => {
    setEditing(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: String(p.precio),
      imagenBase64: p.imagenBase64 || null,
      _file: null,
      categoria: p.categoria || ""
    });
    setShowModal(true);
  };

  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    const nueva = productos.filter((p) => p.id !== id);
    setProductos(nueva);
    setAlerta({ variant: "success", text: "Producto eliminado" });
    limpiarAlerta();
  };

  const handleImage = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.precio) {
      setAlerta({ variant: "warning", text: "Nombre y precio son obligatorios" });
      limpiarAlerta();
      return;
    }

    let imagen = form.imagenBase64;
    if (form._file) {
      imagen = await handleImage(form._file).catch(() => null);
    }

    if (editing) {
      const lista = productos.map((p) =>
        p.id === editing
          ? { ...p, nombre: form.nombre, descripcion: form.descripcion, precio: Number(form.precio), imagenBase64: imagen, categoria: form.categoria }
          : p
      );
      setProductos(lista);
      setAlerta({ variant: "success", text: "Producto actualizado" });
    } else {
      const nuevo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        imagenBase64: imagen,
        categoria: form.categoria
      };
      setProductos([nuevo, ...productos]);
      setAlerta({ variant: "success", text: "Producto agregado" });
    }

    setShowModal(false);
    limpiarAlerta();
  };

  return (
    <Container fluid className="my-4">
      <Row>
        <Col md={3}>
          <AdminSidebar />
        </Col>

        <Col md={9}>
          <AdminHeader onNuevo={abrirNuevo} />

          <DashboardStats productos={productos} />

          {alerta && <Alert variant={alerta.variant}>{alerta.text}</Alert>}

          <ProductTable productos={productos} onEdit={abrirEditar} onDelete={eliminar} />

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>{editing ? "Editar producto" : "Nuevo producto"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control as="textarea" rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Categoría (opcional)</Form.Label>
                  <Form.Control value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Imagen (opcional)</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setForm({ ...form, _file: e.target.files?.[0] })} />
                  {form.imagenBase64 && !form._file && (
                    <div className="mt-2">
                      <Image src={form.imagenBase64} thumbnail style={{ maxWidth: 160 }} />
                    </div>
                  )}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" variant="primary">{editing ? "Guardar" : "Agregar"}</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}
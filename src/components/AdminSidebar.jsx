import React from "react";
import { NavLink } from "react-router-dom";

const styles = {
  wrapper: { background: "#F6EBDD", borderRight: "1px solid rgba(0,0,0,0.04)", minHeight: "80vh", padding: "1rem" },
  title: { fontFamily: "Pacifico, cursive", color: "#7A3B16", marginBottom: 12 },
  link: { display: "block", color: "#7A3B16", padding: "8px 6px", textDecoration: "none", borderRadius: 6 },
  linkActive: { background: "rgba(122,59,22,0.08)" }
};

export default function AdminSidebar() {
  return (
    <aside style={styles.wrapper}>
      <div style={styles.title}>Administración</div>
      <nav>
        <NavLink to="/admin" end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
          Panel
        </NavLink>
        <NavLink to="/admin/productos" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
          Productos
        </NavLink>
        <NavLink to="/admin/pedidos" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
          Pedidos
        </NavLink>
        <NavLink to="/" style={styles.link}>
          Volver al sitio
        </NavLink>
      </nav>
    </aside>
  );
}
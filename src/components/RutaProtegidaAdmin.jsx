import React from "react";
import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";

export default function RutaProtegidaAdmin({ children }) {
  const { usuario } = useAutenticacion();

  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== "admin") return <Navigate to="/not-authorized" replace />;

  return children;
}
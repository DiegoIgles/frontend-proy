import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pagina-estado.css";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Mientras se verifica el token con el backend, no renderiza nada
  if (loading) {
    return (
      <div className="ruta-cargando">
        <span className="ruta-cargando-spinner" />
        Verificando sesión…
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return children;
}

export default PrivateRoute;

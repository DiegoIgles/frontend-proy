import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tieneRol } from "../auth/roles";
import SinPermiso from "../pages/SinPermiso";
import "../styles/pagina-estado.css";

/**
 * Exige sesión y, si se pasa `roles`, que el usuario tenga alguno de ellos.
 * Sin `roles` basta con estar logueado.
 */
function PrivateRoute({ children, roles }) {
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

  if (!user) return <Navigate to="/login" replace />;

  if (!tieneRol(user, roles)) return <SinPermiso />;

  return children;
}

export default PrivateRoute;

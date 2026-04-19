import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Mientras se verifica el token con el backend, no renderiza nada
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Segoe UI, sans-serif", color: "#6b7280", fontSize: 15 }}>
        Cargando...
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return children;
}

export default PrivateRoute;

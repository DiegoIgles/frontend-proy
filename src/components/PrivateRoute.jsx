import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Si NO hay token → login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token → deja pasar
  return children;
}

export default PrivateRoute;
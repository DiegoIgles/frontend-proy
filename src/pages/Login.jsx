import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/login.css";
import { loginAction } from "./auth/actions/login.action";
import { useAuth } from "../context/AuthContext";

/* IMPORTAR CHATBOT */
import FloatingChatbot from "../components/FloatingChatbot";

function Login() {
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Si ya está autenticado
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = await loginAction({
        email,
        password,
      });

      login(data);
      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Credenciales incorrectas"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="login-wrapper">

        {/* Lado izquierdo */}
        <div className="login-left">
          <div className="overlay-text">
            <h1>Mi ERP</h1>
            <p>Gestiona tu negocio de forma inteligente</p>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="login-right">
          <form onSubmit={handleLogin} className="login-form">

            <h2>Iniciar Sesión</h2>

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
              autoComplete="email"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              className="login-button"
              disabled={submitting}
            >
              {submitting ? "Ingresando..." : "Ingresar"}
            </button>

          </form>
        </div>

      </div>

      {/* CHATBOT FLOTANTE */}
      <FloatingChatbot />
    </>
  );
}

export default Login;
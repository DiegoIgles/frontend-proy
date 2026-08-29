import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/login.css";
import { loginAction } from "./auth/actions/login.action";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/* IMPORTAR CHATBOT */
import FloatingChatbot from "../components/FloatingChatbot";

/* Dos versiones del mismo lockup: la de wordmark blanco solo lee sobre el navy
   del panel izquierdo; la de color, solo sobre el fondo claro del formulario. */
import logoBlanco from "../assets/brand/enerlogic-blanco.png";
import logoColor from "../assets/brand/enerlogic-color.png";

function Login() {
  const { user, loading, login } = useAuth();
  const toast = useToast();

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
      toast.success("Bienvenido de nuevo.");
      navigate("/dashboard");

    } catch (error) {
      toast.error(
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
            <img src={logoBlanco} alt="Enerlogic — Energía Inteligente" className="login-brand" />
            <h1>Ingeniería que transforma la energía en ahorro</h1>
            <p>
              Gestión de proyectos, cotizaciones e inventario para soluciones
              fotovoltaicas en todo el territorio boliviano.
            </p>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="login-right">
          <form onSubmit={handleLogin} className="login-form">

            <img src={logoColor} alt="Enerlogic" className="login-form-logo" />

            <h2>Iniciar sesión</h2>
            <p className="login-form-hint">Ingresá con tu cuenta corporativa</p>

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

            <p className="login-footer">Enerlogic S.R.L. · Santa Cruz de la Sierra</p>

          </form>
        </div>

      </div>

      {/* CHATBOT FLOTANTE */}
      <FloatingChatbot />
    </>
  );
}

export default Login;
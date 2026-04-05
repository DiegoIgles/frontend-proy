import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Error en login");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
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
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>

    </div>
  );
}

export default Login;
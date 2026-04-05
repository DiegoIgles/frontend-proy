import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h3>Panel de Administración</h3>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Header;
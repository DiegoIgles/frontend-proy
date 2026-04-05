import React from "react";
import { Link, useLocation } from "react-router-dom";

// Iconos (react-icons)
import { FaTachometerAlt, FaUsers, FaBoxOpen } from "react-icons/fa";
import { FaTags } from "react-icons/fa";
function Sidebar({ onNavigate }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Cerrar sidebar en móvil al hacer click
  const handleClick = () => {
    if (window.innerWidth < 768 && onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="sidebar-content">
      <h2 className="logo">Mi ERP</h2>

      <nav className="menu">
        <p className="menu-title">GENERAL</p>

        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "active" : ""}
          onClick={handleClick}
        >
          <span className="icon">
            <FaTachometerAlt />
          </span>
          Dashboard
        </Link>
        <Link
          to="/categorias"
          className={isActive("/categorias") ? "active" : ""}
          onClick={handleClick}
        >
          <span className="icon">
            <FaTags />
          </span>
          Categorías
        </Link>
        <p className="menu-title">GESTIÓN</p>

        <Link
          to="/clientes"
          className={isActive("/clientes") ? "active" : ""}
          onClick={handleClick}
        >
          <span className="icon">
            <FaUsers />
          </span>
          Clientes
        </Link>

        <Link
          to="/productos"
          className={isActive("/productos") ? "active" : ""}
          onClick={handleClick}
        >
          <span className="icon">
            <FaBoxOpen />
          </span>
          Productos
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

// El estilo vive en layout.css. Acá no va ni un color suelto: en pantallas
// chicas hay que poder esconder piezas con media queries, y eso no se puede
// hacer sobre estilos en línea.
function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const photoUrl = user?.profile?.photo || null;
  const iniciales = user
    ? `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          aria-label="Abrir menú"
        >
          <FaBars />
        </button>
        <h1 className="header-title">Panel de Administración</h1>
      </div>

      <div className="header-right">
        <NotificationBell />

        {user && (
          <button
            className="header-user"
            onClick={() => navigate("/perfil")}
            title="Ver perfil"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="" className="header-avatar" />
            ) : (
              <div className="header-avatar-fallback">
                {iniciales || <FaUserCircle style={{ fontSize: 18 }} />}
              </div>
            )}

            <div className="header-user-info">
              <p className="header-user-name">
                {user.name} {user.lastName}
              </p>
              <p className="header-user-role">
                {user.roles?.includes("admin") ? "Administrador" : "Usuario"}
              </p>
            </div>
          </button>
        )}

        <div className="header-divider" />

        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
}

export default Header;

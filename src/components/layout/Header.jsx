import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Header({ toggleSidebar }) {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const photoUrl  = user?.profile?.photo || null;
  const initiales = user ? `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "";

  return (
    <div className="header">
      {/* Izquierda: hamburger + título */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
        <h3 style={{ margin: 0 }}>Panel de Administración</h3>
      </div>

      {/* Derecha: perfil + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Info del usuario */}
        {user && (
          <button
            onClick={() => navigate("/perfil")}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 8px", borderRadius: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            title="Ver perfil"
          >
            {/* Avatar */}
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="avatar"
                style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover",
                  border: "2px solid #e5e7eb" }}
              />
            ) : (
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#1d4ed8", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>
                {initiales || <FaUserCircle style={{ fontSize: 18 }} />}
              </div>
            )}

            {/* Nombre y rol */}
            <div style={{ textAlign: "left", lineHeight: 1.3 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#111827" }}>
                {user.name} {user.lastName}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#6b7280", textTransform: "capitalize" }}>
                {user.roles?.includes("admin") ? "Administrador" : "Usuario"}
              </p>
            </div>
          </button>
        )}

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
}

export default Header;

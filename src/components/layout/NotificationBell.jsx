import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaExclamationTriangle, FaTimesCircle, FaBullhorn, FaCheckDouble } from "react-icons/fa";
import { getNotificacionesAction } from "../../pages/notificaciones/actions/get-notificaciones.action";
import { getNotificacionesContadorAction } from "../../pages/notificaciones/actions/get-notificaciones-contador.action";
import { marcarNotificacionLeidaAction } from "../../pages/notificaciones/actions/marcar-notificacion-leida.action";
import { marcarTodasLeidasAction } from "../../pages/notificaciones/actions/marcar-todas-leidas.action";

const POLL_MS = 30000;

function IconoNotificacion({ tipo, evento }) {
  if (tipo === "MANUAL") return <FaBullhorn style={{ color: "#1d4ed8" }} />;
  if (evento === "STOCK_AGOTADO") return <FaTimesCircle style={{ color: "#dc2626" }} />;
  return <FaExclamationTriangle style={{ color: "#d97706" }} />;
}

function NotificationBell() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [open, setOpen]       = useState(false);
  const [unread, setUnread]   = useState(0);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContador = useCallback(async () => {
    try {
      const res = await getNotificacionesContadorAction();
      setUnread(res.total ?? 0);
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    fetchContador();
    const interval = setInterval(fetchContador, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchContador]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePanel = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      try {
        const res = await getNotificacionesAction({ limit: 8 });
        setItems(res.data ?? []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarcarLeida = async (id) => {
    try {
      await marcarNotificacionLeidaAction(id);
      setItems((prev) => prev.map((n) => n.usuarioNotificacionId === id ? { ...n, leido: true } : n));
      setUnread((prev) => Math.max(0, prev - 1));
    } catch {
      // silencioso
    }
  };

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasLeidasAction();
      setItems((prev) => prev.map((n) => ({ ...n, leido: true })));
      setUnread(0);
    } catch {
      // silencioso
    }
  };

  const verTodas = () => {
    setOpen(false);
    navigate("/notificaciones");
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        onClick={togglePanel}
        title="Notificaciones"
        style={{
          position: "relative", background: "none", border: "none", cursor: "pointer",
          width: 38, height: 38, borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 17, color: "#374151",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
      >
        <FaBell />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2, minWidth: 16, height: 16,
            borderRadius: 8, background: "#dc2626", color: "#fff",
            fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center",
            justifyContent: "center", padding: "0 3px",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: 46, right: 0, width: 360, maxHeight: 440,
          background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          border: "1px solid #e5e7eb", zIndex: 1500, display: "flex", flexDirection: "column",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 14px", borderBottom: "1px solid #e5e7eb",
          }}>
            <strong style={{ fontSize: 14, color: "#111827" }}>Notificaciones</strong>
            {unread > 0 && (
              <button onClick={handleMarcarTodas} style={{
                background: "none", border: "none", cursor: "pointer", color: "#1d4ed8",
                fontSize: 12, display: "flex", alignItems: "center", gap: 4,
              }}>
                <FaCheckDouble /> Marcar todas
              </button>
            )}
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading ? (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: 20 }}>Cargando...</p>
            ) : items.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: 20 }}>Sin notificaciones</p>
            ) : items.map((n) => (
              <div
                key={n.usuarioNotificacionId}
                onClick={() => !n.leido && handleMarcarLeida(n.usuarioNotificacionId)}
                style={{
                  display: "flex", gap: 10, padding: "10px 14px",
                  borderBottom: "1px solid #f3f4f6", cursor: n.leido ? "default" : "pointer",
                  background: n.leido ? "#fff" : "#eff6ff",
                }}
              >
                <div style={{ fontSize: 15, marginTop: 2 }}>
                  <IconoNotificacion tipo={n.notificacion?.tipo} evento={n.notificacion?.evento} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#111827" }}>
                    {n.notificacion?.titulo}
                  </p>
                  <p style={{
                    margin: "2px 0 0", fontSize: 12, color: "#6b7280",
                    overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  }}>
                    {n.notificacion?.mensaje}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ca3af" }}>
                    {n.notificacion?.fechaCreacion && new Date(n.notificacion.fechaCreacion).toLocaleString("es-BO")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={verTodas} style={{
            background: "none", border: "none", borderTop: "1px solid #e5e7eb",
            padding: "10px 0", color: "#1d4ed8", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Ver todas
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

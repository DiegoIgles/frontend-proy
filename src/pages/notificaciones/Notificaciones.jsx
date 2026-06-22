import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getNotificacionesAction } from "./actions/get-notificaciones.action";
import { marcarNotificacionLeidaAction } from "./actions/marcar-notificacion-leida.action";
import { marcarTodasLeidasAction } from "./actions/marcar-todas-leidas.action";
import { enviarNotificacionManualAction } from "./actions/enviar-notificacion-manual.action";
import { getUsersAction } from "../usuarios/actions/get-users.action";
import {
  FaBell, FaPlus, FaCheck, FaCheckDouble, FaExclamationTriangle,
  FaTimesCircle, FaBullhorn, FaTimes,
} from "react-icons/fa";

const TIPOS = [
  { value: "",        label: "Todos" },
  { value: "SISTEMA",  label: "Sistema" },
  { value: "MANUAL",   label: "Manual" },
];

const EVENTOS = [
  { value: "",             label: "Todos" },
  { value: "STOCK_BAJO",    label: "Stock bajo" },
  { value: "STOCK_AGOTADO", label: "Stock agotado" },
];

const ESTADOS = [
  { value: "",      label: "Todas" },
  { value: "false", label: "No leídas" },
  { value: "true",  label: "Leídas" },
];

const ROLES_DESTINO = ["admin", "super-user", "user"];

const FORM_VACIO = { titulo: "", mensaje: "", destino: "todos", usuarioIds: [], roles: [] };

function IconoNotificacion({ tipo, evento }) {
  if (tipo === "MANUAL") return <FaBullhorn style={{ color: "#1d4ed8" }} />;
  if (evento === "STOCK_AGOTADO") return <FaTimesCircle style={{ color: "#dc2626" }} />;
  return <FaExclamationTriangle style={{ color: "#d97706" }} />;
}

function Notificaciones() {
  const { user } = useAuth();
  const toast = useToast();
  const esAdmin = user?.roles?.includes("admin") || user?.roles?.includes("super-user");

  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);

  const [leido, setLeido]         = useState("");
  const [tipo, setTipo]           = useState("");
  const [evento, setEvento]       = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [search, setSearch]       = useState("");
  const [limit, setLimit]         = useState(10);
  const [offset, setOffset]       = useState(0);

  const [marcandoTodas, setMarcandoTodas] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(FORM_VACIO);
  const [usuarios, setUsuarios]   = useState([]);
  const [saving, setSaving]       = useState(false);
  const [formErr, setFormErr]     = useState("");

  const fetchNotificaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotificacionesAction({ limit, offset, leido, tipo, evento, fechaDesde, fechaHasta, search });
      setItems(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, leido, tipo, evento, fechaDesde, fechaHasta, search]);

  useEffect(() => { fetchNotificaciones(); }, [fetchNotificaciones]);

  const applyFilter = (setter) => (value) => { setter(value); setOffset(0); };

  const limpiarFiltros = () => {
    setLeido(""); setTipo(""); setEvento(""); setFechaDesde(""); setFechaHasta(""); setSearch(""); setOffset(0);
  };
  const hayFiltros = leido || tipo || evento || fechaDesde || fechaHasta || search;

  const handleMarcarLeida = async (id) => {
    try {
      await marcarNotificacionLeidaAction(id);
      fetchNotificaciones();
    } catch {
      // silencioso
    }
  };

  const handleMarcarTodas = async () => {
    setMarcandoTodas(true);
    try {
      await marcarTodasLeidasAction();
      fetchNotificaciones();
      toast.success("Todas las notificaciones fueron marcadas como leídas.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al marcar las notificaciones");
    } finally {
      setMarcandoTodas(false);
    }
  };

  // ── Modal: nueva notificación manual ──
  const abrirModal = async () => {
    setForm(FORM_VACIO);
    setFormErr("");
    setShowModal(true);
    try {
      const res = await getUsersAction({ limit: 200 });
      setUsuarios(Array.isArray(res) ? res : (res.data ?? []));
    } catch {
      setUsuarios([]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMultiChange = (field) => (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((f) => ({ ...f, [field]: selected }));
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.titulo || !form.mensaje) {
      setFormErr("Completa el título y el mensaje.");
      return;
    }
    if (form.destino === "usuarios" && form.usuarioIds.length === 0) {
      setFormErr("Selecciona al menos un usuario destinatario.");
      return;
    }
    if (form.destino === "roles" && form.roles.length === 0) {
      setFormErr("Selecciona al menos un rol destinatario.");
      return;
    }

    const dto = { titulo: form.titulo, mensaje: form.mensaje };
    if (form.destino === "todos")     dto.todos = true;
    if (form.destino === "usuarios")  dto.usuarioIds = form.usuarioIds;
    if (form.destino === "roles")     dto.roles = form.roles;

    try {
      setSaving(true);
      await enviarNotificacionManualAction(dto);
      setShowModal(false);
      fetchNotificaciones();
      toast.success("Notificación enviada correctamente.");
    } catch (err) {
      const message = err.response?.data?.message || "Error al enviar la notificación";
      setFormErr(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaBell style={{ marginRight: 8 }} />Notificaciones</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={handleMarcarTodas} disabled={marcandoTodas}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaCheckDouble /> {marcandoTodas ? "Marcando..." : "Marcar todas como leídas"}
          </button>
          {esAdmin && (
            <button className="btn-primary" onClick={abrirModal} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaPlus /> Nueva Notificación
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-field" style={{ flex: "1 1 200px" }}>
          <label>Buscar</label>
          <input
            placeholder="Título o mensaje..."
            value={search}
            onChange={(e) => applyFilter(setSearch)(e.target.value)}
          />
        </div>
        <div className="filter-field" style={{ flex: "1 1 130px" }}>
          <label>Estado</label>
          <select value={leido} onChange={(e) => applyFilter(setLeido)(e.target.value)}>
            {ESTADOS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="filter-field" style={{ flex: "1 1 130px" }}>
          <label>Tipo</label>
          <select value={tipo} onChange={(e) => applyFilter(setTipo)(e.target.value)}>
            {TIPOS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {tipo === "SISTEMA" && (
          <div className="filter-field" style={{ flex: "1 1 150px" }}>
            <label>Evento</label>
            <select value={evento} onChange={(e) => applyFilter(setEvento)(e.target.value)}>
              {EVENTOS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        )}
        <div className="filter-field" style={{ flex: "0 1 150px" }}>
          <label>Desde</label>
          <input type="date" value={fechaDesde} onChange={(e) => applyFilter(setFechaDesde)(e.target.value)} />
        </div>
        <div className="filter-field" style={{ flex: "0 1 150px" }}>
          <label>Hasta</label>
          <input type="date" value={fechaHasta} onChange={(e) => applyFilter(setFechaHasta)(e.target.value)} />
        </div>
        {hayFiltros && (
          <button className="filters-bar-clear" onClick={limpiarFiltros}>
            <FaTimes /> Limpiar
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="card">
        {loading ? (
          <p style={{ color: "#9ca3af", textAlign: "center", padding: 24 }}>Cargando...</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center", padding: 24 }}>No tienes notificaciones.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((n) => (
              <div key={n.usuarioNotificacionId} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 14px", borderRadius: 8,
                background: n.leido ? "#fff" : "#eff6ff",
                border: `1px solid ${n.leido ? "#e5e7eb" : "#bfdbfe"}`,
              }}>
                <div style={{ fontSize: 18, marginTop: 2 }}>
                  <IconoNotificacion tipo={n.notificacion?.tipo} evento={n.notificacion?.evento} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
                    {n.notificacion?.titulo}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4b5563" }}>
                    {n.notificacion?.mensaje}
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9ca3af" }}>
                    {n.notificacion?.fechaCreacion && new Date(n.notificacion.fechaCreacion).toLocaleString("es-BO")}
                    {n.notificacion?.tipo === "MANUAL" && n.notificacion?.emisor && (
                      <> · Enviado por {n.notificacion.emisor.name} {n.notificacion.emisor.lastName}</>
                    )}
                  </p>
                </div>
                {!n.leido && (
                  <button className="btn-secondary" onClick={() => handleMarcarLeida(n.usuarioNotificacionId)}
                    style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <FaCheck /> Marcar leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onOffsetChange={(newOffset) => setOffset(newOffset)}
          onLimitChange={(newLimit) => { setLimit(newLimit); setOffset(0); }}
        />
      </div>

      {/* Modal: nueva notificación manual */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>Nueva Notificación</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleEnviar}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label>Título *</label>
                  <input name="titulo" value={form.titulo} onChange={handleFormChange} placeholder="Mantenimiento programado" />
                </div>
                <div>
                  <label>Mensaje *</label>
                  <textarea name="mensaje" rows={3} value={form.mensaje} onChange={handleFormChange}
                    placeholder="Describe el contenido de la notificación..." />
                </div>
                <div>
                  <label>Destinatarios</label>
                  <select name="destino" value={form.destino} onChange={handleFormChange}>
                    <option value="todos">Todos los usuarios</option>
                    <option value="usuarios">Usuarios específicos</option>
                    <option value="roles">Por rol</option>
                  </select>
                </div>
                {form.destino === "usuarios" && (
                  <div>
                    <label>Usuarios (Ctrl+clic para múltiples)</label>
                    <select multiple value={form.usuarioIds} onChange={handleMultiChange("usuarioIds")} style={{ height: 110 }}>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>{u.name} {u.lastName} — {u.email}</option>
                      ))}
                    </select>
                  </div>
                )}
                {form.destino === "roles" && (
                  <div>
                    <label>Roles (Ctrl+clic para múltiples)</label>
                    <select multiple value={form.roles} onChange={handleMultiChange("roles")} style={{ height: 80 }}>
                      {ROLES_DESTINO.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                )}
                {formErr && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{formErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Notificaciones;

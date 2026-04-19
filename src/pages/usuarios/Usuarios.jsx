import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getUsersAction } from "./actions/get-users.action";
import { createUserAction } from "./actions/create-user.action";
import { FaUserCog, FaPlus, FaSearch, FaUserCircle, FaEye } from "react-icons/fa";

const ROLES = [
  { value: "",           label: "Todos los roles" },
  { value: "admin",      label: "Administrador" },
  { value: "super-user", label: "Super Usuario" },
  { value: "user",       label: "Usuario" },
];

const ESTADOS = [
  { value: "",      label: "Todos" },
  { value: "true",  label: "Activos" },
  { value: "false", label: "Inactivos" },
];

const FORM_VACIO = { name: "", lastName: "", email: "", password: "", roles: ["user"] };

function RolBadge({ rol }) {
  const esAdmin = rol === "admin" || rol === "super-user";
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
      background: esAdmin ? "#dbeafe" : "#f3f4f6",
      color:      esAdmin ? "#1e40af" : "#374151",
      marginRight: 4,
    }}>
      {rol}
    </span>
  );
}

function AvatarSmall({ photo, name, lastName }) {
  const initiales = `${name?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  return photo ? (
    <img src={photo} alt="avatar"
      style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover",
        border: "2px solid #e5e7eb", flexShrink: 0 }} />
  ) : (
    <div style={{
      width: 34, height: 34, borderRadius: "50%", background: "#1d4ed8",
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: 13, flexShrink: 0,
    }}>
      {initiales || <FaUserCircle style={{ fontSize: 18 }} />}
    </div>
  );
}

function Usuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);

  const [search,   setSearch]   = useState("");
  const [role,     setRole]     = useState("");
  const [isActive, setIsActive] = useState("");
  const [limit,    setLimit]    = useState(10);
  const [offset,   setOffset]   = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(FORM_VACIO);
  const [saving, setSaving]       = useState(false);
  const [formErr, setFormErr]     = useState("");

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { limit, offset, search, role };
      if (isActive !== "") filters.isActive = isActive;
      const res = await getUsersAction(filters);
      if (Array.isArray(res)) {
        setUsuarios(res);
        setTotal(res.length);
      } else {
        setUsuarios(res.data ?? []);
        setTotal(res.total ?? 0);
      }
    } catch {
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, search, role, isActive]);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  // ── Crear usuario ──
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleRolesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((f) => ({ ...f, roles: selected }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.name || !form.lastName || !form.email || !form.password) {
      setFormErr("Completa todos los campos obligatorios.");
      return;
    }
    try {
      setSaving(true);
      await createUserAction(form);
      setShowModal(false);
      setForm(FORM_VACIO);
      fetchUsuarios();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Error al crear el usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaUserCog style={{ marginRight: 8 }} />Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={() => { setForm(FORM_VACIO); setFormErr(""); setShowModal(true); }}>
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
                color: "#9ca3af", fontSize: 13 }} />
              <input
                placeholder="Nombre, apellido o email..."
                value={search}
                onChange={(e) => applyFilter(setSearch, e.target.value)}
                style={{ paddingLeft: 30, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Rol</label>
            <select value={role} onChange={(e) => applyFilter(setRole, e.target.value)} style={{ width: "100%" }}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 140px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Estado</label>
            <select value={isActive} onChange={(e) => applyFilter(setIsActive, e.target.value)} style={{ width: "100%" }}>
              {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Por página</label>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }} style={{ width: "100%" }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af" }}>Cargando...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af" }}>Sin resultados</td></tr>
              ) : usuarios.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AvatarSmall photo={u.profile?.photo} name={u.name} lastName={u.lastName} />
                      <span style={{ fontWeight: 600 }}>{u.name} {u.lastName}</span>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280" }}>{u.email}</td>
                  <td>{u.roles?.map((r) => <RolBadge key={r} rol={r} />)}</td>
                  <td>
                    <span style={{
                      padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                      background: u.isActive ? "#d1fae5" : "#fee2e2",
                      color:      u.isActive ? "#065f46" : "#991b1b",
                    }}>
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-secondary" onClick={() => navigate(`/usuarios/${u.id}`)}
                      style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <FaEye /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onOffsetChange={(newOffset) => setOffset(newOffset)}
          onLimitChange={(newLimit) => { setLimit(newLimit); setOffset(0); }}
        />
      </div>

      {/* Modal Crear Usuario */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Nuevo Usuario</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Nombre *</label>
                  <input name="name" value={form.name} onChange={handleFormChange} placeholder="Juan" />
                </div>
                <div>
                  <label>Apellido *</label>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Pérez" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="juan@empresa.com" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Contraseña *</label>
                  <input name="password" type="password" value={form.password} onChange={handleFormChange}
                    placeholder="Mín. 6 chars, mayúscula, minúscula y número" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Roles (Ctrl+clic para múltiples)</label>
                  <select multiple value={form.roles} onChange={handleRolesChange}
                    style={{ height: 90 }}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="super-user">super-user</option>
                  </select>
                </div>
                {formErr && (
                  <p style={{ gridColumn: "1 / -1", margin: 0, color: "#dc2626", fontSize: 13 }}>{formErr}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Usuarios;

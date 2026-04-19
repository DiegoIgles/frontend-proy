import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getUserAction }        from "./actions/get-user.action";
import { updateUserAction }     from "./actions/update-user.action";
import { changePasswordAction } from "./actions/change-password.action";
import { toggleStatusAction }   from "./actions/toggle-status.action";
import {
  FaArrowLeft, FaUserCircle, FaEdit, FaKey, FaToggleOn, FaToggleOff,
} from "react-icons/fa";

function RolBadge({ rol }) {
  const esAdmin = rol === "admin" || rol === "super-user";
  return (
    <span style={{
      padding: "3px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700,
      background: esAdmin ? "#dbeafe" : "#f3f4f6",
      color:      esAdmin ? "#1e40af" : "#374151",
      marginRight: 4,
    }}>
      {rol}
    </span>
  );
}

function VerUsuario() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal,     setShowEditModal]     = useState(false);
  const [showPassModal,     setShowPassModal]     = useState(false);
  const [togglingStatus,    setTogglingStatus]    = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({ name: "", lastName: "", email: "", roles: [] });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editErr,    setEditErr]    = useState("");

  // Password form
  const [newPassword,  setNewPassword]  = useState("");
  const [savingPass,   setSavingPass]   = useState(false);
  const [passErr,      setPassErr]      = useState("");

  const fetchUsuario = async () => {
    setLoading(true);
    try {
      const data = await getUserAction(id);
      setUsuario(data);
    } catch {
      navigate("/usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuario(); }, [id]); // eslint-disable-line

  const openEdit = () => {
    setEditForm({
      name:     usuario.name,
      lastName: usuario.lastName,
      email:    usuario.email,
      roles:    usuario.roles ?? [],
    });
    setEditErr("");
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleRolesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setEditForm((f) => ({ ...f, roles: selected }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditErr("");
    try {
      setSavingEdit(true);
      await updateUserAction(id, editForm);
      setShowEditModal(false);
      fetchUsuario();
    } catch (err) {
      setEditErr(err.response?.data?.message || "Error al actualizar el usuario");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassErr("");
    if (!newPassword) { setPassErr("Ingresa la nueva contraseña."); return; }
    try {
      setSavingPass(true);
      await changePasswordAction(id, newPassword);
      setShowPassModal(false);
      setNewPassword("");
    } catch (err) {
      setPassErr(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setSavingPass(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!window.confirm(`¿${usuario.isActive ? "Desactivar" : "Activar"} a ${usuario.name}?`)) return;
    try {
      setTogglingStatus(true);
      await toggleStatusAction(id);
      fetchUsuario();
    } catch (err) {
      alert(err.response?.data?.message || "Error al cambiar estado");
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) return <Layout><div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Cargando...</div></Layout>;
  if (!usuario) return null;

  const photoUrl   = usuario.profile?.photo || null;
  const initiales  = `${usuario.name?.[0] ?? ""}${usuario.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <Layout>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-secondary" onClick={() => navigate("/usuarios")}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver
          </button>
          <h1 style={{ margin: 0 }}>Detalle de Usuario</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={openEdit}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FaEdit /> Editar
          </button>
          <button className="btn-secondary" onClick={() => { setNewPassword(""); setPassErr(""); setShowPassModal(true); }}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FaKey /> Contraseña
          </button>
          <button
            onClick={handleToggleStatus}
            disabled={togglingStatus}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "8px 14px", borderRadius: 6, border: "none",
              cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: usuario.isActive ? "#fee2e2" : "#d1fae5",
              color:      usuario.isActive ? "#991b1b" : "#065f46",
            }}
          >
            {usuario.isActive ? <><FaToggleOff /> Desactivar</> : <><FaToggleOn /> Activar</>}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, maxWidth: 820 }}>

        {/* Tarjeta avatar */}
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 14 }}>
            {photoUrl ? (
              <img src={photoUrl} alt="avatar"
                style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover",
                  border: "3px solid #e5e7eb" }} />
            ) : (
              <div style={{
                width: 90, height: 90, borderRadius: "50%", background: "#1d4ed8",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 28, margin: "0 auto",
              }}>
                {initiales || <FaUserCircle style={{ fontSize: 48 }} />}
              </div>
            )}
          </div>

          <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16 }}>
            {usuario.name} {usuario.lastName}
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>{usuario.email}</p>

          <div style={{ marginBottom: 10 }}>
            {usuario.roles?.map((r) => <RolBadge key={r} rol={r} />)}
          </div>

          <span style={{
            display: "inline-block", padding: "3px 14px", borderRadius: 12, fontSize: 12, fontWeight: 700,
            background: usuario.isActive ? "#d1fae5" : "#fee2e2",
            color:      usuario.isActive ? "#065f46" : "#991b1b",
          }}>
            {usuario.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Datos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <div className="card">
            <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Información de la Cuenta</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Nombre</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{usuario.name}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Apellido</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{usuario.lastName}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Correo electrónico</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{usuario.email}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Estado</p>
                <span style={{
                  padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                  background: usuario.isActive ? "#d1fae5" : "#fee2e2",
                  color:      usuario.isActive ? "#065f46" : "#991b1b",
                }}>
                  {usuario.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Roles</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {usuario.roles?.map((r) => <RolBadge key={r} rol={r} />)}
                </div>
              </div>
            </div>
          </div>

          {usuario.profile && (
            <div className="card">
              <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Perfil</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                    letterSpacing: "0.5px", fontWeight: 600 }}>Género</p>
                  <p style={{ margin: 0, fontWeight: 600, textTransform: "capitalize" }}>
                    {usuario.profile.gender || "Sin especificar"}
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                    letterSpacing: "0.5px", fontWeight: 600 }}>Foto</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {usuario.profile.photo ? "Tiene foto" : "Sin foto"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Editar */}
      {showEditModal && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Editar Usuario</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Nombre</label>
                  <input name="name" value={editForm.name} onChange={handleEditChange} />
                </div>
                <div>
                  <label>Apellido</label>
                  <input name="lastName" value={editForm.lastName} onChange={handleEditChange} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Email</label>
                  <input name="email" type="email" value={editForm.email} onChange={handleEditChange} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Roles (Ctrl+clic para múltiples)</label>
                  <select multiple value={editForm.roles} onChange={handleRolesChange} style={{ height: 90 }}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="super-user">super-user</option>
                  </select>
                </div>
                {editErr && (
                  <p style={{ gridColumn: "1 / -1", margin: 0, color: "#dc2626", fontSize: 13 }}>{editErr}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingEdit}>
                  {savingEdit ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cambiar Contraseña */}
      {showPassModal && (
        <div className="modal-backdrop" onClick={() => setShowPassModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Resetear Contraseña</h3>
              <button className="modal-close" onClick={() => setShowPassModal(false)}>×</button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="modal-body">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mín. 6 chars, mayúscula, minúscula y número"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6b7280" }}>
                  Debe contener al menos una mayúscula, una minúscula y un número.
                </p>
                {passErr && (
                  <p style={{ margin: "8px 0 0", color: "#dc2626", fontSize: 13 }}>{passErr}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPassModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingPass}>
                  {savingPass ? "Cambiando..." : "Cambiar contraseña"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default VerUsuario;

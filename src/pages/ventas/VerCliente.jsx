import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getClienteAction }  from "./actions/get-cliente.action";
import { updateClienteAction } from "./actions/update-cliente.action";
import { deleteClienteAction } from "./actions/delete-cliente.action";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash, FaEye, FaArrowLeft } from "react-icons/fa";

function VerCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente,  setCliente]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [form,     setForm]     = useState({});
  const [saving,   setSaving]   = useState(false);
  const [formErr,  setFormErr]  = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadCliente = async () => {
    setLoading(true);
    try {
      const data = await getClienteAction(id);
      setCliente(data);
    } catch {
      setError("No se pudo cargar el cliente.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadCliente(); }, [id]);

  const openEdit = () => {
    setForm({
      nombre:           cliente.nombre,
      apellidoPaterno:  cliente.apellidoPaterno,
      apellidoMaterno:  cliente.apellidoMaterno || "",
      correo:           cliente.correo,
      telefono:         cliente.telefono || "",
      direccion:        cliente.direccion || "",
    });
    setFormErr("");
    setShowEdit(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.nombre.trim() || !form.apellidoPaterno.trim() || !form.correo.trim()) {
      setFormErr("Nombre, apellido paterno y correo son requeridos.");
      return;
    }
    setSaving(true);
    try {
      const dto = { nombre: form.nombre, apellidoPaterno: form.apellidoPaterno, correo: form.correo };
      if (form.apellidoMaterno.trim()) dto.apellidoMaterno = form.apellidoMaterno.trim();
      if (form.telefono.trim())        dto.telefono        = form.telefono.trim();
      if (form.direccion.trim())       dto.direccion       = form.direccion.trim();
      await updateClienteAction(id, dto);
      setShowEdit(false);
      loadCliente();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este cliente? Solo es posible si no tiene ventas.")) return;
    setDeleting(true);
    try {
      await deleteClienteAction(id);
      navigate("/ventas/clientes");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
      setDeleting(false);
    }
  };

  const fullName = (c) => [c.nombre, c.apellidoPaterno, c.apellidoMaterno].filter(Boolean).join(" ");

  if (loading) return <Layout><div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Cargando...</div></Layout>;
  if (error)   return <Layout><div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>{error}</div></Layout>;
  if (!cliente) return null;

  const notas = cliente.notasVenta ?? [];

  return (
    <Layout>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/ventas/clientes")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18, padding: 0 }}>
            <FaArrowLeft />
          </button>
          <h1 style={{ margin: 0 }}>{fullName(cliente)}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={openEdit} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaEdit /> Editar
          </button>
          <button className="btn-danger" onClick={handleDelete} disabled={deleting}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaTrash /> {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start" }}>
        {/* Tarjeta de contacto */}
        <div className="card">
          <div style={{ textAlign: "center", padding: "20px 0 12px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dbeafe",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <FaUser style={{ color: "#2563eb", fontSize: 28 }} />
            </div>
            <h3 style={{ margin: 0, fontSize: 17 }}>{fullName(cliente)}</h3>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "0 0 14px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 4px 8px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <FaEnvelope style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Correo</div>
                <a href={`mailto:${cliente.correo}`} style={{ color: "#2563eb", wordBreak: "break-all" }}>{cliente.correo}</a>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <FaPhone style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Teléfono</div>
                <span>{cliente.telefono || "—"}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <FaMapMarkerAlt style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Dirección</div>
                <span>{cliente.direccion || "—"}</span>
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "8px 0 14px" }} />
          <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: 8 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb" }}>{notas.length}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Notas de venta</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#059669" }}>
                Bs. {notas.reduce((acc, n) => acc + Number(n.montoTotal ?? 0), 0).toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Total comprado</div>
            </div>
          </div>
        </div>

        {/* Historial de ventas */}
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Historial de Ventas</h3>
          {notas.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>Sin ventas registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Glosa</th>
                    <th>Monto Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((n) => (
                    <tr key={n.notaVentaId}>
                      <td style={{ whiteSpace: "nowrap" }}>{n.fecha}</td>
                      <td>{n.glosa || "—"}</td>
                      <td><strong>Bs. {Number(n.montoTotal).toFixed(2)}</strong></td>
                      <td>
                        <Link to={`/ventas/notas/${n.notaVentaId}`} className="btn-secondary" title="Ver nota">
                          <FaEye />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: 600, color: "#374151" }}>Total:</td>
                    <td colSpan={2} style={{ fontWeight: 700, color: "#059669" }}>
                      Bs. {notas.reduce((acc, n) => acc + Number(n.montoTotal ?? 0), 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Editar */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal" style={{ width: "100%", maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16 }}>Editar Cliente</h3>
              <button onClick={() => setShowEdit(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formErr && (
                  <div style={{ background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: 6, fontSize: 13 }}>{formErr}</div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Nombre *</label>
                    <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Apellido Paterno *</label>
                    <input value={form.apellidoPaterno} onChange={(e) => setForm({ ...form, apellidoPaterno: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Apellido Materno</label>
                  <input value={form.apellidoMaterno} onChange={(e) => setForm({ ...form, apellidoMaterno: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Correo *</label>
                  <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Teléfono</label>
                  <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Dirección</label>
                  <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowEdit(false)}
                  style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default VerCliente;

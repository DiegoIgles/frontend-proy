import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { getLeadAction } from "./actions/get-lead.action";
import { updateLeadAction } from "./actions/update-lead.action";
import { deleteLeadAction } from "./actions/delete-lead.action";
import { TIPOS_SERVICIO, TIPOS_SUMINISTRO, TIPOS_CUBIERTA, formatTipoServicio } from "./leads.constants";
import {
  FaUserPlus, FaPhone, FaMapMarkerAlt, FaCommentDots, FaEdit, FaTrash, FaArrowLeft,
  FaBolt, FaBuilding, FaFileInvoiceDollar, FaHome, FaMapMarkedAlt, FaImage,
} from "react-icons/fa";

const fieldLabel = { fontSize: 11, color: "#9ca3af", display: "block", marginBottom: 4 };
const fieldInput = { width: "100%", boxSizing: "border-box" };

function VerLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [lead,    setLead]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [form,     setForm]     = useState({});
  const [saving,   setSaving]   = useState(false);
  const [formErr,  setFormErr]  = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadLead = async () => {
    setLoading(true);
    try {
      const data = await getLeadAction(id);
      setLead(data);
    } catch {
      setError("No se pudo cargar el lead.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadLead(); }, [id]);

  const openEdit = () => {
    setForm({
      nombre:         lead.nombre,
      telefono:       lead.telefono || "",
      direccion:      lead.direccion || "",
      comentario:     lead.comentario || "",
      tipoServicio:   lead.tipoServicio || "",
      tipoSuministro: lead.tipoSuministro || "",
      facturaMensual: lead.facturaMensual ?? "",
      tipoCubierta:   lead.tipoCubierta || "",
      ubicacion:      lead.ubicacion || "",
      facturaImagenUrl: lead.facturaImagenUrl || "",
    });
    setFormErr("");
    setShowEdit(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.nombre.trim()) {
      setFormErr("El nombre es requerido.");
      return;
    }
    setSaving(true);
    try {
      const dto = { nombre: form.nombre };
      if (form.telefono.trim())        dto.telefono        = form.telefono.trim();
      if (form.direccion.trim())       dto.direccion       = form.direccion.trim();
      if (form.comentario.trim())      dto.comentario      = form.comentario.trim();
      if (form.tipoServicio)           dto.tipoServicio    = form.tipoServicio;
      if (form.tipoSuministro)         dto.tipoSuministro  = form.tipoSuministro;
      if (form.facturaMensual !== "" && form.facturaMensual !== null)
        dto.facturaMensual = Number(form.facturaMensual);
      if (form.tipoCubierta)           dto.tipoCubierta    = form.tipoCubierta;
      if (form.ubicacion.trim())       dto.ubicacion       = form.ubicacion.trim();
      if (form.facturaImagenUrl.trim()) dto.facturaImagenUrl = form.facturaImagenUrl.trim();
      await updateLeadAction(id, dto);
      setShowEdit(false);
      loadLead();
      toast.success("Lead actualizado correctamente.");
    } catch (err) {
      const message = err.response?.data?.message || "Error al guardar";
      setFormErr(message);
      toast.error(message);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Eliminar lead",
      message: "¿Eliminar este lead?",
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteLeadAction(id);
      toast.success("Lead eliminado correctamente.");
      navigate("/leads");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar");
      setDeleting(false);
    }
  };

  if (loading) return <Layout><div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Cargando...</div></Layout>;
  if (error)   return <Layout><div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>{error}</div></Layout>;
  if (!lead) return null;

  return (
    <Layout>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/leads")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18, padding: 0 }}>
            <FaArrowLeft />
          </button>
          <h1 style={{ margin: 0 }}>{lead.nombre}</h1>
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

      <div className="card" style={{ maxWidth: 480 }}>
        <div style={{ textAlign: "center", padding: "20px 0 12px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dbeafe",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <FaUserPlus style={{ color: "#2563eb", fontSize: 28 }} />
          </div>
          <h3 style={{ margin: 0, fontSize: 17 }}>{lead.nombre}</h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>
            Registrado el {new Date(lead.fecha).toLocaleString("es-BO")}
          </p>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "0 0 14px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 4px 8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaPhone style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Teléfono</div>
              <span>{lead.telefono || "—"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaMapMarkerAlt style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Dirección</div>
              <span>{lead.direccion || "—"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaCommentDots style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Comentario</div>
              <span>{lead.comentario || "—"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaBolt style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Tipo de servicio</div>
              <span>{formatTipoServicio(lead.tipoServicio)}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaBuilding style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Tipo de suministro</div>
              <span>{lead.tipoSuministro || "—"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaFileInvoiceDollar style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Factura mensual</div>
              <span>{lead.facturaMensual != null ? `Bs. ${Number(lead.facturaMensual).toFixed(2)}` : "—"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaHome style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Tipo de cubierta</div>
              <span>{lead.tipoCubierta || "—"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaMapMarkedAlt style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Ubicación</div>
              {lead.ubicacion ? (
                /^https?:\/\//i.test(lead.ubicacion)
                  ? <a href={lead.ubicacion} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Ver en el mapa</a>
                  : <span>{lead.ubicacion}</span>
              ) : <span>—</span>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <FaImage style={{ color: "#6b7280", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Foto de factura</div>
              {lead.facturaImagenUrl ? (
                <a href={lead.facturaImagenUrl} target="_blank" rel="noreferrer">
                  <img src={lead.facturaImagenUrl} alt="Factura"
                    style={{ maxWidth: 160, maxHeight: 120, borderRadius: 6, display: "block", marginTop: 4, border: "1px solid #e5e7eb" }} />
                </a>
              ) : <span>—</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal" style={{ width: "100%", maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16 }}>Editar Lead</h3>
              <button onClick={() => setShowEdit(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formErr && (
                  <div style={{ background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: 6, fontSize: 13 }}>{formErr}</div>
                )}
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Nombre *</label>
                  <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Comentario</label>
                  <textarea rows={3} value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={fieldLabel}>Tipo de servicio</label>
                  <select value={form.tipoServicio} onChange={(e) => setForm({ ...form, tipoServicio: e.target.value })} style={fieldInput}>
                    <option value="">Sin especificar</option>
                    {form.tipoServicio && !TIPOS_SERVICIO.some((t) => t.value === form.tipoServicio) && (
                      <option value={form.tipoServicio}>{formatTipoServicio(form.tipoServicio)}</option>
                    )}
                    {TIPOS_SERVICIO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Tipo de suministro</label>
                  <select value={form.tipoSuministro} onChange={(e) => setForm({ ...form, tipoSuministro: e.target.value })} style={fieldInput}>
                    <option value="">Sin especificar</option>
                    {form.tipoSuministro && !TIPOS_SUMINISTRO.includes(form.tipoSuministro) && (
                      <option value={form.tipoSuministro}>{form.tipoSuministro}</option>
                    )}
                    {TIPOS_SUMINISTRO.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Factura mensual (Bs)</label>
                  <input type="number" step="0.01" min="0" value={form.facturaMensual}
                    onChange={(e) => setForm({ ...form, facturaMensual: e.target.value })} style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>Tipo de cubierta</label>
                  <select value={form.tipoCubierta} onChange={(e) => setForm({ ...form, tipoCubierta: e.target.value })} style={fieldInput}>
                    <option value="">Sin especificar</option>
                    {form.tipoCubierta && !TIPOS_CUBIERTA.includes(form.tipoCubierta) && (
                      <option value={form.tipoCubierta}>{form.tipoCubierta}</option>
                    )}
                    {TIPOS_CUBIERTA.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Ubicación (link de Google Maps)</label>
                  <input value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} style={fieldInput} />
                </div>
                <div>
                  <label style={fieldLabel}>URL foto de factura</label>
                  <input value={form.facturaImagenUrl} onChange={(e) => setForm({ ...form, facturaImagenUrl: e.target.value })} style={fieldInput} />
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

export default VerLead;

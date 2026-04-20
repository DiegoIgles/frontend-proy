import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getProveedorAction }    from "./actions/get-proveedor.action";
import { updateProveedorAction } from "./actions/update-proveedor.action";
import { deleteProveedorAction } from "./actions/delete-proveedor.action";
import {
  FaArrowLeft, FaEdit, FaTrash, FaTruck, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaUser, FaShoppingCart,
} from "react-icons/fa";

function Campo({ label, value, icon }) {
  return (
    <div>
      <p style={{ margin: "0 0 3px", fontSize: 11, color: "#6b7280",
        textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 5 }}>
        {icon && <span style={{ color: "#9ca3af", fontSize: 12 }}>{icon}</span>}
        {value || <span style={{ color: "#9ca3af", fontWeight: 400 }}>—</span>}
      </p>
    </div>
  );
}

const FORM_VACIO = { nombre: "", contacto: "", email: "", telefono: "", direccion: "", ciudad: "", pais: "" };

function VerProveedor() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [proveedor, setProveedor] = useState(null);
  const [loading,   setLoading]   = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(FORM_VACIO);
  const [saving,   setSaving]   = useState(false);
  const [editErr,  setEditErr]  = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchProveedor = async () => {
    setLoading(true);
    try {
      const data = await getProveedorAction(id);
      setProveedor(data);
    } catch {
      navigate("/compras/proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProveedor(); }, [id]); // eslint-disable-line

  const openEdit = () => {
    setEditForm({
      nombre:    proveedor.nombre    ?? "",
      contacto:  proveedor.contacto  ?? "",
      email:     proveedor.email     ?? "",
      telefono:  proveedor.telefono  ?? "",
      direccion: proveedor.direccion ?? "",
      ciudad:    proveedor.ciudad    ?? "",
      pais:      proveedor.pais      ?? "",
    });
    setEditErr("");
    setShowEdit(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditErr("");
    if (!editForm.nombre.trim()) { setEditErr("El nombre es obligatorio."); return; }
    try {
      setSaving(true);
      const dto = { ...editForm };
      Object.keys(dto).forEach((k) => { if (!dto[k]) delete dto[k]; });
      await updateProveedorAction(id, dto);
      setShowEdit(false);
      fetchProveedor();
    } catch (err) {
      setEditErr(err.response?.data?.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar a "${proveedor.nombre}"? Solo es posible si no tiene compras.`)) return;
    try {
      setDeleting(true);
      await deleteProveedorAction(id);
      navigate("/compras/proveedores");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
      setDeleting(false);
    }
  };

  if (loading) return <Layout><div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Cargando...</div></Layout>;
  if (!proveedor) return null;

  const compras = proveedor.notasCompra ?? [];
  const totalCompras = compras.reduce((s, c) => s + Number(c.montoTotal ?? 0), 0);

  return (
    <Layout>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-secondary" onClick={() => navigate("/compras/proveedores")}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>{proveedor.nombre}</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Proveedor</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={openEdit}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FaEdit /> Editar
          </button>
          <button onClick={handleDelete} disabled={deleting}
            style={{ display: "flex", alignItems: "center", gap: 5,
              padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13, background: "#fee2e2", color: "#991b1b" }}>
            <FaTrash /> {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280",
            textTransform: "uppercase", fontWeight: 600 }}>Notas de Compra</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1d4ed8" }}>{compras.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280",
            textTransform: "uppercase", fontWeight: 600 }}>Total Comprado</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#059669" }}>
            ${totalCompras.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280",
            textTransform: "uppercase", fontWeight: 600 }}>País</p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#374151" }}>
            {proveedor.pais ?? "—"}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>

        {/* Datos de contacto */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "#dbeafe",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FaTruck style={{ color: "#1d4ed8", fontSize: 22 }} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{proveedor.nombre}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Proveedor</p>
            </div>
          </div>

          <Campo label="Contacto"   value={proveedor.contacto}  icon={<FaUser />} />
          <Campo label="Email"      value={proveedor.email}     icon={<FaEnvelope />} />
          <Campo label="Teléfono"   value={proveedor.telefono}  icon={<FaPhone />} />
          <Campo label="Dirección"  value={proveedor.direccion} icon={<FaMapMarkerAlt />} />
          <Campo label="Ciudad"     value={proveedor.ciudad} />
          <Campo label="País"       value={proveedor.pais} />
        </div>

        {/* Historial de compras */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <FaShoppingCart style={{ color: "#6b7280" }} />
            <h3 style={{ margin: 0, fontSize: 15 }}>Historial de Compras</h3>
          </div>

          {compras.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>
              Sin compras registradas.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Glosa</th>
                  <th style={{ textAlign: "right" }}>Monto Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr key={c.notaCompraId}>
                    <td style={{ whiteSpace: "nowrap" }}>{c.fecha}</td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>{c.glosa ?? "—"}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      ${Number(c.montoTotal).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <button className="btn-secondary"
                        onClick={() => navigate(`/compras/notas/${c.notaCompraId}`)}
                        style={{ fontSize: 12, padding: "4px 10px" }}>
                        Ver nota
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f8fafc" }}>
                  <td colSpan={2} style={{ fontWeight: 700, padding: "10px 12px" }}>TOTAL</td>
                  <td style={{ textAlign: "right", fontWeight: 800, fontSize: 15 }}>
                    ${totalCompras.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* Modal Editar */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3>Editar Proveedor</h3>
              <button className="modal-close" onClick={() => setShowEdit(false)}>×</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Nombre *</label>
                  <input name="nombre" value={editForm.nombre}
                    onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div>
                  <label>Contacto</label>
                  <input name="contacto" value={editForm.contacto}
                    onChange={(e) => setEditForm((f) => ({ ...f, contacto: e.target.value }))} />
                </div>
                <div>
                  <label>Email</label>
                  <input name="email" type="email" value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label>Teléfono</label>
                  <input name="telefono" value={editForm.telefono}
                    onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))} />
                </div>
                <div>
                  <label>Ciudad</label>
                  <input name="ciudad" value={editForm.ciudad}
                    onChange={(e) => setEditForm((f) => ({ ...f, ciudad: e.target.value }))} />
                </div>
                <div>
                  <label>País</label>
                  <input name="pais" value={editForm.pais}
                    onChange={(e) => setEditForm((f) => ({ ...f, pais: e.target.value }))} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Dirección</label>
                  <input name="direccion" value={editForm.direccion}
                    onChange={(e) => setEditForm((f) => ({ ...f, direccion: e.target.value }))} />
                </div>
                {editErr && (
                  <p style={{ gridColumn: "1 / -1", margin: 0, color: "#dc2626", fontSize: 13 }}>{editErr}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default VerProveedor;

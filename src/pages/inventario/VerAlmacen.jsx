import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getAlmacenAction }    from "./actions/get-almacen.action";
import { updateAlmacenAction } from "./actions/update-almacen.action";
import { deleteAlmacenAction } from "./actions/delete-almacen.action";
import { FaArrowLeft, FaEdit, FaTrash, FaWarehouse, FaBoxOpen } from "react-icons/fa";

function StockBadge({ stock }) {
  const s = stock === 0 ? { bg: "#fee2e2", c: "#991b1b" }
          : stock <= 10 ? { bg: "#fef9c3", c: "#92400e" }
          :               { bg: "#d1fae5", c: "#065f46" };
  return (
    <span style={{ padding: "2px 12px", borderRadius: 10, fontSize: 12,
      fontWeight: 700, background: s.bg, color: s.c }}>
      {stock}
    </span>
  );
}

function VerAlmacen() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [almacen,  setAlmacen]  = useState(null);
  const [loading,  setLoading]  = useState(true);

  const [showEdit, setShowEdit]   = useState(false);
  const [nombre,   setNombre]     = useState("");
  const [saving,   setSaving]     = useState(false);
  const [editErr,  setEditErr]    = useState("");
  const [deleting, setDeleting]   = useState(false);

  const [search, setSearch] = useState("");

  const fetchAlmacen = async () => {
    setLoading(true);
    try {
      const data = await getAlmacenAction(id);
      setAlmacen(data);
    } catch {
      navigate("/inventario/almacenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlmacen(); }, [id]); // eslint-disable-line

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditErr("");
    if (!nombre.trim()) { setEditErr("El nombre es obligatorio."); return; }
    try {
      setSaving(true);
      await updateAlmacenAction(id, { nombre: nombre.trim() });
      setShowEdit(false);
      fetchAlmacen();
    } catch (err) {
      setEditErr(err.response?.data?.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar "${almacen.nombre}"? Solo es posible si no tiene stock.`)) return;
    try {
      setDeleting(true);
      await deleteAlmacenAction(id);
      navigate("/inventario/almacenes");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
      setDeleting(false);
    }
  };

  if (loading) return <Layout><div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Cargando...</div></Layout>;
  if (!almacen) return null;

  const items = almacen.productoAlmacenes ?? [];
  const stockTotal = items.reduce((s, pa) => s + (pa.stock ?? 0), 0);
  const filtrados  = search
    ? items.filter((pa) =>
        pa.producto?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        pa.producto?.codigo?.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <Layout>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-secondary" onClick={() => navigate("/inventario/almacenes")}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>{almacen.nombre}</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>
              {almacen.almacenId}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary"
            onClick={() => { setNombre(almacen.nombre); setEditErr(""); setShowEdit(true); }}
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
            textTransform: "uppercase", fontWeight: 600 }}>Productos</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1d4ed8" }}>{items.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280",
            textTransform: "uppercase", fontWeight: 600 }}>Stock Total</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800,
            color: stockTotal === 0 ? "#dc2626" : "#059669" }}>{stockTotal}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280",
            textTransform: "uppercase", fontWeight: 600 }}>Sin Stock</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#d97706" }}>
            {items.filter((pa) => pa.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Tabla productos */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15 }}>
            <FaBoxOpen style={{ marginRight: 6 }} />Inventario del Almacén
          </h3>
          <input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
        </div>

        {items.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>
            Este almacén no tiene productos asignados.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Marca / Modelo</th>
                  <th style={{ textAlign: "center" }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af" }}>Sin resultados</td></tr>
                ) : filtrados.map((pa) => (
                  <tr key={pa.productoAlmacenId}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12, background: "#f3f4f6",
                        padding: "2px 6px", borderRadius: 4 }}>
                        {pa.producto?.codigo}
                      </span>
                    </td>
                    <td>
                      <p style={{ margin: 0, fontWeight: 600 }}>{pa.producto?.nombre}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{pa.producto?.sku}</p>
                    </td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>
                      {pa.producto?.categoria?.nombre ?? "—"}
                    </td>
                    <td style={{ fontSize: 13, color: "#6b7280" }}>
                      {pa.producto?.marcaModelo
                        ? `${pa.producto.marcaModelo.marca?.nombre} / ${pa.producto.marcaModelo.modelo?.nombre}`
                        : "—"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <StockBadge stock={pa.stock ?? 0} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f8fafc" }}>
                  <td colSpan={4} style={{ fontWeight: 700, padding: "10px 12px" }}>TOTAL</td>
                  <td style={{ textAlign: "center", fontWeight: 800, fontSize: 15 }}>
                    {filtrados.reduce((s, pa) => s + (pa.stock ?? 0), 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Modal Editar */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3>Editar Almacén</h3>
              <button className="modal-close" onClick={() => setShowEdit(false)}>×</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <label>Nombre *</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoFocus
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                {editErr && <p style={{ margin: "8px 0 0", color: "#dc2626", fontSize: 13 }}>{editErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
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

export default VerAlmacen;

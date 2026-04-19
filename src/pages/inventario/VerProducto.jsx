import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getProductoAction }    from "./actions/get-producto.action";
import { updateProductoAction } from "./actions/update-producto.action";
import { deleteProductoAction } from "./actions/delete-producto.action";
import { assignAlmacenAction }  from "./actions/assign-almacen.action";
import { addPrecioAction }      from "./actions/add-precio.action";
import { getAlmacenesAction }   from "./actions/get-almacenes.action";
import { getCategoriasAction }  from "../Categorias/actions/get-categorias.action";
import {
  FaArrowLeft, FaEdit, FaTrash, FaWarehouse, FaDollarSign,
  FaBoxOpen, FaTag, FaChartBar,
} from "react-icons/fa";

const today = () => new Date().toISOString().split("T")[0];

function Campo({ label, value }) {
  return (
    <div>
      <p style={{ margin: "0 0 3px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
        letterSpacing: "0.5px", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{value || <span style={{ color: "#9ca3af" }}>—</span>}</p>
    </div>
  );
}

function VerProducto() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [producto,   setProducto]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("info");
  const [almacenes,  setAlmacenes]  = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Edit modal
  const [showEdit, setShowEdit]   = useState(false);
  const [editForm, setEditForm]   = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editErr,    setEditErr]    = useState("");

  // Assign almacén modal
  const [showAlmacen,    setShowAlmacen]    = useState(false);
  const [almacenForm,    setAlmacenForm]    = useState({ almacenId: "", stockInicial: 0 });
  const [savingAlmacen,  setSavingAlmacen]  = useState(false);
  const [almacenErr,     setAlmacenErr]     = useState("");

  // Precio modal
  const [showPrecio,   setShowPrecio]   = useState(false);
  const [precioForm,   setPrecioForm]   = useState({ precio: "", fecha: today() });
  const [savingPrecio, setSavingPrecio] = useState(false);
  const [precioErr,    setPrecioErr]    = useState("");

  // Delete
  const [deleting, setDeleting] = useState(false);

  const fetchProducto = async () => {
    setLoading(true);
    try {
      const data = await getProductoAction(id);
      setProducto(data);
    } catch {
      navigate("/inventario/productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducto();
    getAlmacenesAction().then(setAlmacenes).catch(() => {});
    getCategoriasAction().then(setCategorias).catch(() => {});
  }, [id]); // eslint-disable-line

  // ── Edit ──
  const openEdit = () => {
    setEditForm({
      codigo:             producto.codigo,
      nombre:             producto.nombre,
      sku:                producto.sku,
      descripcion:        producto.descripcion ?? "",
      porcentajeGanancia: producto.porcentajeGanancia ?? "",
      categoriaId:        producto.categoria?.categoriaId ?? "",
    });
    setEditErr("");
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditErr("");
    try {
      setSavingEdit(true);
      const dto = { ...editForm };
      if (!dto.categoriaId) delete dto.categoriaId;
      if (!dto.descripcion) delete dto.descripcion;
      if (dto.porcentajeGanancia === "") delete dto.porcentajeGanancia;
      else dto.porcentajeGanancia = Number(dto.porcentajeGanancia);
      await updateProductoAction(id, dto);
      setShowEdit(false);
      fetchProducto();
    } catch (err) {
      setEditErr(err.response?.data?.message || "Error al actualizar");
    } finally {
      setSavingEdit(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      setDeleting(true);
      await deleteProductoAction(id);
      navigate("/inventario/productos");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
      setDeleting(false);
    }
  };

  // ── Assign almacén ──
  const handleAssignAlmacen = async (e) => {
    e.preventDefault();
    setAlmacenErr("");
    if (!almacenForm.almacenId) { setAlmacenErr("Selecciona un almacén."); return; }
    try {
      setSavingAlmacen(true);
      await assignAlmacenAction(id, {
        almacenId:     almacenForm.almacenId,
        stockInicial:  Number(almacenForm.stockInicial),
      });
      setShowAlmacen(false);
      setAlmacenForm({ almacenId: "", stockInicial: 0 });
      fetchProducto();
    } catch (err) {
      setAlmacenErr(err.response?.data?.message || "Error al asignar almacén");
    } finally {
      setSavingAlmacen(false);
    }
  };

  // ── Precio ──
  const handleAddPrecio = async (e) => {
    e.preventDefault();
    setPrecioErr("");
    if (!precioForm.precio || !precioForm.fecha) { setPrecioErr("Completa todos los campos."); return; }
    try {
      setSavingPrecio(true);
      await addPrecioAction(id, {
        precio: Number(precioForm.precio),
        fecha:  precioForm.fecha,
      });
      setShowPrecio(false);
      setPrecioForm({ precio: "", fecha: today() });
      fetchProducto();
    } catch (err) {
      setPrecioErr(err.response?.data?.message || "Error al registrar precio");
    } finally {
      setSavingPrecio(false);
    }
  };

  if (loading) return <Layout><div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Cargando...</div></Layout>;
  if (!producto) return null;

  const precioActual = producto.precioActual?.precio ?? producto.precioActual;
  const stockTotal   = producto.stockTotal ?? 0;

  const TAB_STYLE = (t) => ({
    padding: "8px 18px", border: "none", cursor: "pointer", fontWeight: 600,
    fontSize: 13, borderBottom: tab === t ? "2px solid #3b82f6" : "2px solid transparent",
    background: "none", color: tab === t ? "#3b82f6" : "#6b7280",
  });

  return (
    <Layout>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-secondary" onClick={() => navigate("/inventario/productos")}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>{producto.nombre}</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>
              {producto.codigo} · {producto.sku}
            </p>
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

      {/* Métricas rápidas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
            fontWeight: 600 }}>Stock Total</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800,
            color: stockTotal === 0 ? "#dc2626" : stockTotal <= 10 ? "#d97706" : "#059669" }}>
            {stockTotal}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
            fontWeight: 600 }}>Precio Actual</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1d4ed8" }}>
            {precioActual != null
              ? `$${Number(precioActual).toLocaleString("es-CO", { minimumFractionDigits: 2 })}`
              : "—"}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
            fontWeight: 600 }}>% Ganancia</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>
            {producto.porcentajeGanancia != null ? `${Number(producto.porcentajeGanancia).toFixed(0)}%` : "—"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", paddingLeft: 4 }}>
          <button style={TAB_STYLE("info")}    onClick={() => setTab("info")}>
            <FaBoxOpen style={{ marginRight: 5 }} />Información
          </button>
          <button style={TAB_STYLE("stock")}   onClick={() => setTab("stock")}>
            <FaWarehouse style={{ marginRight: 5 }} />Stock por Almacén
          </button>
          <button style={TAB_STYLE("precios")} onClick={() => setTab("precios")}>
            <FaDollarSign style={{ marginRight: 5 }} />Historial de Precios
          </button>
        </div>

        {/* Tab: Información */}
        {tab === "info" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <Campo label="Código"   value={producto.codigo} />
              <Campo label="SKU"      value={producto.sku} />
              <Campo label="Nombre"   value={producto.nombre} />
              <Campo label="Categoría"
                value={producto.categoria
                  ? `${producto.categoria.categoriaPadre ? producto.categoria.categoriaPadre.nombre + " › " : ""}${producto.categoria.nombre}`
                  : null} />
              <Campo label="Marca"  value={producto.marcaModelo?.marca?.nombre} />
              <Campo label="Modelo" value={producto.marcaModelo?.modelo?.nombre} />
              <div style={{ gridColumn: "1 / -1" }}>
                <Campo label="Descripción" value={producto.descripcion} />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Stock */}
        {tab === "stock" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button className="btn-primary"
                onClick={() => { setAlmacenForm({ almacenId: "", stockInicial: 0 }); setAlmacenErr(""); setShowAlmacen(true); }}
                style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <FaWarehouse /> Asignar Almacén
              </button>
            </div>
            {producto.productoAlmacenes?.length === 0 ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>Sin almacenes asignados.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Almacén</th>
                    <th style={{ textAlign: "center" }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {producto.productoAlmacenes?.map((pa) => (
                    <tr key={pa.productoAlmacenId}>
                      <td style={{ fontWeight: 600 }}>{pa.almacen?.nombre}</td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          padding: "2px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                          background: pa.stock === 0 ? "#fee2e2" : pa.stock <= 10 ? "#fef9c3" : "#d1fae5",
                          color:      pa.stock === 0 ? "#991b1b" : pa.stock <= 10 ? "#92400e" : "#065f46",
                        }}>
                          {pa.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "#f8fafc" }}>
                    <td style={{ fontWeight: 700 }}>TOTAL</td>
                    <td style={{ textAlign: "center", fontWeight: 800, fontSize: 15 }}>{stockTotal}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab: Precios */}
        {tab === "precios" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button className="btn-primary"
                onClick={() => { setPrecioForm({ precio: "", fecha: today() }); setPrecioErr(""); setShowPrecio(true); }}
                style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <FaDollarSign /> Registrar Precio
              </button>
            </div>
            {!producto.precios?.length ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>Sin historial de precios.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th style={{ textAlign: "right" }}>Precio</th>
                    <th style={{ textAlign: "center" }}>Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {producto.precios.map((pr, i) => (
                    <tr key={pr.precioId}>
                      <td>{pr.fecha}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        ${Number(pr.precio).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {i === 0 && (
                          <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 11,
                            fontWeight: 700, background: "#d1fae5", color: "#065f46" }}>
                            Vigente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal Editar */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>Editar Producto</h3>
              <button className="modal-close" onClick={() => setShowEdit(false)}>×</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Código</label>
                  <input name="codigo" value={editForm.codigo} onChange={handleEditChange} />
                </div>
                <div>
                  <label>SKU</label>
                  <input name="sku" value={editForm.sku} onChange={handleEditChange} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Nombre</label>
                  <input name="nombre" value={editForm.nombre} onChange={handleEditChange} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Descripción</label>
                  <input name="descripcion" value={editForm.descripcion} onChange={handleEditChange} />
                </div>
                <div>
                  <label>% Ganancia</label>
                  <input name="porcentajeGanancia" type="number" min="0" max="100"
                    value={editForm.porcentajeGanancia} onChange={handleEditChange} />
                </div>
                <div>
                  <label>Categoría</label>
                  <select name="categoriaId" value={editForm.categoriaId} onChange={handleEditChange}>
                    <option value="">Sin categoría</option>
                    {categorias.map((c) => (
                      <option key={c.categoriaId} value={c.categoriaId}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                {editErr && (
                  <p style={{ gridColumn: "1 / -1", margin: 0, color: "#dc2626", fontSize: 13 }}>{editErr}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingEdit}>
                  {savingEdit ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Almacén */}
      {showAlmacen && (
        <div className="modal-backdrop" onClick={() => setShowAlmacen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Asignar a Almacén</h3>
              <button className="modal-close" onClick={() => setShowAlmacen(false)}>×</button>
            </div>
            <form onSubmit={handleAssignAlmacen}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label>Almacén *</label>
                  <select value={almacenForm.almacenId}
                    onChange={(e) => setAlmacenForm((f) => ({ ...f, almacenId: e.target.value }))}
                    style={{ width: "100%" }}>
                    <option value="">Selecciona un almacén...</option>
                    {almacenes.map((a) => (
                      <option key={a.almacenId} value={a.almacenId}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Stock Inicial</label>
                  <input type="number" min="0" value={almacenForm.stockInicial}
                    onChange={(e) => setAlmacenForm((f) => ({ ...f, stockInicial: e.target.value }))} />
                </div>
                {almacenErr && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{almacenErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAlmacen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingAlmacen}>
                  {savingAlmacen ? "Asignando..." : "Asignar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Precio */}
      {showPrecio && (
        <div className="modal-backdrop" onClick={() => setShowPrecio(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3>Registrar Precio</h3>
              <button className="modal-close" onClick={() => setShowPrecio(false)}>×</button>
            </div>
            <form onSubmit={handleAddPrecio}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label>Precio *</label>
                  <input type="number" step="0.01" min="0" value={precioForm.precio}
                    onChange={(e) => setPrecioForm((f) => ({ ...f, precio: e.target.value }))}
                    placeholder="0.00" />
                </div>
                <div>
                  <label>Fecha *</label>
                  <input type="date" value={precioForm.fecha}
                    onChange={(e) => setPrecioForm((f) => ({ ...f, fecha: e.target.value }))} />
                </div>
                {precioErr && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{precioErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPrecio(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingPrecio}>
                  {savingPrecio ? "Guardando..." : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default VerProducto;

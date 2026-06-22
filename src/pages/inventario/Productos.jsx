import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getProductosAction }  from "./actions/get-productos.action";
import { createProductoAction } from "./actions/create-producto.action";
import { getCategoriasAction }  from "../Categorias/actions/get-categorias.action";
import { getMarcaModelosAction } from "../marca-modelo/actions/marca-modelos.action";
import {
  FaBoxOpen, FaPlus, FaSearch, FaEye, FaCheckSquare, FaSquare,
} from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

const today = () => new Date().toISOString().split("T")[0];

const FORM_VACIO = {
  codigo: "", nombre: "", sku: "", descripcion: "",
  porcentajeGanancia: "", categoriaId: "", marcaModeloId: "",
};

function StockBadge({ stock }) {
  const color  = stock === 0 ? { bg: "#fee2e2", text: "#991b1b" }
               : stock <= 10 ? { bg: "#fef9c3", text: "#92400e" }
               :               { bg: "#d1fae5", text: "#065f46" };
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700,
      background: color.bg, color: color.text,
    }}>
      {stock}
    </span>
  );
}

function Productos() {
  const navigate = useNavigate();
  const toast = useToast();

  const [productos,  setProductos]  = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [categorias,    setCategorias]    = useState([]);
  const [marcaModelos,  setMarcaModelos]  = useState([]);

  const [search,   setSearch]   = useState("");
  const [catId,    setCatId]    = useState("");
  const [conStock, setConStock] = useState("");
  const [limit,    setLimit]    = useState(10);
  const [offset,   setOffset]   = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState(FORM_VACIO);
  const [saving,    setSaving]    = useState(false);
  const [formErr,   setFormErr]   = useState("");

  useEffect(() => {
    getCategoriasAction().then(setCategorias).catch(() => {});
    getMarcaModelosAction().then((d) => setMarcaModelos(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { limit, offset, search };
      if (catId)    filters.categoriaId = catId;
      if (conStock !== "") filters.conStock = conStock;
      const res = await getProductosAction(filters);
      if (Array.isArray(res)) {
        setProductos(res); setTotal(res.length);
      } else {
        setProductos(res.data ?? []); setTotal(res.total ?? 0);
      }
    } catch {
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, search, catId, conStock]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.codigo || !form.nombre || !form.sku) {
      setFormErr("Código, nombre y SKU son obligatorios.");
      return;
    }
    try {
      setSaving(true);
      const dto = { ...form };
      if (!dto.categoriaId)       delete dto.categoriaId;
      if (!dto.marcaModeloId)     delete dto.marcaModeloId;
      if (!dto.descripcion)       delete dto.descripcion;
      if (dto.porcentajeGanancia === "") delete dto.porcentajeGanancia;
      else dto.porcentajeGanancia = Number(dto.porcentajeGanancia);
      await createProductoAction(dto);
      toast.success("Producto creado correctamente.");
      setShowModal(false);
      setForm(FORM_VACIO);
      fetchProductos();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al crear el producto";
      setFormErr(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaBoxOpen style={{ marginRight: 8 }} />Productos</h1>
        <button className="btn-primary" onClick={() => { setForm(FORM_VACIO); setFormErr(""); setShowModal(true); }}>
          <FaPlus /> Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-bar">

        <div className="filter-field filter-search" style={{ flex: "1 1 220px" }}>
          <label>Buscar</label>
          <FaSearch className="filter-search-icon" />
          <input
            placeholder="Nombre, código o SKU..."
            value={search}
            onChange={(e) => applyFilter(setSearch, e.target.value)}
          />
        </div>

        <div className="filter-field" style={{ flex: "1 1 180px" }}>
          <label>Categoría</label>
          <select value={catId} onChange={(e) => applyFilter(setCatId, e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.categoriaId} value={c.categoriaId}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filter-field" style={{ flex: "1 1 160px" }}>
          <label>Stock</label>
          <select value={conStock} onChange={(e) => applyFilter(setConStock, e.target.value)}>
            <option value="">Todos</option>
            <option value="true">Con stock</option>
            <option value="false">Sin stock</option>
          </select>
        </div>

        <div className="filter-field" style={{ flex: "1 1 120px" }}>
          <label>Por página</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca / Modelo</th>
                <th style={{ textAlign: "center" }}>Stock Total</th>
                <th style={{ textAlign: "right" }}>Precio Actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</td></tr>
              ) : productos.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Sin resultados</td></tr>
              ) : productos.map((p) => (
                <tr key={p.productoId}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: 12, background: "#f3f4f6",
                      padding: "2px 6px", borderRadius: 4 }}>
                      {p.codigo}
                    </span>
                  </td>
                  <td>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{p.nombre}</p>
                    {p.sku && <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{p.sku}</p>}
                  </td>
                  <td style={{ color: "#6b7280", fontSize: 13 }}>{p.categoria?.nombre ?? "—"}</td>
                  <td style={{ fontSize: 13, color: "#6b7280" }}>
                    {p.marcaModelo
                      ? `${p.marcaModelo.marca?.nombre} / ${p.marcaModelo.modelo?.nombre}`
                      : "—"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <StockBadge stock={p.stockTotal ?? 0} />
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>
                    {p.precioActual != null
                      ? `$${Number(p.precioActual).toLocaleString("es-CO", { minimumFractionDigits: 2 })}`
                      : <span style={{ color: "#9ca3af" }}>—</span>}
                  </td>
                  <td>
                    <button className="btn-secondary"
                      onClick={() => navigate(`/inventario/productos/${p.productoId}`)}
                      style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <FaEye /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination total={total} limit={limit} offset={offset}
          onOffsetChange={(newOffset) => setOffset(newOffset)}
          onLimitChange={(newLimit) => { setLimit(newLimit); setOffset(0); }} />
      </div>

      {/* Modal Crear Producto */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>Nuevo Producto</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Código *</label>
                  <input name="codigo" value={form.codigo} onChange={handleFormChange} placeholder="PS-400M" />
                </div>
                <div>
                  <label>SKU *</label>
                  <input name="sku" value={form.sku} onChange={handleFormChange} placeholder="SKU-PS400M" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handleFormChange} placeholder="Panel Solar 400W Monocristalino" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Descripción</label>
                  <input name="descripcion" value={form.descripcion} onChange={handleFormChange} placeholder="Descripción opcional..." />
                </div>
                <div>
                  <label>% Ganancia</label>
                  <input name="porcentajeGanancia" type="number" min="0" max="100"
                    value={form.porcentajeGanancia} onChange={handleFormChange} placeholder="25" />
                </div>
                <div>
                  <label>Categoría</label>
                  <select name="categoriaId" value={form.categoriaId} onChange={handleFormChange}>
                    <option value="">Sin categoría</option>
                    {categorias.map((c) => (
                      <option key={c.categoriaId} value={c.categoriaId}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Marca / Modelo</label>
                  <select name="marcaModeloId" value={form.marcaModeloId} onChange={handleFormChange}>
                    <option value="">Sin marca-modelo</option>
                    {marcaModelos.map((mm) => (
                      <option key={mm.marcaModeloId} value={mm.marcaModeloId}>
                        {mm.marca?.nombre} / {mm.modelo?.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {formErr && (
                  <p style={{ gridColumn: "1 / -1", margin: 0, color: "#dc2626", fontSize: 13 }}>{formErr}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Creando..." : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Productos;

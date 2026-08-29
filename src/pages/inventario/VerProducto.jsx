import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getProductoAction }    from "./actions/get-producto.action";
import { updateProductoAction } from "./actions/update-producto.action";
import { deleteProductoAction } from "./actions/delete-producto.action";
import { assignAlmacenAction }  from "./actions/assign-almacen.action";
import { addPrecioAction }      from "./actions/add-precio.action";
import { getAlmacenesAction }   from "./actions/get-almacenes.action";
import { getCategoriasFlatAction }  from "../Categorias/actions/get-categorias-flat.action";
import { getMarcaModelosAction } from "../marca-modelo/actions/marca-modelos.action";
import { getProductosAction } from "./actions/get-productos.action";
import { addCategoriaProductoAction } from "./actions/add-categoria-producto.action";
import { removeCategoriaProductoAction } from "./actions/remove-categoria-producto.action";
import { addComponenteAction } from "./actions/add-componente.action";
import { removeComponenteAction } from "./actions/remove-componente.action";
import ProductoCategoriasYAtributos from "./components/ProductoCategoriasYAtributos";
import {
  FaArrowLeft, FaEdit, FaTrash, FaWarehouse, FaDollarSign,
  FaBoxOpen, FaTag, FaChartBar, FaCogs, FaPlus, FaTimes as FaX, FaSearch,
} from "react-icons/fa";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";

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
  const toast = useToast();
  const confirm = useConfirm();

  const [producto,   setProducto]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("info");
  const [almacenes,   setAlmacenes]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [marcaModelos,setMarcaModelos]= useState([]);

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

  // Categorías (agregar/quitar)
  const [showAddCategoria, setShowAddCategoria] = useState(false);
  const [nuevaCategoriaId, setNuevaCategoriaId] = useState("");
  const [nuevaCategoriaPrincipal, setNuevaCategoriaPrincipal] = useState(false);
  const [savingCategoria, setSavingCategoria] = useState(false);
  const [categoriaErr, setCategoriaErr] = useState("");

  // Componentes (BOM)
  const [showAddComponente, setShowAddComponente] = useState(false);
  const [componenteBusqueda, setComponenteBusqueda] = useState("");
  const [componenteResultados, setComponenteResultados] = useState([]);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);
  const [componenteCantidad, setComponenteCantidad] = useState(1);
  const [savingComponente, setSavingComponente] = useState(false);
  const [componenteErr, setComponenteErr] = useState("");

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
    getCategoriasFlatAction().then((d) => setCategorias(Array.isArray(d) ? d : [])).catch(() => {});
    getMarcaModelosAction().then((d) => setMarcaModelos(Array.isArray(d) ? d : [])).catch(() => {});
  }, [id]); // eslint-disable-line

  // ── Edit ──
  const openEdit = () => {
    setEditForm({
      codigo:               producto.codigo,
      nombre:               producto.nombre,
      sku:                  producto.sku,
      descripcion:          producto.descripcion ?? "",
      categoriaIds:         (producto.categorias ?? []).map((c) => c.categoriaId),
      categoriaPrincipalId: producto.categoriaPrincipal?.categoriaId ?? "",
      atributos:            producto.atributos ?? {},
      marcaModeloId:        producto.marcaModelo?.marcaModeloId ?? "",
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
    if (!editForm.categoriaIds?.length || !editForm.categoriaPrincipalId) {
      setEditErr("Elegí al menos una categoría y marcá cuál es la principal.");
      return;
    }
    try {
      setSavingEdit(true);
      const dto = {
        codigo: editForm.codigo, nombre: editForm.nombre, sku: editForm.sku,
        categoriaIds: editForm.categoriaIds, categoriaPrincipalId: editForm.categoriaPrincipalId,
        atributos: editForm.atributos || {},
      };
      if (editForm.descripcion)   dto.descripcion = editForm.descripcion;
      if (editForm.marcaModeloId) dto.marcaModeloId = editForm.marcaModeloId;
      await updateProductoAction(id, dto);
      toast.success("Producto actualizado correctamente.");
      setShowEdit(false);
      fetchProducto();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al actualizar";
      setEditErr(msg);
      toast.error(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  // ── Categorías (agregar/quitar directo, sin pasar por Editar) ──
  const abrirAddCategoria = () => {
    setNuevaCategoriaId("");
    setNuevaCategoriaPrincipal(false);
    setCategoriaErr("");
    setShowAddCategoria(true);
  };

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    if (!nuevaCategoriaId) { setCategoriaErr("Elegí una categoría."); return; }
    try {
      setSavingCategoria(true);
      await addCategoriaProductoAction(id, { categoriaId: nuevaCategoriaId, principal: nuevaCategoriaPrincipal });
      toast.success("Categoría agregada correctamente.");
      setShowAddCategoria(false);
      fetchProducto();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al agregar categoría";
      setCategoriaErr(Array.isArray(msg) ? msg[0] : msg);
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSavingCategoria(false);
    }
  };

  const handleRemoveCategoria = async (categoriaId) => {
    if (!window.confirm("¿Quitar esta categoría del producto?")) return;
    try {
      await removeCategoriaProductoAction(id, categoriaId);
      toast.success("Categoría quitada correctamente.");
      fetchProducto();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al quitar categoría");
    }
  };

  // ── Componentes (BOM) ──
  const abrirAddComponente = () => {
    setComponenteBusqueda(""); setComponenteResultados([]);
    setComponenteSeleccionado(null); setComponenteCantidad(1);
    setComponenteErr("");
    setShowAddComponente(true);
  };

  const buscarComponentes = async () => {
    try {
      const res = await getProductosAction({ search: componenteBusqueda, limit: 20 });
      const lista = Array.isArray(res) ? res : (res.data ?? []);
      setComponenteResultados(lista.filter((p) => p.productoId !== id));
    } catch {
      setComponenteResultados([]);
    }
  };

  const handleAddComponente = async (e) => {
    e.preventDefault();
    if (!componenteSeleccionado) { setComponenteErr("Elegí un producto."); return; }
    try {
      setSavingComponente(true);
      await addComponenteAction(id, {
        productoComponenteId: componenteSeleccionado.productoId,
        cantidad: Number(componenteCantidad) || 1,
      });
      toast.success("Componente agregado correctamente.");
      setShowAddComponente(false);
      fetchProducto();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al agregar componente";
      setComponenteErr(Array.isArray(msg) ? msg[0] : msg);
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSavingComponente(false);
    }
  };

  const handleRemoveComponente = async (componenteProductoId) => {
    if (!window.confirm("¿Quitar este componente?")) return;
    try {
      await removeComponenteAction(id, componenteProductoId);
      toast.success("Componente quitado correctamente.");
      fetchProducto();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al quitar componente");
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    const ok = await confirm({
      title: "Eliminar producto",
      message: `¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    try {
      setDeleting(true);
      await deleteProductoAction(id);
      toast.success("Producto eliminado correctamente.");
      navigate("/inventario/productos");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar");
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
      toast.success("Almacén asignado correctamente.");
      setShowAlmacen(false);
      setAlmacenForm({ almacenId: "", stockInicial: 0 });
      fetchProducto();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al asignar almacén";
      setAlmacenErr(msg);
      toast.error(msg);
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
      toast.success("Precio registrado correctamente.");
      setShowPrecio(false);
      setPrecioForm({ precio: "", fecha: today() });
      fetchProducto();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al registrar precio";
      setPrecioErr(msg);
      toast.error(msg);
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
    fontSize: 13, borderBottom: tab === t ? "2px solid #0062B7" : "2px solid transparent",
    background: "none", color: tab === t ? "#0062B7" : "#6b7280",
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
              fontWeight: 600, fontSize: 13, background: "#FBE9E7", color: "#96291D" }}>
            <FaTrash /> {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
            fontWeight: 600 }}>Stock Total</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800,
            color: stockTotal === 0 ? "#C0392B" : stockTotal <= 10 ? "#EE9C02" : "#2C9826" }}>
            {stockTotal}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
            fontWeight: 600 }}>Precio Actual</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0062B7" }}>
            {precioActual != null
              ? `$${Number(precioActual).toLocaleString("es-CO", { minimumFractionDigits: 2 })}`
              : "—"}
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
          <button style={TAB_STYLE("componentes")} onClick={() => setTab("componentes")}>
            <FaCogs style={{ marginRight: 5 }} />Componentes
          </button>
        </div>

        {/* Tab: Información */}
        {tab === "info" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
              <Campo label="Código"   value={producto.codigo} />
              <Campo label="SKU"      value={producto.sku} />
              <Campo label="Nombre"   value={producto.nombre} />
              <Campo label="Marca"  value={producto.marcaModelo?.marca?.nombre} />
              <Campo label="Modelo" value={producto.marcaModelo?.modelo?.nombre} />
              <div style={{ gridColumn: "1 / -1" }}>
                <Campo label="Descripción" value={producto.descripcion} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ margin: "0 0 6px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Categorías</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  {(producto.categorias ?? []).map((c) => {
                    const esPrincipal = producto.categoriaPrincipal?.categoriaId === c.categoriaId;
                    return (
                      <span key={c.categoriaId} style={{
                        display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
                        padding: "4px 10px", borderRadius: 999,
                        background: esPrincipal ? "#E3EEF9" : "#f3f4f6",
                        color: esPrincipal ? "#0062B7" : "#374151",
                        border: esPrincipal ? "1px solid #93c5fd" : "1px solid #e5e7eb",
                      }}>
                        {esPrincipal && <FaTag size={10} />}
                        {c.nombre}
                        {!esPrincipal && (
                          <button type="button" onClick={() => handleRemoveCategoria(c.categoriaId)}
                            title="Quitar categoría"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
                              display: "flex", alignItems: "center", padding: 0 }}>
                            <FaX size={10} />
                          </button>
                        )}
                      </span>
                    );
                  })}
                  <button type="button" onClick={abrirAddCategoria} className="btn-secondary"
                    style={{ fontSize: 11, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                    <FaPlus size={10} /> Categoría
                  </button>
                </div>
              </div>

              {producto.categoriaPrincipal?.esquemaAtributos?.length > 0 && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "#6b7280", textTransform: "uppercase",
                    letterSpacing: "0.5px", fontWeight: 600 }}>Especificaciones técnicas</p>
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        {producto.categoriaPrincipal.esquemaAtributos.map((campo) => (
                          <tr key={campo.key}>
                            <td style={{ fontWeight: 600, width: "50%" }}>{campo.label}</td>
                            <td>
                              {producto.atributos?.[campo.key] != null && producto.atributos?.[campo.key] !== ""
                                ? `${producto.atributos[campo.key]}${campo.unidad ? ` ${campo.unidad}` : ""}`
                                : <span style={{ color: "#9ca3af" }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
              <div className="table-responsive">
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
                            background: pa.stock === 0 ? "#FBE9E7" : pa.stock <= 10 ? "#fef9c3" : "#E6F3E5",
                            color:      pa.stock === 0 ? "#96291D" : pa.stock <= 10 ? "#8A5A02" : "#056125",
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
              </div>
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
              <div className="table-responsive">
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
                              fontWeight: 700, background: "#E6F3E5", color: "#056125" }}>
                              Vigente
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Componentes (BOM) */}
        {tab === "componentes" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button className="btn-primary" onClick={abrirAddComponente}
                style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <FaCogs /> Agregar Componente
              </button>
            </div>
            {!producto.componentes?.length ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>Este producto no tiene componentes.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th style={{ textAlign: "center" }}>Cantidad</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {producto.componentes.map((c) => (
                      <tr key={c.productoComponenteRegistroId}>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{c.producto?.codigo}</td>
                        <td style={{ fontWeight: 600 }}>{c.producto?.nombre}</td>
                        <td style={{ textAlign: "center" }}>{c.cantidad}</td>
                        <td style={{ textAlign: "right" }}>
                          <button type="button" onClick={() => handleRemoveComponente(c.producto?.productoId)}
                            title="Quitar componente"
                            style={{ background: "none", border: "none", color: "#C0392B", cursor: "pointer" }}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Editar */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3>Editar Producto</h3>
              <button className="modal-close" onClick={() => setShowEdit(false)}>×</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
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
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Marca / Modelo</label>
                  <select name="marcaModeloId" value={editForm.marcaModeloId} onChange={handleEditChange}>
                    <option value="">Sin marca-modelo</option>
                    {marcaModelos.map((mm) => (
                      <option key={mm.marcaModeloId} value={mm.marcaModeloId}>
                        {mm.marca?.nombre} / {mm.modelo?.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <ProductoCategoriasYAtributos
                  categoriasDisponibles={categorias}
                  categoriaIds={editForm.categoriaIds || []}
                  categoriaPrincipalId={editForm.categoriaPrincipalId || ""}
                  atributos={editForm.atributos || {}}
                  onChangeCategoriaIds={(ids) => setEditForm((f) => ({ ...f, categoriaIds: ids }))}
                  onChangeCategoriaPrincipalId={(cid) => setEditForm((f) => ({ ...f, categoriaPrincipalId: cid }))}
                  onChangeAtributos={(at) => setEditForm((f) => ({ ...f, atributos: at }))}
                />
                {editErr && (
                  <p style={{ gridColumn: "1 / -1", margin: 0, color: "#C0392B", fontSize: 13 }}>{editErr}</p>
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

      {/* Modal Agregar Categoría */}
      {showAddCategoria && (
        <div className="modal-backdrop" onClick={() => setShowAddCategoria(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3>Agregar Categoría</h3>
              <button className="modal-close" onClick={() => setShowAddCategoria(false)}>×</button>
            </div>
            <form onSubmit={handleAddCategoria}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label>Categoría *</label>
                  <select value={nuevaCategoriaId} onChange={(e) => setNuevaCategoriaId(e.target.value)} style={{ width: "100%" }}>
                    <option value="">Selecciona una categoría...</option>
                    {categorias
                      .filter((c) => !(producto.categorias ?? []).some((pc) => pc.categoriaId === c.categoriaId))
                      .map((c) => (
                        <option key={c.categoriaId} value={c.categoriaId}>{c.nombre}</option>
                      ))}
                  </select>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <input type="checkbox" checked={nuevaCategoriaPrincipal}
                    onChange={(e) => setNuevaCategoriaPrincipal(e.target.checked)} />
                  Marcar como categoría principal
                </label>
                {categoriaErr && <p style={{ margin: 0, color: "#C0392B", fontSize: 13 }}>{categoriaErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddCategoria(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingCategoria}>
                  {savingCategoria ? "Agregando..." : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Componente */}
      {showAddComponente && (
        <div className="modal-backdrop" onClick={() => setShowAddComponente(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <h3>Agregar Componente</h3>
              <button className="modal-close" onClick={() => setShowAddComponente(false)}>×</button>
            </div>
            <form onSubmit={handleAddComponente}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label>Buscar producto</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      value={componenteBusqueda}
                      onChange={(e) => setComponenteBusqueda(e.target.value)}
                      placeholder="Nombre, código o SKU..."
                      style={{ flex: 1 }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); buscarComponentes(); } }}
                    />
                    <button type="button" className="btn-secondary" onClick={buscarComponentes}>
                      <FaSearch />
                    </button>
                  </div>
                </div>
                {componenteResultados.length > 0 && (
                  <div style={{ maxHeight: 180, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: 6 }}>
                    {componenteResultados.map((p) => (
                      <div key={p.productoId}
                        onClick={() => setComponenteSeleccionado(p)}
                        style={{
                          padding: "8px 10px", cursor: "pointer", fontSize: 13,
                          background: componenteSeleccionado?.productoId === p.productoId ? "#eff6ff" : "#fff",
                          borderBottom: "1px solid #f3f4f6",
                        }}>
                        <strong>{p.nombre}</strong>
                        <span style={{ color: "#9ca3af", marginLeft: 6, fontSize: 11 }}>{p.codigo}</span>
                      </div>
                    ))}
                  </div>
                )}
                {componenteSeleccionado && (
                  <div style={{ fontSize: 12, color: "#2C9826" }}>
                    Seleccionado: <strong>{componenteSeleccionado.nombre}</strong>
                  </div>
                )}
                <div>
                  <label>Cantidad</label>
                  <input type="number" min="0.01" step="0.01" value={componenteCantidad}
                    onChange={(e) => setComponenteCantidad(e.target.value)} />
                </div>
                {componenteErr && <p style={{ margin: 0, color: "#C0392B", fontSize: 13 }}>{componenteErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddComponente(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingComponente}>
                  {savingComponente ? "Agregando..." : "Agregar"}
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
                {almacenErr && <p style={{ margin: 0, color: "#C0392B", fontSize: 13 }}>{almacenErr}</p>}
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
                {precioErr && <p style={{ margin: 0, color: "#C0392B", fontSize: 13 }}>{precioErr}</p>}
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

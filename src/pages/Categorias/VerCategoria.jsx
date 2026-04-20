import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getCategoriaAction }    from "./actions/get-categoria.action";
import { getCategoriasFlatAction } from "./actions/get-categorias-flat.action";
import { updateCategoriaAction } from "./actions/update-categoria.action";
import { deleteCategoriaAction } from "./actions/delete-categoria.action";
import { FaArrowLeft, FaEdit, FaTrash, FaTags, FaBoxOpen, FaEye } from "react-icons/fa";

function VerCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cat,      setCat]      = useState(null);
  const [flatList, setFlatList] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [form,     setForm]     = useState({ nombre: "", categoriaPadreId: "" });
  const [saving,   setSaving]   = useState(false);
  const [formErr,  setFormErr]  = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [catData, flat] = await Promise.all([getCategoriaAction(id), getCategoriasFlatAction()]);
      setCat(catData);
      setFlatList(Array.isArray(flat) ? flat : []);
    } catch {
      setError("No se pudo cargar la categoría.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const openEdit = () => {
    setForm({ nombre: cat.nombre, categoriaPadreId: cat.categoriaPadre?.categoriaId ?? "" });
    setFormErr("");
    setShowEdit(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.nombre.trim()) { setFormErr("El nombre es requerido."); return; }
    setSaving(true);
    try {
      const dto = { nombre: form.nombre };
      if (form.categoriaPadreId) dto.categoriaPadreId = form.categoriaPadreId;
      await updateCategoriaAction(id, dto);
      setShowEdit(false);
      load();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar esta categoría? Solo es posible si no tiene subcategorías ni productos.")) return;
    setDeleting(true);
    try {
      await deleteCategoriaAction(id);
      navigate("/inventario/categorias");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
      setDeleting(false);
    }
  };

  if (loading) return <Layout><div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Cargando...</div></Layout>;
  if (error)   return <Layout><div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>{error}</div></Layout>;
  if (!cat)    return null;

  const productos    = cat.productos    ?? [];
  const subcategorias = cat.subcategorias ?? [];

  return (
    <Layout>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/inventario/categorias")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18, padding: 0 }}>
            <FaArrowLeft />
          </button>
          <div>
            {cat.categoriaPadre && (
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>
                <Link to={`/inventario/categorias/${cat.categoriaPadre.categoriaId}`}
                  style={{ color: "#6b7280", textDecoration: "none" }}>
                  {cat.categoriaPadre.nombre}
                </Link>
                {" / "}
              </div>
            )}
            <h1 style={{ margin: 0 }}>{cat.nombre}</h1>
          </div>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Info de la categoría */}
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <FaTags style={{ color: "#6366f1" }} /> Información
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Nombre</div>
              <div style={{ fontWeight: 600 }}>{cat.nombre}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Categoría Padre</div>
              <div>
                {cat.categoriaPadre
                  ? <Link to={`/inventario/categorias/${cat.categoriaPadre.categoriaId}`}
                      style={{ color: "#2563eb" }}>{cat.categoriaPadre.nombre}</Link>
                  : <span style={{ color: "#9ca3af" }}>Raíz (sin padre)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Subcategorías */}
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <FaTags style={{ color: "#a78bfa" }} /> Subcategorías
            <span style={{ background: "#ede9fe", color: "#5b21b6", borderRadius: 10, padding: "1px 8px", fontSize: 12 }}>
              {subcategorias.length}
            </span>
          </h3>
          {subcategorias.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Sin subcategorías.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {subcategorias.map((s) => (
                <Link key={s.categoriaId} to={`/inventario/categorias/${s.categoriaId}`}
                  style={{ background: "#ede9fe", color: "#5b21b6", padding: "4px 12px",
                    borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                  {s.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Productos en esta categoría */}
      <div className="card">
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <FaBoxOpen style={{ color: "#2563eb" }} /> Productos
          <span style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 10, padding: "1px 8px", fontSize: 12 }}>
            {productos.length}
          </span>
        </h3>
        {productos.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>Sin productos en esta categoría.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th className="col-hide-mobile">SKU</th>
                  <th className="col-hide-mobile">% Ganancia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.productoId}>
                    <td><code style={{ fontSize: 12, background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{p.codigo}</code></td>
                    <td><strong>{p.nombre}</strong></td>
                    <td className="col-hide-mobile" style={{ color: "#6b7280", fontSize: 13 }}>{p.sku || "—"}</td>
                    <td className="col-hide-mobile">{p.porcentajeGanancia ? `${Number(p.porcentajeGanancia).toFixed(0)}%` : "—"}</td>
                    <td>
                      <Link to={`/inventario/productos/${p.productoId}`} className="btn-secondary" title="Ver producto">
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Editar */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal" style={{ width: "100%", maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16 }}>Editar Categoría</h3>
              <button onClick={() => setShowEdit(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formErr && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: 6, fontSize: 13 }}>{formErr}</div>}
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Nombre *</label>
                  <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box" }} autoFocus />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Categoría Padre</label>
                  <select value={form.categoriaPadreId} onChange={(e) => setForm({ ...form, categoriaPadreId: e.target.value })}
                    style={{ width: "100%" }}>
                    <option value="">Sin categoría padre (raíz)</option>
                    {flatList
                      .filter((c) => c.categoriaId !== cat.categoriaId)
                      .map((c) => (
                        <option key={c.categoriaId} value={c.categoriaId}>
                          {c.categoriaPadre ? `↳ ${c.categoriaPadre.nombre} / ${c.nombre}` : c.nombre}
                        </option>
                      ))}
                  </select>
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

export default VerCategoria;

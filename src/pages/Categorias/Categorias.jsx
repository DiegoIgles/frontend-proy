import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getCategoriasAction }     from "./actions/get-categorias.action";
import { getCategoriasFlatAction } from "./actions/get-categorias-flat.action";
import { createCategoriaAction }   from "./actions/create-categoria.action";
import { updateCategoriaAction }   from "./actions/update-categoria.action";
import { deleteCategoriaAction }   from "./actions/delete-categoria.action";
import { FaPlus, FaEdit, FaTrash, FaEye, FaChevronDown, FaChevronRight, FaTags } from "react-icons/fa";

const EMPTY_FORM = { nombre: "", categoriaPadreId: "" };

function CategoriaModal({ show, onClose, onSaved, flatList, editData }) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  useEffect(() => {
    if (show) {
      setErr("");
      setForm(editData
        ? { nombre: editData.nombre, categoriaPadreId: editData.categoriaPadre?.categoriaId ?? "" }
        : EMPTY_FORM);
    }
  }, [show, editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.nombre.trim()) { setErr("El nombre es requerido."); return; }
    setSaving(true);
    try {
      const dto = { nombre: form.nombre };
      if (form.categoriaPadreId) dto.categoriaPadreId = form.categoriaPadreId;
      if (editData) await updateCategoriaAction(editData.categoriaId, dto);
      else          await createCategoriaAction(dto);
      onSaved();
    } catch (ex) {
      setErr(ex.response?.data?.message || "Error al guardar");
    } finally { setSaving(false); }
  };

  if (!show) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: "100%", maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0, fontSize: 16 }}>{editData ? "Editar Categoría" : "Nueva Categoría"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {err && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: 6, fontSize: 13 }}>{err}</div>}
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Nombre *</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Paneles Solares" style={{ width: "100%", boxSizing: "border-box" }} autoFocus />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Categoría Padre</label>
              <select value={form.categoriaPadreId} onChange={(e) => setForm({ ...form, categoriaPadreId: e.target.value })}
                style={{ width: "100%" }}>
                <option value="">Sin categoría padre (raíz)</option>
                {flatList
                  .filter((c) => !editData || c.categoriaId !== editData.categoriaId)
                  .map((c) => (
                    <option key={c.categoriaId} value={c.categoriaId}>
                      {c.categoriaPadre ? `↳ ${c.categoriaPadre.nombre} / ${c.nombre}` : c.nombre}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose}
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
  );
}

function CategoryRow({ cat, flatList, onEdit, onDelete, deletingId }) {
  const [open, setOpen] = useState(false);
  const hasSubs = cat.subcategorias?.length > 0;

  return (
    <>
      <tr>
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setOpen((v) => !v)}
              style={{ background: "none", border: "none", cursor: hasSubs ? "pointer" : "default",
                color: hasSubs ? "#6b7280" : "transparent", padding: 2, display: "flex" }}>
              {hasSubs ? (open ? <FaChevronDown /> : <FaChevronRight />) : <FaChevronRight />}
            </button>
            <FaTags style={{ color: "#6366f1", flexShrink: 0 }} />
            <strong>{cat.nombre}</strong>
          </div>
        </td>
        <td>
          {hasSubs ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {cat.subcategorias.map((s) => (
                <span key={s.categoriaId} style={{ background: "#ede9fe", color: "#5b21b6",
                  padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 500 }}>
                  {s.nombre}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ color: "#9ca3af", fontSize: 13 }}>Sin subcategorías</span>
          )}
        </td>
        <td>
          <div style={{ display: "flex", gap: 6 }}>
            <Link to={`/inventario/categorias/${cat.categoriaId}`} className="btn-secondary" title="Ver detalle"><FaEye /></Link>
            <button className="btn-secondary" title="Editar" onClick={() => onEdit(cat, null)}><FaEdit /></button>
            <button className="btn-danger" title="Eliminar" disabled={deletingId === cat.categoriaId}
              onClick={() => onDelete(cat.categoriaId)}><FaTrash /></button>
          </div>
        </td>
      </tr>
      {open && hasSubs && cat.subcategorias.map((sub) => (
        <tr key={sub.categoriaId} style={{ background: "#fafafa" }}>
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 32 }}>
              <FaTags style={{ color: "#a78bfa", flexShrink: 0 }} />
              <span>{sub.nombre}</span>
            </div>
          </td>
          <td><span style={{ color: "#9ca3af", fontSize: 12 }}>Subcategoría de <strong>{cat.nombre}</strong></span></td>
          <td>
            <div style={{ display: "flex", gap: 6 }}>
              <Link to={`/inventario/categorias/${sub.categoriaId}`} className="btn-secondary" title="Ver detalle"><FaEye /></Link>
              <button className="btn-secondary" title="Editar" onClick={() => onEdit(sub, cat)}><FaEdit /></button>
              <button className="btn-danger" title="Eliminar" disabled={deletingId === sub.categoriaId}
                onClick={() => onDelete(sub.categoriaId)}><FaTrash /></button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

function Categorias() {
  const [tree,       setTree]       = useState([]);
  const [flatList,   setFlatList]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [treeRes, flatRes] = await Promise.all([getCategoriasAction(), getCategoriasFlatAction()]);
      setTree(Array.isArray(treeRes) ? treeRes : []);
      setFlatList(Array.isArray(flatRes) ? flatRes : []);
    } catch { setTree([]); setFlatList([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setEditData(null); setShowModal(true); };

  const openEdit = (cat, parent) => {
    setEditData({
      categoriaId:   cat.categoriaId,
      nombre:        cat.nombre,
      categoriaPadre: parent ? { categoriaId: parent.categoriaId, nombre: parent.nombre } : null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría? Solo es posible si no tiene subcategorías ni productos.")) return;
    setDeletingId(id);
    try {
      await deleteCategoriaAction(id);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    } finally { setDeletingId(null); }
  };

  const totalSubs = tree.reduce((acc, c) => acc + (c.subcategorias?.length ?? 0), 0);

  return (
    <Layout>
      <div className="page-header">
        <h1>Categorías</h1>
        <button className="btn-primary" onClick={openCreate}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Categoría
        </button>
      </div>

      {/* Métricas rápidas */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Categorías raíz",  value: tree.length,  color: "#6366f1" },
          { label: "Subcategorías",    value: totalSubs,    color: "#a78bfa" },
          { label: "Total",            value: flatList.length, color: "#374151" },
        ].map((m) => (
          <div key={m.label} className="card" style={{ flex: "1 1 140px", textAlign: "center", padding: "14px 10px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</p>
        ) : tree.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>No hay categorías registradas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Subcategorías</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tree.map((cat) => (
                  <CategoryRow key={cat.categoriaId} cat={cat} flatList={flatList}
                    onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoriaModal show={showModal} onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); fetchAll(); }}
        flatList={flatList} editData={editData} />
    </Layout>
  );
}

export default Categorias;

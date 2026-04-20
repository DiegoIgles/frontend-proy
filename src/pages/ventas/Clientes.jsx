import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getClientesAction }  from "./actions/get-clientes.action";
import { createClienteAction } from "./actions/create-cliente.action";
import { deleteClienteAction } from "./actions/delete-cliente.action";
import { FaPlus, FaEye, FaTrash, FaSearch, FaUser } from "react-icons/fa";

const EMPTY_FORM = { nombre: "", apellidoPaterno: "", apellidoMaterno: "", correo: "", telefono: "", direccion: "" };

function Clientes() {
  const [clientes,  setClientes]  = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);

  const [search,  setSearch]  = useState("");
  const [limit,   setLimit]   = useState(10);
  const [offset,  setOffset]  = useState(0);

  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getClientesAction({ limit, offset, search });
      if (Array.isArray(res)) { setClientes(res); setTotal(res.length); }
      else { setClientes(res.data ?? []); setTotal(res.total ?? 0); }
    } catch { setClientes([]); }
    finally { setLoading(false); }
  }, [limit, offset, search]);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.nombre.trim() || !form.apellidoPaterno.trim() || !form.correo.trim()) {
      setFormError("Nombre, apellido paterno y correo son requeridos.");
      return;
    }
    setSaving(true);
    try {
      const dto = { nombre: form.nombre, apellidoPaterno: form.apellidoPaterno, correo: form.correo };
      if (form.apellidoMaterno.trim()) dto.apellidoMaterno = form.apellidoMaterno.trim();
      if (form.telefono.trim())        dto.telefono        = form.telefono.trim();
      if (form.direccion.trim())       dto.direccion       = form.direccion.trim();
      await createClienteAction(dto);
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchClientes();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este cliente? Solo es posible si no tiene ventas.")) return;
    try {
      setDeletingId(id);
      await deleteClienteAction(id);
      fetchClientes();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    } finally { setDeletingId(null); }
  };

  const fullName = (c) =>
    [c.nombre, c.apellidoPaterno, c.apellidoMaterno].filter(Boolean).join(" ");

  return (
    <Layout>
      <div className="page-header">
        <h1>Clientes</h1>
        <button className="btn-primary" onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(""); }}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nuevo Cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 220px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
              <input placeholder="Nombre, apellido o correo..." value={search}
                onChange={(e) => applyFilter(setSearch, e.target.value)}
                style={{ paddingLeft: 30, width: "100%", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ flex: "0 0 110px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Por página</label>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }} style={{ width: "100%" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th className="col-hide-mobile">Correo</th>
                <th className="col-hide-mobile">Teléfono</th>
                <th className="col-hide-mobile">Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</td></tr>
              ) : clientes.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Sin resultados</td></tr>
              ) : clientes.map((c) => (
                <tr key={c.clienteId}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#dbeafe",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FaUser style={{ color: "#2563eb", fontSize: 14 }} />
                      </div>
                      <div>
                        <strong style={{ display: "block" }}>{fullName(c)}</strong>
                      </div>
                    </div>
                  </td>
                  <td className="col-hide-mobile">
                    {c.correo
                      ? <a href={`mailto:${c.correo}`} style={{ color: "#2563eb" }}>{c.correo}</a>
                      : "—"}
                  </td>
                  <td className="col-hide-mobile">{c.telefono || "—"}</td>
                  <td className="col-hide-mobile" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.direccion || "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link to={`/ventas/clientes/${c.clienteId}`} className="btn-secondary" title="Ver detalle"><FaEye /></Link>
                      <button className="btn-danger" title="Eliminar"
                        onClick={() => handleDelete(c.clienteId)}
                        disabled={deletingId === c.clienteId}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={total} limit={limit} offset={offset}
          onOffsetChange={(o) => setOffset(o)}
          onLimitChange={(l) => { setLimit(l); setOffset(0); }} />
      </div>

      {/* Modal Crear */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width: "100%", maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16 }}>Nuevo Cliente</h3>
              <button onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formError && (
                  <div style={{ background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: 6, fontSize: 13 }}>{formError}</div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Nombre *</label>
                    <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Roberto" style={{ width: "100%", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Apellido Paterno *</label>
                    <input value={form.apellidoPaterno} onChange={(e) => setForm({ ...form, apellidoPaterno: e.target.value })}
                      placeholder="Vargas" style={{ width: "100%", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Apellido Materno</label>
                  <input value={form.apellidoMaterno} onChange={(e) => setForm({ ...form, apellidoMaterno: e.target.value })}
                    placeholder="Lima" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Correo *</label>
                  <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    placeholder="roberto.vargas@gmail.com" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Teléfono</label>
                    <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      placeholder="70011001" style={{ width: "100%", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Dirección</label>
                  <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    placeholder="Av. Arce 123" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)}
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

export default Clientes;

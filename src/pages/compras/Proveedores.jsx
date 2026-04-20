import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getProveedoresAction }  from "./actions/get-proveedores.action";
import { createProveedorAction } from "./actions/create-proveedor.action";
import { FaTruck, FaPlus, FaSearch, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const FORM_VACIO = {
  nombre: "", contacto: "", email: "", telefono: "", direccion: "", ciudad: "", pais: "",
};

function Proveedores() {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [total,       setTotal]       = useState(0);
  const [loading,     setLoading]     = useState(true);

  const [search, setSearch] = useState("");
  const [limit,  setLimit]  = useState(10);
  const [offset, setOffset] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState(FORM_VACIO);
  const [saving,    setSaving]    = useState(false);
  const [formErr,   setFormErr]   = useState("");

  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProveedoresAction({ limit, offset, search });
      if (Array.isArray(res)) {
        setProveedores(res); setTotal(res.length);
      } else {
        setProveedores(res.data ?? []); setTotal(res.total ?? 0);
      }
    } catch {
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, search]);

  useEffect(() => { fetchProveedores(); }, [fetchProveedores]);

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.nombre.trim()) { setFormErr("El nombre es obligatorio."); return; }
    try {
      setSaving(true);
      const dto = { ...form };
      Object.keys(dto).forEach((k) => { if (!dto[k]) delete dto[k]; });
      await createProveedorAction(dto);
      setShowModal(false);
      setForm(FORM_VACIO);
      fetchProveedores();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Error al crear el proveedor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaTruck style={{ marginRight: 8 }} />Proveedores</h1>
        <button className="btn-primary"
          onClick={() => { setForm(FORM_VACIO); setFormErr(""); setShowModal(true); }}
          style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FaPlus /> Nuevo Proveedor
        </button>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 240px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
                color: "#9ca3af", fontSize: 13 }} />
              <input
                placeholder="Nombre del proveedor..."
                value={search}
                onChange={(e) => applyFilter(setSearch, e.target.value)}
                style={{ paddingLeft: 30, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ flex: "0 0 120px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Por página</label>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }}
              style={{ width: "100%" }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Ciudad / País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</td></tr>
              ) : proveedores.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Sin resultados</td></tr>
              ) : proveedores.map((p) => (
                <tr key={p.proveedorId}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, background: "#dbeafe",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <FaTruck style={{ color: "#1d4ed8", fontSize: 15 }} />
                      </div>
                      <span style={{ fontWeight: 700 }}>{p.nombre}</span>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280", fontSize: 13 }}>{p.contacto ?? "—"}</td>
                  <td>
                    {p.email
                      ? <a href={`mailto:${p.email}`}
                          style={{ color: "#3b82f6", textDecoration: "none", fontSize: 13,
                            display: "flex", alignItems: "center", gap: 4 }}>
                          <FaEnvelope style={{ fontSize: 11 }} />{p.email}
                        </a>
                      : <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>}
                  </td>
                  <td>
                    {p.telefono
                      ? <span style={{ display: "flex", alignItems: "center", gap: 4,
                          color: "#374151", fontSize: 13 }}>
                          <FaPhone style={{ fontSize: 11 }} />{p.telefono}
                        </span>
                      : <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>}
                  </td>
                  <td style={{ fontSize: 13, color: "#6b7280" }}>
                    {p.ciudad || p.pais
                      ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <FaMapMarkerAlt style={{ fontSize: 11 }} />
                          {[p.ciudad, p.pais].filter(Boolean).join(", ")}
                        </span>
                      : "—"}
                  </td>
                  <td>
                    <button className="btn-secondary"
                      onClick={() => navigate(`/compras/proveedores/${p.proveedorId}`)}
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
          onOffsetChange={(o) => setOffset(o)}
          onLimitChange={(l) => { setLimit(l); setOffset(0); }} />
      </div>

      {/* Modal Crear */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3>Nuevo Proveedor</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handleFormChange}
                    placeholder="Distribuidora Solar Bolivia" />
                </div>
                <div>
                  <label>Contacto</label>
                  <input name="contacto" value={form.contacto} onChange={handleFormChange}
                    placeholder="Pedro Ruiz" />
                </div>
                <div>
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange}
                    placeholder="ventas@empresa.com" />
                </div>
                <div>
                  <label>Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleFormChange}
                    placeholder="22441122" />
                </div>
                <div>
                  <label>Ciudad</label>
                  <input name="ciudad" value={form.ciudad} onChange={handleFormChange}
                    placeholder="La Paz" />
                </div>
                <div>
                  <label>País</label>
                  <input name="pais" value={form.pais} onChange={handleFormChange}
                    placeholder="Bolivia" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Dirección</label>
                  <input name="direccion" value={form.direccion} onChange={handleFormChange}
                    placeholder="Av. Montes 234" />
                </div>
                {formErr && (
                  <p style={{ gridColumn: "1 / -1", margin: 0, color: "#dc2626", fontSize: 13 }}>{formErr}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Creando..." : "Crear Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Proveedores;

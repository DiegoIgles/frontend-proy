import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getAlmacenesAction }  from "./actions/get-almacenes.action";
import { createAlmacenAction } from "./actions/create-almacen.action";
import { FaWarehouse, FaPlus, FaEye } from "react-icons/fa";

function Almacenes() {
  const navigate = useNavigate();

  const [almacenes, setAlmacenes] = useState([]);
  const [loading,   setLoading]   = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [nombre,    setNombre]    = useState("");
  const [saving,    setSaving]    = useState(false);
  const [formErr,   setFormErr]   = useState("");

  const fetchAlmacenes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAlmacenesAction();
      setAlmacenes(Array.isArray(data) ? data : (data.data ?? []));
    } catch {
      setAlmacenes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlmacenes(); }, [fetchAlmacenes]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!nombre.trim()) { setFormErr("El nombre es obligatorio."); return; }
    try {
      setSaving(true);
      await createAlmacenAction({ nombre: nombre.trim() });
      setShowModal(false);
      setNombre("");
      fetchAlmacenes();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Error al crear el almacén");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaWarehouse style={{ marginRight: 8 }} />Almacenes</h1>
        <button className="btn-primary"
          onClick={() => { setNombre(""); setFormErr(""); setShowModal(true); }}
          style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FaPlus /> Nuevo Almacén
        </button>
      </div>

      {/* Métrica */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 20, maxWidth: 400 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280",
            textTransform: "uppercase", fontWeight: 600 }}>Total Almacenes</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1d4ed8" }}>{almacenes.length}</p>
        </div>
      </div>

      {/* Cards de almacenes */}
      {loading ? (
        <p style={{ color: "#9ca3af", textAlign: "center" }}>Cargando...</p>
      ) : almacenes.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
          No hay almacenes registrados.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {almacenes.map((a) => (
            <div key={a.almacenId} className="card"
              style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: "#dbeafe",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FaWarehouse style={{ color: "#1d4ed8", fontSize: 20 }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{a.nombre}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>
                    {a.almacenId.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <button className="btn-secondary"
                onClick={() => navigate(`/inventario/almacenes/${a.almacenId}`)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, width: "100%" }}>
                <FaEye /> Ver detalle
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3>Nuevo Almacén</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <label>Nombre *</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Almacén Norte"
                  autoFocus
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                {formErr && <p style={{ margin: "8px 0 0", color: "#dc2626", fontSize: 13 }}>{formErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Creando..." : "Crear Almacén"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Almacenes;

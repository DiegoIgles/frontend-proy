import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getAlmacenesAction }  from "./actions/get-almacenes.action";
import { createAlmacenAction } from "./actions/create-almacen.action";
import { FaWarehouse, FaPlus, FaArrowRight, FaBoxOpen } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

function Almacenes() {
  const toast = useToast();

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
      toast.success("Almacén creado correctamente.");
      setShowModal(false);
      setNombre("");
      fetchAlmacenes();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al crear el almacén";
      setFormErr(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1><FaWarehouse style={{ marginRight: 8 }} />Almacenes</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            {almacenes.length} {almacenes.length === 1 ? "almacén registrado" : "almacenes registrados"}
          </p>
        </div>
        <button className="btn-primary"
          onClick={() => { setNombre(""); setFormErr(""); setShowModal(true); }}
          style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FaPlus /> Nuevo Almacén
        </button>
      </div>

      {/* Cards de almacenes */}
      {loading ? (
        <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>Cargando...</p>
      ) : almacenes.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>
          <FaWarehouse style={{ fontSize: 32, color: "#d1d5db", marginBottom: 10 }} />
          <p style={{ margin: 0 }}>No hay almacenes registrados.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {almacenes.map((a) => {
            const numProductos = a.productoAlmacenes?.length;
            return (
              <div key={a.almacenId} className="card"
                style={{
                  display: "flex", flexDirection: "column", padding: 0, overflow: "hidden",
                  transition: "box-shadow 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 8px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 20 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, background: "#dbeafe",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <FaWarehouse style={{ color: "#1d4ed8", fontSize: 20 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#111827" }}>{a.nombre}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 5 }}>
                      <FaBoxOpen style={{ fontSize: 11 }} />
                      {typeof numProductos === "number"
                        ? `${numProductos} ${numProductos === 1 ? "producto" : "productos"}`
                        : "Almacén"}
                    </p>
                  </div>
                </div>
                <Link to={`/inventario/almacenes/${a.almacenId}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 20px", borderTop: "1px solid #f3f4f6",
                    fontSize: 13, fontWeight: 600, color: "#1d4ed8", textDecoration: "none",
                  }}>
                  Ver detalle <FaArrowRight style={{ fontSize: 11 }} />
                </Link>
              </div>
            );
          })}
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

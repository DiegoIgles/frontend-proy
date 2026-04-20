import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getAjustesAction }   from "./actions/get-ajustes.action";
import { deleteAjusteAction } from "./actions/delete-ajuste.action";
import { FaPlus, FaEye, FaTrash, FaSearch, FaFilter } from "react-icons/fa";

function TipoBadge({ tipo }) {
  return tipo === "ENTRADA"
    ? <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>ENTRADA</span>
    : <span style={{ background: "#fee2e2", color: "#991b1b", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>SALIDA</span>;
}

function Ajustes() {
  const [ajustes,  setAjustes]  = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);

  const [tipo,      setTipo]      = useState("");
  const [search,    setSearch]    = useState("");
  const [fechaDesde,setFechaDesde]= useState("");
  const [fechaHasta,setFechaHasta]= useState("");
  const [limit,     setLimit]     = useState(10);
  const [offset,    setOffset]    = useState(0);
  const [showFechas,setShowFechas]= useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const activeFechas = [fechaDesde, fechaHasta].filter(Boolean).length;

  const fetchAjustes = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { limit, offset, tipo, search };
      if (fechaDesde) filters.fechaDesde = fechaDesde;
      if (fechaHasta) filters.fechaHasta = fechaHasta;
      const res = await getAjustesAction(filters);
      if (Array.isArray(res)) { setAjustes(res); setTotal(res.length); }
      else { setAjustes(res.data ?? []); setTotal(res.total ?? 0); }
    } catch { setAjustes([]); }
    finally { setLoading(false); }
  }, [limit, offset, tipo, search, fechaDesde, fechaHasta]);

  useEffect(() => { fetchAjustes(); }, [fetchAjustes]);

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este ajuste? Se revertirá el stock.")) return;
    try {
      setDeletingId(id);
      await deleteAjusteAction(id);
      fetchAjustes();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    } finally { setDeletingId(null); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Ajustes de Stock</h1>
        <Link to="/ajustes/crear" className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nuevo Ajuste
        </Link>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
              <input placeholder="Buscar en glosa..." value={search}
                onChange={(e) => applyFilter(setSearch, e.target.value)}
                style={{ paddingLeft: 30, width: "100%", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ flex: "1 1 140px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Tipo</label>
            <select value={tipo} onChange={(e) => applyFilter(setTipo, e.target.value)} style={{ width: "100%" }}>
              <option value="">Todos</option>
              <option value="ENTRADA">ENTRADA</option>
              <option value="SALIDA">SALIDA</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Fechas</label>
            <button onClick={() => setShowFechas((v) => !v)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                borderRadius: 6, border: "1px solid #d1d5db", background: showFechas ? "#dbeafe" : "#fff",
                color: showFechas ? "#1d4ed8" : "#374151", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              <FaFilter /> Fechas {activeFechas > 0 && <span style={{ background: "#1d4ed8", color: "#fff",
                borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11 }}>{activeFechas}</span>}
            </button>
          </div>
          <div style={{ flex: "0 0 110px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Por página</label>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }} style={{ width: "100%" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={100}>100</option>
            </select>
          </div>
        </div>
        {showFechas && (
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Desde</label>
              <input type="date" value={fechaDesde} onChange={(e) => applyFilter(setFechaDesde, e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Hasta</label>
              <input type="date" value={fechaHasta} onChange={(e) => applyFilter(setFechaHasta, e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} />
            </div>
            {activeFechas > 0 && (
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button onClick={() => { applyFilter(setFechaDesde, ""); setFechaHasta(""); }}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 13 }}>
                  Limpiar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th className="col-hide-mobile">Glosa</th>
                <th className="col-hide-mobile">Usuario</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</td></tr>
              ) : ajustes.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Sin resultados</td></tr>
              ) : ajustes.map((ajuste) => (
                <tr key={ajuste.ajusteId}>
                  <td style={{ whiteSpace: "nowrap" }}>{ajuste.fecha}</td>
                  <td><TipoBadge tipo={ajuste.tipo} /></td>
                  <td className="col-hide-mobile">{ajuste.glosa || "—"}</td>
                  <td className="col-hide-mobile">{ajuste.usuario?.name} {ajuste.usuario?.lastName}</td>
                  <td style={{ fontSize: 13 }}>
                    {ajuste.detallesAjuste?.map((d) => (
                      <span key={d.detalleAjusteId} style={{ display: "block" }}>
                        {d.productoAlmacen?.producto?.nombre}
                        <span style={{ color: "#6b7280", marginLeft: 4 }}>× {d.cantidad}</span>
                      </span>
                    ))}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link to={`/ajustes/${ajuste.ajusteId}`} className="btn-secondary" title="Ver detalle"><FaEye /></Link>
                      <button className="btn-danger" title="Eliminar"
                        onClick={() => handleDelete(ajuste.ajusteId)}
                        disabled={deletingId === ajuste.ajusteId}>
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
    </Layout>
  );
}

export default Ajustes;

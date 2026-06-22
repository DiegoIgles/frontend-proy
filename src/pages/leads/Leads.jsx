import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getLeadsAction } from "./actions/get-leads.action";
import { deleteLeadAction } from "./actions/delete-lead.action";
import { FaEye, FaTrash, FaSearch, FaUserPlus, FaTimes } from "react-icons/fa";

// El backend solo filtra por "search" (nombre) y no pagina. El rango de fechas
// y la paginación se aplican aquí sobre el arreglo completo que devuelve la API.
function Leads() {
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [search,     setSearch]     = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [limit,  setLimit]  = useState(10);
  const [offset, setOffset] = useState(0);

  const [deletingId, setDeletingId] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeadsAction({ search });
      setLeads(Array.isArray(res) ? res : (res.data ?? []));
    } catch { setLeads([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const leadsFiltrados = useMemo(() => {
    return leads.filter((l) => {
      const fecha = l.fecha?.slice(0, 10);
      if (fechaDesde && fecha < fechaDesde) return false;
      if (fechaHasta && fecha > fechaHasta) return false;
      return true;
    });
  }, [leads, fechaDesde, fechaHasta]);

  const total = leadsFiltrados.length;
  const leadsPagina = useMemo(
    () => leadsFiltrados.slice(offset, offset + limit),
    [leadsFiltrados, offset, limit]
  );

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const limpiarFiltros = () => {
    setSearch(""); setFechaDesde(""); setFechaHasta(""); setOffset(0);
  };
  const hayFiltros = search || fechaDesde || fechaHasta;

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este lead?")) return;
    try {
      setDeletingId(id);
      await deleteLeadAction(id);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    } finally { setDeletingId(null); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaUserPlus style={{ marginRight: 8 }} />Gestión de Leads</h1>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 220px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
              <input placeholder="Buscar por nombre..." value={search}
                onChange={(e) => applyFilter(setSearch, e.target.value)}
                style={{ paddingLeft: 30, width: "100%", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ flex: "0 1 150px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Desde</label>
            <input type="date" value={fechaDesde} onChange={(e) => applyFilter(setFechaDesde, e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ flex: "0 1 150px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Hasta</label>
            <input type="date" value={fechaHasta} onChange={(e) => applyFilter(setFechaHasta, e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ flex: "0 0 110px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Por página</label>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }} style={{ width: "100%" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={100}>100</option>
            </select>
          </div>
          {hayFiltros && (
            <button className="btn-secondary" onClick={limpiarFiltros}
              style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
              <FaTimes /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="col-hide-mobile">Teléfono</th>
                <th className="col-hide-mobile">Dirección</th>
                <th className="col-hide-mobile">Comentario</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</td></tr>
              ) : leadsPagina.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Sin resultados</td></tr>
              ) : leadsPagina.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.nombre}</strong></td>
                  <td className="col-hide-mobile">
                    {l.telefono ? <a href={`tel:${l.telefono}`} style={{ color: "#2563eb" }}>{l.telefono}</a> : "—"}
                  </td>
                  <td className="col-hide-mobile" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.direccion || "—"}
                  </td>
                  <td className="col-hide-mobile" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.comentario || "—"}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(l.fecha).toLocaleDateString("es-BO")}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link to={`/leads/${l.id}`} className="btn-secondary" title="Ver detalle"><FaEye /></Link>
                      <button className="btn-danger" title="Eliminar"
                        onClick={() => handleDelete(l.id)}
                        disabled={deletingId === l.id}>
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
          onLimitChange={(lim) => { setLimit(lim); setOffset(0); }} />
      </div>
    </Layout>
  );
}

export default Leads;

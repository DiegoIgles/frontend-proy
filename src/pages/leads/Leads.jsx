import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { getLeadsAction } from "./actions/get-leads.action";
import { deleteLeadAction } from "./actions/delete-lead.action";
import { formatTipoServicio } from "./leads.constants";
import { FaEye, FaTrash, FaSearch, FaUserPlus, FaTimes } from "react-icons/fa";

// El backend solo filtra por "search" (nombre) y no pagina. El rango de fechas
// y la paginación se aplican aquí sobre el arreglo completo que devuelve la API.
function Leads() {
  const toast = useToast();
  const confirm = useConfirm();
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [search,      setSearch]      = useState("");
  const [tipoServicio, setTipoServicio] = useState("");
  const [fechaDesde,  setFechaDesde]  = useState("");
  const [fechaHasta,  setFechaHasta]  = useState("");
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

  const serviciosDisponibles = useMemo(() => {
    const unicos = [...new Set(leads.map((l) => l.tipoServicio).filter(Boolean))];
    return unicos.map((v) => ({ value: v, label: formatTipoServicio(v) }));
  }, [leads]);

  const leadsFiltrados = useMemo(() => {
    return leads.filter((l) => {
      const fecha = l.fecha?.slice(0, 10);
      if (fechaDesde && fecha < fechaDesde) return false;
      if (fechaHasta && fecha > fechaHasta) return false;
      if (tipoServicio && l.tipoServicio !== tipoServicio) return false;
      return true;
    });
  }, [leads, fechaDesde, fechaHasta, tipoServicio]);

  const total = leadsFiltrados.length;
  const leadsPagina = useMemo(
    () => leadsFiltrados.slice(offset, offset + limit),
    [leadsFiltrados, offset, limit]
  );

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const limpiarFiltros = () => {
    setSearch(""); setTipoServicio(""); setFechaDesde(""); setFechaHasta(""); setOffset(0);
  };
  const hayFiltros = search || tipoServicio || fechaDesde || fechaHasta;

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar lead",
      message: "¿Eliminar este lead?",
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    try {
      setDeletingId(id);
      await deleteLeadAction(id);
      toast.success("Lead eliminado correctamente.");
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar");
    } finally { setDeletingId(null); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaUserPlus style={{ marginRight: 8 }} />Gestión de Leads</h1>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-field filter-search" style={{ flex: "1 1 220px" }}>
          <label>Buscar</label>
          <FaSearch className="filter-search-icon" />
          <input placeholder="Buscar por nombre..." value={search}
            onChange={(e) => applyFilter(setSearch, e.target.value)} />
        </div>
        <div className="filter-field" style={{ flex: "0 1 170px" }}>
          <label>Servicio</label>
          <select value={tipoServicio} onChange={(e) => applyFilter(setTipoServicio, e.target.value)}>
            <option value="">Todos</option>
            {serviciosDisponibles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-field" style={{ flex: "0 1 150px" }}>
          <label>Desde</label>
          <input type="date" value={fechaDesde} onChange={(e) => applyFilter(setFechaDesde, e.target.value)} />
        </div>
        <div className="filter-field" style={{ flex: "0 1 150px" }}>
          <label>Hasta</label>
          <input type="date" value={fechaHasta} onChange={(e) => applyFilter(setFechaHasta, e.target.value)} />
        </div>
        <div className="filter-field" style={{ flex: "0 0 110px" }}>
          <label>Por página</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }}>
            <option value={10}>10</option><option value={25}>25</option><option value={100}>100</option>
          </select>
        </div>
        {hayFiltros && (
          <button className="filters-bar-clear" onClick={limpiarFiltros}>
            <FaTimes /> Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="col-hide-mobile">Teléfono</th>
                <th className="col-hide-mobile">Correo</th>
                <th className="col-hide-mobile">Servicio</th>
                <th className="col-hide-mobile">Suministro</th>
                <th className="col-hide-mobile">Dirección</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</td></tr>
              ) : leadsPagina.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Sin resultados</td></tr>
              ) : leadsPagina.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.nombre}</strong></td>
                  <td className="col-hide-mobile">
                    {l.telefono ? <a href={`tel:${l.telefono}`} style={{ color: "#0062B7" }}>{l.telefono}</a> : "—"}
                  </td>
                  <td className="col-hide-mobile">
                    {l.correo ? <a href={`mailto:${l.correo}`} style={{ color: "#0062B7" }}>{l.correo}</a> : "—"}
                  </td>
                  <td className="col-hide-mobile">{formatTipoServicio(l.tipoServicio)}</td>
                  <td className="col-hide-mobile">{l.tipoSuministro || "—"}</td>
                  <td className="col-hide-mobile" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.direccion || "—"}
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

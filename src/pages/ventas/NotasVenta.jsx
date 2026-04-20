import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getNotasVentaAction }   from "./actions/get-notas-venta.action";
import { deleteNotaVentaAction } from "./actions/delete-nota-venta.action";
import EstadoBadge from "../../components/EstadoBadge";
import { FaPlus, FaEye, FaMoneyBillWave, FaTrash, FaSearch, FaFilter } from "react-icons/fa";

const ESTADOS = ["", "PENDIENTE", "PAGADO_PARCIAL", "PAGADO", "VENCIDO"];

function NotasVenta() {
  const [notas,   setNotas]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);

  const [search,      setSearch]      = useState("");
  const [fechaDesde,  setFechaDesde]  = useState("");
  const [fechaHasta,  setFechaHasta]  = useState("");
  const [esCredito,   setEsCredito]   = useState("");
  const [estadoDeuda, setEstadoDeuda] = useState("");
  const [limit,       setLimit]       = useState(10);
  const [offset,      setOffset]      = useState(0);
  const [showFechas,  setShowFechas]  = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const activeFechas = [fechaDesde, fechaHasta].filter(Boolean).length;

  const fetchNotas = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { limit, offset, search, esCredito, estadoDeuda };
      if (fechaDesde) filters.fechaDesde = fechaDesde;
      if (fechaHasta) filters.fechaHasta = fechaHasta;
      const res = await getNotasVentaAction(filters);
      if (Array.isArray(res)) { setNotas(res); setTotal(res.length); }
      else { setNotas(res.data ?? []); setTotal(res.total ?? 0); }
    } catch { setNotas([]); }
    finally { setLoading(false); }
  }, [limit, offset, search, esCredito, estadoDeuda, fechaDesde, fechaHasta]);

  useEffect(() => { fetchNotas(); }, [fetchNotas]);

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta nota de venta? Se revertirá el stock.")) return;
    try {
      setDeletingId(id);
      await deleteNotaVentaAction(id);
      fetchNotas();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    } finally { setDeletingId(null); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Notas de Venta</h1>
        <Link to="/ventas/notas/crear" className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Venta
        </Link>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
              <input placeholder="Glosa o cliente..." value={search}
                onChange={(e) => applyFilter(setSearch, e.target.value)}
                style={{ paddingLeft: 30, width: "100%", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ flex: "1 1 140px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Tipo</label>
            <select value={esCredito} onChange={(e) => applyFilter(setEsCredito, e.target.value)} style={{ width: "100%" }}>
              <option value="">Todos</option>
              <option value="false">Contado</option>
              <option value="true">Crédito</option>
            </select>
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Estado deuda</label>
            <select value={estadoDeuda} onChange={(e) => applyFilter(setEstadoDeuda, e.target.value)} style={{ width: "100%" }}>
              {ESTADOS.map((e) => <option key={e} value={e}>{e || "Todos"}</option>)}
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
                <th>Cliente</th>
                <th className="col-hide-mobile">Glosa</th>
                <th className="col-hide-mobile">Usuario</th>
                <th>Monto Total</th>
                <th className="col-hide-mobile">Tipo</th>
                <th className="col-hide-mobile">Saldo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Cargando...</td></tr>
              ) : notas.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "#9ca3af", padding: 30 }}>Sin resultados</td></tr>
              ) : notas.map((nota) => (
                <tr key={nota.notaVentaId}>
                  <td style={{ whiteSpace: "nowrap" }}>{nota.fecha}</td>
                  <td>
                    <strong>
                      {nota.cliente?.nombre} {nota.cliente?.apellidoPaterno}
                      {nota.cliente?.apellidoMaterno ? ` ${nota.cliente.apellidoMaterno}` : ""}
                    </strong>
                    {nota.cliente?.telefono && <><br /><small style={{ color: "#6b7280" }}>{nota.cliente.telefono}</small></>}
                  </td>
                  <td className="col-hide-mobile">{nota.glosa || "—"}</td>
                  <td className="col-hide-mobile">{nota.usuario?.name} {nota.usuario?.lastName}</td>
                  <td><strong>Bs. {Number(nota.montoTotal).toFixed(2)}</strong></td>
                  <td className="col-hide-mobile">
                    {nota.esCredito
                      ? <span style={{ color: "#d97706", fontWeight: 600 }}>Crédito</span>
                      : <span style={{ color: "#059669", fontWeight: 600 }}>Contado</span>}
                  </td>
                  <td className="col-hide-mobile">
                    {nota.saldoPendiente > 0
                      ? <span style={{ color: "#dc2626" }}>Bs. {Number(nota.saldoPendiente).toFixed(2)}</span>
                      : <span style={{ color: "#059669" }}>Bs. 0.00</span>}
                  </td>
                  <td><EstadoBadge estado={nota.estadoDeuda} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link to={`/ventas/notas/${nota.notaVentaId}`} className="btn-secondary" title="Ver detalle"><FaEye /></Link>
                      {nota.puedeRegistrarCobro && (
                        <Link to={`/ventas/notas/${nota.notaVentaId}/cobro`} className="btn-primary" title="Registrar cobro"><FaMoneyBillWave /></Link>
                      )}
                      <button className="btn-danger" title="Eliminar"
                        onClick={() => handleDelete(nota.notaVentaId)}
                        disabled={deletingId === nota.notaVentaId}>
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

export default NotasVenta;

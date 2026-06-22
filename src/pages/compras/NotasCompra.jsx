import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getNotasCompraAction }    from "./actions/get-notas-compra.action";
import { deleteNotaCompraAction }  from "./actions/delete-nota-compra.action";
import EstadoBadge from "../../components/EstadoBadge";
import { FaPlus, FaEye, FaMoneyBillWave, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";

const ESTADOS = ["", "PENDIENTE", "PAGADO_PARCIAL", "PAGADO", "VENCIDO"];

function NotasCompra() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

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
      const res = await getNotasCompraAction(filters);
      if (Array.isArray(res)) { setNotas(res); setTotal(res.length); }
      else { setNotas(res.data ?? []); setTotal(res.total ?? 0); }
    } catch { setNotas([]); }
    finally { setLoading(false); }
  }, [limit, offset, search, esCredito, estadoDeuda, fechaDesde, fechaHasta]);

  useEffect(() => { fetchNotas(); }, [fetchNotas]);

  const applyFilter = (setter, value) => { setter(value); setOffset(0); };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar nota de compra",
      message: "¿Eliminar esta nota de compra? Se revertirá el stock.",
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    try {
      setDeletingId(id);
      await deleteNotaCompraAction(id);
      toast.success("Nota de compra eliminada correctamente.");
      fetchNotas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar");
    } finally { setDeletingId(null); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Notas de Compra</h1>
        <Link to="/compras/notas/crear" className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Nota
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-field filter-search" style={{ flex: "1 1 200px" }}>
          <label>Buscar</label>
          <FaSearch className="filter-search-icon" />
          <input placeholder="Glosa o proveedor..." value={search}
            onChange={(e) => applyFilter(setSearch, e.target.value)} />
        </div>
        <div className="filter-field" style={{ flex: "1 1 140px" }}>
          <label>Tipo</label>
          <select value={esCredito} onChange={(e) => applyFilter(setEsCredito, e.target.value)}>
            <option value="">Todos</option>
            <option value="false">Contado</option>
            <option value="true">Crédito</option>
          </select>
        </div>
        <div className="filter-field" style={{ flex: "1 1 160px" }}>
          <label>Estado deuda</label>
          <select value={estadoDeuda} onChange={(e) => applyFilter(setEstadoDeuda, e.target.value)}>
            {ESTADOS.map((e) => <option key={e} value={e}>{e || "Todos"}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label>Fechas</label>
          <button onClick={() => setShowFechas((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
              borderRadius: 6, border: "1px solid #d1d5db", background: showFechas ? "#dbeafe" : "#fff",
              color: showFechas ? "#1d4ed8" : "#374151", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            <FaFilter /> Fechas {activeFechas > 0 && <span style={{ background: "#1d4ed8", color: "#fff",
              borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 11 }}>{activeFechas}</span>}
          </button>
        </div>
        <div className="filter-field" style={{ flex: "0 0 110px" }}>
          <label>Por página</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }}>
            <option value={10}>10</option><option value={25}>25</option><option value={100}>100</option>
          </select>
        </div>
        {showFechas && (
          <>
            <div className="filter-field" style={{ flex: "1 1 180px" }}>
              <label>Desde</label>
              <input type="date" value={fechaDesde} onChange={(e) => applyFilter(setFechaDesde, e.target.value)} />
            </div>
            <div className="filter-field" style={{ flex: "1 1 180px" }}>
              <label>Hasta</label>
              <input type="date" value={fechaHasta} onChange={(e) => applyFilter(setFechaHasta, e.target.value)} />
            </div>
            {activeFechas > 0 && (
              <button className="filters-bar-clear" onClick={() => { applyFilter(setFechaDesde, ""); setFechaHasta(""); }}>
                Limpiar
              </button>
            )}
          </>
        )}
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Proveedor</th>
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
                <tr key={nota.notaCompraId}>
                  <td style={{ whiteSpace: "nowrap" }}>{nota.fecha}</td>
                  <td>
                    <strong>{nota.proveedor?.nombre}</strong>
                    {nota.proveedor?.ciudad && <><br /><small style={{ color: "#6b7280" }}>{nota.proveedor.ciudad}</small></>}
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
                      <Link to={`/compras/notas/${nota.notaCompraId}`} className="btn-secondary" title="Ver detalle"><FaEye /></Link>
                      {nota.puedeRegistrarPago && (
                        <Link to={`/compras/notas/${nota.notaCompraId}/pago`} className="btn-primary" title="Registrar pago"><FaMoneyBillWave /></Link>
                      )}
                      <button className="btn-danger" title="Eliminar"
                        onClick={() => handleDelete(nota.notaCompraId)}
                        disabled={deletingId === nota.notaCompraId}>
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

export default NotasCompra;

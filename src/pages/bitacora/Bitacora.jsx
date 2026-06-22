import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getBitacoraAction } from "./actions/get-bitacora.action";
import { getBitacoraOpcionesAction } from "./actions/get-bitacora-opciones.action";
import { exportBitacoraAction } from "./actions/export-bitacora.action";
import { FaHistory, FaSearch, FaFileExcel, FaTimes, FaEye } from "react-icons/fa";

const ACCION_COLORS = {
  CREAR:             { bg: "#d1fae5", color: "#065f46" },
  ACTUALIZAR:        { bg: "#dbeafe", color: "#1e40af" },
  ELIMINAR:          { bg: "#fee2e2", color: "#991b1b" },
  APROBAR:           { bg: "#ede9fe", color: "#5b21b6" },
  REGISTRAR_PAGO:    { bg: "#cffafe", color: "#0e7490" },
  REGISTRAR_COBRO:   { bg: "#cffafe", color: "#0e7490" },
  AJUSTE_STOCK:      { bg: "#ffedd5", color: "#9a3412" },
  ASIGNAR_ALMACEN:   { bg: "#f3f4f6", color: "#374151" },
};

function AccionBadge({ accion }) {
  const c = ACCION_COLORS[accion] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, whiteSpace: "nowrap",
    }}>
      {accion}
    </span>
  );
}

function formatJson(value) {
  if (!value) return null;
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function DetalleModal({ registro, onClose }) {
  const anterior = formatJson(registro.valorAnterior);
  const nuevo = formatJson(registro.valorNuevo);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 760 }}>
        <div className="modal-header">
          <h3>Detalle del registro</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ marginTop: 0, fontSize: 13, color: "#6b7280" }}>
            <strong>{registro.accion}</strong> sobre <strong>{registro.tablaAfectada}</strong>
            {" "}(ID: {registro.registroId})
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Valor anterior</label>
              <pre style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6,
                padding: 10, fontSize: 12, maxHeight: 320, overflow: "auto", margin: 0 }}>
                {anterior || "—"}
              </pre>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Valor nuevo</label>
              <pre style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6,
                padding: 10, fontSize: 12, maxHeight: 320, overflow: "auto", margin: 0 }}>
                {nuevo || "—"}
              </pre>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function Bitacora() {
  const [registros, setRegistros] = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [exporting, setExporting] = useState(false);

  const [opciones, setOpciones] = useState({ modulos: [], acciones: [] });

  const [search, setSearch]         = useState("");
  const [modulo, setModulo]         = useState("");
  const [accion, setAccion]         = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [limit, setLimit]           = useState(10);
  const [offset, setOffset]         = useState(0);

  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    getBitacoraOpcionesAction()
      .then(setOpciones)
      .catch(() => setOpciones({ modulos: [], acciones: [] }));
  }, []);

  const fetchRegistros = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBitacoraAction({ limit, offset, search, modulo, accion, fechaDesde, fechaHasta });
      setRegistros(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch {
      setRegistros([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, search, modulo, accion, fechaDesde, fechaHasta]);

  useEffect(() => { fetchRegistros(); }, [fetchRegistros]);

  const applyFilter = (setter) => (value) => { setter(value); setOffset(0); };

  const limpiarFiltros = () => {
    setSearch(""); setModulo(""); setAccion(""); setFechaDesde(""); setFechaHasta(""); setOffset(0);
  };

  const hayFiltros = search || modulo || accion || fechaDesde || fechaHasta;

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportBitacoraAction({ search, modulo, accion, fechaDesde, fechaHasta });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Layout>
      {detalle && <DetalleModal registro={detalle} onClose={() => setDetalle(null)} />}

      <div className="page-header">
        <h1><FaHistory style={{ marginRight: 8 }} />Bitácora</h1>
        <button className="btn-primary" onClick={handleExport} disabled={exporting}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaFileExcel /> {exporting ? "Exportando..." : "Exportar a Excel"}
        </button>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
                color: "#9ca3af", fontSize: 13 }} />
              <input
                placeholder="Tabla o acción..."
                value={search}
                onChange={(e) => applyFilter(setSearch)(e.target.value)}
                style={{ paddingLeft: 30, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Módulo</label>
            <select value={modulo} onChange={(e) => applyFilter(setModulo)(e.target.value)} style={{ width: "100%" }}>
              <option value="">Todos</option>
              {opciones.modulos.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Acción</label>
            <select value={accion} onChange={(e) => applyFilter(setAccion)(e.target.value)} style={{ width: "100%" }}>
              <option value="">Todas</option>
              {opciones.acciones.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ flex: "0 1 150px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Desde</label>
            <input type="date" value={fechaDesde} onChange={(e) => applyFilter(setFechaDesde)(e.target.value)}
              style={{ width: "100%" }} />
          </div>
          <div style={{ flex: "0 1 150px" }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Hasta</label>
            <input type="date" value={fechaHasta} onChange={(e) => applyFilter(setFechaHasta)(e.target.value)}
              style={{ width: "100%" }} />
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
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>Tabla afectada</th>
                <th>Registro ID</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#9ca3af" }}>Cargando...</td></tr>
              ) : registros.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#9ca3af" }}>Sin resultados</td></tr>
              ) : registros.map((r) => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(r.fechaRegistro).toLocaleString("es-BO")}</td>
                  <td style={{ color: "#374151" }}>
                    {r.usuario ? `${r.usuario.name} ${r.usuario.lastName}` : "Sistema"}
                  </td>
                  <td><AccionBadge accion={r.accion} /></td>
                  <td>{r.modulo}</td>
                  <td style={{ color: "#6b7280" }}>{r.tablaAfectada}</td>
                  <td style={{ color: "#6b7280", fontSize: 12 }}>{r.registroId}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => setDetalle(r)}
                      style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <FaEye /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onOffsetChange={(newOffset) => setOffset(newOffset)}
          onLimitChange={(newLimit) => { setLimit(newLimit); setOffset(0); }}
        />
      </div>
    </Layout>
  );
}

export default Bitacora;

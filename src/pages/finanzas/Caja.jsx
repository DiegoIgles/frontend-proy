import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getMovimientosCajaAction } from "./actions/get-movimientos-caja.action";
import { createMovimientoCajaAction } from "./actions/create-movimiento-caja.action";
import { FaPlus, FaTimes, FaCheckCircle, FaSearch } from "react-icons/fa";

// ── helpers ────────────────────────────────────────────────

function getOrigen(mov) {
  if (mov.notaVenta)       return { label: "Nota de Venta",   color: "#059669" };
  if (mov.notaCompra)      return { label: "Nota de Compra",  color: "#dc2626" };
  if (mov.cuentaPorCobrar) return { label: "Cobro CxC",       color: "#1d4ed8" };
  if (mov.cuentaPorPagar)  return { label: "Pago CxP",        color: "#d97706" };
  return                          { label: "Manual",           color: "#6b7280" };
}

function TipoBadge({ tipo }) {
  const isIngreso = tipo === "INGRESO";
  return (
    <span style={{
      background: isIngreso ? "#d1fae5" : "#fee2e2",
      color:      isIngreso ? "#065f46" : "#991b1b",
      padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
    }}>
      {tipo}
    </span>
  );
}

function MetricCard({ label, value, color, sub }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </p>
      <p style={{ fontSize: 24, fontWeight: 800, margin: 0, color }}>
        Bs. {Number(value).toLocaleString("es-BO", { minimumFractionDigits: 2 })}
      </p>
      {sub && <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

// ── Modal nuevo movimiento ──────────────────────────────────

function NuevoMovimientoModal({ onClose, onCreated }) {
  const [form, setForm]         = useState({ monto: "", tipoMovimiento: "INGRESO", glosa: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createMovimientoCajaAction({
        monto:          Number(form.monto),
        tipoMovimiento: form.tipoMovimiento,
        glosa:          form.glosa || undefined,
      });
      onCreated();
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar el movimiento");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: 28, width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Nuevo Movimiento Manual</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 14, color: "#374151", marginRight: 12 }}>Tipo *</label>
            <label style={{ marginRight: 20, cursor: "pointer" }}>
              <input type="radio" name="tipo" value="INGRESO" checked={form.tipoMovimiento === "INGRESO"}
                onChange={() => setForm((p) => ({ ...p, tipoMovimiento: "INGRESO" }))}
                style={{ marginRight: 5 }} />
              <span style={{ color: "#065f46", fontWeight: 600 }}>INGRESO</span>
            </label>
            <label style={{ cursor: "pointer" }}>
              <input type="radio" name="tipo" value="EGRESO" checked={form.tipoMovimiento === "EGRESO"}
                onChange={() => setForm((p) => ({ ...p, tipoMovimiento: "EGRESO" }))}
                style={{ marginRight: 5 }} />
              <span style={{ color: "#991b1b", fontWeight: 600 }}>EGRESO</span>
            </label>
          </div>

          {/* Monto */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Monto (Bs.) *</label>
            <input
              type="number" min={0.01} step="0.01" placeholder="0.00"
              value={form.monto}
              onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))}
              required
            />
          </div>

          {/* Glosa */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Glosa <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
            <input
              type="text" placeholder="Ej: Pago servicio de limpieza"
              value={form.glosa}
              onChange={(e) => setForm((p) => ({ ...p, glosa: e.target.value }))}
            />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaTimes /> Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaCheckCircle /> {submitting ? "Guardando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Página principal ────────────────────────────────────────

function Caja() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filtros
  const [tipo,       setTipo]       = useState("");
  const [search,     setSearch]     = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Paginación
  const [limit,  setLimit]  = useState(10);
  const [offset, setOffset] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMovimientosCajaAction({
        tipoMovimiento: tipo      || undefined,
        search:         search    || undefined,
        fechaDesde:     fechaDesde || undefined,
        fechaHasta:     fechaHasta || undefined,
        limit,
        offset,
      });
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tipo, search, fechaDesde, fechaHasta, limit, offset]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset a primera página al cambiar filtros (no paginación)
  const applyFilter = (setter) => (val) => {
    setter(val);
    setOffset(0);
  };

  const resumen = data?.resumen;

  return (
    <Layout>
      {showModal && (
        <NuevoMovimientoModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); fetchData(); }}
        />
      )}

      <div className="page-header">
        <h1>Caja</h1>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <FaPlus /> Nuevo Movimiento
        </button>
      </div>

      {/* Métricas */}
      {resumen && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          <MetricCard label="Total Ingresos"  value={resumen.ingresos} color="#059669" />
          <MetricCard label="Total Egresos"   value={resumen.egresos}  color="#dc2626" />
          <MetricCard
            label="Saldo en Caja"
            value={resumen.saldo}
            color={resumen.saldo >= 0 ? "#1d4ed8" : "#dc2626"}
            sub={resumen.saldo < 0 ? "Saldo negativo" : undefined}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>

          {/* Búsqueda */}
          <div className="form-group" style={{ flex: "1 1 200px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Buscar en glosa</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
              <input
                type="text"
                placeholder="Ej: venta contado..."
                value={search}
                onChange={(e) => applyFilter(setSearch)(e.target.value)}
                style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="form-group" style={{ flex: "0 1 160px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Tipo</label>
            <select value={tipo} onChange={(e) => applyFilter(setTipo)(e.target.value)}>
              <option value="">Todos</option>
              <option value="INGRESO">INGRESO</option>
              <option value="EGRESO">EGRESO</option>
            </select>
          </div>

          {/* Fecha desde */}
          <div className="form-group" style={{ flex: "0 1 160px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => applyFilter(setFechaDesde)(e.target.value)}
            />
          </div>

          {/* Fecha hasta */}
          <div className="form-group" style={{ flex: "0 1 160px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => applyFilter(setFechaHasta)(e.target.value)}
            />
          </div>

          {/* Limpiar */}
          {(tipo || search || fechaDesde || fechaHasta) && (
            <button
              className="btn-secondary"
              onClick={() => { applyFilter(setTipo)(""); applyFilter(setSearch)(""); applyFilter(setFechaDesde)(""); applyFilter(setFechaHasta)(""); }}
              style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}
            >
              <FaTimes /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        {loading ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: 24 }}>Cargando...</p>
        ) : error ? (
          <p style={{ color: "#dc2626", textAlign: "center", padding: 24 }}>Error al cargar los movimientos.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Glosa</th>
                    <th className="col-hide-mobile">Origen</th>
                    <th className="col-hide-mobile">Usuario</th>
                    <th style={{ textAlign: "right" }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#6b7280", padding: 24 }}>
                        No se encontraron movimientos.
                      </td>
                    </tr>
                  ) : (
                    data?.data?.map((mov) => {
                      const origen = getOrigen(mov);
                      const isIngreso = mov.tipoMovimiento === "INGRESO";
                      return (
                        <tr key={mov.movimientoCajaId}>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {new Date(mov.fecha).toLocaleDateString("es-BO")}
                          </td>
                          <td><TipoBadge tipo={mov.tipoMovimiento} /></td>
                          <td style={{ maxWidth: 280 }}>{mov.glosa || "—"}</td>
                          <td className="col-hide-mobile">
                            <span style={{ fontSize: 12, fontWeight: 600, color: origen.color }}>
                              {origen.label}
                            </span>
                          </td>
                          <td className="col-hide-mobile" style={{ fontSize: 13, color: "#6b7280" }}>
                            {mov.usuario.name} {mov.usuario.lastName}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap",
                            color: isIngreso ? "#059669" : "#dc2626" }}>
                            {isIngreso ? "+" : "−"} Bs. {Number(mov.monto).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {data && (
              <Pagination
                total={data.total}
                limit={limit}
                offset={offset}
                onLimitChange={setLimit}
                onOffsetChange={setOffset}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Caja;

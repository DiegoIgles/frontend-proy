import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import EstadoBadge from "../../components/EstadoBadge";
import { getCuentasCobrarAction } from "./actions/get-cuentas-cobrar.action";
import { createCuentaCobrarAction } from "./actions/create-cuenta-cobrar.action";
import { FaPlus, FaTimes, FaCheckCircle, FaSearch, FaEye } from "react-icons/fa";

const ESTADOS = ["PENDIENTE", "PAGADO_PARCIAL", "PAGADO", "VENCIDO"];

function fmt(n) {
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

// ── Modal nueva cuenta manual ──────────────────────────────

function NuevaCuentaModal({ onClose, onCreated }) {
  const [form, setForm]         = useState({ montoTotal: "", descripcion: "", fechaVencimiento: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createCuentaCobrarAction({
        montoTotal:       Number(form.montoTotal),
        descripcion:      form.descripcion      || undefined,
        fechaVencimiento: form.fechaVencimiento || undefined,
      });
      onCreated();
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear la cuenta por cobrar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: 28, width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Nueva Cuenta por Cobrar</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Monto Total (Bs.) *</label>
            <input
              type="number" min={0.01} step="0.01" placeholder="0.00"
              value={form.montoTotal}
              onChange={set("montoTotal")}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Descripción / Concepto <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
            <input
              type="text" placeholder="Ej: Deuda cliente externo"
              value={form.descripcion}
              onChange={set("descripcion")}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Fecha de Vencimiento <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
            <input
              type="date"
              value={form.fechaVencimiento}
              onChange={set("fechaVencimiento")}
            />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaTimes /> Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaCheckCircle /> {submitting ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Página principal ────────────────────────────────────────

function CuentasCobrar() {
  const navigate = useNavigate();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [estado,           setEstado]           = useState("");
  const [search,           setSearch]           = useState("");
  const [vencimientoDesde, setVencimientoDesde] = useState("");
  const [vencimientoHasta, setVencimientoHasta] = useState("");
  const [limit,            setLimit]            = useState(10);
  const [offset,           setOffset]           = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCuentasCobrarAction({
        estado:           estado           || undefined,
        search:           search           || undefined,
        vencimientoDesde: vencimientoDesde || undefined,
        vencimientoHasta: vencimientoHasta || undefined,
        limit,
        offset,
      });
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [estado, search, vencimientoDesde, vencimientoHasta, limit, offset]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const applyFilter = (setter) => (val) => { setter(val); setOffset(0); };

  const hasFilters = estado || search || vencimientoDesde || vencimientoHasta;

  return (
    <Layout>
      {showModal && (
        <NuevaCuentaModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); fetchData(); }}
        />
      )}

      <div className="page-header">
        <h1>Cuentas por Cobrar</h1>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <FaPlus /> Nueva Cuenta
        </button>
      </div>

      {/* Resumen */}
      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 20 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Registros encontrados
            </p>
            <p style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#1d4ed8" }}>{data.total}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Pendiente
            </p>
            <p style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#d97706" }}>
              Bs. {fmt(data.totalPendiente ?? 0)}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>

          <div className="form-group" style={{ flex: "1 1 200px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Buscar en descripción</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
              <input
                type="text"
                placeholder="Ej: SolarTech..."
                value={search}
                onChange={(e) => applyFilter(setSearch)(e.target.value)}
                style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div className="form-group" style={{ flex: "0 1 180px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Estado</label>
            <select value={estado} onChange={(e) => applyFilter(setEstado)(e.target.value)}>
              <option value="">Todos</option>
              {ESTADOS.map((e) => <option key={e} value={e}>{e.replace("_", " ")}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ flex: "0 1 160px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Vence desde</label>
            <input type="date" value={vencimientoDesde} onChange={(e) => applyFilter(setVencimientoDesde)(e.target.value)} />
          </div>

          <div className="form-group" style={{ flex: "0 1 160px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Vence hasta</label>
            <input type="date" value={vencimientoHasta} onChange={(e) => applyFilter(setVencimientoHasta)(e.target.value)} />
          </div>

          {hasFilters && (
            <button
              className="btn-secondary"
              onClick={() => {
                applyFilter(setEstado)("");
                applyFilter(setSearch)("");
                applyFilter(setVencimientoDesde)("");
                applyFilter(setVencimientoHasta)("");
              }}
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
          <p style={{ color: "#dc2626", textAlign: "center", padding: 24 }}>Error al cargar las cuentas por cobrar.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Descripción</th>
                    <th className="col-hide-mobile">Vencimiento</th>
                    <th style={{ textAlign: "right" }}>Monto Total</th>
                    <th style={{ textAlign: "right" }}>Cobrado</th>
                    <th style={{ textAlign: "right" }}>Saldo</th>
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", color: "#6b7280", padding: 24 }}>
                        No se encontraron cuentas por cobrar.
                      </td>
                    </tr>
                  ) : (
                    data?.data?.map((cxc) => (
                      <tr key={cxc.cuentaPorCobrarId}>
                        <td><EstadoBadge estado={cxc.estado} /></td>
                        <td style={{ maxWidth: 260 }}>{cxc.descripcion || "—"}</td>
                        <td className="col-hide-mobile" style={{ whiteSpace: "nowrap", color: cxc.estado === "VENCIDO" ? "#dc2626" : undefined }}>
                          {cxc.fechaVencimiento
                            ? new Date(cxc.fechaVencimiento + "T00:00:00").toLocaleDateString("es-BO")
                            : "—"}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>
                          Bs. {fmt(cxc.montoTotal)}
                        </td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap", color: "#059669" }}>
                          Bs. {fmt(cxc.montoCobrado)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap",
                          color: Number(cxc.saldo) > 0 ? "#d97706" : "#059669" }}>
                          Bs. {fmt(cxc.saldo)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn-secondary"
                            onClick={() => navigate(`/finanzas/cuentas-por-cobrar/${cxc.cuentaPorCobrarId}`)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, padding: "5px 12px" }}
                          >
                            <FaEye /> Ver
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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

export default CuentasCobrar;

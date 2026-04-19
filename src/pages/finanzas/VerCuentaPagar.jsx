import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import EstadoBadge from "../../components/EstadoBadge";
import { getCuentaPagarAction } from "./actions/get-cuenta-pagar.action";
import { registrarPagoCxpAction } from "./actions/registrar-pago-cxp.action";
import { FaArrowLeft, FaTimes, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

function fmt(n) {
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

function InfoRow({ label, value, valueStyle }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#6b7280", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 14, ...valueStyle }}>{value}</span>
    </div>
  );
}

// ── Modal registrar pago ───────────────────────────────────

function RegistrarPagoModal({ saldo, cuentaId, onClose, onRegistrado }) {
  const [form, setForm]         = useState({ monto: "", glosa: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const monto = Number(form.monto);
    if (monto <= 0) { alert("El monto debe ser mayor a 0"); return; }
    if (monto > Number(saldo)) { alert(`El monto no puede superar el saldo pendiente (Bs. ${fmt(saldo)})`); return; }
    try {
      setSubmitting(true);
      await registrarPagoCxpAction(cuentaId, {
        monto,
        glosa: form.glosa || undefined,
      });
      onRegistrado();
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar el pago");
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Registrar Pago</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>
            <FaTimes />
          </button>
        </div>

        <p style={{ margin: "0 0 18px", fontSize: 14, color: "#6b7280" }}>
          Saldo pendiente: <strong style={{ color: "#dc2626" }}>Bs. {fmt(saldo)}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Monto a pagar (Bs.) *</label>
            <input
              type="number" min={0.01} max={Number(saldo)} step="0.01" placeholder="0.00"
              value={form.monto}
              onChange={set("monto")}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Glosa <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
            <input
              type="text" placeholder="Ej: Pago parcial cuota 1"
              value={form.glosa}
              onChange={set("glosa")}
            />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaTimes /> Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaCheckCircle /> {submitting ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Página detalle ─────────────────────────────────────────

function VerCuentaPagar() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [cxp, setCxp]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCuentaPagarAction(id);
      setCxp(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const canPagar = cxp && (cxp.estado === "PENDIENTE" || cxp.estado === "PAGADO_PARCIAL");

  return (
    <Layout>
      {showModal && cxp && (
        <RegistrarPagoModal
          saldo={cxp.saldo}
          cuentaId={cxp.cuentaPorPagarId}
          onClose={() => setShowModal(false)}
          onRegistrado={() => { setShowModal(false); fetchData(); }}
        />
      )}

      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn-secondary"
            onClick={() => navigate("/finanzas/cuentas-por-pagar")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FaArrowLeft /> Volver
          </button>
          <h1 style={{ margin: 0 }}>Detalle Cuenta por Pagar</h1>
        </div>
        {canPagar && (
          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FaMoneyBillWave /> Registrar Pago
          </button>
        )}
      </div>

      {loading && <p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Cargando...</p>}
      {error   && <p style={{ color: "#dc2626", textAlign: "center", padding: 40 }}>Error al cargar la cuenta.</p>}

      {!loading && cxp && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Datos generales */}
          <div className="card">
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Información General</h3>
            <InfoRow label="Estado" value={<EstadoBadge estado={cxp.estado} />} />
            <InfoRow label="Descripción" value={cxp.descripcion || "—"} />
            <InfoRow
              label="Vencimiento"
              value={cxp.fechaVencimiento
                ? new Date(cxp.fechaVencimiento + "T00:00:00").toLocaleDateString("es-BO")
                : "Sin vencimiento"}
              valueStyle={cxp.estado === "VENCIDO" ? { color: "#dc2626" } : {}}
            />
            <InfoRow label="Monto Total"   value={`Bs. ${fmt(cxp.montoTotal)}`} />
            <InfoRow label="Monto Pagado"  value={`Bs. ${fmt(cxp.montoPagado)}`} valueStyle={{ color: "#059669" }} />
            <InfoRow
              label="Saldo Pendiente"
              value={`Bs. ${fmt(cxp.saldo)}`}
              valueStyle={{ color: Number(cxp.saldo) > 0 ? "#dc2626" : "#059669", fontSize: 16 }}
            />

            {/* Barra de progreso */}
            {(() => {
              const pct = Math.min(100, (Number(cxp.montoPagado) / Number(cxp.montoTotal)) * 100);
              return (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                    <span>Progreso de pago</span>
                    <span>{pct.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`,
                      background: pct >= 100 ? "#059669" : "#dc2626",
                      borderRadius: 4, transition: "width 0.4s",
                    }} />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Nota de compra asociada */}
          <div className="card">
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Nota de Compra Asociada</h3>
            {cxp.notaCompra ? (
              <>
                <InfoRow label="ID Nota" value={cxp.notaCompra.notaCompraId.slice(0, 8) + "…"} />
                <InfoRow label="Fecha" value={new Date(cxp.notaCompra.fecha + "T00:00:00").toLocaleDateString("es-BO")} />
                <InfoRow label="Monto Total" value={`Bs. ${fmt(cxp.notaCompra.montoTotal)}`} />
                <InfoRow label="Glosa" value={cxp.notaCompra.glosa || "—"} />
                <div style={{ marginTop: 14 }}>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/compras/notas/${cxp.notaCompra.notaCompraId}`)}
                    style={{ fontSize: 13, padding: "6px 14px" }}
                  >
                    Ver Nota de Compra
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: "#6b7280", fontSize: 14, marginTop: 8 }}>Cuenta creada manualmente (sin nota de compra).</p>
            )}
          </div>

          {/* Historial de pagos */}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>
              Historial de Pagos
              <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: "#6b7280" }}>
                ({cxp.movimientosCaja?.length ?? 0} movimiento{cxp.movimientosCaja?.length !== 1 ? "s" : ""})
              </span>
            </h3>
            {!cxp.movimientosCaja || cxp.movimientosCaja.length === 0 ? (
              <p style={{ color: "#6b7280", fontSize: 14 }}>Sin pagos registrados aún.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Glosa</th>
                      <th className="col-hide-mobile">Registrado por</th>
                      <th style={{ textAlign: "right" }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cxp.movimientosCaja.map((mov) => (
                      <tr key={mov.movimientoCajaId}>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {new Date(mov.fecha).toLocaleDateString("es-BO")}
                        </td>
                        <td style={{ maxWidth: 260 }}>{mov.glosa || "—"}</td>
                        <td className="col-hide-mobile" style={{ fontSize: 13, color: "#6b7280" }}>
                          {mov.usuario.name} {mov.usuario.lastName}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#dc2626", whiteSpace: "nowrap" }}>
                          − Bs. {fmt(mov.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </Layout>
  );
}

export default VerCuentaPagar;

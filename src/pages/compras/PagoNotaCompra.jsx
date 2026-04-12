import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useSaldoCompra } from "./hooks/useSaldoCompra";
import { registrarPagoCompraAction } from "./actions/registrar-pago-compra.action";
import { FaArrowLeft, FaTimes, FaCheckCircle } from "react-icons/fa";

const ESTADO_STYLES = {
  PAGADO:         { background: "#d1fae5", color: "#065f46", label: "Pagado" },
  PAGADO_PARCIAL: { background: "#dbeafe", color: "#1e40af", label: "Pagado Parcial" },
  PENDIENTE:      { background: "#fef3c7", color: "#92400e", label: "Pendiente" },
  VENCIDO:        { background: "#fee2e2", color: "#991b1b", label: "Vencido" },
};

function EstadoBadge({ estado }) {
  const style = ESTADO_STYLES[estado] ?? { background: "#e5e7eb", color: "#374151", label: estado };
  return (
    <span style={{ background: style.background, color: style.color, padding: "3px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      {style.label}
    </span>
  );
}

function MetricaCard({ label, value, color }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 16px" }}>
      <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, margin: "4px 0 0", color: color ?? "#111827" }}>
        {value}
      </p>
    </div>
  );
}

function PagoNotaCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saldo, loading, error } = useSaldoCompra(id);

  const [monto, setMonto]     = useState("");
  const [glosa, setGlosa]     = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error al cargar el saldo de la compra.</p></Layout>;
  if (!saldo)  return null;

  const montoNum = Number(monto) || 0;
  const saldoTrasAbono = saldo.saldoPendiente - montoNum;
  const montoInvalido  = montoNum <= 0 || montoNum > saldo.saldoPendiente;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (montoInvalido) return;

    try {
      setSubmitting(true);
      await registrarPagoCompraAction(id, {
        monto: montoNum,
        glosa: glosa || undefined,
      });
      navigate(`/compras/notas/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar el pago");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Encabezado */}
      <div className="page-header">
        <div>
          <Link to={`/compras/notas/${id}`} style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver a la Nota de Compra
          </Link>
          <h1 style={{ marginTop: 4 }}>Registrar Pago</h1>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>Proveedor: {saldo.proveedor}</span>
        </div>
        <EstadoBadge estado={saldo.estado} />
      </div>

      {/* Métricas de la deuda */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        <MetricaCard
          label="Monto Total Compra"
          value={`Bs. ${Number(saldo.montoTotalCompra).toFixed(2)}`}
        />
        <MetricaCard
          label="Total Deuda"
          value={`Bs. ${Number(saldo.montoTotalDeuda).toFixed(2)}`}
        />
        <MetricaCard
          label="Ya Pagado"
          value={`Bs. ${Number(saldo.montoPagado).toFixed(2)}`}
          color="#059669"
        />
        <MetricaCard
          label="Saldo Pendiente"
          value={`Bs. ${Number(saldo.saldoPendiente).toFixed(2)}`}
          color="#dc2626"
        />
      </div>

      {saldo.fechaVencimiento && (
        <div style={{ marginBottom: 16, padding: "8px 14px", background: "#fffbeb", borderLeft: "4px solid #f59e0b", borderRadius: 4, fontSize: 13 }}>
          Fecha de vencimiento: <strong>{new Date(saldo.fechaVencimiento).toLocaleDateString("es-BO")}</strong>
        </div>
      )}

      {/* Formulario de pago */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Nuevo Abono</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

            <div className="form-group">
              <label>Monto a Abonar (Bs.) *</label>
              <input
                type="number"
                min={0.01}
                step="0.01"
                max={saldo.saldoPendiente}
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
              {montoNum > saldo.saldoPendiente && (
                <small style={{ color: "#dc2626" }}>
                  El monto no puede superar el saldo pendiente (Bs. {Number(saldo.saldoPendiente).toFixed(2)})
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Glosa <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
              <input
                type="text"
                placeholder="Ej: Abono cuota 2"
                value={glosa}
                onChange={(e) => setGlosa(e.target.value)}
              />
            </div>
          </div>

          {/* Preview saldo resultante */}
          {montoNum > 0 && !montoInvalido && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20, padding: 14, background: "#f0fdf4", borderRadius: 8 }}>
              <div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Saldo actual</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#dc2626", margin: "4px 0 0" }}>
                  Bs. {Number(saldo.saldoPendiente).toFixed(2)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Este abono</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#059669", margin: "4px 0 0" }}>
                  − Bs. {montoNum.toFixed(2)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Saldo tras abono</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: saldoTrasAbono === 0 ? "#059669" : "#d97706", margin: "4px 0 0" }}>
                  Bs. {saldoTrasAbono.toFixed(2)}
                  {saldoTrasAbono === 0 && <span style={{ marginLeft: 6 }}>✓ Pagado</span>}
                </p>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Link to={`/compras/notas/${id}`} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaTimes /> Cancelar
            </Link>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || montoInvalido}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <FaCheckCircle /> {submitting ? "Registrando..." : "Confirmar Pago"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default PagoNotaCompra;

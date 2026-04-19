import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getProyectoAction } from "./actions/get-proyecto.action";
import { aprobarProyectoAction } from "./actions/aprobar-proyecto.action";
import { deleteProyectoAction } from "./actions/delete-proyecto.action";
import { addSeguimientoAction } from "./actions/add-seguimiento.action";
import { deleteSeguimientoAction } from "./actions/delete-seguimiento.action";
import { getAnalisisAction } from "./actions/get-analisis.action";
import {
  FaArrowLeft, FaTimes, FaCheckCircle, FaPlus, FaTrash, FaFilePdf,
  FaExclamationTriangle, FaChartBar, FaListAlt, FaBoxOpen,
} from "react-icons/fa";

// ── helpers ──────────────────────────────────────────────────

function fmt(n) {
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-BO");
}

const TIPO_COLORS = {
  MATERIAL:   { bg: "#dbeafe", color: "#1e40af" },
  MANO_OBRA:  { bg: "#d1fae5", color: "#065f46" },
  TRANSPORTE: { bg: "#fef3c7", color: "#92400e" },
  GASTO_EXTRA:{ bg: "#fee2e2", color: "#991b1b" },
};

function TipoBadge({ tipo }) {
  const s = TIPO_COLORS[tipo] ?? { bg: "#e5e7eb", color: "#374151" };
  const label = tipo?.replace("_", " ") ?? tipo;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function InfoRow({ label, value, valueStyle }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#6b7280", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 14, textAlign: "right", maxWidth: "60%", ...valueStyle }}>{value}</span>
    </div>
  );
}

function Tab({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
        fontWeight: active ? 700 : 400, fontSize: 14,
        color: active ? "#1d4ed8" : "#6b7280",
        borderBottom: active ? "3px solid #1d4ed8" : "3px solid transparent",
        display: "flex", alignItems: "center", gap: 6,
        transition: "color 0.15s",
      }}
    >
      {icon} {label}
    </button>
  );
}

// ── Modal agregar seguimiento ─────────────────────────────────

const TIPOS_SEG = ["MATERIAL", "MANO_OBRA", "GASTO_EXTRA", "TRANSPORTE"];

function AgregarSeguimientoModal({ proyectoId, onClose, onAgregado }) {
  const [form, setForm]     = useState({ tipo: "MATERIAL", fechaGasto: "", monto: "", descripcion: "" });
  const [submitting, setSub] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSub(true);
      await addSeguimientoAction(proyectoId, {
        tipo:        form.tipo,
        fechaGasto:  form.fechaGasto,
        monto:       Number(form.monto),
        descripcion: form.descripcion || undefined,
      });
      onAgregado();
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar el gasto");
    } finally {
      setSub(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: 28, width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Registrar Gasto de Seguimiento</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Tipo de Gasto *</label>
            <select value={form.tipo} onChange={set("tipo")}>
              {TIPOS_SEG.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Fecha del Gasto *</label>
            <input type="date" value={form.fechaGasto} onChange={set("fechaGasto")} required />
          </div>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Monto (Bs.) *</label>
            <input type="number" min={0.01} step="0.01" placeholder="0.00" value={form.monto} onChange={set("monto")} required />
          </div>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Descripción <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
            <input type="text" placeholder="Ej: Compra de cables y conectores" value={form.descripcion} onChange={set("descripcion")} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}><FaTimes /> Cancelar</button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaCheckCircle /> {submitting ? "Guardando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Tab: Información del proyecto ─────────────────────────────

function TabInfo({ p }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div className="card">
        <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Datos Generales</h3>
        <InfoRow label="Nombre" value={p.nombre} />
        <InfoRow label="Descripción" value={p.descripcion || "—"} />
        <InfoRow label="Responsable" value={`${p.usuario.name} ${p.usuario.lastName}`} />
        <InfoRow label="Fecha inicio" value={fmtDate(p.fechaInicio)} />
        <InfoRow label="Fecha final" value={fmtDate(p.fechaFinal)} />
      </div>
      <div className="card">
        <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Presupuesto Estimado</h3>
        <InfoRow label="Mano de Obra" value={p.manoObra ? `Bs. ${fmt(p.manoObra)}` : "—"} />
        <InfoRow label="Costos Extra" value={p.costoExtra ? `Bs. ${fmt(p.costoExtra)}` : "—"} />
        <InfoRow label="Monto Final Cotizado" value={p.montoFinal ? `Bs. ${fmt(p.montoFinal)}` : "—"} valueStyle={{ fontSize: 16, color: "#111827" }} />
      </div>

      {/* Tabla de productos */}
      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>
          Productos del Proyecto
          <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: "#6b7280" }}>
            ({p.proyectoProductoAlmacenes?.length ?? 0} ítem{p.proyectoProductoAlmacenes?.length !== 1 ? "s" : ""})
          </span>
        </h3>
        {!p.proyectoProductoAlmacenes?.length ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>Sin productos asignados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th className="col-hide-mobile">Almacén</th>
                  <th style={{ textAlign: "right" }}>Stock</th>
                  <th style={{ textAlign: "right" }}>Cant.</th>
                  <th style={{ textAlign: "right" }} className="col-hide-mobile">Precio Unit.</th>
                  <th style={{ textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {p.proyectoProductoAlmacenes.map((item) => {
                  const prod = item.productoAlmacen.producto;
                  const stockBajo = item.productoAlmacen.stock < item.cantidad;
                  return (
                    <tr key={item.proyectoProductoAlmacenId}>
                      <td style={{ fontFamily: "monospace", fontSize: 13 }}>{prod.codigo}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{prod.nombre}</span>
                        <br />
                        <span style={{ fontSize: 12, color: "#6b7280" }}>{prod.sku}</span>
                      </td>
                      <td className="col-hide-mobile" style={{ fontSize: 13, color: "#6b7280" }}>
                        {item.productoAlmacen.almacen.nombre}
                      </td>
                      <td style={{ textAlign: "right", color: stockBajo ? "#dc2626" : "#059669", fontWeight: 600 }}>
                        {item.productoAlmacen.stock}
                        {stockBajo && <FaExclamationTriangle style={{ marginLeft: 5, fontSize: 11 }} />}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{item.cantidad}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }} className="col-hide-mobile">
                        {Number(item.precioUnitario) > 0 ? `Bs. ${fmt(item.precioUnitario)}` : "—"}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {Number(item.subtotal) > 0 ? `Bs. ${fmt(item.subtotal)}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {(() => {
                const totalSubtotal = p.proyectoProductoAlmacenes.reduce((s, i) => s + Number(i.subtotal ?? 0), 0);
                return totalSubtotal > 0 ? (
                  <tfoot>
                    <tr style={{ borderTop: "2px solid #e5e7eb" }}>
                      <td colSpan={5} style={{ textAlign: "right", fontWeight: 600, color: "#6b7280", fontSize: 13, paddingTop: 8 }}>
                        Total productos:
                      </td>
                      <td colSpan={2} style={{ textAlign: "right", fontWeight: 800, fontSize: 15, paddingTop: 8, whiteSpace: "nowrap" }}>
                        Bs. {fmt(totalSubtotal)}
                      </td>
                    </tr>
                  </tfoot>
                ) : null;
              })()}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Seguimiento ──────────────────────────────────────────

function TabSeguimiento({ p, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting]   = useState(null);

  const handleDelete = async (segId) => {
    if (!window.confirm("¿Eliminar este registro de seguimiento?")) return;
    try {
      setDeleting(segId);
      await deleteSeguimientoAction(p.proyectoId, segId);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  };

  const totalGastado = (p.seguimientos ?? []).reduce((s, seg) => s + Number(seg.monto), 0);

  return (
    <>
      {showModal && (
        <AgregarSeguimientoModal
          proyectoId={p.proyectoId}
          onClose={() => setShowModal(false)}
          onAgregado={() => { setShowModal(false); onRefresh(); }}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Total gastado registrado: </span>
          <strong style={{ color: "#dc2626", fontSize: 16 }}>Bs. {fmt(totalGastado)}</strong>
          {p.montoFinal && (
            <span style={{ marginLeft: 8, fontSize: 12, color: "#9ca3af" }}>
              de Bs. {fmt(p.montoFinal)} presupuestados
            </span>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <FaPlus /> Registrar Gasto
        </button>
      </div>

      <div className="card">
        {!p.seguimientos?.length ? (
          <p style={{ color: "#6b7280", fontSize: 14, textAlign: "center", padding: 24 }}>Sin registros de seguimiento.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha Gasto</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th style={{ textAlign: "right" }}>Monto</th>
                  <th style={{ textAlign: "center" }}></th>
                </tr>
              </thead>
              <tbody>
                {[...p.seguimientos]
                  .sort((a, b) => a.fechaGasto.localeCompare(b.fechaGasto))
                  .map((seg) => (
                    <tr key={seg.seguimientoId}>
                      <td style={{ whiteSpace: "nowrap" }}>{fmtDate(seg.fechaGasto)}</td>
                      <td><TipoBadge tipo={seg.tipo} /></td>
                      <td style={{ maxWidth: 260 }}>{seg.descripcion || "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#dc2626", whiteSpace: "nowrap" }}>
                        Bs. {fmt(seg.monto)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(seg.seguimientoId)}
                          disabled={deleting === seg.seguimientoId}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 14, padding: "4px 8px" }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ── Tab: Análisis Presupuestal ────────────────────────────────

function TabAnalisis({ proyectoId }) {
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    getAnalisisAction(proyectoId)
      .then(setAnalisis)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [proyectoId]);

  if (loading) return <p style={{ color: "#6b7280", padding: 24, textAlign: "center" }}>Cargando análisis...</p>;
  if (error)   return <p style={{ color: "#dc2626", padding: 24, textAlign: "center" }}>Error al cargar el análisis.</p>;
  if (!analisis) return null;

  const { presupuesto, ejecucion, gastosPorDia, alertas } = analisis;
  const pct = Math.min(100, ejecucion.porcentajeEjecutado);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Alerta de proyección */}
      {ejecucion.alertaProyeccion && (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <FaExclamationTriangle style={{ color: "#d97706", fontSize: 18, flexShrink: 0 }} />
          <span style={{ color: "#92400e", fontWeight: 600 }}>
            Alerta: la proyección al cierre supera el presupuesto. Gasto proyectado: <strong>Bs. {fmt(ejecucion.proyeccionAlFinal)}</strong>
          </span>
        </div>
      )}

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Días Totales",       value: presupuesto.diasTotales,       color: "#374151" },
          { label: "Días Transcurridos", value: presupuesto.diasTranscurridos, color: "#1d4ed8" },
          { label: "Días Restantes",     value: presupuesto.diasRestantes,      color: presupuesto.diasRestantes <= 0 ? "#dc2626" : "#059669" },
          { label: "Días con Alerta",    value: alertas.totalDiasConAlerta,    color: alertas.totalDiasConAlerta > 0 ? "#dc2626" : "#059669" },
        ].map((m) => (
          <div key={m.label} className="card" style={{ textAlign: "center", padding: "14px 10px" }}>
            <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, margin: 0, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Ejecución */}
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Ejecución Presupuestal</h3>
          <InfoRow label="Presupuesto total" value={`Bs. ${fmt(presupuesto.montoFinal)}`} />
          <InfoRow label="Límite diario" value={`Bs. ${fmt(presupuesto.limiteDiario)}`} />
          <InfoRow label="Gastado total" value={`Bs. ${fmt(ejecucion.gastadoTotal)}`} valueStyle={{ color: "#dc2626" }} />
          <InfoRow label="Saldo disponible" value={`Bs. ${fmt(ejecucion.saldoDisponible)}`} valueStyle={{ color: "#059669" }} />
          <InfoRow label="Proyección al cierre" value={`Bs. ${fmt(ejecucion.proyeccionAlFinal)}`}
            valueStyle={{ color: ejecucion.alertaProyeccion ? "#dc2626" : "#059669" }} />

          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              <span>Porcentaje ejecutado</span>
              <span>{pct.toFixed(1)}%</span>
            </div>
            <div style={{ height: 10, background: "#e5e7eb", borderRadius: 5, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : "#1d4ed8",
                borderRadius: 5, transition: "width 0.4s",
              }} />
            </div>
          </div>
        </div>

        {/* Gasto por tipo */}
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Gasto por Tipo</h3>
          {Object.keys(ejecucion.gastoPorTipo).length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>Sin gastos registrados.</p>
          ) : (
            Object.entries(ejecucion.gastoPorTipo).map(([tipo, monto]) => {
              const pctTipo = ejecucion.gastadoTotal > 0
                ? (monto / ejecucion.gastadoTotal * 100).toFixed(1)
                : 0;
              const s = TIPO_COLORS[tipo] ?? { bg: "#e5e7eb", color: "#374151" };
              return (
                <div key={tipo} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <TipoBadge tipo={tipo} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Bs. {fmt(monto)} <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: 12 }}>({pctTipo}%)</span></span>
                  </div>
                  <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pctTipo}%`, background: s.color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Gastos por día */}
      <div className="card">
        <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>
          Gastos por Día
          <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: "#6b7280" }}>
            Límite diario: Bs. {fmt(presupuesto.limiteDiario)}
          </span>
        </h3>
        {gastosPorDia.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>Sin gastos registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th style={{ textAlign: "right" }}>Total Día</th>
                  <th style={{ textAlign: "right" }}>Límite</th>
                  <th style={{ textAlign: "right" }}>Exceso</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {gastosPorDia.map((dia) => (
                  <tr key={dia.fecha} style={{ background: dia.superaLimite ? "#fff5f5" : undefined }}>
                    <td style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                      {fmtDate(dia.fecha)}
                      {dia.superaLimite && <FaExclamationTriangle style={{ marginLeft: 6, color: "#dc2626", fontSize: 11 }} />}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: dia.superaLimite ? "#dc2626" : "#059669", whiteSpace: "nowrap" }}>
                      Bs. {fmt(dia.total)}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap", color: "#6b7280" }}>
                      Bs. {fmt(dia.limiteDiario)}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap", color: dia.exceso > 0 ? "#dc2626" : "#9ca3af", fontWeight: dia.exceso > 0 ? 700 : 400 }}>
                      {dia.exceso > 0 ? `+ Bs. ${fmt(dia.exceso)}` : "—"}
                    </td>
                    <td style={{ fontSize: 12, color: "#6b7280", maxWidth: 300 }}>
                      {dia.detalles.map((d) => d.descripcion).join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen alertas */}
      {alertas.totalDiasConAlerta > 0 && (
        <div className="card" style={{ borderLeft: "4px solid #dc2626" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#dc2626" }}>
            <FaExclamationTriangle style={{ marginRight: 8 }} />
            Días que superaron el límite ({alertas.totalDiasConAlerta})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alertas.dias.map((alerta) => (
              <div key={alerta.fecha} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontWeight: 600 }}>{fmtDate(alerta.fecha)}</span>
                <span>Gastado: <strong style={{ color: "#dc2626" }}>Bs. {fmt(alerta.gastado)}</strong></span>
                <span>Límite: <strong>Bs. {fmt(alerta.limite)}</strong></span>
                <span>Exceso: <strong style={{ color: "#dc2626" }}>+ Bs. {fmt(alerta.exceso)}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────

function VerProyecto() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [p, setP]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tab, setTab]         = useState("info");
  const [aprobando, setAprobando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setP(await getProyectoAction(id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAprobar = async () => {
    if (!window.confirm("¿Aprobar esta cotización y convertirla en Proyecto?")) return;
    try {
      setAprobando(true);
      await aprobarProyectoAction(id);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error al aprobar el proyecto");
    } finally {
      setAprobando(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    try {
      setEliminando(true);
      await deleteProyectoAction(id);
      navigate("/proyectos");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
      setEliminando(false);
    }
  };

  const esCotizacion = p?.estado === "COTIZACION";

  return (
    <Layout>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn-secondary" onClick={() => navigate("/proyectos")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaArrowLeft /> Volver
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>{p?.nombre ?? "Cargando..."}</h1>
            {p && (
              <span style={{
                background: esCotizacion ? "#fef3c7" : "#dbeafe",
                color: esCotizacion ? "#92400e" : "#1e40af",
                padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700,
              }}>
                {esCotizacion ? "Cotización" : "Proyecto en Ejecución"}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {/* Imprimir cotización — disponible siempre */}
          {p && (
            <button
              className="btn-secondary"
              onClick={() => navigate(`/proyectos/${id}/cotizacion`)}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <FaFilePdf /> Imprimir Cotización
            </button>
          )}
          {p && esCotizacion && (
            <button
              className="btn-primary"
              onClick={handleAprobar}
              disabled={aprobando}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#059669" }}
            >
              <FaCheckCircle /> {aprobando ? "Aprobando..." : "Aprobar → Proyecto"}
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={handleEliminar}
            disabled={eliminando}
            style={{ display: "flex", alignItems: "center", gap: 6, color: "#dc2626", borderColor: "#dc2626" }}
          >
            <FaTrash /> {eliminando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {loading && <p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Cargando...</p>}
      {error   && <p style={{ color: "#dc2626", textAlign: "center", padding: 40 }}>Error al cargar el proyecto.</p>}

      {!loading && p && (
        <>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: 20, overflowX: "auto" }}>
            <Tab label="Información" icon={<FaBoxOpen />} active={tab === "info"} onClick={() => setTab("info")} />
            <Tab label={`Seguimiento (${p.seguimientos?.length ?? 0})`} icon={<FaListAlt />} active={tab === "seguimiento"} onClick={() => setTab("seguimiento")} />
            {p.estado === "PROYECTO" && (
              <Tab label="Análisis Presupuestal" icon={<FaChartBar />} active={tab === "analisis"} onClick={() => setTab("analisis")} />
            )}
          </div>

          {tab === "info"        && <TabInfo p={p} />}
          {tab === "seguimiento" && <TabSeguimiento p={p} onRefresh={fetchData} />}
          {tab === "analisis"    && p.estado === "PROYECTO" && <TabAnalisis proyectoId={id} />}
        </>
      )}
    </Layout>
  );
}

export default VerProyecto;

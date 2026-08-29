import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCotizacionManualAction } from "./actions/get-cotizacion.action";
import { FaPrint, FaArrowLeft, FaBolt } from "react-icons/fa";
import { Pagina1Portada } from "./diseños_print/Pagina1Portada";
import { Pagina2QuienesSomos } from "./diseños_print/Pagina2QuienesSomos";
import { Pagina4Diseno } from "./diseños_print/Pagina4Diseno";
import { Pagina5Cotizacion } from "./diseños_print/Pagina5Cotizacion";
import { Pagina6Roi } from "./diseños_print/Pagina6Roi";
import { Pagina7Proteccion } from "./diseños_print/Pagina7Proteccion";

// ── Helpers de formato ────────────────────────────────────────

function fmt(n, dec = 2) {
  return Number(n ?? 0).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtEntero(n) {
  return Number(n ?? 0).toLocaleString("es-BO", { maximumFractionDigits: 0 });
}

function fmtFechaCorta(d) {
  if (!d) return "—";
  const fecha = new Date(String(d).slice(0, 10) + "T00:00:00");
  return fecha.toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ── Logo corporativo ──────────────────────────────────────────

function Logo({ light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: light ? "#22c55e" : "linear-gradient(135deg, #16a34a, #22c55e)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 22,
      }}>
        <FaBolt />
      </div>
      <div>
        <p style={{
          margin: 0, fontWeight: 800, fontSize: 20, letterSpacing: 1.5,
          color: light ? "#fff" : "#0f2a4a", lineHeight: 1
        }}>
          ENERLOGIC
        </p>
        <p style={{
          margin: 0, fontSize: 9, letterSpacing: 3, fontWeight: 600,
          color: light ? "#86efac" : "#16a34a"
        }}>
          ENERGÍA INTELIGENTE
        </p>
      </div>
    </div>
  );
}

// ── Gráfico de barras ROI (HTML/CSS puro) ─────────────────────

function GraficoRoi({ barras }) {
  const datos = (barras ?? []).map((b, i) => ({
    etiqueta: b.etiqueta || `Año ${i + 1}`,
    valor: Number(b.valor ?? 0),
  }));

  if (datos.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#9ca3af", fontSize: 13, border: "1px dashed #d1d5db", borderRadius: 10
      }}>
        Sin datos de barras ROI cargados
      </div>
    );
  }

  const valores = datos.map((d) => d.valor);
  const max = Math.max(...valores, 0);
  const min = Math.min(...valores, 0);
  const rango = max - min || 1;
  const ceroDesdeAbajo = ((0 - min) / rango) * 100;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Área del gráfico */}
      <div style={{
        position: "relative", flex: 1, display: "flex", gap: "1.5%",
        padding: "26px 6px 0", minHeight: 0
      }}>
        {/* Línea del eje cero */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          bottom: `${ceroDesdeAbajo}%`, background: "#0f2a4a", opacity: 0.5
        }} />

        {datos.map((d, i) => {
          const altoPct = (Math.abs(d.valor) / rango) * 100;
          const positivo = d.valor >= 0;
          const barStyle = positivo
            ? { bottom: `${ceroDesdeAbajo}%`, height: `${altoPct}%` }
            : { bottom: `${ceroDesdeAbajo - altoPct}%`, height: `${altoPct}%` };
          const labelStyle = positivo
            ? { bottom: `calc(${ceroDesdeAbajo + altoPct}% + 4px)` }
            : { bottom: `calc(${ceroDesdeAbajo - altoPct}% - 4px)`, transform: "translateY(100%)" };

          return (
            <div key={i} style={{ position: "relative", flex: 1, height: "100%" }}>
              {/* Valor al extremo de la barra */}
              <span style={{
                position: "absolute", left: "50%", transform: `translateX(-50%) ${positivo ? "" : "translateY(100%)"}`,
                ...labelStyle, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap",
                color: positivo ? "#166534" : "#b45309",
              }}>
                {fmtEntero(d.valor)}
              </span>

              {/* Barra */}
              <div style={{
                position: "absolute", left: "12%", right: "12%",
                borderRadius: "6px 6px 0 0",
                background: positivo
                  ? "linear-gradient(180deg, #22c55e, #16a34a)"
                  : "linear-gradient(180deg, #f59e0b, #d97706)",
                ...barStyle,
              }} />
            </div>
          );
        })}
      </div>

      {/* Etiquetas debajo de cada barra */}
      <div style={{
        display: "flex", gap: "1.5%", padding: "6px 6px 0",
        borderTop: "1px solid #e5e7eb"
      }}>
        {datos.map((d, i) => (
          <div key={i} style={{
            flex: 1, textAlign: "center", fontSize: 10,
            fontWeight: 700, color: "#374151"
          }}>
            {d.etiqueta}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Documento imprimible (10 Páginas) ─────────────────────────

function CotizacionManualPrint() {
  const { id } = useParams();
  const [cot, setCot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCotizacionManualAction(id)
      .then((data) => { setCot(data); setLoading(false); })
      .catch((err) => { setError(err); setLoading(false); });
  }, [id]);

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando cotización...</p>;
  if (error) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar la cotización.</p>;
  if (!cot) return null;

  const AZUL = "#0f2a4a";
  const VERDE = "#16a34a";
  const NARANJA = "#f59e0b";

  return (
    <>
      {/* Barra de acciones — solo pantalla */}
      <div className="acciones no-print">
        <button onClick={() => window.print()} className="btn-print">
          <FaPrint style={{ marginRight: 6 }} /> Imprimir / Guardar PDF
        </button>
        <Link to="/cotizaciones-manuales" className="btn-volver">
          <FaArrowLeft style={{ marginRight: 6 }} /> Volver
        </Link>
      </div>

      <div className="documento">

        {/* ═══════════ PÁGINA 1: PORTADA (CLONADA DINÁMICA) ═══════════ */}
        <Pagina1Portada cot={cot} />

        {/* ═══════════ PÁGINA 2: ¿QUIÉNES SOMOS? (CLONADA) ═══════════ */}
        <Pagina2QuienesSomos />

        {/* ═══════════ PÁGINA 3: INTRODUCCIÓN (ESTÁTICA) ═══════════ */}
        <section className="pagina pagina-estatica">
          <img src="/cotizacion/cotizacion3_A4.png" alt="Portada 3" />
        </section>

        {/* ═══════════ PÁGINA 4: DISEÑO DEL SISTEMA (DINÁMICA - NUEVA PORTADA 4) ═══════════ */}
        <Pagina4Diseno cot={cot} />

        {/* ═══════════ PÁGINA 5: COTIZACIÓN Y TOTALES (DINÁMICA) ═══════════ */}
        <Pagina5Cotizacion cot={cot} />

        {/* ═══════════ PÁGINA 6: RETORNO DE INVERSIÓN (DINÁMICA) ═══════════ */}
        <Pagina6Roi cot={cot} />

        {/* ═══════════ PÁGINA 7: ALCANCE Y PROTECCIÓN DE INVERSIÓN (DINÁMICA) ═══════════ */}
        <Pagina7Proteccion cot={cot} />

        {/* ═══════════ PÁGINA 8: GARANTÍAS Y PROTECCIÓN (ESTÁTICA) ═══════════ */}
        <section className="pagina pagina-estatica">
          <img src="/cotizacion/cotizacion8_A4.png" alt="Garantías 8" />
        </section>

        {/* ═══════════ PÁGINA 9: TÉRMINOS Y CONDICIONES (ESTÁTICA) ═══════════ */}
        <section className="pagina pagina-estatica">
          <img src="/cotizacion/cotizacion9_A4.png" alt="Términos 9" />
        </section>

        {/* ═══════════ PÁGINA 10: CIERRE (ESTÁTICA) ═══════════ */}
        <section className="pagina pagina-estatica">
          <img src="/cotizacion/cotizacion10_A4.png" alt="Cierre 10" />
        </section>

      </div>

      {/* ── Estilos de impresión ── */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #e5e7eb; font-family: 'Segoe UI', Arial, sans-serif; }

        .acciones {
          display: flex; gap: 10px; padding: 14px 24px;
          background: #fff; border-bottom: 1px solid #e5e7eb;
          position: sticky; top: 0; z-index: 10;
        }
        .btn-print {
          display: flex; align-items: center;
          padding: 8px 20px; background: #0f2a4a; color: #fff;
          border: none; border-radius: 6px; font-size: 14px;
          font-weight: 600; cursor: pointer;
        }
        .btn-volver {
          display: flex; align-items: center;
          padding: 8px 20px; background: #f3f4f6; color: #374151;
          border: 1px solid #d1d5db; border-radius: 6px;
          font-size: 14px; text-decoration: none; font-weight: 500;
        }

        .documento { padding: 24px 0; }

        .pagina {
          position: relative;
          width: 279.4mm;
          height: 215.9mm;
          margin: 0 auto 24px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
          page-break-after: always;
          break-after: page;
        }
        .pagina-estatica {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }
        .pagina-estatica img {
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .pagina:last-child { page-break-after: auto; break-after: auto; margin-bottom: 0; }

        @page { size: letter landscape; margin: 0; }

        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .documento { padding: 0; }
          .pagina {
            margin: 0;
            box-shadow: none;
            width: 279.4mm;
            height: 215.9mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}

export default CotizacionManualPrint;

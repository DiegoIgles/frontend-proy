import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCotizacionManualAction } from "./actions/get-cotizacion.action";
import { FaPrint, FaArrowLeft, FaCheckCircle, FaLeaf, FaSolarPanel, FaTools, FaShieldAlt, FaBolt } from "react-icons/fa";

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
        <p style={{ margin: 0, fontWeight: 800, fontSize: 20, letterSpacing: 1.5,
          color: light ? "#fff" : "#0f2a4a", lineHeight: 1 }}>
          ENERLOGIC
        </p>
        <p style={{ margin: 0, fontSize: 9, letterSpacing: 3, fontWeight: 600,
          color: light ? "#86efac" : "#16a34a" }}>
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
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#9ca3af", fontSize: 13, border: "1px dashed #d1d5db", borderRadius: 10 }}>
        Sin datos de barras ROI cargados
      </div>
    );
  }

  const valores = datos.map((d) => d.valor);
  const max = Math.max(...valores, 0);
  const min = Math.min(...valores, 0);
  const rango = max - min || 1;
  const ceroDesdeAbajo = ((0 - min) / rango) * 100; // % desde abajo donde cruza el eje cero

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Área del gráfico */}
      <div style={{ position: "relative", flex: 1, display: "flex", gap: "1.5%",
        padding: "26px 6px 0", minHeight: 0 }}>
        {/* Línea del eje cero */}
        <div style={{ position: "absolute", left: 0, right: 0, height: 2,
          bottom: `${ceroDesdeAbajo}%`, background: "#0f2a4a", opacity: 0.5 }} />

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
      <div style={{ display: "flex", gap: "1.5%", padding: "6px 6px 0",
        borderTop: "1px solid #e5e7eb" }}>
        {datos.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10,
            fontWeight: 700, color: "#374151" }}>
            {d.etiqueta}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Documento imprimible ──────────────────────────────────────

function CotizacionManualPrint() {
  const { id } = useParams();
  const [cot, setCot]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getCotizacionManualAction(id)
      .then((data) => { setCot(data); setLoading(false); })
      .catch((err)  => { setError(err); setLoading(false); });
  }, [id]);

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando cotización...</p>;
  if (error)   return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar la cotización.</p>;
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

        {/* ═══════════ PÁGINA 1: PORTADA ═══════════ */}
        <section className="pagina" style={{ background: `linear-gradient(160deg, ${AZUL} 0%, #16395f 55%, #1a4a2e 100%)`, color: "#fff" }}>
          <div style={{ padding: "18mm 18mm 0" }}>
            <Logo light />
          </div>

          <div style={{ padding: "26mm 18mm 0", textAlign: "right" }}>
            <h1 style={{ margin: 0, fontSize: 44, fontWeight: 800, letterSpacing: 2, lineHeight: 1.1 }}>
              PROPUESTA<br />COMERCIAL
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 700, letterSpacing: 5, color: "#22c55e" }}>
              ESTUDIO ENERGÉTICO
            </p>
            <div style={{ margin: "14px 0 0 auto", width: 90, height: 5, background: NARANJA, borderRadius: 3 }} />
          </div>

          <div style={{ padding: "34mm 18mm 0" }}>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: 2, color: "#86efac", fontWeight: 700 }}>
              PREPARADO PARA
            </p>
            <p style={{ margin: "6px 0 4px", fontSize: 32, fontWeight: 800 }}>{cot.nombreCliente}</p>
            <p style={{ margin: 0, fontSize: 15, color: "#cbd5e1" }}>
              {cot.lugar || "Santa Cruz de la Sierra"} | {fmtFechaCorta(cot.fecha)}
            </p>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
            background: VERDE, padding: "10mm 18mm",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>PROPUESTA N°</span>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3 }}>| {cot.nroPropuesta} |</span>
          </div>
        </section>

        {/* ═══════════ PÁGINA 2: DISEÑO DEL SISTEMA ═══════════ */}
        <section className="pagina">
          <div style={{ padding: "14mm 16mm 0" }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: VERDE }}>INGENIERÍA DESARROLLADA PARA ESTE PROYECTO</p>
            <h2 style={{ margin: "4px 0 0", fontSize: 30, fontWeight: 800, color: AZUL }}>DISEÑO DEL SISTEMA</h2>
            <div style={{ width: 70, height: 4, background: NARANJA, borderRadius: 2, marginTop: 8 }} />
          </div>

          {/* Grid de imágenes */}
          <div style={{
            padding: "10mm 16mm 0",
            display: "grid",
            gridTemplateColumns: cot.imagenesProyecto?.length > 1 ? "1fr 1fr" : "1fr",
            gap: "6mm",
            height: "150mm",
          }}>
            {(cot.imagenesProyecto ?? []).length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px dashed #d1d5db", borderRadius: 12, color: "#9ca3af", fontSize: 14 }}>
                Sin imágenes del proyecto
              </div>
            ) : (
              cot.imagenesProyecto.map((url, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", background: "#f3f4f6",
                  border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={url} alt={`Diseño ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              ))
            )}
          </div>

          {/* KPIs */}
          <div style={{ padding: "10mm 16mm 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5mm" }}>
            {[
              { label: "POTENCIA INSTALADA", valor: `${fmt(cot.potenciaInstalada)} kWp` },
              { label: "CANTIDAD DE PANELES", valor: `${fmtEntero(cot.cantidadPaneles)} und.` },
              { label: "SUPERFICIE REQUERIDA", valor: `${fmt(cot.superficieRequerida, 1)} m²` },
              { label: "PRODUCCIÓN ANUAL EST.", valor: `${fmtEntero(cot.produccionAnualEstimada)} kWh` },
            ].map((kpi) => (
              <div key={kpi.label} style={{ background: AZUL, borderRadius: 10, padding: "6mm 4mm",
                textAlign: "center", borderBottom: `4px solid ${VERDE}` }}>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#fff" }}>{kpi.valor}</p>
                <p style={{ margin: "4px 0 0", fontSize: 8.5, fontWeight: 700, letterSpacing: 1, color: "#86efac" }}>
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ PÁGINA 3: COTIZACIÓN Y TOTALES ═══════════ */}
        <section className="pagina">
          {/* Cabecera */}
          <div style={{ padding: "12mm 16mm 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: AZUL }}>COTIZACIÓN</h2>
              <div style={{ width: 60, height: 4, background: NARANJA, borderRadius: 2, marginTop: 6 }} />
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: "#374151" }}>
              <p style={{ margin: 0, fontWeight: 800, color: AZUL }}>Página 3</p>
              <p style={{ margin: "4px 0 0" }}>{cot.lugar || "Santa Cruz de la Sierra"}, {fmtFechaCorta(cot.fecha)}</p>
              <p style={{ margin: "2px 0 0" }}>Validez de la oferta: <strong>{cot.validezOfertaDias} días</strong></p>
              <p style={{ margin: "2px 0 0" }}>Realizado por: <strong>{cot.realizadoPor}</strong></p>
            </div>
          </div>

          {/* Cuadro de productos (imagen) */}
          <div style={{ padding: "8mm 16mm 0" }}>
            {cot.imagenCuadroProductos ? (
              <img src={cot.imagenCuadroProductos} alt="Cuadro de productos"
                style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb" }} />
            ) : (
              <div style={{ height: "90mm", display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px dashed #d1d5db", borderRadius: 10, color: "#9ca3af", fontSize: 14 }}>
                Sin imagen del cuadro de productos
              </div>
            )}
          </div>

          {/* Totales */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "6mm 16mm 0" }}>
            <div style={{ minWidth: "70mm", background: "#f8fafc", border: "1px solid #e5e7eb",
              borderRadius: 10, padding: "5mm 6mm" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                <span style={{ color: "#6b7280" }}>SUB TOTAL</span>
                <span style={{ fontWeight: 700 }}>{fmt(cot.precioSubTotal)} BS</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0",
                borderBottom: "1px solid #e5e7eb" }}>
                <span style={{ color: "#6b7280" }}>IVA (13%)</span>
                <span style={{ fontWeight: 700 }}>{fmt(cot.iva)} BS</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 0" }}>
                <span style={{ fontWeight: 800, color: AZUL, fontSize: 15 }}>TOTAL</span>
                <span style={{ fontWeight: 800, color: VERDE, fontSize: 19 }}>{fmt(cot.total)} BS</span>
              </div>
            </div>
          </div>

          {/* Pie: condiciones */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
            background: "#f8fafc", borderTop: `3px solid ${VERDE}`, padding: "6mm 16mm",
            display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: AZUL }}>CONDICIONES COMERCIALES</p>
              <p style={{ margin: "3px 0 0", color: "#374151" }}>Tiempo de montaje: <strong>{cot.tiempoMontaje}</strong></p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, color: "#6b7280" }}>Realizado por</p>
              <p style={{ margin: "3px 0 0", fontWeight: 800, color: AZUL }}>{cot.realizadoPor}</p>
            </div>
          </div>
        </section>

        {/* ═══════════ PÁGINA 4: GARANTÍAS (ESTÁTICA) ═══════════ */}
        <section className="pagina">
          <div style={{ padding: "16mm 16mm 0", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: AZUL }}>GARANTÍAS</h2>
            <div style={{ width: 70, height: 4, background: NARANJA, borderRadius: 2, margin: "8px auto 0" }} />
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 10 }}>
              Respaldo total en cada componente de tu sistema fotovoltaico
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12mm", padding: "18mm 16mm 0" }}>
            {[
              { icon: <FaSolarPanel />, titulo: "PANELES", anios: "10 años", desc: "Garantía del fabricante sobre módulos fotovoltaicos" },
              { icon: <FaBolt />,       titulo: "INVERSOR", anios: "5 años", desc: "Cobertura sobre el equipo de conversión de energía" },
              { icon: <FaTools />,      titulo: "INSTALACIÓN", anios: "2 años", desc: "Garantía sobre el montaje y obra realizada" },
            ].map((g) => (
              <div key={g.titulo} style={{ textAlign: "center", width: "46mm" }}>
                <div style={{
                  width: "34mm", height: "34mm", margin: "0 auto", borderRadius: "50%",
                  border: `4px solid ${VERDE}`, background: "#f0fdf4",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <FaCheckCircle style={{ color: VERDE, fontSize: 26 }} />
                  <span style={{ color: AZUL, fontSize: 26, marginTop: 6 }}>{g.icon}</span>
                </div>
                <p style={{ margin: "8px 0 0", fontWeight: 800, fontSize: 15, color: AZUL, letterSpacing: 1 }}>{g.titulo}</p>
                <p style={{ margin: "2px 0 0", fontWeight: 800, fontSize: 20, color: VERDE }}>{g.anios}</p>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: "#6b7280" }}>{g.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ margin: "20mm 16mm 0", background: "#f0fdf4", border: `1px solid ${VERDE}`,
            borderRadius: 10, padding: "6mm 8mm", display: "flex", alignItems: "center", gap: 12 }}>
            <FaShieldAlt style={{ color: VERDE, fontSize: 28, flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12.5, color: "#166534" }}>
              Todas nuestras instalaciones cuentan con certificación de calidad y soporte post-venta
              para garantizar el óptimo funcionamiento de tu sistema durante toda su vida útil.
            </p>
          </div>
        </section>

        {/* ═══════════ PÁGINA 5: PROTECCIÓN DE INVERSIÓN ═══════════ */}
        <section className="pagina">
          <div style={{ padding: "12mm 16mm 0" }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: AZUL }}>PROTECCIÓN DE INVERSIÓN</h2>
            <div style={{ width: 60, height: 4, background: NARANJA, borderRadius: 2, marginTop: 6 }} />
          </div>

          {/* Imagen superior — coloca el archivo en public/cotizacion/tecnico-paneles.jpg */}
          <div style={{ padding: "8mm 16mm 0" }}>
            <div style={{ height: "78mm", borderRadius: 14, overflow: "hidden", position: "relative",
              background: `linear-gradient(135deg, ${AZUL}, #1a4a2e)` }}>
              <img src="/cotizacion/tecnico-paneles.jpg" alt="Técnico instalando paneles"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
                justifyContent: "center", color: "rgba(255,255,255,0.85)", zIndex: -1 }}>
                <FaSolarPanel style={{ fontSize: 60 }} />
              </div>
            </div>
          </div>

          {/* Tabla comparativa */}
          <div style={{ padding: "8mm 16mm 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6mm" }}>
            {[
              {
                nombre: "PROTECCIÓN ESENCIAL PLUS", color: AZUL,
                items: ["Inspección visual anual", "Limpieza de paneles (1 vez/año)", "Monitoreo remoto básico", "Informe anual de rendimiento"],
              },
              {
                nombre: "PROTECCIÓN EXTENDIDA PREMIUM", color: VERDE,
                items: ["Inspección técnica semestral", "Limpieza de paneles (2 veces/año)", "Monitoreo remoto 24/7", "Atención prioritaria de fallas", "Informe semestral de rendimiento"],
              },
            ].map((plan) => (
              <div key={plan.nombre} style={{ border: `2px solid ${plan.color}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ background: plan.color, color: "#fff", padding: "4mm", textAlign: "center",
                  fontWeight: 800, fontSize: 12.5, letterSpacing: 0.5 }}>
                  {plan.nombre}
                </div>
                <div style={{ padding: "4mm 5mm" }}>
                  {plan.items.map((item) => (
                    <p key={item} style={{ margin: "5px 0", fontSize: 12, color: "#374151",
                      display: "flex", alignItems: "center", gap: 8 }}>
                      <FaCheckCircle style={{ color: VERDE, flexShrink: 0 }} /> {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Montos */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "5mm", padding: "8mm 16mm 0" }}>
            <div style={{ background: AZUL, borderRadius: 10, padding: "5mm 8mm", textAlign: "center", minWidth: "52mm" }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#86efac" }}>INVERSIÓN ANUAL</p>
              <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: "#fff" }}>{fmt(cot.inversionAnualUsd, 0)} $us</p>
            </div>
            <div style={{ background: VERDE, borderRadius: 10, padding: "5mm 8mm", textAlign: "center", minWidth: "64mm" }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#dcfce7" }}>
                VALOR DE CONTRATACIÓN TOTAL (5 AÑOS)
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: "#fff" }}>{fmt(cot.valorContratacionTotalUsd, 0)} $us</p>
            </div>
          </div>
        </section>

        {/* ═══════════ PÁGINA 6: RETORNO DE INVERSIÓN ═══════════ */}
        <section className="pagina">
          <div style={{ padding: "12mm 16mm 0" }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: AZUL }}>RETORNO DE INVERSIÓN</h2>
            <div style={{ width: 60, height: 4, background: NARANJA, borderRadius: 2, marginTop: 6 }} />
          </div>

          {/* Métricas clave */}
          <div style={{ padding: "8mm 16mm 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5mm" }}>
            {[
              { label: "AHORRO ANUAL", valor: `Bs. ${fmtEntero(cot.ahorroAnualBs)}`, bg: AZUL },
              { label: "RETORNO DE INVERSIÓN (ROI)", valor: `${fmt(cot.retornoInversionAnios, 1)} AÑOS`, bg: VERDE },
              { label: "AHORRO TOTAL A 30 AÑOS", valor: `USD ${fmtEntero(cot.ahorroTotal30AniosUsd)}`, bg: AZUL },
            ].map((m) => (
              <div key={m.label} style={{ background: m.bg, borderRadius: 10, padding: "6mm 4mm",
                textAlign: "center", borderBottom: `4px solid ${NARANJA}` }}>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#e2e8f0" }}>{m.label}</p>
                <p style={{ margin: "5px 0 0", fontSize: 19, fontWeight: 800, color: "#fff" }}>{m.valor}</p>
              </div>
            ))}
          </div>

          {/* Gráfico de barras */}
          <div style={{ padding: "6mm 16mm 0", height: "140mm", display: "flex", flexDirection: "column" }}>
            <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: AZUL }}>
              Flujo acumulado del proyecto
            </p>
            <GraficoRoi barras={cot.roiBarras} />
            {cot.imagenRoi && (
              <p style={{ margin: "6px 0 0", fontSize: 10, color: "#9ca3af", textAlign: "right" }}>
                Valores calculados en base al estudio ROI adjunto.
              </p>
            )}
          </div>
        </section>

        {/* ═══════════ PÁGINA 7: ALCANCE DEL PROYECTO (ESTÁTICA) ═══════════ */}
        <section className="pagina">
          <div style={{ padding: "12mm 16mm 0" }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: AZUL }}>ALCANCE DEL PROYECTO</h2>
            <div style={{ width: 60, height: 4, background: NARANJA, borderRadius: 2, marginTop: 6 }} />
          </div>

          <div style={{ padding: "14mm 22mm 0", display: "flex", flexDirection: "column", gap: "8mm" }}>
            {[
              { n: 1, titulo: "Ingeniería", desc: "Estudio técnico, diseño del sistema y dimensionamiento según tu consumo energético." },
              { n: 2, titulo: "Suministro", desc: "Provisionamiento de paneles, inversores y materiales de primera calidad certificada." },
              { n: 3, titulo: "Instalación", desc: "Montaje profesional del sistema por personal técnico calificado, con estándares de seguridad." },
              { n: 4, titulo: "Generación Distribuida", desc: "Trámites y conexión a la red eléctrica para inyección y compensación de energía." },
              { n: 5, titulo: "Acompañamiento", desc: "Monitoreo, mantenimiento y soporte post-instalación durante la vida del sistema." },
            ].map((paso) => (
              <div key={paso.n} style={{ display: "flex", alignItems: "center", gap: "8mm" }}>
                <div style={{
                  width: "16mm", height: "16mm", borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${VERDE}, #22c55e)`, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 800,
                }}>
                  {paso.n}
                </div>
                <div style={{ borderLeft: `3px solid ${VERDE}`, paddingLeft: "6mm" }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: AZUL }}>{paso.titulo}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#6b7280" }}>{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ PÁGINA 8: CIERRE (ESTÁTICA) ═══════════ */}
        <section className="pagina" style={{ background: `linear-gradient(160deg, ${AZUL} 0%, #16395f 60%, #1a4a2e 100%)`, color: "#fff" }}>
          <div style={{ padding: "18mm 18mm 0" }}>
            <Logo light />
          </div>

          <div style={{ padding: "52mm 24mm 0", textAlign: "center" }}>
            <FaLeaf style={{ fontSize: 44, color: "#22c55e" }} />
            <h1 style={{ margin: "10mm 0 0", fontSize: 36, fontWeight: 800, letterSpacing: 2, lineHeight: 1.25 }}>
              GRACIAS POR CONFIAR<br />EN ENERLOGIC
            </h1>
            <div style={{ width: 90, height: 5, background: NARANJA, borderRadius: 3, margin: "10mm auto 0" }} />
            <p style={{ marginTop: "10mm", fontSize: 14, color: "#cbd5e1" }}>
              Comprometidos con tu ahorro energético y el cuidado del medio ambiente.
            </p>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(0,0,0,0.25)", padding: "8mm 18mm", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: 1, color: "#22c55e" }}>
              www.enerlogic.com.bo
            </p>
          </div>
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
          width: 210mm;
          height: 297mm;
          margin: 0 auto 24px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
          page-break-after: always;
          break-after: page;
        }
        .pagina:last-child { page-break-after: auto; break-after: auto; margin-bottom: 0; }

        @page { size: A4; margin: 0; }

        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .documento { padding: 0; }
          .pagina {
            margin: 0;
            box-shadow: none;
            width: 210mm;
            height: 297mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}

export default CotizacionManualPrint;

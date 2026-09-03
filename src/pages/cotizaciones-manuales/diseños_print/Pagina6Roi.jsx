import React from "react";
import { Logo } from "./shared/Logo";
import { IconValidez } from "./shared/IconosCotizacion";
import {
  IconAhorroAnual, IconRetorno, IconAhorroTotal, IconResumen, IconCheck,
  ICONOS_BENEFICIO, IconWhatsapp, IconWeb, IconUbicacion,
} from "./shared/IconosRoi";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 6 — "RETORNO DE INVERSIÓN (ROI)"
// ---------------------------------------------------------------------------
// Reescribe el armado anterior, que dibujaba el gráfico con divs de alto
// proporcional dentro de una hoja A4 vertical. Base de medición: el arte
// apaisado aprobado (1536×1024), con las mismas dos escalas de las páginas 2 a
// 5 —KX para medidas y cuerpos, KY para posiciones verticales—.
//
// LO QUE ESTA PÁGINA HACE DISTINTO: el gráfico va A ESCALA. Ver GRÁFICO.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

// --- Rejilla ----------------------------------------------------------------
const MARGEN = { x0: 33, x1: 1504 };
const ANCHO = MARGEN.x1 - MARGEN.x0;
const RADIO = 10;

const HEADER = { logo: { x: 33, y: 22, h: 80 }, regla: { x: 392, y0: 22, y1: 102 }, textoX: 431, tituloCap: 30, bajadaCap: 92 };

// Los tres indicadores. En el arte miden 494/459/488 px de ancho: se igualan,
// que la diferencia no se ve y así los tres grupos caen en la misma posición
// dentro de su tarjeta.
const KPI = {
  y0: 141, y1: 348, gap: 14,
  iconoCx: 88, iconoD: 82, iconoCy: 198,   // cx relativo a la tarjeta; cy absoluto
  ejeTexto: 285,               // eje donde el arte centra rótulo, cifra y regla
  rotuloCap: 164, valorCap: 208, reglaY: 270, reglaW: 308, pieCap: 286, piePaso: 28,
};

const CUADRO = { y0: 352, y1: 789, barra: { y0: 361, y1: 418 }, iconoCx: 77, iconoD: 46, tituloX: 115, tituloCap: 380 };

// --- GRÁFICO ----------------------------------------------------------------
// Las barras del arte NO están a escala: medidas contra su propio eje dan 6.86
// px por mil en la primera barra y 2.60 en la última, cada una con su factor.
// Un gráfico que no está a escala miente sobre lo único que tiene que mostrar,
// así que acá se dibujan proporcionales de verdad.
//
// El tope del eje se redondea "hacia arriba y bonito" para que las cinco marcas
// caigan en números redondos. Con las cifras del propio arte el cálculo devuelve
// 500.000, que es exactamente el tope que el arte dibuja: la escala del eje sí
// estaba bien, lo que estaba mal eran las barras.
const GRAFICO = {
  x0: 213, x1: 1414,           // 0 y tope del eje
  filas: [474, 509, 545, 582, 620, 656],
  alto: 18,
  etiquetaX: 60, iconoD: 30, etiquetaTextoX: 100,
  cabeceraCap: 437, cabeceraAnios: 105, cabeceraValores: 245,
  ejeY: 683, ticksCap: 702, tituloEjeCap: 717,
  gapValor: 14,
  marcas: 5,
};

function topeBonito(max) {
  if (!(max > 0)) return 5;
  const crudo = max / GRAFICO.marcas;
  const magnitud = 10 ** Math.floor(Math.log10(crudo));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * magnitud).find((p) => p >= crudo - 1e-9);
  return paso * GRAFICO.marcas;
}

const NOTA = { x0: 262, x1: 1300, y0: 730, y1: 782, iconoD: 34 };
// El rótulo se sube por encima del borde de la tarjeta (811). Medido sobre la
// mancha del arte daba 806, o sea montado sobre el filete: ahí el arte lo tapa
// con un chip del color del papel, pero acá la tarjeta es blanca sobre fondo
// blanco y el chip se leía como un recuadro pegado. Sale más limpio despejarlo.
const BENEFICIOS = { y0: 811, y1: 940, tituloCap: 790, iconoD: 56, iconoDx: 14, textoDx: 86, tituloCapDy: 24, descCapDy: 66, descPaso: 26 };
const PIE = { y0: 949, logoX: 46, logoH: 46 };

// --- Cuerpos ----------------------------------------------------------------
const CUERPO = {
  titulo: 7.6,        // "RETORNO DE INVERSIÓN (ROI)" ≙ los 109 mm del arte
  bajada: 4.2,
  kpiRotulo: 3.2,
  kpiValor: 8.4,
  kpiPie: 3.5,
  cuadroTitulo: 4.6,
  grafCabecera: 2.9,
  grafEtiqueta: 3.0,
  grafValor: 3.4,
  grafTick: 2.7,
  nota: 3.4,
  benTitulo: 4.0,
  benRotulo: 3.0,
  benDesc: 2.7,
  pieTexto: 3.4,
};

// --- Contenido --------------------------------------------------------------
export const CONTENIDO_ROI = {
  titulo: "RETORNO DE INVERSIÓN (ROI)",
  // La bajada lleva "ahorro garantizado" subrayado, como en el arte.
  bajada: [{ t: "Tu inversión hoy, " }, { t: "ahorro garantizado", sub: true }, { t: " mañana." }],
  kpis: [
    { icono: IconAhorroAnual, color: COLORS.navy, rotulo: "AHORRO ANUAL", campo: "ahorroAnualBs", prefijo: "BS. ", pie: ["Ahorro promedio en", "tu factura eléctrica"] },
    { icono: IconRetorno, color: COLORS.naranja, rotulo: "RETORNO DE INVERSIÓN (ROI)", campo: "retornoInversionAnios", sufijo: " AÑOS", dec: 0, pie: ["Tu inversión se recupera en", null] },
    { icono: IconAhorroTotal, color: COLORS.verde900, rotulo: "AHORRO TOTAL A 30 AÑOS", campo: "ahorroTotal30AniosUsd", prefijo: "BS ", pie: ["Ahorro acumulado", "estimado"] },
  ],
  tituloCuadro: "AHORRO ACUMULADO PROYECTADO (RESUMEN)",
  cabeceraAnios: "AÑOS",
  cabeceraValores: "AHORRO ACUMULADO (BS)",
  tituloEje: "BOLIVIANOS (BS)",
  moneda: "BS ",
  tituloBeneficios: "BENEFICIOS QUE GENERAN VALOR REAL",
  beneficios: [
    // El rótulo va del color del disco de su icono, no todo en navy: así lo
    // pide el arte y es lo que ata cada beneficio con su símbolo.
    { icono: "rayo", color: COLORS.verde900, rotulo: ["AHORRO REAL", "TODOS LOS MESES"], desc: ["Reduce tu factura eléctrica", "desde el primer día."] },
    { icono: "hoja", color: COLORS.navy, rotulo: ["ENERGÍA LIMPIA", "Y SOSTENIBLE"], desc: ["Generas tu propia energía", "y cuidas el medio ambiente."] },
    { icono: "proteccion", color: COLORS.naranja, rotulo: ["PROTECCIÓN ANTE", "AUMENTOS"], desc: ["Tu inversión te protege de", "futuras alzas en el precio de la energía."] },
    { icono: "casa", color: COLORS.navy, rotulo: ["MAYOR VALOR", "PARA TU PROPIEDAD"], desc: ["Aumenta el valor de tu inmueble", "o negocio con energía solar."] },
  ],
  contacto: [
    { icono: IconWhatsapp, texto: "+591 781 110 78" },
    { icono: IconWeb, texto: "www.enerlogic.com.bo" },
    { icono: IconUbicacion, texto: "Santa Cruz, Bolivia" },
  ],
};

const fmt = (n, dec = 0) =>
  n === null || n === undefined || n === "" ? "—" : Number(n).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// --- Piezas -----------------------------------------------------------------

function TarjetaKpi({ dato, cot, x0, ancho }) {
  const Icono = dato.icono;
  const eje = x0 + KPI.ejeTexto;
  const centrado = (cx) => ({
    position: "absolute", left: 0, width: "100%", margin: 0, textAlign: "center",
    transform: `translateX(${(X(cx) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`, whiteSpace: "nowrap",
  });

  return (
    <>
      <div style={{ position: "absolute", left: mmX(x0), top: mmY(KPI.y0), width: mmX(ancho), height: mmY(KPI.y1 - KPI.y0), background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(RADIO) }} />

      <Icono style={{ position: "absolute", left: mmX(x0 + KPI.iconoCx - KPI.iconoD / 2), top: `${(Y(KPI.iconoCy) - X(KPI.iconoD) / 2).toFixed(2)}mm`, width: mmX(KPI.iconoD), height: mmX(KPI.iconoD) }} />

      <p style={{ ...centrado(eje), top: capTop(KPI.rotuloCap, CUERPO.kpiRotulo), fontSize: `${CUERPO.kpiRotulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.06mm", color: dato.color }}>
        {dato.rotulo}
      </p>

      <p style={{ ...centrado(eje), top: capTop(KPI.valorCap, CUERPO.kpiValor), fontSize: `${CUERPO.kpiValor}mm`, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.08mm", color: dato.color }}>
        {dato.prefijo ?? ""}{fmt(cot?.[dato.campo], dato.dec ?? 0)}{dato.sufijo ?? ""}
      </p>

      <div style={{ position: "absolute", left: mmX(eje - KPI.reglaW / 2), top: mmY(KPI.reglaY), width: mmX(KPI.reglaW), height: "0.5mm", background: dato.color }} />

      {dato.pie.map((linea, i) => (
        <p key={i} style={{ ...centrado(eje), top: capTop(KPI.pieCap + i * KPI.piePaso, CUERPO.kpiPie), fontSize: `${CUERPO.kpiPie}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.tinta }}>
          {/* El segundo renglón del retorno repite la cifra, así que se arma acá
              y no en el contenido: cambia con el dato. */}
          {linea ?? `${fmt(cot?.retornoInversionAnios, 0)} años.`}
        </p>
      ))}
    </>
  );
}

function Grafico({ c, cot }) {
  const barras = (cot?.roiBarras ?? []).slice(0, GRAFICO.filas.length);
  const valores = barras.map((b) => Number(b?.valor) || 0);
  const tope = topeBonito(Math.max(0, ...valores));
  const ancho = GRAFICO.x1 - GRAFICO.x0;
  const px = (v) => (v / tope) * ancho;

  return (
    <>
      <p style={{ position: "absolute", left: mmX(GRAFICO.cabeceraAnios), top: capTop(GRAFICO.cabeceraCap, CUERPO.grafCabecera), margin: 0, fontSize: `${CUERPO.grafCabecera}mm`, fontWeight: 700, color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.cabeceraAnios}
      </p>
      <p style={{ position: "absolute", left: mmX(GRAFICO.cabeceraValores), top: capTop(GRAFICO.cabeceraCap, CUERPO.grafCabecera), margin: 0, fontSize: `${CUERPO.grafCabecera}mm`, fontWeight: 700, color: COLORS.verde900, whiteSpace: "nowrap" }}>
        {c.cabeceraValores}
      </p>

      {/* Retícula: una línea punteada por marca, sin la del cero, que ya la
          dibuja el eje. */}
      {Array.from({ length: GRAFICO.marcas }, (_, i) => {
        const x = GRAFICO.x0 + (ancho * (i + 1)) / GRAFICO.marcas;
        return <div key={i} style={{ position: "absolute", left: mmX(x), top: mmY(GRAFICO.filas[0] - 12), width: "0.2mm", height: mmY(GRAFICO.ejeY - GRAFICO.filas[0] + 12), background: COLORS.regla }} />;
      })}

      {/* Eje vertical y base */}
      <div style={{ position: "absolute", left: mmX(GRAFICO.x0 - 2), top: mmY(GRAFICO.filas[0] - 12), width: "0.6mm", height: mmY(GRAFICO.ejeY - GRAFICO.filas[0] + 12), background: COLORS.navy }} />
      <div style={{ position: "absolute", left: mmX(GRAFICO.x0 - 2), top: mmY(GRAFICO.ejeY), width: mmX(ancho + 4), height: "0.4mm", background: COLORS.navy }} />

      {GRAFICO.filas.map((y, i) => {
        const b = barras[i];
        const valor = valores[i] ?? 0;
        const ultima = i === GRAFICO.filas.length - 1;
        const largo = px(valor);
        return (
          <React.Fragment key={i}>
            <IconValidez style={{ position: "absolute", left: mmX(GRAFICO.etiquetaX), top: `${(Y(y + GRAFICO.alto / 2) - X(GRAFICO.iconoD) / 2).toFixed(2)}mm`, width: mmX(GRAFICO.iconoD), height: mmX(GRAFICO.iconoD) }} />
            <p style={{ position: "absolute", left: mmX(GRAFICO.etiquetaTextoX), top: `${(Y(y + GRAFICO.alto / 2) - CUERPO.grafEtiqueta * 0.5).toFixed(2)}mm`, margin: 0, fontSize: `${CUERPO.grafEtiqueta}mm`, fontWeight: 700, lineHeight: 1, color: COLORS.navy, whiteSpace: "nowrap", textTransform: "uppercase" }}>
              {b?.etiqueta ?? `${(i + 1) * 5} años`}
            </p>

            <div style={{ position: "absolute", left: mmX(GRAFICO.x0), top: mmY(y), width: mmX(largo), height: mmY(GRAFICO.alto), background: ultima ? COLORS.verde900 : COLORS.verde, borderRadius: "0 0.5mm 0.5mm 0" }} />

            <p style={{ position: "absolute", left: mmX(GRAFICO.x0 + largo + GRAFICO.gapValor), top: `${(Y(y + GRAFICO.alto / 2) - CUERPO.grafValor * 0.5).toFixed(2)}mm`, margin: 0, fontSize: `${CUERPO.grafValor}mm`, fontWeight: 700, lineHeight: 1, color: ultima ? COLORS.verde900 : COLORS.verde, whiteSpace: "nowrap" }}>
              {c.moneda}{fmt(valor)}
            </p>
          </React.Fragment>
        );
      })}

      {Array.from({ length: GRAFICO.marcas + 1 }, (_, i) => {
        const x = GRAFICO.x0 + (ancho * i) / GRAFICO.marcas;
        return (
          <p key={i} style={{ position: "absolute", left: 0, width: "100%", top: capTop(GRAFICO.ticksCap, CUERPO.grafTick), margin: 0, textAlign: "center", transform: `translateX(${(X(x) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`, fontSize: `${CUERPO.grafTick}mm`, fontWeight: 600, lineHeight: 1, color: COLORS.tinta, whiteSpace: "nowrap" }}>
            {fmt((tope * i) / GRAFICO.marcas)}
          </p>
        );
      })}

      <p style={{ position: "absolute", left: 0, width: "100%", top: capTop(GRAFICO.tituloEjeCap, CUERPO.grafTick), margin: 0, textAlign: "center", transform: `translateX(${(X((GRAFICO.x0 + GRAFICO.x1) / 2) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`, fontSize: `${CUERPO.grafTick}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.06mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.tituloEje}
      </p>
    </>
  );
}

export function Pagina6Roi({ cot, contenido = CONTENIDO_ROI }) {
  if (!cot) return null;
  const c = contenido;
  const anchoKpi = (ANCHO - KPI.gap * 2) / 3;
  const anchoBen = ANCHO / c.beneficios.length;
  const anios = fmt(cot?.retornoInversionAnios, 0);

  return (
    <section
      className="pagina"
      style={{ position: "relative", width: `${PAGE_WIDTH_MM}mm`, height: `${PAGE_HEIGHT_MM}mm`, background: COLORS.blanco, overflow: "hidden", margin: "0 auto 24px", fontFamily: FONT_FAMILY, color: COLORS.tinta }}
    >
      {/* Adorno de la esquina: foto en arco con las cintas de marca. Es un
          recorte del arte —el cliente no entregó la pieza suelta— y por eso su
          fondo casi blanco tiene que coincidir con el de la hoja, que es lo que
          lo hace desaparecer contra el papel.

          Va con ALFA recortada a la forma del arco, no como rectángulo: monta
          sobre la esquina de la tercera tarjeta y con fondo opaco le borraba el
          rótulo. La máscara sale de la curva del borde medida fila por fila
          sobre el arte, no de inundar el blanco: el recorte ya toca la tarjeta
          y su filete cortaba la inundación. */}
      <img
        src="/cotizacion/assets/roi-esquina.png"
        alt=""
        // Va por encima de las tarjetas, no por debajo: en el arte el arco baja
        // y monta sobre la esquina superior derecha del tercer indicador. Sin
        // el z-index la tarjeta lo tapaba y el arco quedaba cortado en seco.
        style={{ position: "absolute", left: mmX(1085), top: 0, width: mmX(1536 - 1085), height: mmY(157), zIndex: 2 }}
      />

      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: mmY(HEADER.logo.y), left: mmX(HEADER.logo.x) }}>
        <Logo heightMm={X(HEADER.logo.h)} />
      </div>
      <div style={{ position: "absolute", left: mmX(HEADER.regla.x), top: mmY(HEADER.regla.y0), width: "0.4mm", height: mmY(HEADER.regla.y1 - HEADER.regla.y0), background: COLORS.navy }} />

      <h1 style={{ position: "absolute", left: mmX(HEADER.textoX), top: capTop(HEADER.tituloCap, CUERPO.titulo), margin: 0, fontSize: `${CUERPO.titulo}mm`, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.05mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.titulo}
      </h1>
      <p style={{ position: "absolute", left: mmX(HEADER.textoX), top: capTop(HEADER.bajadaCap, CUERPO.bajada), margin: 0, fontSize: `${CUERPO.bajada}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.bajada.map((p, i) => (
          <span key={i} style={p.sub ? { fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "0.9mm" } : undefined}>{p.t}</span>
        ))}
      </p>

      {/* ── Indicadores ────────────────────────────────────────────────── */}
      {c.kpis.map((k, i) => (
        <TarjetaKpi key={k.campo} dato={k} cot={cot} x0={MARGEN.x0 + i * (anchoKpi + KPI.gap)} ancho={anchoKpi} />
      ))}

      {/* ── Cuadro del ahorro acumulado ────────────────────────────────── */}
      <div style={{ position: "absolute", left: mmX(MARGEN.x0), top: mmY(CUADRO.y0), width: mmX(ANCHO), height: mmY(CUADRO.y1 - CUADRO.y0), background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(RADIO), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: mmY(CUADRO.barra.y0 - CUADRO.y0), width: "100%", height: mmY(CUADRO.barra.y1 - CUADRO.barra.y0), background: COLORS.navy }} />
      </div>
      <IconResumen style={{ position: "absolute", left: mmX(CUADRO.iconoCx - CUADRO.iconoD / 2), top: `${(Y((CUADRO.barra.y0 + CUADRO.barra.y1) / 2) - X(CUADRO.iconoD) / 2).toFixed(2)}mm`, width: mmX(CUADRO.iconoD), height: mmX(CUADRO.iconoD) }} />
      <p style={{ position: "absolute", left: mmX(CUADRO.tituloX), top: capTop(CUADRO.tituloCap, CUERPO.cuadroTitulo), margin: 0, fontSize: `${CUERPO.cuadroTitulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.08mm", color: COLORS.blanco, whiteSpace: "nowrap" }}>
        {c.tituloCuadro}
      </p>

      <Grafico c={c} cot={cot} />

      {/* ── Nota ───────────────────────────────────────────────────────── */}
      {/* La píldora se ajusta al texto en vez de tener el ancho del arte. Con
          medida fija —los 1038 px del original— el renglón se salía por la
          derecha y terminaba sobre el papel: Montserrat es más ancha que la
          tipografía del arte y el texto además crece con la cifra de años. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: mmY(NOTA.y0),
          transform: `translateX(calc(-50% + ${(X((NOTA.x0 + NOTA.x1) / 2) - PAGE_WIDTH_MM / 2).toFixed(2)}mm))`,
          height: mmY(NOTA.y1 - NOTA.y0),
          // `max-content` es imprescindible: al ser absoluto y arrancar en
          // left:50%, el ancho que se le concede por defecto es lo que queda
          // hasta el borde —media hoja— y el renglón se partía en dos.
          width: "max-content",
          maxWidth: mmX(ANCHO - 60),
          display: "flex",
          alignItems: "center",
          gap: mmX(20),
          padding: `0 ${mmX(26)}`,
          background: COLORS.tinteVerde,
          borderRadius: mmX(6),
        }}
      >
        <IconCheck style={{ flex: "0 0 auto", width: mmX(NOTA.iconoD), height: mmX(NOTA.iconoD) }} />
        <p style={{ margin: 0, fontSize: `${CUERPO.nota}mm`, fontWeight: 500, lineHeight: 1.25, color: COLORS.navy }}>
          Desde el <strong>año {anios}</strong>, tu sistema comienza a generar{" "}
          <strong style={{ color: COLORS.verde900 }}>ahorros puros y crecientes</strong> durante los próximos <strong>30 años</strong>.
        </p>
      </div>

      {/* ── Beneficios ─────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: mmX(MARGEN.x0), top: mmY(BENEFICIOS.y0), width: mmX(ANCHO), height: mmY(BENEFICIOS.y1 - BENEFICIOS.y0), background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(RADIO) }} />
      {/* El rótulo va POR ENCIMA de la tarjeta, no montado sobre su filete: acá
          la tarjeta es blanca sobre fondo blanco y el chip que interrumpía el
          borde —el truco de la página 3— se leía como un recuadro pegado. El
          arte lo resuelve con dos hilos y un punto a cada lado. */}
      {[0, 1].map((lado) => {
        const medio = (MARGEN.x0 + MARGEN.x1) / 2;
        // El rótulo mide ~465 px a este cuerpo; con menos hueco los hilos le
        // pasaban por encima de las letras.
        const hueco = 540;
        const desde = lado === 0 ? MARGEN.x0 + 120 : medio + hueco / 2;
        const hasta = lado === 0 ? medio - hueco / 2 : MARGEN.x1 - 120;
        const punto = lado === 0 ? hasta : desde;
        return (
          <React.Fragment key={lado}>
            <div style={{ position: "absolute", left: mmX(desde), top: mmY(BENEFICIOS.tituloCap + 8), width: mmX(hasta - desde), height: "0.25mm", background: COLORS.regla }} />
            <div style={{ position: "absolute", left: mmX(punto - 5), top: mmY(BENEFICIOS.tituloCap + 3), width: mmX(10), height: mmX(10), borderRadius: "50%", background: COLORS.azul }} />
          </React.Fragment>
        );
      })}
      <p style={{ position: "absolute", left: 0, width: "100%", top: capTop(BENEFICIOS.tituloCap, CUERPO.benTitulo), margin: 0, textAlign: "center", fontSize: `${CUERPO.benTitulo}mm`, fontWeight: 700, letterSpacing: "0.08mm", color: COLORS.navy }}>
        {c.tituloBeneficios}
      </p>

      {c.beneficios.map((b, i) => {
        const Icono = ICONOS_BENEFICIO[b.icono];
        const x0 = MARGEN.x0 + i * anchoBen;
        return (
          <React.Fragment key={b.icono}>
            {i > 0 && <div style={{ position: "absolute", left: mmX(x0), top: mmY(BENEFICIOS.y0 + 18), width: "0.25mm", height: mmY(BENEFICIOS.y1 - BENEFICIOS.y0 - 36), background: COLORS.regla }} />}
            <Icono style={{ position: "absolute", left: mmX(x0 + BENEFICIOS.iconoDx + 24), top: `${(Y(BENEFICIOS.y0 + BENEFICIOS.tituloCapDy + 4) - X(BENEFICIOS.iconoD) / 2 + Y(10)).toFixed(2)}mm`, width: mmX(BENEFICIOS.iconoD), height: mmX(BENEFICIOS.iconoD) }} />
            {b.rotulo.map((linea, j) => (
              <p key={j} style={{ position: "absolute", left: mmX(x0 + BENEFICIOS.textoDx + 24), top: capTop(BENEFICIOS.y0 + BENEFICIOS.tituloCapDy + j * 22, CUERPO.benRotulo), margin: 0, fontSize: `${CUERPO.benRotulo}mm`, fontWeight: 700, lineHeight: 1, color: b.color, whiteSpace: "nowrap" }}>
                {linea}
              </p>
            ))}
            {b.desc.map((linea, j) => (
              <p key={j} style={{ position: "absolute", left: mmX(x0 + BENEFICIOS.iconoDx + 24), top: capTop(BENEFICIOS.y0 + BENEFICIOS.descCapDy + j * BENEFICIOS.descPaso, CUERPO.benDesc), margin: 0, fontSize: `${CUERPO.benDesc}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.tinta, whiteSpace: "nowrap" }}>
                {linea}
              </p>
            ))}
          </React.Fragment>
        );
      })}

      {/* ── Pie ────────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: 0, top: mmY(PIE.y0), width: "100%", height: `${(PAGE_HEIGHT_MM - Y(PIE.y0)).toFixed(2)}mm`, background: COLORS.navy }} />
      <div style={{ position: "absolute", left: mmX(PIE.logoX), top: `${(Y(PIE.y0) + (PAGE_HEIGHT_MM - Y(PIE.y0)) / 2 - X(PIE.logoH) / 2).toFixed(2)}mm` }}>
        <Logo heightMm={X(PIE.logoH)} variante="blanco" />
      </div>
      {c.contacto.map((k, i) => {
        const Icono = k.icono;
        const paso = 420;
        const x0 = 400 + i * paso;
        const cy = Y(PIE.y0) + (PAGE_HEIGHT_MM - Y(PIE.y0)) / 2;
        return (
          <React.Fragment key={k.texto}>
            {i > 0 && <div style={{ position: "absolute", left: mmX(x0 - 46), top: `${(cy - Y(24)).toFixed(2)}mm`, width: "0.25mm", height: mmY(48), background: "rgba(255,255,255,0.28)" }} />}
            <Icono style={{ position: "absolute", left: mmX(x0), top: `${(cy - X(34) / 2).toFixed(2)}mm`, width: mmX(34), height: mmX(34) }} />
            <p style={{ position: "absolute", left: mmX(x0 + 52), top: `${(cy - CUERPO.pieTexto * 0.55).toFixed(2)}mm`, margin: 0, fontSize: `${CUERPO.pieTexto}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.blanco, whiteSpace: "nowrap" }}>
              {k.texto}
            </p>
          </React.Fragment>
        );
      })}
    </section>
  );
}

export default Pagina6Roi;

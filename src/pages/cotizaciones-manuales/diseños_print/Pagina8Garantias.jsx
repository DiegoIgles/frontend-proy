import React from "react";
import { Logo } from "./shared/Logo";
import { FranjaAtributos, ATRIBUTOS } from "./shared/FranjaAtributos";
import { IconMedallaIngenieria } from "./shared/IconosDiseno";
import { CintaEsquina } from "./shared/CintaEsquina";
import { IconEscudo } from "./shared/IconosProteccion";
import { IconoGarantia } from "./shared/IconosGarantia";
import { GARANTIAS_DEFAULT } from "../shared/garantias";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 8 — "GARANTÍAS"
// ---------------------------------------------------------------------------
// Reemplaza al PNG estático /cotizacion/cotizacion8_A4.png, que era A4 vertical
// y entraba escalado dentro de la hoja carta apaisada, con dos bandas blancas a
// los lados. Base de medición: el arte apaisado aprobado (1536×1024), con las
// mismas dos escalas de las páginas 2 a 7.
//
// Las tarjetas de garantía son DINÁMICAS: salen de `cot.garantias` (icono,
// rótulo, años, descripción, activa), de 1 a 10 por cotización, con las cinco
// del arte como default (shared/garantias.js). El resto de la hoja es estático.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

// --- Rejilla ----------------------------------------------------------------
const MARGEN = { x0: 46, x1: 1480 };
const ANCHO = MARGEN.x1 - MARGEN.x0;
const RADIO = 10;

const CABEZA = {
  logo: { x: 34, y: 26, h: 88 },
  escudo: { cx: 765, cy: 83, d: 112 },
  // 163 es el tope de la MAYÚSCULA, no el de la mancha: arriba está la tilde de
  // la "Í". Medir la mancha entera daba 150 y con ese valor el título subía y la
  // tilde se salía de la hoja, como pasó en la página 5.
  tituloCap: 163,
  regla: { y: 254, w: 88, h: 6 },
  bajadaCap: 285, bajadaPaso: 28,
  ejeX: 762,
};

// Banda de tarjetas de garantía. En el arte hay CINCO en una fila (miden
// ~292 px cada una); la hoja admite de 1 a 10: hasta cinco van en una fila y de
// seis en adelante en dos filas, con el mismo diseño compacto del arte (disco
// arriba a la izquierda, rótulo y plazo a su derecha, descripción debajo).
const BANDA = { y0: 360, y1: 730, gap: 18, gapFilas: 16 };
const TARJETAS_POR_FILA_MAX = 5;

const COMPROMISO = { y0: 750, y1: 885, escudoCx: 136, escudoD: 94, textoDx: 222, divisorX: 600, parrafoDx: 595, tituloCap: 790, reglaY: 828, reglaW: 68, parrafoCap: 792, parrafoPaso: 28 };
const PIE_Y = 906;

// --- Cuerpos ----------------------------------------------------------------
const CUERPO = {
  titulo: 12.6,       // "GARANTÍAS" ≙ los 97 mm del arte
  bajada: 3.9,
  tarjTitulo: 3.9,
  tarjValor: 9.6,
  tarjUnidad: 4.6,
  tarjDesc: 2.5,
  compTitulo: 4.4,
  compTexto: 3.6,
};

// --- Contenido --------------------------------------------------------------
export const CONTENIDO_GARANTIAS = {
  titulo: "GARANTÍAS",
  bajada: [
    "Respaldamos la calidad de nuestros equipos y servicios con garantías",
    "diseñadas para brindarte tranquilidad y confianza a largo plazo.",
  ],
  unidad: "AÑOS",
  compromiso: {
    titulo: "COMPROMISO ENERLOGIC",
    texto: [
      "Trabajamos con equipos de alta calidad y proveedores confiables para garantizar",
      "el máximo rendimiento, seguridad y durabilidad de tu sistema energético.",
    ],
  },
};

// La franja del pie es la misma de las páginas 4, 5 y 7, con la medalla.
const ATRIBUTOS_PAGINA8 = ATRIBUTOS.map((a, i) =>
  i === 0 ? { ...a, icono: <IconMedallaIngenieria width="100%" height="100%" /> } : a
);

// --- Piezas -----------------------------------------------------------------

function Garantia({ g, c, x0, y0, ancho, alto }) {
  // Dos modos según la forma de la tarjeta:
  //  - "vertical" (una fila, tarjetas altas): disco arriba a la izquierda, rótulo
  //    y plazo a su derecha, descripción debajo a todo el ancho — el arte.
  //  - "horizontal" (dos filas, tarjetas anchas y bajas): disco a la izquierda,
  //    rótulo, plazo y descripción en una columna a su derecha.
  const horizontal = alto < 260;
  const k = Math.min(1, ancho / 292);
  const pad = 16 * (horizontal ? 1 : k);
  const disco = horizontal ? Math.min(alto - pad * 2, 118) : 126 * k;
  const badge = disco * 0.32;
  const textoX = pad + disco + 14;
  const fTitulo = CUERPO.tarjTitulo * (horizontal ? 0.8 : 0.84 * k);
  const fValor = CUERPO.tarjValor * (horizontal ? 0.72 : 0.86 * k);
  const fUnidad = CUERPO.tarjUnidad * (horizontal ? 0.8 : 0.9 * k);
  const fDesc = horizontal ? 2.45 : 3.1 * Math.max(0.86, k);
  const topTitulo = Y(pad) + 3;
  const topValor = topTitulo + fTitulo * 2.3;
  const topRegla = topValor + fValor * 1.25;
  const descLeft = horizontal ? textoX : pad;
  const descTop = horizontal ? topRegla + 3 : Y(pad + disco) + 6;
  const descAncho = horizontal ? ancho - textoX - pad : ancho - pad * 2;

  return (
    <div style={{ position: "absolute", left: mmX(x0), top: mmY(y0), width: mmX(ancho), height: mmY(alto), background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(RADIO), overflow: "hidden" }}>
      {/* Disco navy con el icono calado y el escudo verde montado arriba a la derecha. */}
      <div style={{ position: "absolute", left: mmX(pad), top: mmY(pad), width: mmX(disco), height: mmX(disco), borderRadius: "50%", background: COLORS.navy }}>
        <IconoGarantia clave={g.icono} color={COLORS.blanco} style={{ position: "absolute", left: "24%", top: "24%", width: "52%", height: "52%" }} />
      </div>
      <div style={{ position: "absolute", left: mmX(pad + disco - badge * 0.78), top: `${(Y(pad) - X(badge) * 0.12).toFixed(2)}mm`, width: mmX(badge), height: mmX(badge), borderRadius: "50%", background: COLORS.verde }}>
        <IconEscudo color={COLORS.blanco} style={{ position: "absolute", left: "20%", top: "20%", width: "60%", height: "60%" }} />
      </div>

      <p style={{ position: "absolute", left: mmX(textoX), top: `${topTitulo.toFixed(2)}mm`, margin: 0, width: mmX(ancho - textoX - pad), fontSize: `${fTitulo}mm`, fontWeight: 700, lineHeight: 1.1, letterSpacing: "0.05mm", color: COLORS.navy }}>
        {g.rotulo}
      </p>

      <p style={{ position: "absolute", left: mmX(textoX), top: `${topValor.toFixed(2)}mm`, margin: 0, display: "flex", alignItems: "baseline", gap: mmX(8), lineHeight: 1, whiteSpace: "nowrap" }}>
        <span style={{ fontSize: `${fValor}mm`, fontWeight: 800, color: COLORS.verde, letterSpacing: "-0.1mm" }}>{g.anios}</span>
        <span style={{ fontSize: `${fUnidad}mm`, fontWeight: 700, color: COLORS.verde }}>{c.unidad}</span>
      </p>
      <div style={{ position: "absolute", left: mmX(textoX), top: `${topRegla.toFixed(2)}mm`, width: mmX(46), height: "0.6mm", background: COLORS.verde }} />

      <p style={{ position: "absolute", left: mmX(descLeft), top: `${descTop.toFixed(2)}mm`, margin: 0, width: mmX(descAncho), fontSize: `${fDesc}mm`, fontWeight: 500, lineHeight: 1.45, color: COLORS.tinta }}>
        {g.descripcion ?? g.desc}
      </p>
    </div>
  );
}

// Reparte N tarjetas: una fila hasta 5, dos filas de 6 en adelante.
function distribuir(n) {
  if (n <= TARJETAS_POR_FILA_MAX) return [n];
  const primera = Math.ceil(n / 2);
  return [primera, n - primera];
}

export function Pagina8Garantias({ cot, contenido = CONTENIDO_GARANTIAS }) {
  const c = contenido;
  // Garantías de ESTA cotización (solo las activas); sin dato, las 5 del arte.
  const lista = (Array.isArray(cot?.garantias) && cot.garantias.length ? cot.garantias : GARANTIAS_DEFAULT)
    .filter((g) => g.activa !== false)
    .slice(0, 10);
  const filas = distribuir(lista.length);
  const altoBanda = BANDA.y1 - BANDA.y0;
  const altoFila = filas.length === 1 ? altoBanda : (altoBanda - BANDA.gapFilas) / 2;

  return (
    <section
      className="pagina"
      style={{ position: "relative", width: `${PAGE_WIDTH_MM}mm`, height: `${PAGE_HEIGHT_MM}mm`, background: COLORS.blanco, overflow: "hidden", margin: "0 auto 24px", fontFamily: FONT_FAMILY, color: COLORS.tinta }}
    >
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: mmY(CABEZA.logo.y), left: mmX(CABEZA.logo.x) }}>
        <Logo heightMm={X(CABEZA.logo.h)} />
      </div>

      <IconEscudo
        color={COLORS.navy}
        style={{ position: "absolute", left: mmX(CABEZA.escudo.cx - CABEZA.escudo.d / 2), top: `${(Y(CABEZA.escudo.cy) - X(CABEZA.escudo.d) / 2).toFixed(2)}mm`, width: mmX(CABEZA.escudo.d), height: mmX(CABEZA.escudo.d) }}
      />

      <h1 style={{ position: "absolute", left: 0, width: "100%", top: capTop(CABEZA.tituloCap, CUERPO.titulo), margin: 0, textAlign: "center", transform: `translateX(${(X(CABEZA.ejeX) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`, fontSize: `${CUERPO.titulo}mm`, fontWeight: 800, lineHeight: 1, letterSpacing: "0.2mm", color: COLORS.navy }}>
        {c.titulo}
      </h1>

      <div style={{ position: "absolute", left: `${(X(CABEZA.ejeX) - X(CABEZA.regla.w) / 2).toFixed(2)}mm`, top: mmY(CABEZA.regla.y), width: mmX(CABEZA.regla.w), height: mmX(CABEZA.regla.h), background: COLORS.verde, borderRadius: mmX(3) }} />

      {c.bajada.map((l, i) => (
        <p key={l} style={{ position: "absolute", left: 0, width: "100%", top: capTop(CABEZA.bajadaCap + i * CABEZA.bajadaPaso, CUERPO.bajada), margin: 0, textAlign: "center", transform: `translateX(${(X(CABEZA.ejeX) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`, fontSize: `${CUERPO.bajada}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.navy, whiteSpace: "nowrap" }}>
          {l}
        </p>
      ))}

      {/* ── Garantías (dinámicas: 1 a 10) ───────────────────────────────── */}
      {filas.map((cant, f) => {
        const desde = filas.slice(0, f).reduce((t, n) => t + n, 0);
        const ancho = (ANCHO - BANDA.gap * (cant - 1)) / cant;
        const y0 = BANDA.y0 + f * (altoFila + BANDA.gapFilas);
        return lista.slice(desde, desde + cant).map((g, i) => (
          <Garantia key={`${f}-${i}`} g={g} c={c} x0={MARGEN.x0 + i * (ancho + BANDA.gap)} y0={y0} ancho={ancho} alto={altoFila} />
        ));
      })}

      {/* ── Compromiso ─────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: mmX(MARGEN.x0), top: mmY(COMPROMISO.y0), width: mmX(ANCHO), height: mmY(COMPROMISO.y1 - COMPROMISO.y0), background: COLORS.hueso, borderRadius: mmX(RADIO) }} />

      <div style={{ position: "absolute", left: mmX(COMPROMISO.escudoCx - COMPROMISO.escudoD / 2), top: `${(Y((COMPROMISO.y0 + COMPROMISO.y1) / 2) - X(COMPROMISO.escudoD) / 2).toFixed(2)}mm`, width: mmX(COMPROMISO.escudoD), height: mmX(COMPROMISO.escudoD), borderRadius: "50%", background: COLORS.verde900 }}>
        <IconEscudo color={COLORS.blanco} style={{ position: "absolute", left: "24%", top: "24%", width: "52%", height: "52%" }} />
      </div>

      <p style={{ position: "absolute", left: mmX(COMPROMISO.textoDx), top: capTop(COMPROMISO.tituloCap, CUERPO.compTitulo), margin: 0, fontSize: `${CUERPO.compTitulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.06mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.compromiso.titulo}
      </p>
      <div style={{ position: "absolute", left: mmX(COMPROMISO.textoDx), top: mmY(COMPROMISO.reglaY), width: mmX(COMPROMISO.reglaW), height: "0.6mm", background: COLORS.verde }} />

      <div style={{ position: "absolute", left: mmX(COMPROMISO.divisorX), top: mmY(COMPROMISO.y0 + 26), width: "0.25mm", height: mmY(COMPROMISO.y1 - COMPROMISO.y0 - 52), background: COLORS.regla }} />

      {c.compromiso.texto.map((l, i) => (
        <p key={l} style={{ position: "absolute", left: mmX(COMPROMISO.parrafoDx + 46), top: capTop(COMPROMISO.parrafoCap + i * COMPROMISO.parrafoPaso, CUERPO.compTexto), margin: 0, fontSize: `${CUERPO.compTexto}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.tinta, whiteSpace: "nowrap" }}>
          {l}
        </p>
      ))}

      {/* ── Pie ────────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: 0, top: mmY(PIE_Y), width: "100%", height: `${(PAGE_HEIGHT_MM - Y(PIE_Y)).toFixed(2)}mm`, background: COLORS.navy, overflow: "hidden" }}>
        <FranjaAtributos escala="carta" mostrarBarra={false} atributos={ATRIBUTOS_PAGINA8} />
      </div>
      <CintaEsquina />
    </section>
  );
}

export default Pagina8Garantias;

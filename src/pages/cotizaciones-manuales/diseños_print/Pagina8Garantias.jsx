import React from "react";
import { Logo } from "./shared/Logo";
import { FranjaAtributos, ATRIBUTOS } from "./shared/FranjaAtributos";
import { IconMedallaIngenieria } from "./shared/IconosDiseno";
import { CintaEsquina } from "./shared/CintaEsquina";
import { IconEscudo, IconPanelSolar, IconInversor, IconHerramientas } from "./shared/IconosProteccion";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 8 — "GARANTÍAS"
// ---------------------------------------------------------------------------
// Reemplaza al PNG estático /cotizacion/cotizacion8_A4.png, que era A4 vertical
// y entraba escalado dentro de la hoja carta apaisada, con dos bandas blancas a
// los lados. Base de medición: el arte apaisado aprobado (1536×1024), con las
// mismas dos escalas de las páginas 2 a 7.
//
// La hoja es ENTERAMENTE ESTÁTICA: los plazos (10 / 5 / 2 años) no existen como
// campo en la entidad, así que viven en CONTENIDO_GARANTIAS. Están puestos como
// dato y no incrustados en el texto justamente para que el día que haya que
// hacerlos variables por cotización alcance con cambiar de dónde se leen.

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

// Tres tarjetas de garantía. En el arte miden 471/467/465 px: prácticamente
// iguales, se reparten en tercios exactos.
const TARJETA = {
  y0: 368, y1: 728, gap: 22,
  disco: { cx: 117, cy: 137, d: 194 },   // relativo al borde de la tarjeta
  badge: { cx: 194, cy: 75, d: 52 },
  // 236 y no 250: el disco termina en 214 y la columna de texto tiene que
  // llegar hasta el borde de la tarjeta para que la descripción entre.
  textoDx: 236,
  tituloCap: 58, valorCap: 106, reglaDy: 190, reglaW: 51,
  descCap: 220, descPaso: 26,
};

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
  garantias: [
    {
      icono: IconPanelSolar, rotulo: "PANELES SOLARES", anios: 10,
      desc: "Garantía premium que respalda el rendimiento y la durabilidad de los paneles solares.",
    },
    {
      icono: IconInversor, rotulo: "INVERSOR", anios: 5,
      desc: "Garantía estándar que asegura el funcionamiento confiable del inversor.",
    },
    {
      icono: IconHerramientas, rotulo: "INSTALACIÓN", anios: 2,
      desc: "Garantía que cubre los materiales y la instalación del sistema.",
    },
  ],
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

function Garantia({ g, c, x0, ancho }) {
  const Icono = g.icono;
  const alto = TARJETA.y1 - TARJETA.y0;

  return (
    <div style={{ position: "absolute", left: mmX(x0), top: mmY(TARJETA.y0), width: mmX(ancho), height: mmY(alto), background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(RADIO) }}>
      {/* Disco navy con el equipo calado, y el escudo verde montado arriba a la
          derecha: el escudo sale del disco a propósito, no está contenido. */}
      <div style={{ position: "absolute", left: mmX(TARJETA.disco.cx - TARJETA.disco.d / 2), top: `${(Y(TARJETA.disco.cy) - X(TARJETA.disco.d) / 2).toFixed(2)}mm`, width: mmX(TARJETA.disco.d), height: mmX(TARJETA.disco.d), borderRadius: "50%", background: COLORS.navy }}>
        <Icono color={COLORS.blanco} style={{ position: "absolute", left: "24%", top: "24%", width: "52%", height: "52%" }} />
      </div>
      <IconEscudo
        color={COLORS.verde}
        style={{ position: "absolute", left: mmX(TARJETA.badge.cx - TARJETA.badge.d / 2), top: `${(Y(TARJETA.badge.cy) - X(TARJETA.badge.d) / 2).toFixed(2)}mm`, width: mmX(TARJETA.badge.d), height: mmX(TARJETA.badge.d) }}
      />

      <p style={{ position: "absolute", left: mmX(TARJETA.textoDx), top: capTop(TARJETA.tituloCap, CUERPO.tarjTitulo), margin: 0, fontSize: `${CUERPO.tarjTitulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.06mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
        {g.rotulo}
      </p>

      {/* La cifra y la unidad comparten línea de base; por eso van en un mismo
          renglón con `alignItems: baseline` y no como dos bloques apilados.
          Las dos van del MISMO verde: muestreado en el arte, "10" y "AÑOS"
          dan el mismo lima (#4E8617), no una en verde y la otra en navy. */}
      <p style={{ position: "absolute", left: mmX(TARJETA.textoDx), top: capTop(TARJETA.valorCap, CUERPO.tarjValor), margin: 0, display: "flex", alignItems: "baseline", gap: mmX(12), lineHeight: 1, whiteSpace: "nowrap" }}>
        <span style={{ fontSize: `${CUERPO.tarjValor}mm`, fontWeight: 800, color: COLORS.verde, letterSpacing: "-0.1mm" }}>{g.anios}</span>
        <span style={{ fontSize: `${CUERPO.tarjUnidad}mm`, fontWeight: 700, color: COLORS.verde }}>{c.unidad}</span>
      </p>

      <div style={{ position: "absolute", left: mmX(TARJETA.textoDx), top: mmY(TARJETA.reglaDy), width: mmX(TARJETA.reglaW), height: "0.6mm", background: COLORS.verde }} />

      {/* Párrafo fluido, no líneas partidas a mano. El arte las corta en tres
          porque su condensada entra justo; con Montserrat esos mismos cortes
          dejaban huérfanas ("Garantía premium que / respalda"). Dejando elegir
          el quiebre al navegador salen tres o cuatro líneas parejas, y en la
          tarjeta sobra alto para las cuatro. */}
      <p style={{ position: "absolute", left: mmX(TARJETA.textoDx), top: capTop(TARJETA.descCap, CUERPO.tarjDesc), margin: 0, width: mmX(ancho - TARJETA.textoDx - 16), fontSize: `${CUERPO.tarjDesc}mm`, fontWeight: 500, lineHeight: (Y(TARJETA.descPaso) / CUERPO.tarjDesc).toFixed(3), color: COLORS.tinta }}>
        {g.desc}
      </p>
    </div>
  );
}

export function Pagina8Garantias({ contenido = CONTENIDO_GARANTIAS }) {
  const c = contenido;
  const anchoTarj = (ANCHO - TARJETA.gap * 2) / 3;

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

      {/* ── Tres garantías ─────────────────────────────────────────────── */}
      {c.garantias.map((g, i) => (
        <Garantia key={g.rotulo} g={g} c={c} x0={MARGEN.x0 + i * (anchoTarj + TARJETA.gap)} ancho={anchoTarj} />
      ))}

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

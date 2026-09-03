import React from "react";
import { Logo } from "./shared/Logo";
import { FranjaAtributos, ATRIBUTOS } from "./shared/FranjaAtributos";
import { IconMedallaIngenieria } from "./shared/IconosDiseno";
import { CintaEsquina } from "./shared/CintaEsquina";
import {
  IconEscudo, IconMonitoreo, IconLlave, IconTilde, IconEstrella,
  IconHojaLinea, IconRendimiento, IconComprobante, IconApreton, IconCalendario,
} from "./shared/IconosProteccion";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 7 — "PROTEGEMOS TU INVERSIÓN"
// ---------------------------------------------------------------------------
// Base de medición: el arte apaisado aprobado (1536×1024), con las mismas dos
// escalas de las páginas 2 a 6.
//
// LO QUE ESTA PÁGINA HACE DISTINTO: es la más densa de la cotización —dos
// programas con sus listas, un comparativo y una franja de precios— pero casi
// todo es texto fijo; lo único que viene del backend son los dos importes. Por
// eso los bloques se posicionan con las cajas medidas del arte y el contenido
// DENTRO de cada caja fluye con flex, en vez de clavar en coordenadas las
// sesenta y pico de líneas que tiene la hoja. Cambiar un renglón del contenido
// no obliga a recalcular nada.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

// --- Rejilla ----------------------------------------------------------------
const MARGEN = { x0: 34, x1: 1494 };
const ANCHO = MARGEN.x1 - MARGEN.x0;
const RADIO = 10;

const CABEZA = {
  logo: { x: 34, y: 18, h: 72 },
  tituloCap: [113, 168],
  parrafoCap: 244, parrafoPaso: 30,
  rasgos: { y0: 330, y1: 396, x1: 700 },
};
const FOTO = { x0: 792, x1: 1166, y0: 18, y1: 400 };
const COMPROMISO = { x0: 1182, x1: 1498, y0: 18, y1: 400 };
const SECCION = { cap: 416, ejeX: 828 };

// Los tres bloques de programa. En el arte miden 472/488/457 px: se igualan,
// que la diferencia no se ve y así las dos columnas internas de Plus y Premium
// caen en la misma posición.
const PROGRAMAS = { y0: 450, cabecera: 60, y1: 810, gap: 20 };
const FRANJA_PRECIOS = { y0: 832, y1: 939 };
const PIE_Y = 942;

// --- Cuerpos ----------------------------------------------------------------
const CUERPO = {
  titulo: 10.4,        // "TU INVERSIÓN" ≙ los 86 mm del arte
  parrafo: 3.5,
  rasgoRotulo: 3.2,
  rasgoPie: 2.9,
  compromisoTitulo: 4.6,
  compromisoTexto: 3.5,
  seccion: 4.6,
  progTitulo: 4.6,
  progBajada: 3.4,
  progBadge: 2.7,
  colRotulo: 2.75,
  colPlazo: 4.0,
  // Las listas son lo más apretado de la hoja: siete ítems por columna en una
  // tarjeta de 76 mm, y varios envuelven a dos renglones. El arte los resuelve
  // con una condensada; acá hay que bajar el cuerpo y cerrar el interlineado o
  // los últimos ítems se salen por abajo.
  item: 2.1,
  notaPie: 2.7,
  compTitulo: 3.8,
  compCol: 2.9,
  compFila: 2.5,
  porQueTitulo: 3.1,
  porQueItem: 2.7,
  precioRotulo: 2.8,   // "VALOR DE CONTRATACIÓN TOTAL (5 AÑOS)" en un renglón
  precioValor: 7.6,
  precioPie: 2.7,
};

// --- Contenido --------------------------------------------------------------
const B = (t) => ({ t, b: true });

export const CONTENIDO_PROTECCION = {
  tituloA: "PROTEGEMOS",
  tituloB: "TU INVERSIÓN",
  parrafo: [
    [{ t: "Tu sistema solar fue diseñado para generar ahorro durante más de 25 años." }],
    [{ t: "Nuestro compromiso es " }, B("acompañarlo"), { t: " para que mantenga su " }, B("seguridad,")],
    [B("eficiencia y máximo rendimiento"), { t: " desde el primer día." }],
  ],
  rasgos: [
    { icono: IconEscudo, rotulo: "SEGURIDAD", pie: "para tu sistema" },
    { icono: IconRendimiento, rotulo: "MÁXIMO", pie: "rendimiento" },
    { icono: IconHojaLinea, rotulo: "AHORRO", pie: "sostenible" },
  ],
  compromiso: {
    tituloA: "COMPROMISO",
    tituloB: "ENERLOGIC",
    texto: "Monitoreamos continuamente el desempeño de su sistema para detectar a tiempo cualquier desviación significativa y actuamos antes de que afecte su ahorro esperado.",
  },
  seccionA: "NUESTROS PROGRAMAS DE ",
  seccionB: "PROTECCIÓN",
  programas: [
    {
      clave: "plus",
      tituloA: "ENERLOGIC ", tituloB: "PLUS",
      bajada: "PROTECCIÓN ESENCIAL",
      badge: "INCLUIDO EN TODAS LAS INSTALACIONES",
      fondo: COLORS.navy,
      badgeFondo: COLORS.azul,
      anios: 2,
      columnas: [
        {
          icono: IconMonitoreo, rotulo: ["MONITOREO", "INTELIGENTE"], plazo: "2 AÑOS",
          items: [["Supervisión permanente del sistema"], ["Reportes mensuales"], ["Detección de alarmas y anomalías"], ["Seguimiento del desempeño"]],
        },
        {
          icono: IconLlave, rotulo: ["MANTENIMIENTO", "PREVENTIVO"], plazo: "2 AÑOS",
          items: [
            [B("1 visita preventiva anual"), { t: " (2 visitas en total)" }],
            [{ t: "Inspección eléctrica y mecánica" }],
            [{ t: "Revisión de protecciones AC/DC" }],
            [B("Revisión del inversor")],
            [{ t: "Verificación de conexiones" }],
            [B("Limpieza de módulos"), { t: " cuando sea necesaria" }],
            [{ t: "Informe técnico de la visita" }],
          ],
        },
      ],
      nota: "La protección esencial para el correcto funcionamiento de su sistema.",
    },
    {
      clave: "premium",
      tituloA: "ENERLOGIC ", tituloB: "PREMIUM",
      bajada: "PROTECCIÓN EXTENDIDA",
      badge: "DISPONIBLE AL CONTRATAR SU SISTEMA",
      fondo: COLORS.verde900,
      badgeFondo: COLORS.verde,
      anios: 5,
      columnas: [
        {
          icono: IconMonitoreo, rotulo: ["MONITOREO", "INTELIGENTE"], plazo: "5 AÑOS",
          items: [["Supervisión permanente del sistema"], ["Reportes mensuales"], ["Detección de alarmas y anomalías"], ["Seguimiento del desempeño"]],
        },
        {
          icono: IconLlave, rotulo: ["MANTENIMIENTO", "PREVENTIVO"], plazo: "5 AÑOS",
          items: [
            [B("1 visita preventiva anual"), { t: " (5 visitas en total)" }],
            [{ t: "Inspección eléctrica y mecánica" }],
            [{ t: "Revisión de protecciones AC/DC" }],
            [B("Revisión del inversor")],
            [{ t: "Verificación de conexiones" }],
            [B("Limpieza de módulos"), { t: " cuando sea necesaria" }],
            [{ t: "Informe técnico de la visita" }],
            [B("Atención prioritaria"), { estrella: true }],
          ],
        },
      ],
    },
  ],
  comparada: {
    titulo: "COBERTURA COMPARADA",
    columnas: [
      { rotulo: "PLUS", pie: "ESENCIAL", color: COLORS.navy },
      { rotulo: "PREMIUM", pie: "EXTENDIDO", color: COLORS.verde },
    ],
    filas: [
      { icono: IconMonitoreo, rotulo: ["MONITOREO", "INTELIGENTE"] },
      { icono: IconLlave, rotulo: ["MANTENIMIENTO", "PREVENTIVO"] },
    ],
    casillas: 5,
    porQue: {
      tituloA: "¿POR QUÉ ELEGIR ", tituloB: "PREMIUM?",
      items: [
        { icono: IconEscudo, partes: [{ t: "Cobertura extendida por " }, B("5 años"), { t: "." }] },
        { icono: IconCalendario, partes: [{ t: "Mayor continuidad en el rendimiento del sistema." }] },
        { icono: IconRendimiento, partes: [{ t: "Acompañamiento técnico durante toda la cobertura." }] },
      ],
    },
  },
  precios: [
    {
      icono: IconEscudo, rotulo: "COBERTURA EXTENDIDA",
      texto: ["Amplíe la protección de su sistema", "de 2 a 5 años con el programa", "Enerlogic Premium."],
    },
    { icono: IconComprobante, rotulo: "INVERSIÓN ANUAL", campo: "inversionAnualUsd", pie: [B("por año (aprox.)")] },
    {
      icono: IconApreton, rotulo: "VALOR DE CONTRATACIÓN TOTAL (5 AÑOS)", campo: "valorContratacionTotalUsd",
      pie: [{ t: "Disponible únicamente al momento" }, { t: "\n" }, B("de contratar su sistema.")],
    },
  ],
  moneda: "$us",
};

// La franja del pie es la misma de las páginas 4 y 5, con la medalla.
const ATRIBUTOS_PAGINA7 = ATRIBUTOS.map((a, i) =>
  i === 0 ? { ...a, icono: <IconMedallaIngenieria width="100%" height="100%" /> } : a
);

const fmt = (n) => (n === null || n === undefined || n === "" ? "—" : Number(n).toLocaleString("es-BO", { maximumFractionDigits: 0 }));

function Rico({ partes, colorFuerte }) {
  return (
    <>
      {partes.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : p.estrella ? null : (
          <span key={i} style={{ fontWeight: p.b ? 700 : "inherit", color: p.b && colorFuerte ? colorFuerte : "inherit" }}>
            {p.t}
          </span>
        )
      )}
    </>
  );
}

// --- Piezas -----------------------------------------------------------------

function Programa({ p, x0, ancho }) {
  const alto = PROGRAMAS.y1 - PROGRAMAS.y0;
  const anchoCol = (ancho - X(0)) / 2;

  return (
    <div
      style={{
        position: "absolute", left: mmX(x0), top: mmY(PROGRAMAS.y0),
        width: mmX(ancho), height: mmY(alto),
        background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`,
        borderRadius: mmX(RADIO), overflow: "hidden",
      }}
    >
      {/* Cabecera de color con el escudo, el nombre y la chapa */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: mmY(PROGRAMAS.cabecera), background: p.fondo }}>
        <IconEscudo color={COLORS.blanco} style={{ position: "absolute", left: mmX(96), top: mmY(8), width: mmX(44), height: mmX(44) }} />
        <p style={{ position: "absolute", left: mmX(152), top: capTop(12, CUERPO.progTitulo), margin: 0, fontSize: `${CUERPO.progTitulo}mm`, fontWeight: 700, lineHeight: 1, color: COLORS.blanco, whiteSpace: "nowrap" }}>
          {p.tituloA}
          <span style={{ color: COLORS.verde }}>{p.tituloB}</span>
        </p>
        <p style={{ position: "absolute", left: mmX(152), top: capTop(36, CUERPO.progBajada), margin: 0, fontSize: `${CUERPO.progBajada}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.blanco, whiteSpace: "nowrap" }}>
          {p.bajada}
        </p>
      </div>

      <div style={{ position: "absolute", left: "50%", top: mmY(PROGRAMAS.cabecera + 4), transform: "translateX(-50%)", width: "max-content", padding: `${mmY(5)} ${mmX(24)}`, background: p.badgeFondo, borderRadius: mmX(16) }}>
        <p style={{ margin: 0, fontSize: `${CUERPO.progBadge}mm`, fontWeight: 700, lineHeight: 1.15, letterSpacing: "0.05mm", color: COLORS.blanco, whiteSpace: "nowrap" }}>
          {p.badge}
        </p>
      </div>

      {/* Dos columnas: monitoreo y mantenimiento */}
      <div style={{ position: "absolute", left: 0, top: mmY(PROGRAMAS.cabecera + 38), width: "100%", display: "flex", padding: `0 ${mmX(14)}`, gap: mmX(10), boxSizing: "border-box" }}>
        {p.columnas.map((col, i) => {
          const Icono = col.icono;
          return (
            <div key={i} style={{ flex: "1 1 0", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: mmX(10) }}>
                <Icono color={COLORS.navy} style={{ flex: "0 0 auto", width: mmX(34), height: mmX(34) }} />
                <div style={{ minWidth: 0 }}>
                  {col.rotulo.map((l) => (
                    <p key={l} style={{ margin: 0, fontSize: `${CUERPO.colRotulo}mm`, fontWeight: 700, lineHeight: 1.2, color: COLORS.navy, whiteSpace: "nowrap" }}>{l}</p>
                  ))}
                </div>
              </div>
              <p style={{ margin: `${mmY(2)} 0 0 ${mmX(40)}`, fontSize: `${CUERPO.colPlazo}mm`, fontWeight: 700, lineHeight: 1, color: p.fondo, whiteSpace: "nowrap" }}>
                {col.plazo}
              </p>

              <ul style={{ margin: `${mmY(8)} 0 0`, padding: 0, listStyle: "none" }}>
                {col.items.map((it, j) => {
                  const partes = it.map((x) => (typeof x === "string" ? { t: x } : x));
                  const estrella = partes.some((x) => x.estrella);
                  const Vinieta = estrella ? IconEstrella : IconTilde;
                  return (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: mmX(6), marginBottom: mmY(4) }}>
                      <Vinieta color={estrella ? COLORS.verde900 : COLORS.verde} style={{ flex: "0 0 auto", width: mmX(13), height: mmX(13), marginTop: mmY(1) }} />
                      <p style={{ margin: 0, fontSize: `${CUERPO.item}mm`, fontWeight: 500, lineHeight: 1.22, color: COLORS.tinta }}>
                        <Rico partes={partes} colorFuerte={COLORS.navy} />
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {p.nota && (
        <div style={{ position: "absolute", left: mmX(14), right: mmX(14), bottom: mmY(10), display: "flex", alignItems: "center", gap: mmX(8), background: COLORS.tinteAzul, borderRadius: mmX(6), padding: `${mmY(6)} ${mmX(10)}` }}>
          <IconEscudo color={COLORS.azul} style={{ flex: "0 0 auto", width: mmX(24), height: mmX(24) }} />
          <p style={{ margin: 0, fontSize: `${CUERPO.notaPie}mm`, fontWeight: 600, lineHeight: 1.3, color: COLORS.azul }}>{p.nota}</p>
        </div>
      )}
    </div>
  );
}

function Comparada({ c, x0, ancho }) {
  const alto = PROGRAMAS.y1 - PROGRAMAS.y0;
  const { comparada: k } = c;

  return (
    <div style={{ position: "absolute", left: mmX(x0), top: mmY(PROGRAMAS.y0), width: mmX(ancho), height: mmY(alto), background: COLORS.hueso, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(RADIO), padding: `${mmY(18)} ${mmX(24)}`, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <p style={{ margin: 0, textAlign: "center", fontSize: `${CUERPO.compTitulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.06mm", color: COLORS.navy }}>
        {k.titulo}
      </p>

      {/* Cabecera de las dos columnas */}
      <div style={{ display: "flex", marginTop: mmY(26) }}>
        <div style={{ flex: "0 0 34%" }} />
        {k.columnas.map((col) => (
          <div key={col.rotulo} style={{ flex: "1 1 0", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: `${CUERPO.compCol}mm`, fontWeight: 700, lineHeight: 1.25, color: col.color }}>{col.rotulo}</p>
            <p style={{ margin: 0, fontSize: `${CUERPO.compFila}mm`, fontWeight: 600, lineHeight: 1.25, color: COLORS.tinta }}>{col.pie}</p>
          </div>
        ))}
      </div>

      {/* Una fila por servicio, con las casillas llenas según los años de cada
          programa: no se dibujan a mano, salen de `anios` para que no puedan
          quedar en desacuerdo con lo que dicen las tarjetas de al lado. */}
      {k.filas.map((fila, i) => {
        const Icono = fila.icono;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", marginTop: mmY(22) }}>
            <div style={{ flex: "0 0 34%", display: "flex", alignItems: "center", gap: mmX(8) }}>
              <Icono color={COLORS.navy} style={{ flex: "0 0 auto", width: mmX(28), height: mmX(28) }} />
              <div>
                {fila.rotulo.map((l) => (
                  <p key={l} style={{ margin: 0, fontSize: `${CUERPO.compFila}mm`, fontWeight: 700, lineHeight: 1.2, color: COLORS.navy, whiteSpace: "nowrap" }}>{l}</p>
                ))}
              </div>
            </div>
            {c.programas.map((p) => (
              <div key={p.clave} style={{ flex: "1 1 0", display: "flex", justifyContent: "center", gap: mmX(6) }}>
                {Array.from({ length: k.casillas }, (_, n) => (
                  <span
                    key={n}
                    style={{
                      width: mmX(20), height: mmX(20), borderRadius: mmX(3),
                      background: n < p.anios ? (p.clave === "plus" ? COLORS.navy : COLORS.verde) : COLORS.blanco,
                      border: `0.2mm solid ${n < p.anios ? "transparent" : COLORS.regla}`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}

      {/* ¿Por qué elegir Premium? */}
      <div style={{ marginTop: "auto", background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(6), padding: `${mmY(12)} ${mmX(16)}` }}>
        <p style={{ margin: 0, fontSize: `${CUERPO.porQueTitulo}mm`, fontWeight: 700, lineHeight: 1, color: COLORS.navy }}>
          {k.porQue.tituloA}
          <span style={{ color: COLORS.verde900 }}>{k.porQue.tituloB}</span>
        </p>
        {k.porQue.items.map((it, i) => {
          const Icono = it.icono;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: mmX(10), marginTop: mmY(10) }}>
              <Icono color={COLORS.verde900} style={{ flex: "0 0 auto", width: mmX(20), height: mmX(20) }} />
              <p style={{ margin: 0, fontSize: `${CUERPO.porQueItem}mm`, fontWeight: 500, lineHeight: 1.3, color: COLORS.tinta }}>
                <Rico partes={it.partes} colorFuerte={COLORS.navy} />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Pagina7Proteccion({ cot, contenido = CONTENIDO_PROTECCION }) {
  if (!cot) return null;
  const c = contenido;
  const anchoProg = (ANCHO - PROGRAMAS.gap * 2) / 3;

  return (
    <section
      className="pagina"
      style={{ position: "relative", width: `${PAGE_WIDTH_MM}mm`, height: `${PAGE_HEIGHT_MM}mm`, background: COLORS.blanco, overflow: "hidden", margin: "0 auto 24px", fontFamily: FONT_FAMILY, color: COLORS.tinta }}
    >
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: mmY(CABEZA.logo.y), left: mmX(CABEZA.logo.x) }}>
        <Logo heightMm={X(CABEZA.logo.h)} />
      </div>

      <h1 style={{ position: "absolute", left: mmX(36), top: capTop(CABEZA.tituloCap[0], CUERPO.titulo), margin: 0, fontSize: `${CUERPO.titulo}mm`, fontWeight: 800, lineHeight: (Y(CABEZA.tituloCap[1] - CABEZA.tituloCap[0]) / CUERPO.titulo).toFixed(3), letterSpacing: "-0.1mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
        <span style={{ display: "block" }}>{c.tituloA}</span>
        <span style={{ display: "block", color: COLORS.verde900 }}>{c.tituloB}</span>
      </h1>

      {c.parrafo.map((linea, i) => (
        <p key={i} style={{ position: "absolute", left: mmX(36), top: capTop(CABEZA.parrafoCap + i * CABEZA.parrafoPaso, CUERPO.parrafo), margin: 0, fontSize: `${CUERPO.parrafo}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.tinta, whiteSpace: "nowrap" }}>
          <Rico partes={linea} colorFuerte={COLORS.navy} />
        </p>
      ))}

      {/* Tres rasgos, separados por hilos */}
      {c.rasgos.map((r, i) => {
        const Icono = r.icono;
        const paso = (CABEZA.rasgos.x1 - 36) / c.rasgos.length;
        const x0 = 36 + i * paso;
        const cy = (CABEZA.rasgos.y0 + CABEZA.rasgos.y1) / 2;
        return (
          <React.Fragment key={r.rotulo}>
            {i > 0 && <div style={{ position: "absolute", left: mmX(x0 - 14), top: mmY(CABEZA.rasgos.y0), width: "0.25mm", height: mmY(CABEZA.rasgos.y1 - CABEZA.rasgos.y0), background: COLORS.regla }} />}
            <Icono color={COLORS.verde900} style={{ position: "absolute", left: mmX(x0), top: `${(Y(cy) - X(38) / 2).toFixed(2)}mm`, width: mmX(38), height: mmX(38) }} />
            <p style={{ position: "absolute", left: mmX(x0 + 50), top: capTop(CABEZA.rasgos.y0 + 4, CUERPO.rasgoRotulo), margin: 0, fontSize: `${CUERPO.rasgoRotulo}mm`, fontWeight: 700, lineHeight: 1, color: COLORS.navy, whiteSpace: "nowrap" }}>{r.rotulo}</p>
            <p style={{ position: "absolute", left: mmX(x0 + 50), top: capTop(CABEZA.rasgos.y0 + 32, CUERPO.rasgoPie), margin: 0, fontSize: `${CUERPO.rasgoPie}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.tinta, whiteSpace: "nowrap" }}>{r.pie}</p>
          </React.Fragment>
        );
      })}

      {/* ── Foto y compromiso ──────────────────────────────────────────── */}
      <img
        src="/cotizacion/assets/proteccion-tecnico.jpg"
        alt="Técnico de Enerlogic en mantenimiento"
        style={{ position: "absolute", left: mmX(FOTO.x0), top: mmY(FOTO.y0), width: mmX(FOTO.x1 - FOTO.x0), height: mmY(FOTO.y1 - FOTO.y0), objectFit: "cover", borderRadius: mmX(RADIO) }}
      />

      <div style={{ position: "absolute", left: mmX(COMPROMISO.x0), top: mmY(COMPROMISO.y0), width: mmX(COMPROMISO.x1 - COMPROMISO.x0), height: mmY(COMPROMISO.y1 - COMPROMISO.y0), background: COLORS.navy, borderRadius: mmX(RADIO), padding: `${mmY(34)} ${mmX(26)}`, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: mmX(14) }}>
          <IconEscudo color={COLORS.blanco} style={{ flex: "0 0 auto", width: mmX(46), height: mmX(46) }} />
          <div>
            <p style={{ margin: 0, fontSize: `${CUERPO.compromisoTitulo}mm`, fontWeight: 700, lineHeight: 1.25, color: COLORS.verde, whiteSpace: "nowrap" }}>{c.compromiso.tituloA}</p>
            <p style={{ margin: 0, fontSize: `${CUERPO.compromisoTitulo}mm`, fontWeight: 700, lineHeight: 1.25, color: COLORS.blanco, whiteSpace: "nowrap" }}>{c.compromiso.tituloB}</p>
          </div>
        </div>
        <p style={{ margin: `${mmY(28)} 0 0`, fontSize: `${CUERPO.compromisoTexto}mm`, fontWeight: 500, lineHeight: 1.75, color: COLORS.blanco }}>
          {c.compromiso.texto}
        </p>
      </div>

      {/* ── Título de sección ──────────────────────────────────────────── */}
      {[0, 1].map((lado) => {
        const hueco = 620;
        const desde = lado === 0 ? MARGEN.x0 + 20 : X(0) + SECCION.ejeX + hueco / 2;
        const hasta = lado === 0 ? SECCION.ejeX - hueco / 2 : MARGEN.x1 - 20;
        const punto = lado === 0 ? hasta : desde;
        return (
          <React.Fragment key={lado}>
            <div style={{ position: "absolute", left: mmX(desde), top: mmY(SECCION.cap + 9), width: mmX(hasta - desde), height: "0.5mm", background: COLORS.verde }} />
            <div style={{ position: "absolute", left: mmX(punto - 5), top: mmY(SECCION.cap + 4), width: mmX(11), height: mmX(11), borderRadius: "50%", background: COLORS.verde }} />
          </React.Fragment>
        );
      })}
      <p style={{ position: "absolute", left: 0, width: "100%", top: capTop(SECCION.cap, CUERPO.seccion), margin: 0, textAlign: "center", transform: `translateX(${(X(SECCION.ejeX) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`, fontSize: `${CUERPO.seccion}mm`, fontWeight: 700, letterSpacing: "0.06mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.seccionA}
        <span style={{ color: COLORS.verde900 }}>{c.seccionB}</span>
      </p>

      {/* ── Programas y comparativo ────────────────────────────────────── */}
      {c.programas.map((p, i) => (
        <Programa key={p.clave} p={p} x0={MARGEN.x0 + i * (anchoProg + PROGRAMAS.gap)} ancho={anchoProg} />
      ))}
      <Comparada c={c} x0={MARGEN.x0 + 2 * (anchoProg + PROGRAMAS.gap)} ancho={anchoProg} />

      {/* ── Franja de precios ──────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: mmX(MARGEN.x0), top: mmY(FRANJA_PRECIOS.y0), width: mmX(ANCHO), height: mmY(FRANJA_PRECIOS.y1 - FRANJA_PRECIOS.y0), background: COLORS.blanco, border: `0.25mm solid ${COLORS.regla}`, borderRadius: mmX(RADIO), display: "flex", alignItems: "center" }}>
        {c.precios.map((p, i) => {
          const Icono = p.icono;
          return (
            <div key={p.rotulo} style={{ flex: "1 1 0", display: "flex", alignItems: "center", gap: mmX(18), padding: `0 ${mmX(30)}`, boxSizing: "border-box", borderLeft: i > 0 ? `0.25mm solid ${COLORS.regla}` : "none", minWidth: 0 }}>
              <Icono color={COLORS.verde900} style={{ flex: "0 0 auto", width: mmX(54), height: mmX(54) }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: `${CUERPO.precioRotulo}mm`, fontWeight: 700, lineHeight: 1.2, color: COLORS.navy }}>{p.rotulo}</p>
                {p.campo ? (
                  <>
                    <p style={{ margin: `${mmY(4)} 0 0`, fontSize: `${CUERPO.precioValor}mm`, fontWeight: 800, lineHeight: 1, color: COLORS.verde900, whiteSpace: "nowrap" }}>
                      {fmt(cot[p.campo])} <span style={{ fontSize: `${CUERPO.precioValor * 0.8}mm` }}>{c.moneda}</span>
                    </p>
                    <p style={{ margin: `${mmY(4)} 0 0`, fontSize: `${CUERPO.precioPie}mm`, lineHeight: 1.3, color: COLORS.tinta, whiteSpace: "pre-line" }}>
                      <Rico partes={p.pie} colorFuerte={COLORS.navy} />
                    </p>
                  </>
                ) : (
                  <div style={{ marginTop: mmY(4) }}>
                    {p.texto.map((l) => (
                      <p key={l} style={{ margin: 0, fontSize: `${CUERPO.precioPie}mm`, fontWeight: 500, lineHeight: 1.35, color: COLORS.tinta }}>{l}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pie ────────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: 0, top: mmY(PIE_Y), width: "100%", height: `${(PAGE_HEIGHT_MM - Y(PIE_Y)).toFixed(2)}mm`, background: COLORS.navy, overflow: "hidden" }}>
        <FranjaAtributos escala="carta" mostrarBarra={false} atributos={ATRIBUTOS_PAGINA7} />
      </div>
      <CintaEsquina />
    </section>
  );
}

export default Pagina7Proteccion;

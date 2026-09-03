import React from "react";
import { Logo } from "./shared/Logo";
import { IconEscudo, IconPanelSolar, IconAuricular } from "./shared/IconosProteccion";
import { IconWeb } from "./shared/IconosRoi";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 10 — CIERRE, "GRACIAS POR CONFIAR EN ENERLOGIC"
// ---------------------------------------------------------------------------
// Reemplaza al PNG estático /cotizacion/cotizacion10_A4.png, que era A4 vertical
// y entraba escalado en la hoja carta apaisada. Base de medición: el arte
// apaisado aprobado (1536×1024), con las mismas dos escalas de las páginas 2 a 9.
//
// Hoja enteramente estática y la única sin la franja de atributos: su pie es
// otro, con la web y las redes.
//
// TODO EL LADO DERECHO —el arco, las cintas de marca y la foto— va como UNA
// SOLA IMAGEN y no reconstruido con máscaras SVG como en las páginas 1 a 3. La
// razón: ahí las curvas separaban zonas de color plano y había que poder
// recolorearlas; acá encierran una fotografía y no hay nada dinámico adentro, así
// que redibujarlas solo agregaría una fuente de error. El recorte es un
// rectángulo y arranca donde el arte todavía es fondo liso: lo que lo hace
// desaparecer contra la hoja es que el papel sea exactamente COLORS.perla.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

// --- Rejilla ----------------------------------------------------------------
const ARCO = { x0: 600, y1: 903 };
const CABEZA = { logo: { x: 59, y: 64, h: 94 }, textoX: 57 };
const TITULO = { graciasCap: 232, confiarCap: 350, marcaCap: 405 };
const REGLA = { x: 57, y: 513, w: 74, h: 7 };
const BAJADA = { cap: 553, paso: 34 };

// Los tres rasgos. En el arte los divisores caen en 194 y 396, y las columnas
// no son iguales: la tercera es más ancha porque "ACOMPAÑAMIENTO" es la palabra
// más larga. Se respetan tal cual en vez de repartir en tercios.
const RASGOS = {
  columnas: [32, 212, 414],
  divisores: [194, 396],
  divisorY: [686, 852],
  iconoY: 694, iconoD: 72,
  rotuloCap: 806, rotuloPaso: 26,
};

const PIE = {
  y0: 902,
  globo: { cx: 90, d: 50 }, webX: 132,
  sociales: [495, 605, 715], socialD: 60,
  divisores: [439, 838],
  derechaX: 1443, derechaCap: [936, 966],
  cy: 962,
};

// --- Cuerpos ----------------------------------------------------------------
const CUERPO = {
  gracias: 19.5,       // "GRACIAS" ≙ los 101.7 mm del arte
  confiar: 6.0,
  confiarEsp: 3.6,     // el arte espacia mucho esta línea; sin esto queda corta
  marca: 16.0,
  bajada: 4.4,
  rasgo: 3.2,
  pieWeb: 3.9,
  pieDerecha: 3.8,
};

// --- Contenido --------------------------------------------------------------
const V = (t) => ({ t, v: true });

export const CONTENIDO_CIERRE = {
  gracias: "GRACIAS",
  confiar: "POR CONFIAR EN",
  marca: "ENERLOGIC",
  bajada: [
    [{ t: "Transformamos la energía en " }, V("ahorro,")],
    [V("confianza"), { t: " y " }, V("tranquilidad"), { t: " para nuestros clientes." }],
  ],
  rasgos: [
    { icono: IconEscudo, lineas: ["COMPROMISO", "CON CALIDAD"] },
    { icono: IconPanelSolar, lineas: ["ENERGÍA", "EFICIENTE"] },
    { icono: IconAuricular, lineas: ["ACOMPAÑAMIENTO", "POSVENTA"] },
  ],
  web: "www.enerlogic.com.bo",
  redes: ["facebook", "instagram", "tiktok"],
  cierreA: "ENERGÍA INTELIGENTE",
  cierreB: "PARA UN FUTURO SOSTENIBLE",
};

const RUTA = "/cotizacion/assets/cierre";

function Rico({ partes }) {
  return (
    <>
      {partes.map((p, i) => (
        <span key={i} style={p.v ? { fontWeight: 700, color: COLORS.verde900 } : undefined}>{p.t}</span>
      ))}
    </>
  );
}

export function Pagina10Cierre({ contenido = CONTENIDO_CIERRE }) {
  const c = contenido;
  const altoPie = PAGE_HEIGHT_MM - Y(PIE.y0);

  return (
    <section
      className="pagina"
      style={{ position: "relative", width: `${PAGE_WIDTH_MM}mm`, height: `${PAGE_HEIGHT_MM}mm`, background: COLORS.perla, overflow: "hidden", margin: "0 auto 24px", fontFamily: FONT_FAMILY, color: COLORS.tinta }}
    >
      <img
        src={`${RUTA}/arco.jpg`}
        alt=""
        style={{ position: "absolute", left: mmX(ARCO.x0), top: 0, width: mmX(1536 - ARCO.x0), height: mmY(ARCO.y1) }}
      />

      {/* ── Columna izquierda ──────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: mmY(CABEZA.logo.y), left: mmX(CABEZA.logo.x) }}>
        <Logo heightMm={X(CABEZA.logo.h)} />
      </div>

      <h1 style={{ position: "absolute", left: mmX(CABEZA.textoX), top: capTop(TITULO.graciasCap, CUERPO.gracias), margin: 0, fontSize: `${CUERPO.gracias}mm`, fontWeight: 800, lineHeight: 1, letterSpacing: "0.3mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.gracias}
      </h1>

      {/* El arte abre mucho esta línea: sin el espaciado queda un tercio más
          corta que las dos que tiene encima y debajo, y el bloque se desalinea. */}
      <p style={{ position: "absolute", left: mmX(CABEZA.textoX), top: capTop(TITULO.confiarCap, CUERPO.confiar), margin: 0, fontSize: `${CUERPO.confiar}mm`, fontWeight: 600, lineHeight: 1, letterSpacing: `${CUERPO.confiarEsp}mm`, color: COLORS.navy, whiteSpace: "nowrap" }}>
        {c.confiar}
      </p>

      <p style={{ position: "absolute", left: mmX(CABEZA.textoX), top: capTop(TITULO.marcaCap, CUERPO.marca), margin: 0, fontSize: `${CUERPO.marca}mm`, fontWeight: 800, lineHeight: 1, letterSpacing: "0.2mm", color: COLORS.verde900, whiteSpace: "nowrap" }}>
        {c.marca}
      </p>

      <div style={{ position: "absolute", left: mmX(REGLA.x), top: mmY(REGLA.y), width: mmX(REGLA.w), height: mmX(REGLA.h), background: COLORS.verde900, borderRadius: mmX(3) }} />

      {c.bajada.map((linea, i) => (
        <p key={i} style={{ position: "absolute", left: mmX(CABEZA.textoX + 1), top: capTop(BAJADA.cap + i * BAJADA.paso, CUERPO.bajada), margin: 0, fontSize: `${CUERPO.bajada}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.navy, whiteSpace: "nowrap" }}>
          <Rico partes={linea} />
        </p>
      ))}

      {/* ── Tres rasgos ────────────────────────────────────────────────── */}
      {RASGOS.divisores.map((x) => (
        <div key={x} style={{ position: "absolute", left: mmX(x), top: mmY(RASGOS.divisorY[0]), width: "0.25mm", height: mmY(RASGOS.divisorY[1] - RASGOS.divisorY[0]), background: COLORS.regla }} />
      ))}

      {c.rasgos.map((r, i) => {
        const Icono = r.icono;

        return (
          // `width: max-content` para que la caja mida lo que mide su rótulo:
          // el icono va centrado SOBRE EL TEXTO, no sobre la columna, y las tres
          // columnas del arte tienen anchos distintos.
          <div key={r.lineas[0]} style={{ position: "absolute", left: mmX(RASGOS.columnas[i]), top: mmY(RASGOS.iconoY), width: "max-content" }}>
            <Icono color={COLORS.navy} style={{ display: "block", margin: "0 auto", width: mmX(RASGOS.iconoD), height: mmX(RASGOS.iconoD) }} />
            {r.lineas.map((l, j) => (
              <p key={l} style={{ margin: `${j === 0 ? mmY(RASGOS.rotuloCap - RASGOS.iconoY - RASGOS.iconoD * KX / KY) : 0} 0 0`, fontSize: `${CUERPO.rasgo}mm`, fontWeight: 700, lineHeight: (Y(RASGOS.rotuloPaso) / CUERPO.rasgo).toFixed(3), letterSpacing: "0.04mm", color: j === 0 ? COLORS.navy : COLORS.verde900, whiteSpace: "nowrap" }}>
                {l}
              </p>
            ))}
          </div>
        );
      })}

      {/* ── Pie ────────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: 0, top: mmY(PIE.y0), width: "100%", height: `${altoPie.toFixed(2)}mm`, background: COLORS.navy }} />

      <IconWeb style={{ position: "absolute", left: mmX(PIE.globo.cx - PIE.globo.d / 2), top: `${(Y(PIE.cy) - X(PIE.globo.d) / 2).toFixed(2)}mm`, width: mmX(PIE.globo.d), height: mmX(PIE.globo.d) }} />
      <p style={{ position: "absolute", left: mmX(PIE.webX), top: `${(Y(PIE.cy) - CUERPO.pieWeb * 0.55).toFixed(2)}mm`, margin: 0, fontSize: `${CUERPO.pieWeb}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.blanco, whiteSpace: "nowrap" }}>
        {c.web}
      </p>

      {PIE.divisores.map((x) => (
        <div key={x} style={{ position: "absolute", left: mmX(x), top: `${(Y(PIE.cy) - Y(30)).toFixed(2)}mm`, width: "0.25mm", height: mmY(60), background: "rgba(255,255,255,0.30)" }} />
      ))}

      {/* Los logos de las redes van como imagen: son marcas registradas y a
          color, así que se recortan del arte en vez de redibujarlas. */}
      {c.redes.map((red, i) => (
        <img
          key={red}
          src={`${RUTA}/${red}.png`}
          alt={red}
          style={{ position: "absolute", left: mmX(PIE.sociales[i]), top: `${(Y(PIE.cy) - X(PIE.socialD) / 2).toFixed(2)}mm`, width: mmX(PIE.socialD), height: mmX(PIE.socialD), objectFit: "contain" }}
        />
      ))}

      <p style={{ position: "absolute", left: 0, width: mmX(PIE.derechaX), top: capTop(PIE.derechaCap[0], CUERPO.pieDerecha), margin: 0, textAlign: "right", fontSize: `${CUERPO.pieDerecha}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.06mm", color: COLORS.verde, whiteSpace: "nowrap" }}>
        {c.cierreA}
      </p>
      <p style={{ position: "absolute", left: 0, width: mmX(PIE.derechaX), top: capTop(PIE.derechaCap[1], CUERPO.pieDerecha), margin: 0, textAlign: "right", fontSize: `${CUERPO.pieDerecha}mm`, fontWeight: 500, lineHeight: 1, letterSpacing: "0.06mm", color: COLORS.blanco, whiteSpace: "nowrap" }}>
        {c.cierreB}
      </p>
    </section>
  );
}

export default Pagina10Cierre;

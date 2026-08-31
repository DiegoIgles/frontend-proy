import React from "react";
import { Logo } from "./shared/Logo";
import { ICONOS } from "./shared/IconosSoluciones";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 2 — "¿QUIÉNES SOMOS?"
// ---------------------------------------------------------------------------
// Base de medición: el arte apaisado aprobado por Enerlogic (PNG 1536×1024),
// medido pixel a pixel igual que la portada. Como el arte es 3:2 y la hoja es
// carta apaisada (1.294:1), no calzan solos. A diferencia de la página 1 —donde
// el arte es una composición de círculos que hay que preservar, y por eso se
// ancla con escala única dejando sangrar el sobrante— acá el arte es una
// maqueta de dos columnas: lo que hay que preservar son las PROPORCIONES del
// bloque, no la circularidad. Por eso se adoptan dos escalas:
//
//     KX = 279.4 / 1536 = 0.181901 mm/px   → todas las medidas y cuerpos
//     KY = 215.9 / 1024 = 0.210840 mm/px   → todas las posiciones verticales
//
// Consecuencia buscada: cada bloque cae exactamente en su proporción original
// de la hoja y no sobra ni falta papel; el 16% de diferencia entre escalas se
// va en aire entre líneas, que es donde no molesta. Los arcos del hero se
// dibujan como ELIPSES (rx = r·KX, ry = r·KY): un círculo estirado un 16% en
// una curva orgánica es imperceptible, y así el arco entra y sale de la hoja
// por donde entra y sale en el arte.
//
// Tipografía: el arte usa una grotesca condensada para los títulos y una
// geométrica estrecha para el cuerpo; ninguna de las dos es Montserrat, que es
// ~30% más ancha a igual altura de mayúscula. La página 1 ya resolvió lo mismo
// sustituyendo por Montserrat, así que acá se hace igual y los cuerpos se
// calculan POR ANCHO (que la línea ocupe la misma columna del arte), no por
// altura de mayúscula. El resultado es un título algo menos alto que el
// original a cambio de respetar la caja. Si algún día se licencia la
// condensada, se cambia FONT_FAMILY y se recalculan solo estos cuerpos.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;

// --- Hero -------------------------------------------------------------------
// Cuatro circunferencias ajustadas por mínimos cuadrados sobre el borde real de
// cada mancha del arte, con rechazo de atípicos. Residuo máximo entre paréntesis.
const ARCO_EXT = { cx: 1140.34, cy: 186.44, r: 391.66 };   // borde externo del navy (1.1 px)
const ARCO_INT = { cx: 1119.12, cy: 307.89, r: 383.02 };   // borde interno del navy (1.6 px)
const FOTO_ARCO = { cx: 1119.12, cy: 307.89, r: 364.0 };   // borde izquierdo de la foto
const FOTO_CORTE = { cx: 1320.48, cy: -551.38, r: 972.69 };// barrido inferior (5.7 px)
//
// ARCO_INT y FOTO_ARCO son concéntricos: los 19 px que los separan son el hueso
// que el arte deja entre la media luna y la foto. No mover uno sin el otro.
//
// La foto NO es "el interior de FOTO_ARCO": arriba a la derecha se sale de esa
// circunferencia y llega hasta el borde de la hoja. Por eso la máscara es la
// unión de la lente con una banda que cubre la mitad derecha, todo recortado
// por FOTO_CORTE. La banda solo aporta donde la lente ya no llega.
const BANDA_X = 203.57;
const BANDA_ALTO = 95;

const FOTO_SRC = "/cotizacion/assets/hero-quienes-somos.jpg";

const el = (c) => ({ cx: X(c.cx), cy: Y(c.cy), rx: X(c.r), ry: Y(c.r) });

function HeroArco() {
  const ext = el(ARCO_EXT), int = el(ARCO_INT), foto = el(FOTO_ARCO), corte = el(FOTO_CORTE);
  return (
    <svg
      viewBox={`0 0 ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM}`}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
    >
      <defs>
        <mask id="q2Luna">
          <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill="#000" />
          <ellipse {...ext} fill="#fff" />
          <ellipse {...int} fill="#000" />
        </mask>
        <mask id="q2Corte">
          <ellipse {...corte} fill="#fff" />
        </mask>
        <mask id="q2Foto">
          <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill="#000" />
          <g mask="url(#q2Corte)" fill="#fff">
            <ellipse {...foto} />
            <rect x={BANDA_X} y={0} width={PAGE_WIDTH_MM - BANDA_X} height={BANDA_ALTO} />
          </g>
        </mask>
      </defs>

      <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.navy} mask="url(#q2Luna)" />

      {/* La caja de la foto conserva el aspecto del recorte (no se deforma con
          KY); "slice" la hace cubrir la máscara y el sobrante cae fuera de hoja. */}
      <g mask="url(#q2Foto)">
        <image
          href={FOTO_SRC}
          x={X(745)}
          y={-1}
          width={PAGE_WIDTH_MM - X(745)}
          height={Y(452)}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </svg>
  );
}

// --- Contenido --------------------------------------------------------------
// Todo el texto vive acá para que mañana lo sirva NestJS sin tocar el maquetado.
const B = (t) => ({ t, b: true });

export const CONTENIDO_QUIENES_SOMOS = {
  tituloA: "¿QUIÉNES ",
  tituloB: "SOMOS?",
  subtitulo: [
    { t: "Ingeniería que transforma la " },
    { t: "energía en ahorro.", c: COLORS.azul },
  ],
  parrafos: [
    [
      { t: "EnerLogic S.R.L.", b: true, c: COLORS.azul },
      { t: " es una empresa boliviana especializada en soluciones " },
      B("energéticas y servicios eléctricos"),
      { t: ", líderes " },
      B("EPC"),
      { t: " en proyectos " },
      B("Llave en Mano"),
      { t: " para sistemas On Grid, Off Grid, híbridos y sistemas de bombeo solar, incluyendo " },
      B("ingeniería, suministro, instalación y puesta en marcha."),
      { t: " Ofrecemos soluciones completas, eficientes y adaptadas a cada cliente." },
    ],
    [
      { t: "Contamos con un área de " },
      B("Tendidos de Media y Baja Tensión"),
      { t: ", que incluye gestión y aprobación en la elaboración del proyecto, suministro de transformadores, provisión de materiales e instalación con pruebas finales." },
    ],
    [
      { t: "Trabajamos con tecnología de fabricantes líderes a nivel mundial como " },
      B("Schneider Electric, Huawei, Growatt, Victron"),
      { t: ", entre otros, en el área de sistemas renovables y soluciones de carga vehiculares para todo el territorio boliviano." },
    ],
  ],
  seccionSoluciones: "NUESTRAS SOLUCIONES",
  soluciones: [
    { icono: "onGrid", lineas: ["Sistemas", "Fotovoltaicos"], destacado: "On Grid", color: COLORS.azul },
    { icono: "offGrid", lineas: ["Sistemas"], destacado: "Off Grid\ne Híbridos", color: COLORS.azul },
    { icono: "bombeo", lineas: ["Sistemas de"], destacado: "Bombeo Solar", color: COLORS.azul },
    { icono: "tension", lineas: ["Infraestructura", "Eléctrica en"], destacado: "Media y Baja Tensión", color: COLORS.azul },
    { icono: "tramitacion", lineas: ["Gestión y tramitación"], destacado: "CRE y AETN", color: COLORS.azul, prefijo: "ante " },
    { icono: "carga", lineas: ["Soluciones de carga para"], destacado: "vehículos eléctricos", color: COLORS.azul },
  ],
  seccionMarcas: "TECNOLOGÍA DE FABRICANTES LÍDERES",
  pieMarcas: "Seleccionamos la tecnología más adecuada para cada proyecto, priorizando calidad, eficiencia y respaldo técnico.",
};

// Logos de fabricantes. Recortados del arte aprobado a 3× — sirven para el
// armado y para pruebas de impresión, pero conviene reemplazarlos por los SVG
// oficiales de cada marca en cuanto el cliente los envíe: mismo nombre de
// archivo y listo, la maqueta no cambia.
const MARCAS = [
  { src: "/cotizacion/assets/marcas/schneider.png", alt: "Schneider Electric", x0: 89, x1: 269, h: 55 },
  { src: "/cotizacion/assets/marcas/huawei.png", alt: "Huawei", x0: 364, x1: 439, h: 74 },
  { src: "/cotizacion/assets/marcas/growatt.png", alt: "Growatt", x0: 523, x1: 689, h: 33 },
  { src: "/cotizacion/assets/marcas/victron.png", alt: "Victron Energy", x0: 747, x1: 956, h: 50 },
  { src: "/cotizacion/assets/marcas/hoymiles.png", alt: "Hoymiles", x0: 1015, x1: 1192, h: 56 },
  { src: "/cotizacion/assets/marcas/solax.png", alt: "SolaX Power", x0: 1267, x1: 1444, h: 75 },
];
const DIVISORES_MARCAS = [304.5, 491.5, 716.5, 988, 1227.5];

// --- Geometría de la maqueta (px del arte, salvo aviso) ----------------------
const COL_TEXTO = { x0: 48, x1: 663 };
// La grilla es lo único que NO sale del arte tal cual. Con la fuente del arte
// las tres columnas cabían iguales; Montserrat pide un 20% más de ancho para la
// misma etiqueta, así que se reparte a medida: cada columna recibe el ancho que
// pide su etiqueta más larga (medida en el navegador, en cuerpos de la fuente
// real) más 1 mm de resguardo. La grilla arranca 4.5 mm antes y termina 3.6 mm
// después que en el arte para comprar ese espacio; el margen derecho de hoja
// queda en 8.4 mm, holgado para imprimir.
//   col 1  "Media y Baja Tensión"    11.011 em
//   col 2  "Gestión y tramitación"   10.853 em
//   col 3  "Soluciones de carga para" 12.679 em
const GRILLA = { xmm: [123.5, 171.3, 218.6, 271.0], y: [477, 618, 776] };
const TARJETA = { icono: 14, gap: 1.8, padIzq: 1.6, padDer: 0.6 };
const CAJA = { x0: 50.5, x1: 1482.5, yTop: 837 };
// El pie de la hoja gana ~1.9 mm respecto al arte: es el sobrante que deja el
// bloque de párrafos al reflowear con Montserrat. Se lo queda el margen inferior.
const CAJA_ALTO_MM = 29.95;

const CUERPO = {
  titulo: 11.8,   // así "¿QUIÉNES SOMOS?" ocupa los mismos 115 mm del arte
  subtitulo: 4.55,
  parrafo: 3.6,
  seccion: 5.6,
  tarjeta: 2.55,
  cajaTitulo: 5.0,
  pie: 3.5,
};

function Rico({ partes }) {
  return (
    <>
      {partes.map((p, i) => (
        <span key={i} style={{ fontWeight: p.b ? 700 : "inherit", color: p.c || "inherit" }}>
          {p.t}
        </span>
      ))}
    </>
  );
}

function Tarjeta({ dato }) {
  const Icono = ICONOS[dato.icono];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${TARJETA.gap}mm`, height: "100%", paddingLeft: `${TARJETA.padIzq}mm`, paddingRight: `${TARJETA.padDer}mm` }}>
      <Icono style={{ width: `${TARJETA.icono}mm`, height: `${TARJETA.icono}mm`, flexShrink: 0 }} />
      <div style={{ minWidth: 0 }}>
        {dato.lineas.map((l, i) => (
          <p key={i} style={{ margin: 0, fontSize: `${CUERPO.tarjeta}mm`, lineHeight: 1.32, color: COLORS.tinta, fontWeight: 500 }}>
            {l}
          </p>
        ))}
        {dato.destacado.split("\n").map((l, i) => (
          <p key={i} style={{ margin: 0, fontSize: `${CUERPO.tarjeta}mm`, lineHeight: 1.32, color: dato.color, fontWeight: 700 }}>
            {i === 0 && dato.prefijo ? (
              <span style={{ color: COLORS.tinta, fontWeight: 500 }}>{dato.prefijo}</span>
            ) : null}
            {l}
          </p>
        ))}
        <div style={{ marginTop: "1.7mm", width: "7.5mm", height: "0.5mm", background: COLORS.verde900 }} />
      </div>
    </div>
  );
}

export function Pagina2QuienesSomos({ contenido = CONTENIDO_QUIENES_SOMOS }) {
  const c = contenido;
  const cajaTopMM = Y(CAJA.yTop);
  const cajaBotMM = cajaTopMM + CAJA_ALTO_MM;
  const marcasCyMM = cajaTopMM + CAJA_ALTO_MM * 0.44;

  return (
    <section
      className="pagina"
      style={{
        position: "relative",
        width: `${PAGE_WIDTH_MM}mm`,
        height: `${PAGE_HEIGHT_MM}mm`,
        background: COLORS.hueso,
        overflow: "hidden",
        margin: "0 auto 24px",
        fontFamily: FONT_FAMILY,
        color: COLORS.tinta,
      }}
    >
      <HeroArco />

      {/* ── Columna izquierda ───────────────────────────────────────────── */}

      <div style={{ position: "absolute", top: mmY(22), left: mmX(35), zIndex: 3 }}>
        <Logo heightMm={X(83)} />
      </div>

      <h1
        style={{
          position: "absolute",
          top: mmY(146),
          left: mmX(50),
          margin: 0,
          fontSize: `${CUERPO.titulo}mm`,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.12mm",
          whiteSpace: "nowrap",
          zIndex: 3,
        }}
      >
        <span style={{ color: COLORS.navy }}>{c.tituloA}</span>
        <span style={{ color: COLORS.verde900 }}>{c.tituloB}</span>
      </h1>

      <div style={{ position: "absolute", top: mmY(243), left: mmX(50), width: mmX(57), height: "1.4mm", background: COLORS.verde900, zIndex: 3 }} />

      <p style={{ position: "absolute", top: mmY(264), left: mmX(52), margin: 0, fontSize: `${CUERPO.subtitulo}mm`, fontWeight: 700, lineHeight: 1.2, color: COLORS.navy, zIndex: 3 }}>
        <Rico partes={c.subtitulo} />
      </p>

      {/* Los tres párrafos se reparten el alto disponible: con Montserrat el
          reflow no da las mismas 5/4/4 líneas del arte, así que se deja que el
          bloque respire en vez de clavar cada línea a una Y fija. */}
      <div
        style={{
          position: "absolute",
          top: mmY(336),
          left: mmX(COL_TEXTO.x0),
          width: mmX(COL_TEXTO.x1 - COL_TEXTO.x0),
          height: `${(cajaTopMM - Y(336) - 4.5).toFixed(2)}mm`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 3,
        }}
      >
        {c.parrafos.map((p, i) => (
          <p key={i} style={{ margin: 0, fontSize: `${CUERPO.parrafo}mm`, fontWeight: 500, lineHeight: 1.5, textAlign: "justify", color: COLORS.tinta }}>
            <Rico partes={p} />
          </p>
        ))}
      </div>

      {/* ── Columna derecha: soluciones ─────────────────────────────────── */}

      <h2 style={{ position: "absolute", top: mmY(404), left: "129.1mm", margin: 0, fontSize: `${CUERPO.seccion}mm`, fontWeight: 700, lineHeight: 1, color: COLORS.navy, letterSpacing: "0.05mm", zIndex: 3 }}>
        {c.seccionSoluciones}
      </h2>

      <div style={{ position: "absolute", top: mmY(447), left: "128.5mm", width: mmX(56), height: "1.4mm", background: COLORS.verde900, zIndex: 3 }} />

      <div style={{ position: "absolute", top: mmY(GRILLA.y[0]), left: `${GRILLA.xmm[0]}mm`, width: `${GRILLA.xmm[3] - GRILLA.xmm[0]}mm`, height: mmY(GRILLA.y[2] - GRILLA.y[0]), zIndex: 3 }}>
        {/* Divisores: hilos de 0.3 mm. Ni tarjetas, ni bordes cerrados, ni sombras. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: mmY(GRILLA.y[1] - GRILLA.y[0]), height: "0.3mm", background: COLORS.regla }} />
        {[1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${(GRILLA.xmm[i] - GRILLA.xmm[0]).toFixed(2)}mm`, width: "0.3mm", background: COLORS.regla }} />
        ))}

        {c.soluciones.map((s, i) => {
          const col = i % 3;
          const fila = Math.floor(i / 3);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(GRILLA.xmm[col] - GRILLA.xmm[0]).toFixed(2)}mm`,
                width: `${(GRILLA.xmm[col + 1] - GRILLA.xmm[col]).toFixed(2)}mm`,
                top: mmY(GRILLA.y[fila] - GRILLA.y[0]),
                height: mmY(GRILLA.y[fila + 1] - GRILLA.y[fila]),
              }}
            >
              <Tarjeta dato={s} />
            </div>
          );
        })}
      </div>

      {/* ── Franja de fabricantes ───────────────────────────────────────── */}

      <div
        style={{
          position: "absolute",
          top: `${cajaTopMM}mm`,
          left: mmX(CAJA.x0),
          width: mmX(CAJA.x1 - CAJA.x0),
          height: `${CAJA_ALTO_MM}mm`,
          border: `0.3mm solid ${COLORS.verde900}`,
          borderRadius: "3mm",
          background: COLORS.blanco,
          zIndex: 2,
        }}
      />

      {/* Título y pie montan SOBRE los bordes de la caja y los interrumpen: el
          fondo del rótulo es lo que corta el hilo, igual que en el arte. */}
      <p
        style={{
          position: "absolute",
          top: `${cajaTopMM}mm`,
          left: 0,
          width: "100%",
          textAlign: "center",
          margin: 0,
          transform: "translateY(-52%)",
          zIndex: 4,
        }}
      >
        <span style={{ background: COLORS.hueso, padding: "0 4mm", fontSize: `${CUERPO.cajaTitulo}mm`, fontWeight: 700, color: COLORS.navy, letterSpacing: "0.05mm" }}>
          {c.seccionMarcas}
        </span>
      </p>

      <p
        style={{
          position: "absolute",
          top: `${cajaBotMM}mm`,
          left: 0,
          width: "100%",
          textAlign: "center",
          margin: 0,
          transform: "translateY(-52%)",
          zIndex: 4,
        }}
      >
        <span style={{ background: COLORS.blanco, padding: "0 4mm", fontSize: `${CUERPO.pie}mm`, fontWeight: 500, color: COLORS.tinta }}>
          {c.pieMarcas}
        </span>
      </p>

      {DIVISORES_MARCAS.map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: mmX(x),
            top: `${(marcasCyMM - X(45) / 2).toFixed(2)}mm`,
            width: "0.3mm",
            height: mmX(45),
            background: COLORS.verde900,
            opacity: 0.45,
            zIndex: 3,
          }}
        />
      ))}

      {MARCAS.map((m) => (
        <img
          key={m.alt}
          src={m.src}
          alt={m.alt}
          style={{
            position: "absolute",
            left: mmX(m.x0),
            width: mmX(m.x1 - m.x0),
            height: mmX(m.h),
            top: `${(marcasCyMM - X(m.h) / 2).toFixed(2)}mm`,
            objectFit: "contain",
            zIndex: 3,
          }}
        />
      ))}
    </section>
  );
}

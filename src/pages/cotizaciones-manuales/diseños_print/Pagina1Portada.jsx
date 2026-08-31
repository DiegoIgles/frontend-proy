import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Logo } from "./shared/Logo";
import { FranjaAtributos } from "./shared/FranjaAtributos";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

function fmtFechaCorta(d) {
  if (!d) return "—";
  const fecha = new Date(String(d).slice(0, 10) + "T00:00:00");
  const dia = fecha.getDate();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} ${mes} del ${anio}`;
}

// ---------------------------------------------------------------------------
// Base de medición
// ---------------------------------------------------------------------------
// Toda la geometría sale de medir el arte aprobado (PNG 1536×1024) pixel a
// pixel: cada media luna se obtuvo ajustando por mínimos cuadrados los dos
// círculos que la generan sobre el borde real de la mancha de color, con
// rechazo de atípicos (residuo máximo ≤ 2.9 px en todas las formas).
//
// El arte es 3:2 y la hoja es carta apaisada (1.294:1), así que no calzan
// solos. Conversión adoptada — escala ÚNICA, los círculos siguen siendo
// círculos:
//
//     mm = px * 0.21084 - 44.4   en X          (1024 px → 215.9 mm)
//     mm = px * 0.21084          en Y          (1536 px → 323.8 mm)
//
// Se ancla por el borde DERECHO y por el ALTO completo de la hoja. Que el arte
// llegue hasta y=215.9 es lo que hace que la foto y la media luna azul pisen la
// franja de atributos y que la esquina inferior derecha quede en hueso, igual
// que en el original. Los 44.4 mm que sobran de ancho se van fuera de la hoja
// por la derecha: ahí solo hay sangrado de la foto y de la cuña verde.
//
// Costo de este anclaje: el navy arranca en x=126.5 mm en vez de 146.5, así que
// la columna de texto trabaja con un 18% menos de ancho que el arte original y
// tiene su propia escala (ver ESCALA_TEXTO más abajo).
//
// Si hay que reencuadrar, se recalculan TODOS los círculos con la misma escala.
// Mover un centro suelto deforma la media luna.

const FOTO_SRC = "/cotizacion/assets/portada-foto-arte.png";

// La foto sale RECORTADA DEL ARTE APROBADO, no de un archivo suelto. El
// paneles-solares-portada.png que se usaba antes era otra toma —o la misma muy
// reprocesada—: cielo dorado lavado, paneles empastados y un halo de sol que
// quemaba medio disco. Reencuadrarlo no arreglaba nada porque el problema era
// el bitmap, no la caja.
//
// El recorte se sacó del arte apaisado (1536×1024) con la conversión de arriba
// (mm = px·0.21084, con −44.4 en X), tomando el rectángulo que envuelve al
// disco dentro de la hoja: píxeles 860..1536 × 90..1024. Lo de afuera del
// disco se rellenó extendiendo el borde, así que si algún día la máscara se
// mueve medio milímetro asoma foto estirada y nunca el anillo de hueso ni la
// cuña verde del arte.
//
// Por eso la caja es EXACTAMENTE ese rectángulo llevado a mm y su aspecto
// coincide con el del archivo (676:934): no hay recorte ni deformación, cada
// píxel cae donde cae en el arte.
//
// Al reemplazar el archivo por una versión de más resolución hay que respetar
// la proporción 676:934; el nombre y esta caja no se tocan.
const FOTO_BOX = { x: 136.92, y: 18.98, w: 142.53, h: 196.92 };

// Círculo de la foto y de cada media luna (mm). "contiene" pinta, "recorta" resta.
const FOTO = { cx: 238.99, cy: 121.06, r: 102.05 };

// Segundo recorte de la foto: el arco que la separa de la media luna azul.
// Ajustado sobre 130 filas del arte (residuo máx 1.83 px). Abre los ~18 mm de
// hueso que hay entre la foto y la curva, y deja la foto terminando en punta
// abajo a la izquierda en vez de cerrar en su propio arco. También fija el borde
// inferior de la foto en y=198.4 mm, o sea 17.5 mm arriba del pie de la hoja.
const FOTO_RECORTE = [272.22, 45.77, 152.61];

const CIRC = {
  navy: { contiene: [258.79, 101.39, 132.32], recorta: [240.68, 131.33, 120.79], recorta2: [264.42, 68.06, 85.98] },
  azul: { contiene: [246.90, 132.89, 114.02], recorta: [277.33, 44.34, 171.56] },
  // El radio del recorte verde medido es 108.79, pero con ese valor el arco del
  // verde y el de la foto se separan hasta 1.1 mm en el borde derecho de la hoja
  // y aparece una línea de hueso donde el arte los tiene pegados. Bajarlo a
  // 107.60 hace que el verde siga 0.2 mm POR DEBAJO del borde de la foto en todo
  // el tramo: como la foto se pinta después, lo tapa, y el contacto queda limpio.
  // Se corrige acá y no agrandando la foto porque agrandarla angostaría el
  // anillo de hueso contra la media luna navy, que sí está medido.
  verde: { contiene: [280.57, 78.01, 94.33], recorta: [240.26, 127.75, 107.6] },
};

// Filetes concéntricos con el círculo que recorta el navy, apenas perceptibles.
const HAIRLINES = [140.8, 152.2, 163.8];

// Donde arranca la franja de atributos. El arte la pisa; ella no lo tapa.
const FRANJA_Y_MM = 187.6;

function CurvaPortada() {
  const c = (a) => <circle cx={a[0]} cy={a[1]} r={a[2]} />;
  return (
    <svg
      viewBox={`0 0 ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM}`}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2 }}
    >
      <defs>
        <mask id="mNavy">
          <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill="#000" />
          <g fill="#fff">{c(CIRC.navy.contiene)}</g>
          <g fill="#000">
            {c(CIRC.navy.recorta)}
            {c(CIRC.navy.recorta2)}
          </g>
        </mask>
        <mask id="mAzul">
          <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill="#000" />
          <g fill="#fff">{c(CIRC.azul.contiene)}</g>
          <g fill="#000">{c(CIRC.azul.recorta)}</g>
        </mask>
        <mask id="mVerde">
          <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill="#000" />
          <g fill="#fff">{c(CIRC.verde.contiene)}</g>
          <g fill="#000">{c(CIRC.verde.recorta)}</g>
        </mask>
        <clipPath id="cFoto">
          <circle cx={FOTO.cx} cy={FOTO.cy} r={FOTO.r} />
        </clipPath>
        <clipPath id="cFotoRecorte">{c(FOTO_RECORTE)}</clipPath>
        {/* La banda navy muere donde empieza el círculo que contiene la media
            luna azul. Medido en el arte: en y=890 px el navy corta en 906 px y
            el azul arranca en 907, que es exactamente esa circunferencia. Por eso
            la esquina inferior derecha de la hoja queda en hueso y no en navy. */}
        <mask id="mBanda">
          <rect x="0" y={FRANJA_Y_MM} width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM - FRANJA_Y_MM} fill="#fff" />
          <g fill="#000">{c(CIRC.azul.contiene)}</g>
        </mask>
        {/* Los filetes viven sobre el hueso; no deben cruzar la franja */}
        <clipPath id="cSobreFranja">
          <rect x="0" y="0" width={PAGE_WIDTH_MM} height={FRANJA_Y_MM} />
        </clipPath>
      </defs>

      {/* Fondo navy de la franja: va acá, dentro del arte, para que las curvas
          y la foto se pinten ENCIMA. Los rótulos de la franja se montan después
          en HTML, así "ACOMPAÑAMIENTO POSVENTA" se lee sobre la curva azul. */}
      <rect x="0" y={FRANJA_Y_MM} width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM - FRANJA_Y_MM} fill={COLORS.navy} mask="url(#mBanda)" />

      <g clipPath="url(#cSobreFranja)" fill="none" stroke={COLORS.navy} strokeOpacity={0.1} strokeWidth={0.25}>
        {HAIRLINES.map((r) => (
          <circle key={r} cx={CIRC.navy.recorta[0]} cy={CIRC.navy.recorta[1]} r={r} />
        ))}
      </g>

      <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.navy} mask="url(#mNavy)" />
      <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.azul} mask="url(#mAzul)" />
      <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.verde900} mask="url(#mVerde)" />

      {/* Doble recorte: los dos clipPath anidados se intersecan */}
      <g clipPath="url(#cFoto)">
        <image
          href={FOTO_SRC}
          x={FOTO_BOX.x}
          y={FOTO_BOX.y}
          width={FOTO_BOX.w}
          height={FOTO_BOX.h}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#cFotoRecorte)"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Columna de texto
// ---------------------------------------------------------------------------
// Con el arte anclado al alto de la hoja, el navy arranca en x=126.5 mm. El arte
// deja 17.3 mm de aire entre el texto y el navy, así que el texto puede llegar
// como mucho a x=109.2. El bloque conserva EXACTAMENTE las proporciones
// internas del original, en su propia escala:
//
//     mm = px * 0.15029 - 0.36            (en X)
//     mm = (px - 247) * 0.15029 + BLOQUE_Y   (en Y)
//
// BLOQUE_Y centra el bloque entre el logo y la franja. Es el único número de
// adaptación: subirlo o bajarlo mueve el bloque entero sin tocar el interlineado.
const ESCALA_TEXTO = 0.15029;
const BLOQUE_Y = 62.85;
const X = (px) => `${(px * ESCALA_TEXTO - 0.36).toFixed(2)}mm`;
const Y = (px) => `${((px - 247) * ESCALA_TEXTO + BLOQUE_Y).toFixed(2)}mm`;
const ANCHO = (px) => `${(px * ESCALA_TEXTO).toFixed(2)}mm`;

// Cuerpo tipográfico a partir de la altura de mayúscula medida en el arte
// (Montserrat: capHeight = 0.70 em; el tope de la caja queda 0.1585 em arriba).
const cuerpo = (capMm) => `${(capMm / 0.7).toFixed(2)}mm`;
const cajaY = (pyCapTop, capMm) => `${((pyCapTop - 247) * ESCALA_TEXTO + BLOQUE_Y - 0.1585 * (capMm / 0.7)).toFixed(2)}mm`;

// "ENERGÉTICO" es la línea más larga del arte y termina justo en este límite.
const TEXTO_MAX_WIDTH_MM = 109.2 - 7.0;

// El nombre del cliente va SIEMPRE en un renglón: si se parte, la segunda línea
// se come el pie de ciudad/fecha, que está posicionado en absoluto. En Montserrat
// 700 mayúsculas cada carácter mide ~1.02 veces la altura de mayúscula, así que
// para nombres largos se baja el cuerpo lo justo para que entre.
const CAP_CLIENTE = 5.56;
function capCliente(nombre) {
  const n = (nombre || "").length;
  if (!n) return CAP_CLIENTE;
  return Math.min(CAP_CLIENTE, TEXTO_MAX_WIDTH_MM / (n * 1.02));
}

export function Pagina1Portada({ cot }) {
  if (!cot) return null;

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
      }}
    >
      <CurvaPortada />

      {/* Rótulos de la franja — SIN fondo y por encima del arte. El navy de la
          banda lo pinta el SVG por debajo de las curvas, así el cuarto atributo
          ("ACOMPAÑAMIENTO POSVENTA") se lee en blanco sobre la media luna azul
          en vez de quedar tapado por ella. */}
      <div style={{ position: "absolute", top: `${FRANJA_Y_MM}mm`, left: 0, width: "100%", height: `${(PAGE_HEIGHT_MM - FRANJA_Y_MM).toFixed(1)}mm`, zIndex: 3 }}>
        <FranjaAtributos escala="carta" fondo="transparent" />
      </div>

      {/* Logo — fondo transparente, 26.5% del ancho de hoja como en el arte */}
      <div style={{ position: "absolute", top: "7.5mm", left: "5.0mm", zIndex: 3 }}>
        <Logo heightMm={19.6} />
      </div>

      {/* N° de propuesta — sobre la cuña verde, cerrando en x=270.8 mm */}
      <div style={{ position: "absolute", top: "5.38mm", right: "8.6mm", width: "70mm", textAlign: "right", zIndex: 3 }}>
        <p style={{ margin: 0, color: COLORS.blanco, fontSize: cuerpo(2.32), fontWeight: 500, letterSpacing: "0.3mm", lineHeight: 1 }}>
          N° DE PROPUESTA
        </p>
        <p style={{ margin: "2.6mm 0 0", color: COLORS.blanco, fontSize: cuerpo(3.37), fontWeight: 600, letterSpacing: "0.2mm", lineHeight: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "2.6mm" }}>
          <span style={{ display: "inline-block", width: "0.3mm", height: "5.0mm", background: COLORS.blanco }} />
          {cot.nroPropuesta || "—"}
          <span style={{ display: "inline-block", width: "0.3mm", height: "5.0mm", background: COLORS.blanco }} />
        </p>
      </div>

      {/* Eyebrow — mayúsculas verde-900, alto de caja 3.01 mm */}
      <p style={{ position: "absolute", top: cajaY(247, 3.01), left: X(48), margin: 0, color: COLORS.verde900, fontSize: cuerpo(3.01), fontWeight: 700, letterSpacing: "0.33mm", lineHeight: 1, whiteSpace: "nowrap", zIndex: 3 }}>
        PROPUESTA COMERCIAL
      </p>

      <div style={{ position: "absolute", top: Y(295), left: X(47), width: ANCHO(68), height: "0.45mm", background: COLORS.verde900, zIndex: 3 }} />

      {/* Título — dos líneas del mismo cuerpo, altura de mayúscula 12.32 mm */}
      <h1 style={{ position: "absolute", top: cajaY(333, 12.32), left: X(49), margin: 0, color: COLORS.navy, fontSize: cuerpo(12.32), fontWeight: 700, lineHeight: 1, letterSpacing: "-0.08mm", zIndex: 3 }}>
        ESTUDIO
      </h1>
      <h1 style={{ position: "absolute", top: cajaY(444, 12.32), left: X(49), margin: 0, color: COLORS.navy, fontSize: cuerpo(12.32), fontWeight: 700, lineHeight: 1, letterSpacing: "-0.08mm", zIndex: 3 }}>
        ENERGÉTICO
      </h1>

      <div style={{ position: "absolute", top: Y(563), left: X(46), width: ANCHO(69), height: "0.45mm", background: COLORS.verde900, zIndex: 3 }} />

      <p style={{ position: "absolute", top: cajaY(600, 3.21), left: X(48), maxWidth: `${TEXTO_MAX_WIDTH_MM}mm`, margin: 0, fontSize: cuerpo(3.21), fontWeight: 500, color: COLORS.navy, lineHeight: 1.25, whiteSpace: "pre-line", wordBreak: "break-word", zIndex: 3 }}>
        {cot.subtituloPropuesta || "Propuesta de Sistema Fotovoltaico On Grid"}
      </p>

      <p style={{ position: "absolute", top: cajaY(693, CAP_CLIENTE), left: X(47), maxWidth: `${TEXTO_MAX_WIDTH_MM}mm`, margin: 0, fontSize: cuerpo(capCliente(cot.nombreCliente)), fontWeight: 700, color: COLORS.verde900, textTransform: "uppercase", lineHeight: 1.15, whiteSpace: "nowrap", zIndex: 3 }}>
        {cot.nombreCliente || "CLIENTE GENERAL"}
      </p>

      <div style={{ position: "absolute", top: Y(760), left: X(46), width: ANCHO(69), height: "0.45mm", background: COLORS.verde900, zIndex: 3 }} />

      <div style={{ position: "absolute", top: Y(804), left: X(48), height: "5.41mm", display: "flex", alignItems: "center", gap: "3.6mm", zIndex: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.8mm" }}>
          <FaMapMarkerAlt style={{ fontSize: "3.6mm", color: COLORS.navy }} />
          <span style={{ fontSize: "3.6mm", fontWeight: 500, color: COLORS.navy }}>
            {cot.ubicacion || cot.lugar || "Santa Cruz de la Sierra"}
          </span>
        </div>
        <div style={{ width: "0.25mm", height: "4.4mm", background: COLORS.navy800, opacity: 0.35 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "1.8mm" }}>
          <FaCalendarAlt style={{ fontSize: "3.6mm", color: COLORS.navy }} />
          <span style={{ fontSize: "3.6mm", fontWeight: 500, color: COLORS.navy }}>
            {fmtFechaCorta(cot.fecha)}
          </span>
        </div>
      </div>
    </section>
  );
}

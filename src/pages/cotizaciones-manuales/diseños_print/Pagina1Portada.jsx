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
// Toda la geometría de abajo sale de medir el arte del cliente (PNG 1536×1024)
// pixel a pixel: cada media luna se obtuvo ajustando por mínimos cuadrados los
// dos círculos que la generan sobre el borde real de la mancha de color
// (residuo máximo ≤ 2.5 px en las tres formas).
//
// El arte es 3:2 y la hoja es carta apaisada (1.294:1), así que no calzan solos.
// Conversión adoptada:  mm = px * 0.1832 - 2.0  en X,  mm = px * 0.1832  en Y.
// Es una escala ÚNICA (los círculos siguen siendo círculos): 1024 px → 187.6 mm,
// que es justo donde arranca la franja de atributos, y 1536 px → 281.4 mm, de
// los que se recortan 2 mm de hueso vacío por la izquierda para cerrar en 279.4.
// Consecuencia: el arte ocupa y 0 → 187.6 y la franja el resto (187.6 → 215.9).
//
// Si hay que reencuadrar, se recalculan TODOS los círculos con la misma escala.
// Mover un centro suelto deforma la media luna.

const FOTO_SRC = "/cotizacion/assets/paneles-solares-portada.png";

// La foto es la original completa (1424×1876), sin recortar: se coloca en una
// caja de su mismo aspecto y el círculo hace de máscara. La caja se corrió a la
// izquierda a propósito para que el sol caiga en x≈264.7 mm — dentro de la hoja —
// tal como en el arte. Su borde derecho (288.6 mm) queda fuera de la hoja, así
// que el hueco que deja a la derecha del círculo nunca se ve.
const FOTO_BOX = { x: 153.3, y: 17.1, w: 135.3, h: 178.2 };

// Círculo de la foto y de cada media luna (mm). "contiene" pinta, "recorta" resta.
const FOTO = { cx: 238.5, cy: 98.3, r: 80.0 };
const CIRC = {
  navy: { contiene: [260.7, 87.7, 114.1], recorta: [245.8, 114.2, 105.1], recorta2: [269.0, 61.9, 78.5] },
  azul: { contiene: [252.6, 115.0, 100.1], recorta: [266.2, 52.0, 132.3] },
  verde: { contiene: [280.4, 67.8, 82.0], recorta: [246.1, 114.0, 97.3] },
};

// Filetes concéntricos con el círculo que recorta el navy, apenas perceptibles.
const HAIRLINES = [122.4, 132.3, 142.4];

function CurvaPortada() {
  const c = (a) => <circle cx={a[0]} cy={a[1]} r={a[2]} />;
  return (
    <svg
      viewBox={`0 0 ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM}`}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
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
        {/* El arte del cliente termina donde empieza la franja de atributos */}
        <clipPath id="cArte">
          <rect x="0" y="0" width={PAGE_WIDTH_MM} height="187.6" />
        </clipPath>
      </defs>

      <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.hueso} />

      <g clipPath="url(#cArte)">
        <g fill="none" stroke={COLORS.navy} strokeOpacity={0.1} strokeWidth={0.25}>
          {HAIRLINES.map((r) => (
            <circle key={r} cx={CIRC.navy.recorta[0]} cy={CIRC.navy.recorta[1]} r={r} />
          ))}
        </g>

        <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.navy} mask="url(#mNavy)" />
        <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.azul} mask="url(#mAzul)" />
        <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill={COLORS.verde900} mask="url(#mVerde)" />

        <image
          href={FOTO_SRC}
          x={FOTO_BOX.x}
          y={FOTO_BOX.y}
          width={FOTO_BOX.w}
          height={FOTO_BOX.h}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#cFoto)"
        />
      </g>
    </svg>
  );
}

// La columna de texto del arte llega hasta y=153.7 mm y allí arranca su franja.
// En carta la franja arranca 25 mm más abajo, así que el bloque se baja la mitad
// de esa diferencia para que no quede colgado del logo ni pegado a la franja.
// Es el único número "de adaptación": subirlo o bajarlo mueve el bloque entero
// sin tocar el interlineado medido.
const SHIFT = 13.0;
const T = (mm) => `${(mm + SHIFT).toFixed(2)}mm`;

// Cuerpo tipográfico a partir de la altura de mayúscula medida en el arte
// (Montserrat: capHeight = 0.70 em; el tope de la caja queda 0.1585 em arriba).
const cuerpo = (capMm) => `${(capMm / 0.7).toFixed(2)}mm`;
const topeCaja = (capTopMm, capMm) => capTopMm - 0.1585 * (capMm / 0.7);

// Ninguna línea de texto pasa de x=131.6 mm, que es donde termina "ENERGÉTICO"
// en el arte. El borde izquierdo del navy queda en 146.6: quedan 15 mm de aire.
const TEXTO_MAX_WIDTH_MM = 131.6 - 7.0;

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

      {/* Logo — fondo transparente. Medido: x 4.6, y 7.5, alto 19.6 mm */}
      <div style={{ position: "absolute", top: "7.5mm", left: "4.6mm", zIndex: 3 }}>
        <Logo heightMm={19.6} />
      </div>

      {/* N° de propuesta — sobre la cuña verde, cerrando en x=271.9 mm */}
      <div style={{ position: "absolute", top: "4.67mm", right: "7.5mm", width: "70mm", textAlign: "right", zIndex: 3 }}>
        <p style={{ margin: 0, color: COLORS.blanco, fontSize: cuerpo(1.9), fontWeight: 500, letterSpacing: "0.25mm", lineHeight: 1 }}>
          N° DE PROPUESTA
        </p>
        <p style={{ margin: "3.4mm 0 0", color: COLORS.blanco, fontSize: cuerpo(2.8), fontWeight: 600, letterSpacing: "0.2mm", lineHeight: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "2.4mm" }}>
          <span style={{ display: "inline-block", width: "0.25mm", height: "4.2mm", background: COLORS.blanco }} />
          {cot.nroPropuesta || "—"}
          <span style={{ display: "inline-block", width: "0.25mm", height: "4.2mm", background: COLORS.blanco }} />
        </p>
      </div>

      {/* Eyebrow — mayúsculas verde-900, alto de caja 3.8 mm */}
      <p style={{ position: "absolute", top: T(topeCaja(45.3, 3.8)), left: "6.8mm", margin: 0, color: COLORS.verde900, fontSize: cuerpo(3.8), fontWeight: 700, letterSpacing: "0.42mm", lineHeight: 1, whiteSpace: "nowrap", zIndex: 3 }}>
        PROPUESTA COMERCIAL
      </p>

      <div style={{ position: "absolute", top: T(54.0), left: "6.6mm", width: "12.5mm", height: "0.5mm", background: COLORS.verde900, zIndex: 3 }} />

      {/* Título — dos líneas del mismo cuerpo, altura de mayúscula 15.0 mm */}
      <h1 style={{ position: "absolute", top: T(topeCaja(61.0, 15.0)), left: "7.0mm", margin: 0, color: COLORS.navy, fontSize: cuerpo(15.0), fontWeight: 700, lineHeight: 1, letterSpacing: "-0.1mm", zIndex: 3 }}>
        ESTUDIO
      </h1>
      <h1 style={{ position: "absolute", top: T(topeCaja(81.3, 15.0)), left: "7.0mm", margin: 0, color: COLORS.navy, fontSize: cuerpo(15.0), fontWeight: 700, lineHeight: 1, letterSpacing: "-0.1mm", zIndex: 3 }}>
        ENERGÉTICO
      </h1>

      <div style={{ position: "absolute", top: T(103.1), left: "6.4mm", width: "12.7mm", height: "0.5mm", background: COLORS.verde900, zIndex: 3 }} />

      <p style={{ position: "absolute", top: T(topeCaja(109.9, 3.9)), left: "6.8mm", maxWidth: `${TEXTO_MAX_WIDTH_MM}mm`, margin: 0, fontSize: cuerpo(3.9), fontWeight: 500, color: COLORS.navy, lineHeight: 1.25, whiteSpace: "pre-line", wordBreak: "break-word", zIndex: 3 }}>
        {cot.subtituloPropuesta || "Propuesta de Sistema Fotovoltaico On Grid"}
      </p>

      <p style={{ position: "absolute", top: T(topeCaja(127.0, 6.8)), left: "6.6mm", maxWidth: `${TEXTO_MAX_WIDTH_MM}mm`, margin: 0, fontSize: cuerpo(6.8), fontWeight: 700, color: COLORS.verde900, textTransform: "uppercase", lineHeight: 1.15, wordBreak: "break-word", zIndex: 3 }}>
        {cot.nombreCliente || "CLIENTE GENERAL"}
      </p>

      <div style={{ position: "absolute", top: T(139.2), left: "6.4mm", width: "12.7mm", height: "0.5mm", background: COLORS.verde900, zIndex: 3 }} />

      <div style={{ position: "absolute", top: T(147.3), left: "6.8mm", height: "6.4mm", display: "flex", alignItems: "center", gap: "4.4mm", zIndex: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2.2mm" }}>
          <FaMapMarkerAlt style={{ fontSize: "4.4mm", color: COLORS.navy }} />
          <span style={{ fontSize: "4.4mm", fontWeight: 500, color: COLORS.navy }}>
            {cot.ubicacion || cot.lugar || "Santa Cruz de la Sierra"}
          </span>
        </div>
        <div style={{ width: "0.3mm", height: "5.4mm", background: COLORS.navy800, opacity: 0.35 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "2.2mm" }}>
          <FaCalendarAlt style={{ fontSize: "4.4mm", color: COLORS.navy }} />
          <span style={{ fontSize: "4.4mm", fontWeight: 500, color: COLORS.navy }}>
            {fmtFechaCorta(cot.fecha)}
          </span>
        </div>
      </div>

      {/* Franja de atributos — a sangre, desde donde termina el arte */}
      <div style={{ position: "absolute", top: "187.6mm", left: 0, width: "100%", height: "28.3mm", zIndex: 3 }}>
        <FranjaAtributos escala="carta" />
      </div>
    </section>
  );
}

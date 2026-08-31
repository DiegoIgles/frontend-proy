import React from "react";
import { COLORS } from "./constants";

// ---------------------------------------------------------------------------
// Iconos de "NUESTRAS SOLUCIONES" — página 2
// ---------------------------------------------------------------------------
// Line-art plano redibujado del arte aprobado: trazo de 2 unidades, remates y
// uniones redondeadas, sin sombras ni degradados. Todos comparten el mismo
// sistema de coordenadas (viewBox 0 0 48 48) para que la grilla los alinee sin
// ajustes por icono, y todos pintan primero su disco de tinte —así el disco
// escala junto con el dibujo y nunca se desfasa.
//
// Los únicos colores permitidos son los de la paleta de marca (constants.js):
// el arte original usa un azul/verde ligeramente distintos, pero prevalece la
// coherencia con la página 1.

const AZUL = COLORS.azul;
const VERDE = COLORS.verde900;
const NAVY = COLORS.navy;
const NARANJA = COLORS.naranja;

function Disco({ tinte }) {
  return <circle cx="24" cy="24" r="23" fill={tinte} />;
}

// Sol de 8 rayos: se reutiliza en los iconos On Grid y Bombeo Solar.
function Sol({ cx, cy, r }) {
  const rayos = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const x1 = cx + Math.cos(a) * (r + 1.6);
    const y1 = cy + Math.sin(a) * (r + 1.6);
    const x2 = cx + Math.cos(a) * (r + 3.4);
    const y2 = cy + Math.sin(a) * (r + 3.4);
    rayos.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  return (
    <g stroke={NARANJA} strokeWidth="1.8" strokeLinecap="round">
      <circle cx={cx} cy={cy} r={r} fill={NARANJA} stroke="none" />
      {rayos}
    </g>
  );
}

const svgProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// 1 — Sistemas Fotovoltaicos On Grid
export function IconOnGrid(props) {
  return (
    <svg {...svgProps} {...props}>
      <Disco tinte={COLORS.tinteAzul} />
      <Sol cx={34.5} cy={12} r={3.4} />
      {/* Panel en perspectiva: cuerpo lleno y retícula 4×3 calada en blanco */}
      <path d="M8.5 22.5 L30.5 19 L34 31.5 L11.5 35.5 Z" fill={AZUL} stroke={AZUL} strokeWidth="1.6" />
      <g stroke={COLORS.blanco} strokeWidth="0.9">
        <path d="M9.9 27 L32.6 23.6" />
        <path d="M15.9 21.3 L19.3 34.2" />
        <path d="M21.3 20.4 L25 33.3" />
        <path d="M26.6 19.6 L30.2 32.4" />
      </g>
      <g stroke={AZUL} strokeWidth="2">
        <path d="M21.4 27.8 L21.4 39.5" />
        <path d="M15.6 41.5 L21.4 39.5 L27.2 41.5" />
      </g>
    </svg>
  );
}

// 2 — Sistemas Off Grid e Híbridos
export function IconOffGrid(props) {
  return (
    <svg {...svgProps} {...props}>
      <Disco tinte={COLORS.tinteVerde} />
      <rect x="19.5" y="6.5" width="9" height="3.6" rx="1.4" fill={VERDE} />
      <rect x="14.5" y="10" width="19" height="31" rx="5.5" stroke={VERDE} strokeWidth="2.4" />
      <path d="M25.8 16.5 L19 26.6 L23.6 26.6 L22.2 34.5 L29 24.4 L24.4 24.4 Z" fill={COLORS.verde} stroke={COLORS.verde} strokeWidth="1.4" />
    </svg>
  );
}

// 3 — Sistemas de Bombeo Solar
export function IconBombeoSolar(props) {
  return (
    <svg {...svgProps} {...props}>
      <Disco tinte={COLORS.tinteAzul} />
      <Sol cx={35} cy={12.5} r={3.2} />
      {/* Columna de impulsión que baja al reservorio */}
      <path d="M12.5 8.5 h6.5 v13.5" stroke={AZUL} strokeWidth="2.2" />
      <path d="M19 22 H34.5 a1.5 1.5 0 0 1 1.5 1.5 V36 a1.5 1.5 0 0 1 -1.5 1.5 H10.5 a1.5 1.5 0 0 1 -1.5 -1.5 V23.5 a1.5 1.5 0 0 1 1.5 -1.5 H12.5" stroke={AZUL} strokeWidth="2.2" />
      <g stroke={AZUL} strokeWidth="1.7">
        <path d="M10.5 28.5 q3.2 -2.4 6.4 0 t6.4 0 t6.4 0 t5.3 -0.6" />
        <path d="M10.5 33 q3.2 -2.4 6.4 0 t6.4 0 t6.4 0 t5.3 -0.6" />
      </g>
    </svg>
  );
}

// 4 — Infraestructura Eléctrica en Media y Baja Tensión
function Torre({ x }) {
  return (
    <g stroke={NAVY} strokeWidth="1.5" transform={`translate(${x} 0)`}>
      <path d="M0 9 L-4.2 37" />
      <path d="M0 9 L4.2 37" />
      <path d="M-1.5 19 H1.5" />
      <path d="M-2.5 26 H2.5" />
      <path d="M-3.4 32 H3.4" />
      <path d="M-1.5 19 L1.9 26" />
      <path d="M1.5 19 L-1.9 26" />
      <path d="M-2.5 26 L2.9 32" />
      <path d="M2.5 26 L-2.9 32" />
      <path d="M-6 12.5 H6" />
      <path d="M-4.6 16 H4.6" />
      <path d="M0 6 L0 9" />
      <path d="M-6 12.5 v2.2 M6 12.5 v2.2 M-4.6 16 v2 M4.6 16 v2" />
    </g>
  );
}

export function IconMediaBajaTension(props) {
  return (
    <svg {...svgProps} {...props}>
      <Disco tinte={COLORS.tinteAzul} />
      <Torre x={13} />
      <Torre x={26} />
      {/* Gabinete / transformador al pie de la segunda torre */}
      <g stroke={NAVY} strokeWidth="1.5">
        <path d="M24 30 H37 V40 H24 Z" />
        <path d="M26 30 v-2.6 M30.5 30 v-2.6 M35 30 v-2.6" />
        <path d="M26.6 33 v4.5 M29 33 v4.5 M31.5 33 v4.5 M34 33 v4.5" />
        <path d="M22.6 40 H38.4" />
      </g>
    </svg>
  );
}

// 5 — Gestión y tramitación ante CRE y AETN
export function IconTramitacion(props) {
  return (
    <svg {...svgProps} {...props}>
      <Disco tinte={COLORS.tinteVerde} />
      <path d="M12 8.5 H27.5 L35 16 V39.5 H12 Z" stroke={NAVY} strokeWidth="2" fill={COLORS.blanco} />
      <path d="M27.5 8.5 V16 H35" stroke={NAVY} strokeWidth="2" />
      <g stroke={NAVY} strokeWidth="1.7">
        <path d="M17 20 H24" />
        <path d="M17 25 H30" />
        <path d="M17 29.5 H30" />
        <path d="M17 34 H24" />
      </g>
      <circle cx="32" cy="34.5" r="7.5" fill={COLORS.blanco} stroke={VERDE} strokeWidth="2.2" />
      <path d="M28.4 34.6 L31.2 37.4 L36 31.8" stroke={VERDE} strokeWidth="2.4" />
    </svg>
  );
}

// 6 — Soluciones de carga para vehículos eléctricos
export function IconCargaVehiculos(props) {
  return (
    <svg {...svgProps} {...props}>
      <Disco tinte={COLORS.tinteVerde} />
      <path d="M11.5 10 a3 3 0 0 1 3 -3 H26 a3 3 0 0 1 3 3 V40 H11.5 Z" stroke={NAVY} strokeWidth="2" />
      <path d="M9.5 40 H31" stroke={NAVY} strokeWidth="2" />
      <rect x="14.5" y="10.5" width="12" height="10" rx="1.6" fill={VERDE} />
      {/* Silueta de auto calada sobre la pantalla */}
      <path d="M15.8 19 v-2.2 l1.4 -0.2 1.3 -2.1 a1.3 1.3 0 0 1 1.1 -0.6 h2.4 a1.3 1.3 0 0 1 1.1 0.6 l1.3 2.1 1.4 0.2 V19 Z" fill={COLORS.blanco} />
      <path d="M22.4 24 L17.6 31.4 L21 31.4 L20 37 L24.8 29.6 L21.4 29.6 Z" fill={VERDE} stroke={VERDE} strokeWidth="1.2" />
      {/* Conector y manguera */}
      <path d="M29 33 q6 0 6 -6 v-3" stroke={NAVY} strokeWidth="1.8" />
      <rect x="31.5" y="17.5" width="7" height="7" rx="1.6" stroke={NAVY} strokeWidth="1.8" />
      <path d="M33.4 17.5 v-3 M36.6 17.5 v-3" stroke={NAVY} strokeWidth="1.8" />
    </svg>
  );
}

export const ICONOS = {
  onGrid: IconOnGrid,
  offGrid: IconOffGrid,
  bombeo: IconBombeoSolar,
  tension: IconMediaBajaTension,
  tramitacion: IconTramitacion,
  carga: IconCargaVehiculos,
};

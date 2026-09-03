import React from "react";
import { COLORS } from "./constants";

// ---------------------------------------------------------------------------
// Iconos de la página 7 — "Protegemos tu inversión"
// ---------------------------------------------------------------------------
// Line-art en viewBox 0 0 48 48, igual que las páginas 2 a 5. Todos toman el
// color por prop `color` en vez de fijarlo: en esta página el MISMO dibujo
// aparece en verde sobre papel, en blanco sobre el navy de la tarjeta de
// compromiso y en blanco sobre las cabeceras de los dos programas.

const linea = (color, ancho = 2.4) => ({
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: color,
  strokeWidth: ancho,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

// Escudo con tilde: es el símbolo que ordena toda la página —encabeza los dos
// programas, la tarjeta de compromiso y la cobertura extendida—.
export function IconEscudo({ color = COLORS.verde900, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M24 4 7.5 10.3v13.4C7.5 34.4 14.5 43.4 24 45.5c9.5-2.1 16.5-11.1 16.5-21.8V10.3z" />
      <path d="M16 23.6 21.8 29.5 32.6 18.2" strokeWidth="3.4" />
    </svg>
  );
}

// Monitoreo: pantalla con la curva de desempeño.
export function IconMonitoreo({ color = COLORS.navy, ...props }) {
  return (
    <svg {...linea(color)} {...props}>
      <rect x="5" y="9" width="38" height="27" rx="3" />
      <path d="M18 43h12M24 36v7" />
      <path d="M11.5 27.5 18 20l5 4.2 8.5-9.7" />
      <path d="M27.5 14.5h5v5" />
    </svg>
  );
}

// Mantenimiento: llave inglesa. Misma silueta que la de la página 5, redibujada
// acá porque allá va cruzada con un destornillador y acá va sola.
export function IconLlave({ color = COLORS.navy, ...props }) {
  return (
    <svg {...linea(color)} {...props}>
      <path d="M34.5 4.5a8.5 8.5 0 0 0-9.4 12.2L6.9 34.9a3 3 0 0 0 0 4.2l2 2a3 3 0 0 0 4.2 0l18.2-18.2a8.5 8.5 0 0 0 12.2-9.4l-5.6 5.6-4.9-.9-.9-4.9z" />
    </svg>
  );
}

// Viñeta de las listas: tilde dentro de un aro fino. Va a ~2.4 mm impresos, así
// que el aro es lo que la separa del texto; un tilde suelto se confunde con una
// letra.
export function IconTilde({ color = COLORS.verde, ...props }) {
  return (
    <svg {...linea(color, 3)} {...props}>
      <circle cx="24" cy="24" r="20" strokeWidth="2.6" />
      <path d="M14.5 24.5 21 31l13-13.5" />
    </svg>
  );
}

// Atención prioritaria: la única viñeta que no es un tilde, para que se note
// que es lo que Premium suma sobre Plus.
export function IconEstrella({ color = COLORS.verde900, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M24 4.5 30 18l14.5 1.8-10.6 10 2.8 14.4L24 37.4 11.3 44.2l2.8-14.4-10.6-10L18 18z" />
    </svg>
  );
}

// Ahorro sostenible: hoja con su nervadura.
export function IconHojaLinea({ color = COLORS.verde900, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M39 8c0 15.5-11.5 27-27 27C12 19.5 23.5 8 39 8Z" />
      <path d="M9.5 40.5 32 18" />
    </svg>
  );
}

// Rendimiento y continuidad: barras con flecha.
export function IconRendimiento({ color = COLORS.verde900, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M6.5 41.5h35" />
      <path d="M12 41.5V30M21 41.5V22.5M30 41.5V27M39 41.5V16" />
      <path d="M9 20 19 10.5l6 5.2L41 6" />
      <path d="M33.5 6h7.5v7.5" />
    </svg>
  );
}

// Inversión anual: comprobante con el signo de moneda.
export function IconComprobante({ color = COLORS.verde900, ...props }) {
  return (
    <svg {...linea(color, 2.4)} {...props}>
      <path d="M10 5.5h20L38 14v28.5a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2v-35a2 2 0 0 1 2-2z" />
      <path d="M29.5 5.5V14H38" />
      <path d="M24 20.5v14M27.8 23.2a3.4 3.4 0 0 0-3.4-2.2h-1.2a2.9 2.9 0 0 0 0 5.8h1.6a2.9 2.9 0 0 1 0 5.8h-1.2a3.4 3.4 0 0 1-3.4-2.2" strokeWidth="2.1" />
    </svg>
  );
}

// Valor de contratación: apretón de manos. Mismo dibujo que la página 3, en
// line-art suelto.
export function IconApreton({ color = COLORS.verde900, ...props }) {
  return (
    <svg {...linea(color, 2.4)} viewBox="0 0 48 34" {...props}>
      <path d="M2.5 15.5 8.8 5.6l7.4 4.7-6.3 9.9z" />
      <path d="M45.5 15.5 39.2 5.6l-7.4 4.7 6.3 9.9z" />
      <path d="M16.2 10.3c3.4-1.8 6.4-2.5 9.1-2.1 2.6.4 4.6 1.5 6.5 2.1" />
      <path d="M31.8 10.3 24.6 16l-4.4 3.1c-1.6 1.1-3.3-.8-2.1-2.3l4.3-5.3" />
      <path d="M24.6 16l8.6 7.6M21.6 18.7l7.9 6.9M18.6 21.4l6.9 6" />
      <path d="M9.9 20.2l4.5 4.1M13.6 23.9l4 3.7M17.3 27.6l3.2 3" />
    </svg>
  );
}

// Cobertura: calendario, para el plazo del programa.
export function IconCalendario({ color = COLORS.verde900, ...props }) {
  return (
    <svg {...linea(color, 2.4)} {...props}>
      <rect x="6.5" y="10" width="35" height="32" rx="3.5" />
      <path d="M6.5 19.5h35M15 5.5v8M33 5.5v8" />
      <path d="M14 27h4M22 27h4M30 27h4M14 34.5h4M22 34.5h4M30 34.5h4" strokeWidth="2.1" />
    </svg>
  );
}

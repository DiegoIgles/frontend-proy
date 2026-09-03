import React from "react";
import { COLORS } from "./constants";

// ---------------------------------------------------------------------------
// Iconos de la página 5 — "Cotización"
// ---------------------------------------------------------------------------
// Line-art verde en viewBox 0 0 48 48, mismo trazo que las páginas 2 a 4. Son
// tres familias por dónde aparecen en la hoja:
//
//   · Cabecera  — pin, calendario y persona, en la tarjeta de datos de la oferta.
//   · Condiciones — apretón de manos y herramientas, en las tarjetas del pie.
//   · Notas     — hoja de documento.
//
// El apretón va DENTRO de un disco verde relleno con el dibujo calado en blanco:
// así lo pide el arte para ese único icono, y por eso no comparte el `linea` de
// los demás.

const VERDE = COLORS.verde;

const linea = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: VERDE,
  strokeWidth: 2.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Lugar: pin de mapa con el hueco calado, no un punto relleno.
export function IconLugar(props) {
  return (
    <svg {...linea} {...props}>
      <path d="M24 4.5c-7.5 0-13.5 6-13.5 13.5 0 9.6 13.5 25.5 13.5 25.5S37.5 27.6 37.5 18c0-7.5-6-13.5-13.5-13.5Z" />
      <circle cx="24" cy="17.8" r="5.2" />
    </svg>
  );
}

// Validez: calendario con las anillas arriba y la retícula de días.
export function IconValidez(props) {
  return (
    <svg {...linea} {...props}>
      <rect x="6.5" y="10" width="35" height="32" rx="3.5" />
      <path d="M6.5 19.5h35" />
      <path d="M15 5.5v8M33 5.5v8" />
      <g strokeWidth="2.2">
        <path d="M14 27h4M22 27h4M30 27h4M14 34.5h4M22 34.5h4M30 34.5h4" />
      </g>
    </svg>
  );
}

// Realizado por: busto. Hombros abiertos, sin cortar contra el borde.
export function IconPersona(props) {
  return (
    <svg {...linea} {...props}>
      <circle cx="24" cy="15.5" r="8.5" />
      <path d="M8.5 42.5a15.5 15.5 0 0 1 31 0" />
    </svg>
  );
}

// Condiciones comerciales: apretón de manos calado sobre disco verde. El dibujo
// es el mismo de IconCompromiso (página 3) —dos antebrazos, el pulgar cruzado
// sobre los nudillos y tres dedos—, reencuadrado: viene en una caja de 48×34 y
// hay que centrarlo y achicarlo para que respire dentro del disco.
export function IconCondiciones(props) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <circle cx="24" cy="24" r="23" fill={VERDE} />
      <g
        transform="translate(5.3 10.8) scale(0.78)"
        fill="none"
        stroke={COLORS.blanco}
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 15.5 8.8 5.6l7.4 4.7-6.3 9.9z" />
        <path d="M45.5 15.5 39.2 5.6l-7.4 4.7 6.3 9.9z" />
        <path d="M16.2 10.3c3.4-1.8 6.4-2.5 9.1-2.1 2.6.4 4.6 1.5 6.5 2.1" />
        <path d="M31.8 10.3 24.6 16l-4.4 3.1c-1.6 1.1-3.3-.8-2.1-2.3l4.3-5.3" />
        <path d="M24.6 16l8.6 7.6M21.6 18.7l7.9 6.9M18.6 21.4l6.9 6" />
        <path d="M9.9 20.2l4.5 4.1M13.6 23.9l4 3.7M17.3 27.6l3.2 3" />
      </g>
    </svg>
  );
}

// Tiempo de montaje: llave inglesa y destornillador cruzados en aspa, como en
// el arte. La llave va de arriba a la derecha hacia abajo a la izquierda y el
// destornillador al revés, para que el cruce quede en el centro.
export function IconMontaje(props) {
  return (
    <svg {...linea} {...props} strokeWidth="2.5">
      <path d="M34.5 4.5a8.5 8.5 0 0 0-9.4 12.2L6.9 34.9a3 3 0 0 0 0 4.2l2 2a3 3 0 0 0 4.2 0l18.2-18.2a8.5 8.5 0 0 0 12.2-9.4l-5.6 5.6-4.9-.9-.9-4.9z" />
      <path d="M7.2 14.4 14.4 7.2l6.9 6.9-3.6 3.6z" />
      <path d="m19.5 19.5 19.8 19.8a2.9 2.9 0 0 0 4.1-4.1L23.6 15.4" />
    </svg>
  );
}

// Notas: hoja con la esquina doblada y tres renglones.
export function IconNotas(props) {
  return (
    <svg {...linea} {...props}>
      <path d="M28.5 4.5H12a3.5 3.5 0 0 0-3.5 3.5v32a3.5 3.5 0 0 0 3.5 3.5h24a3.5 3.5 0 0 0 3.5-3.5V15.5z" />
      <path d="M28.5 4.5v11h11" />
      <g strokeWidth="2.2">
        <path d="M16 24.5h16M16 31h16M16 37.5h10" />
      </g>
    </svg>
  );
}

export const ICONOS_OFERTA = {
  lugar: IconLugar,
  validez: IconValidez,
  persona: IconPersona,
};

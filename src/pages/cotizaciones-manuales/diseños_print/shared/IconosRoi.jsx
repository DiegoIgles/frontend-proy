import React from "react";
import { COLORS } from "./constants";

// ---------------------------------------------------------------------------
// Iconos de la página 6 — "Retorno de inversión (ROI)"
// ---------------------------------------------------------------------------
// Casi todos van CALADOS EN BLANCO sobre un disco de color, no en line-art como
// los de las páginas 2 a 5: así los pide el arte de esta página, donde el color
// del disco es lo que agrupa cada indicador con su cifra (navy el ahorro anual,
// naranja el retorno, verde el acumulado).
//
// Por eso el disco lo dibuja el propio icono y no el contenedor: acá cada uno
// lleva su color y conviene que viajen juntos. `Disco` centra el glifo en un
// viewBox de 48 y deja 4 unidades de aire, que a 20 mm impresos es el mínimo
// para que el dibujo no se pegue al borde.

function Disco({ color, children, ...props }) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <circle cx="24" cy="24" r="24" fill={color} />
      <g fill={COLORS.blanco} stroke="none">
        {children}
      </g>
    </svg>
  );
}

// Ahorro anual: barras ascendentes con la flecha de crecimiento.
export function IconAhorroAnual(props) {
  return (
    <Disco color={COLORS.navy} {...props}>
      <path d="M12 27h4.6v10H12zM19.8 22.5h4.6V37h-4.6zM27.6 25h4.6v12h-4.6zM35.4 18h4.6v19h-4.6z" />
      <path d="M11 19.6 20 12l5.4 4.4L36.2 8v4.6l-10.6 8.6-5.4-4.4-7.6 6.4z" />
    </Disco>
  );
}

// Retorno: calendario, que es lo que mide el plazo.
export function IconRetorno(props) {
  return (
    <Disco color={COLORS.naranja} {...props}>
      <path d="M15 9h2.8v5H15zM30.2 9H33v5h-2.8z" />
      <path d="M11 13.5h26a2.5 2.5 0 0 1 2.5 2.5v3.5h-31V16a2.5 2.5 0 0 1 2.5-2.5z" />
      <path d="M8.5 22.5h31V37a2.5 2.5 0 0 1-2.5 2.5H11A2.5 2.5 0 0 1 8.5 37z" />
      <g fill={COLORS.naranja}>
        <path d="M13.5 26.5h5v4h-5zM21.5 26.5h5v4h-5zM29.5 26.5h5v4h-5zM13.5 33h5v4h-5zM21.5 33h5v4h-5zM29.5 33h5v4h-5z" />
      </g>
    </Disco>
  );
}

// Ahorro acumulado: alcancía. La moneda entrando es lo que la separa de un
// chanchito cualquiera y lo que la vuelve legible a 20 mm.
export function IconAhorroTotal(props) {
  return (
    <Disco color={COLORS.verde900} {...props}>
      <path d="M24.5 14c-7.7 0-13.9 4.8-13.9 10.7 0 3.3 1.9 6.2 5 8.1v4.4a1.4 1.4 0 0 0 1.4 1.4h3a1.4 1.4 0 0 0 1.4-1.4v-1.6c1 .1 2 .2 3.1.2s2.1-.1 3.1-.2v1.6a1.4 1.4 0 0 0 1.4 1.4h3a1.4 1.4 0 0 0 1.4-1.4v-4.4c1.9-1.2 3.4-2.7 4.2-4.5h1.8a1.4 1.4 0 0 0 1.4-1.4v-4.4a1.4 1.4 0 0 0-1.4-1.4h-2.3C36.5 17.6 31 14 24.5 14z" />
      <circle cx="31.5" cy="23.5" r="1.8" fill={COLORS.verde900} />
      <path d="M20 9.5a4.6 4.6 0 0 1 8.6 2.6 20 20 0 0 0-3.3-.3 4.6 4.6 0 0 1-5.3-2.3z" />
    </Disco>
  );
}

// Cabecera del cuadro y beneficio de ahorro: la misma flecha creciente que el
// primer indicador, sin las barras, para que el bloque se lea como su resumen.
export function IconResumen(props) {
  return (
    <Disco color={COLORS.verde} {...props}>
      <path d="M10 30.5 21 19l6.4 5.6L37 14.5v-5H24l3.6 3.6-6.6 6.8-6.4-5.6L8 22.5z" />
      <path d="M10 34h28v4.5H10z" />
    </Disco>
  );
}

// Nota al pie del cuadro: tilde de confirmación.
export function IconCheck(props) {
  return (
    <Disco color={COLORS.verde900} {...props}>
      <path d="M20.6 33.4 11.4 24.2l3.4-3.4 5.8 5.8 12.6-12.6 3.4 3.4z" />
    </Disco>
  );
}

// --- Beneficios -------------------------------------------------------------

export function IconRayo(props) {
  return (
    <Disco color={COLORS.verde900} {...props}>
      <path d="M27.4 6 12 27.5h9L19.2 42 35 20.5h-9.2z" />
    </Disco>
  );
}

export function IconHoja(props) {
  return (
    <Disco color={COLORS.navy} {...props}>
      {/* Lente entre dos curvas: esquinas en (36,10) y (10,36). Dibujada con
          arcos daba un borrón, porque los flags de barrido cerraban la figura
          por el lado equivocado. */}
      <path d="M36 10c0 14.4-11.6 26-26 26C10 21.6 21.6 10 36 10Z" />
      <path d="M11.6 34.4 34.4 11.6" stroke={COLORS.navy} strokeWidth="2.4" />
    </Disco>
  );
}

export function IconProteccion(props) {
  return (
    <Disco color={COLORS.naranja} {...props}>
      <path d="M24 6.5 9.5 12v11.5c0 8.9 6.1 16.4 14.5 18.5 8.4-2.1 14.5-9.6 14.5-18.5V12z" />
      <g fill={COLORS.naranja}>
        <path d="M21.9 15h4.2l-.6 12h-3z" />
        <circle cx="24" cy="31.5" r="2.2" />
      </g>
    </Disco>
  );
}

export function IconCasa(props) {
  return (
    <Disco color={COLORS.navy} {...props}>
      <path d="M24 8 7 22.6l2.6 3.1L24 13.8l14.4 11.9 2.6-3.1z" />
      <path d="M13 25.6 24 16.4l11 9.2V39H27.6v-8.6h-7.2V39H13z" />
    </Disco>
  );
}

export const ICONOS_BENEFICIO = {
  rayo: IconRayo,
  hoja: IconHoja,
  proteccion: IconProteccion,
  casa: IconCasa,
};

// --- Pie de página ----------------------------------------------------------
// Van en line-art verde sobre el navy del pie, no calados en disco.

const pie = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: COLORS.verde,
  strokeWidth: 2.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconWhatsapp(props) {
  return (
    <svg {...pie} {...props}>
      <path d="M8.5 39.5 11 31a16 16 0 1 1 6 6z" />
      <path d="M18.5 18.5c0 6 5 11 11 11 1.4 0 2.2-.5 2.2-2v-1.7l-3.6-1.6-1.7 2a10 10 0 0 1-4.6-4.6l2-1.7-1.6-3.6h-1.7c-1.5 0-2 .8-2 2.2z" strokeWidth="2.2" />
    </svg>
  );
}

export function IconWeb(props) {
  return (
    <svg {...pie} {...props}>
      <circle cx="24" cy="24" r="17.5" />
      <path d="M6.5 24h35" />
      <path d="M24 6.5c4.4 4.7 6.8 11 6.8 17.5S28.4 36.8 24 41.5c-4.4-4.7-6.8-11-6.8-17.5S19.6 11.2 24 6.5z" />
    </svg>
  );
}

export function IconUbicacion(props) {
  return (
    <svg {...pie} {...props}>
      <path d="M24 5.5c-7.2 0-13 5.8-13 13 0 9.3 13 24 13 24s13-14.7 13-24c0-7.2-5.8-13-13-13z" />
      <circle cx="24" cy="18.2" r="4.8" />
    </svg>
  );
}

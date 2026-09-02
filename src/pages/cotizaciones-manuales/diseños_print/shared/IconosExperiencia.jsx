import React from "react";
import { COLORS } from "./constants";

// ---------------------------------------------------------------------------
// Iconos de la página 3 — "La confianza de nuestra experiencia"
// ---------------------------------------------------------------------------
// Dos familias distintas, por eso conviven en un solo archivo pero con dos
// sistemas de coordenadas:
//
//   · MÉTRICAS (viewBox 0 0 100 100) — van DENTRO de un anillo. En el arte el
//     disco mide 73 px de diámetro con un aro de 2 px, así que el aro se dibuja
//     acá mismo (r = 48.5, trazo 2.7 ≙ 2 px del arte) y no como un borde CSS:
//     así el aro escala junto con el dibujo y nunca se desfasa medio píxel.
//   · VALORES (viewBox 0 0 48 48) — line-art suelto, sin aro, mismo sistema que
//     IconosSoluciones.jsx de la página 2 para que las dos franjas de la
//     cotización se dibujen con el mismo trazo.
//
// Los colores salen SIEMPRE de la paleta de marca. El arte usa un lima
// (#5D9E10) que no está en la paleta: se sustituye por COLORS.verde, que es el
// único verde de marca que lee sobre navy (verde900 se apaga demasiado).

const VERDE = COLORS.verde;
const AZUL = COLORS.azul;
const BLANCO = COLORS.blanco;

// --- Métricas ---------------------------------------------------------------

const aroProps = {
  viewBox: "0 0 100 100",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Aro({ color }) {
  return <circle cx="50" cy="50" r="48.5" stroke={color} strokeWidth="2.7" />;
}

// 1 — Proyectos ejecutados: portapapeles con tres ítems tildados.
// Es el único icono del trío que va en blanco con aro azul (en el arte marca la
// métrica "dura" de trayectoria); los otros dos son verdes.
export function IconProyectos(props) {
  return (
    <svg {...aroProps} {...props}>
      <Aro color={AZUL} />
      <g stroke={BLANCO} strokeWidth="3.2">
        {/* Tabla: la escotadura superior deja pasar la pinza */}
        <path d="M39 26.5h-6a3.5 3.5 0 0 0-3.5 3.5v43a3.5 3.5 0 0 0 3.5 3.5h34a3.5 3.5 0 0 0 3.5-3.5V30a3.5 3.5 0 0 0-3.5-3.5h-6" />
        {/* Pinza + presilla */}
        <path d="M43 22.5h14a2.5 2.5 0 0 1 2.5 2.5v6.5h-19V25a2.5 2.5 0 0 1 2.5-2.5Z" />
        <path d="M46.5 22.5a3.5 3.5 0 0 1 7 0" />
        {/* Tres ítems: tilde + renglón */}
        <g>
          <path d="M37.5 43.5l3 3 5.5-6" />
          <path d="M52 43.5h13" />
          <path d="M37.5 55l3 3 5.5-6" />
          <path d="M52 55h13" />
          <path d="M37.5 66.5l3 3 5.5-6" />
          <path d="M52 66.5h13" />
        </g>
      </g>
    </svg>
  );
}

// 2 — Potencia instalada: panel fotovoltaico con sol naciente.
export function IconPotencia(props) {
  const rayos = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    rayos.push(
      <line
        key={i}
        x1={50 + Math.cos(a) * 10}
        y1={26 + Math.sin(a) * 10}
        x2={50 + Math.cos(a) * 14}
        y2={26 + Math.sin(a) * 14}
      />
    );
  }
  return (
    <svg {...aroProps} {...props}>
      <Aro color={VERDE} />
      <g stroke={VERDE} strokeWidth="2.8">
        <circle cx="50" cy="26" r="6.5" />
        {rayos}
        {/* Módulo en leve perspectiva, retícula 3×3 */}
        <path d="M32 42h36l5 30H27z" />
        <path d="M32.9 52h34.2M31.6 62h36.8" />
        <path d="M44 42l-1.7 30M56 42l1.7 30" />
        {/* Poste */}
        <path d="M50 72v6" />
      </g>
    </svg>
  );
}

// 3 — CO₂ mitigadas: nube con el rótulo dentro y tres flechas de caída.
export function IconCo2(props) {
  return (
    <svg {...aroProps} {...props}>
      <Aro color={VERDE} />
      <g stroke={VERDE} strokeWidth="2.8">
        {/* Nube de base plana. Se recorre EN SENTIDO HORARIO (sweep-flag 1 en
            los tres arcos): subiendo por la izquierda, cruzando por arriba y
            bajando por la derecha, cada arco abomba hacia afuera. Invertir uno
            solo lo mete hacia adentro y la nube se vuelve un borrón. */}
        <path d="M28 58A11 11 0 0 1 32 37.6 15 15 0 0 1 60 35.5 13.5 13.5 0 0 1 72 58Z" />
        {/* Tres flechas de caída; la del medio baja más, como en el arte */}
        <path d="M39 60v11M39 71l-4.2-4.6M39 71l4.2-4.6" />
        <path d="M50 60v15M50 75l-4.2-4.6M50 75l4.2-4.6" />
        <path d="M61 60v11M61 71l-4.2-4.6M61 71l4.2-4.6" />
      </g>
      {/* El rótulo va como texto y no como trazado: a 13 mm de icono impreso el
          contorno de una "O" dibujada a mano se empasta y esto no. */}
      <text
        x="50"
        y="52"
        textAnchor="middle"
        fill={VERDE}
        fontFamily="Montserrat, Arial, sans-serif"
        fontWeight="700"
        fontSize="17"
      >
        CO
        <tspan fontSize="12" dy="3.5">
          2
        </tspan>
      </text>
    </svg>
  );
}

export const ICONOS_METRICA = {
  proyectos: IconProyectos,
  potencia: IconPotencia,
  co2: IconCo2,
};

// --- Valores ----------------------------------------------------------------

const valorProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: VERDE,
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Escudo con tilde.
export function IconCalidad(props) {
  return (
    <svg {...valorProps} {...props}>
      <path d="M24 3.5 6.5 10.4v12.2C6.5 33.3 13.9 42.4 24 44.5c10.1-2.1 17.5-11.2 17.5-21.9V10.4z" />
      <path d="M16.4 23.4 21.8 29l10-11" />
    </svg>
  );
}

// Engranaje de 8 dientes. Se generan por ángulo para que queden repartidos
// exactos: dibujarlos a mano siempre deja uno corrido un grado.
export function IconIngenieria(props) {
  const R_INT = 15.5;
  const R_EXT = 21.5;
  const dientes = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const w = 0.16; // media anchura angular del diente
    const p = (r, ang) => `${(24 + Math.cos(ang) * r).toFixed(2)} ${(24 + Math.sin(ang) * r).toFixed(2)}`;
    dientes.push(
      <path
        key={i}
        d={`M${p(R_INT, a - w)} L${p(R_EXT, a - w * 0.72)} L${p(R_EXT, a + w * 0.72)} L${p(R_INT, a + w)}`}
      />
    );
  }
  return (
    <svg {...valorProps} {...props}>
      <circle cx="24" cy="24" r={R_INT} />
      <circle cx="24" cy="24" r="6.4" />
      {dientes}
    </svg>
  );
}

// Apretón de manos: dos antebrazos con puño y el pulgar cruzado sobre los
// nudillos, como en el arte. Los dedos son tres arcos cortos, no líneas.
export function IconCompromiso(props) {
  return (
    <svg {...valorProps} {...props} viewBox="0 0 48 34">
      {/* Mangas */}
      <path d="M2.5 15.5 8.8 5.6l7.4 4.7-6.3 9.9z" />
      <path d="M45.5 15.5 39.2 5.6l-7.4 4.7 6.3 9.9z" />
      {/* Dorso de cada mano */}
      <path d="M16.2 10.3c3.4-1.8 6.4-2.5 9.1-2.1 2.6.4 4.6 1.5 6.5 2.1" />
      <path d="M31.8 10.3 24.6 16l-4.4 3.1c-1.6 1.1-3.3-.8-2.1-2.3l4.3-5.3" />
      {/* Apretón: pulgar sobre los nudillos y tres dedos */}
      <path d="M24.6 16l8.6 7.6M21.6 18.7l7.9 6.9M18.6 21.4l6.9 6" />
      <path d="M9.9 20.2l4.5 4.1M13.6 23.9l4 3.7M17.3 27.6l3.2 3" />
      <path d="M38.1 20.2 33.6 24" />
    </svg>
  );
}

// Hoja con nervadura, inclinada y con el tallo saliendo por abajo a la
// izquierda: la silueta es una gota rotada 45°, no una elipse.
export function IconSostenibilidad(props) {
  return (
    <svg {...valorProps} {...props}>
      {/* Silueta: lado derecho recto con la esquina superior en ángulo, cuarto
          de círculo abajo y semicírculo a la izquierda. No es una elipse. */}
      <path d="M41.5 6.5v17.6A17.6 17.6 0 0 1 23.9 41.7 17.6 17.6 0 0 1 23.9 6.5Z" />
      {/* Nervadura central: sale de la hoja y termina en punta abajo a la izquierda */}
      <path d="M6.5 43.5 35.5 14" />
      {/* Cuatro nervios laterales */}
      <path d="M17.6 32.4h-6.9M22.3 27.7h-9.4M26.4 23.6v-9.4M30.6 19.4l8.4-.4" />
    </svg>
  );
}

export const ICONOS_VALOR = {
  calidad: IconCalidad,
  ingenieria: IconIngenieria,
  compromiso: IconCompromiso,
  sostenibilidad: IconSostenibilidad,
};

import React from "react";
import { COLORS } from "./constants";

// ---------------------------------------------------------------------------
// Iconos de la página 4 — "Diseño del sistema"
// ---------------------------------------------------------------------------
// Dos familias, las dos en viewBox 0 0 48 48:
//
//   · VISTAS — line-art verde que acompaña al rótulo de cada imagen del
//     proyecto. Mismo trazo que IconosSoluciones (página 2) e IconosExperiencia
//     (página 3) para que las cuatro páginas se dibujen igual.
//   · KPI — glifo BLANCO y macizo. Va dentro de un disco navy que dibuja la
//     página, no el icono: el disco es el mismo para los cuatro y sale más
//     barato pintarlo una vez en el contenedor que repetirlo en cada SVG.
//
// El arte usa un verde lima (#59942A) que no está en la paleta; se sustituye
// por COLORS.verde, igual que en las páginas 2 y 3.

const VERDE = COLORS.verde;

const linea = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: VERDE,
  strokeWidth: 2.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Módulo fotovoltaico visto de frente, con retícula y poste. Es el icono del
// rótulo principal (vista superior) y el de "cantidad de paneles" comparte
// silueta a propósito: en el arte son la misma familia.
export function IconVistaSuperior(props) {
  return (
    <svg {...linea} {...props}>
      <path d="M9 10.5h30v23H9z" />
      <path d="M9 18.2h30M9 25.9h30" />
      <path d="M19 10.5v23M29 10.5v23" />
      <path d="M24 33.5v6M17 39.5h14" />
    </svg>
  );
}

// Cubo isométrico: contorno hexagonal más las tres aristas que salen del
// vértice frontal. Con eso se lee el volumen sin sombrear nada.
export function IconVista3D(props) {
  return (
    <svg {...linea} {...props}>
      <path d="M24 5.5 41.5 15v18L24 42.5 6.5 33V15z" />
      <path d="M24 24 41.5 15M24 24 6.5 15M24 24v18.5" />
    </svg>
  );
}

// Campo de módulos en perspectiva: trapecio con retícula 4×3. La inclinación
// de las verticales es lo que lo distingue del icono de vista superior.
export function IconVistaInclinada(props) {
  return (
    <svg {...linea} {...props}>
      <path d="M13.5 12h27l5.5 24H8z" />
      <path d="M11.7 24h30.9M10.2 30h33.9" />
      <path d="M22.5 12l-3.5 24M31.5 12l3.5 24" />
    </svg>
  );
}

// Nave industrial de frente: techo a dos aguas y estructura. En el arte es un
// triángulo con dos travesaños; se le agrega la base para que no quede flotando.
export function IconVistaLateral(props) {
  return (
    <svg {...linea} {...props}>
      <path d="M24 6.5 43.5 40.5h-39z" />
      <path d="M14.6 24h18.8M10.4 32h27.2" />
      <path d="M24 6.5v34" />
    </svg>
  );
}

export const ICONOS_VISTA = {
  vistaSuperior: IconVistaSuperior,
  vista3d: IconVista3D,
  vistaInclinada: IconVistaInclinada,
  vistaLateral: IconVistaLateral,
};

// --- KPI --------------------------------------------------------------------
// Macizos y en blanco: van sobre el disco navy, donde un line-art de 1 mm de
// trazo se cerraría al imprimir.

const macizo = { viewBox: "0 0 48 48", fill: COLORS.blanco };

export function IconPotenciaInstalada(props) {
  return (
    <svg {...macizo} {...props}>
      <path d="M27.8 4 12 26.4h9.2L19.4 44 36 21.2h-9.4z" />
    </svg>
  );
}

export function IconCantidadPaneles(props) {
  return (
    <svg {...macizo} {...props}>
      <path d="M22.6 5h2.8v5h-2.8zM11.9 8.3l2.2-1.6 2.9 4-2.2 1.6zM31 10.7l2.9-4 2.2 1.6-2.9 4z" />
      <path d="M10 15h28l3.4 19H6.6z" />
      <path d="M22.6 36h2.8v5.5h-2.8zM15.5 41h17v2.6h-17z" />
      {/* Retícula calada: el navy del disco se ve por los cortes */}
      <g fill={COLORS.navy}>
        <path d="M10.9 22.6h26.2v1.5H10.9zM9.7 28.4h28.6v1.5H9.7z" />
        <path d="M19.6 15.6h1.5l-1 18.4h-1.5zM26.9 15.6h1.5l1 18.4h-1.5z" />
      </g>
    </svg>
  );
}

// Superficie: las cuatro escuadras de un encuadre. Nada dentro — lo que mide
// es el área vacía.
export function IconSuperficie(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke={COLORS.blanco} strokeWidth="3.1" strokeLinecap="round" {...props}>
      <path d="M8 17V9.5a1.5 1.5 0 0 1 1.5-1.5H17M31 8h7.5A1.5 1.5 0 0 1 40 9.5V17M40 31v7.5a1.5 1.5 0 0 1-1.5 1.5H31M17 40H9.5A1.5 1.5 0 0 1 8 38.5V31" />
      <path d="M22 8h4M22 40h4M8 22v4M40 22v4" strokeWidth="2.4" />
    </svg>
  );
}

export function IconProduccion(props) {
  return (
    <svg {...macizo} {...props}>
      <path d="M8 30h7.5v12H8zM20.2 21h7.5v21h-7.5zM32.4 10h7.5v32h-7.5z" />
    </svg>
  );
}

export const ICONOS_KPI = {
  potencia: IconPotenciaInstalada,
  paneles: IconCantidadPaneles,
  superficie: IconSuperficie,
  produccion: IconProduccion,
};

// --- Medalla de ingeniería --------------------------------------------------
// Solo para la franja de la página 4: su arte cambia el icono de "Ingeniería
// Especializada" por una medalla —corona de engranaje con dos cintas colgando—
// mientras que la portada conserva el de FranjaAtributos. Por eso vive acá y no
// allá: si se cambiara el compartido cambiarían las dos páginas.
//
// El medallón va arriba y las cintas abajo, así que la corona es más chica que
// en un engranaje suelto: el conjunto tiene que entrar igual en los 48×48 del
// resto de la familia para que la franja no se descuadre.
//
// Los doce dientes se generan por ángulo. Dibujarlos a mano siempre deja uno
// corrido un grado, y a 8 mm impresos eso se lee como un engranaje torcido.
export function IconMedallaIngenieria(props) {
  const CY = 17.5;
  const dientes = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * 2 * Math.PI) / 12;
    const p = (r) => `${(24 + Math.cos(a) * r).toFixed(2)} ${(CY + Math.sin(a) * r).toFixed(2)}`;
    dientes.push(<path key={i} d={`M${p(11.6)} L${p(14.4)}`} strokeWidth={3.6} strokeLinecap="round" />);
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke={VERDE} strokeLinejoin="round" {...props}>
      {/* Cintas: van primero para que el medallón las tape donde nacen */}
      <path d="M18.6 26.5 12.4 44.8 17.4 42.2 20.4 46.2 25.4 32.6Z" strokeWidth={2.2} />
      <path d="M29.4 26.5 35.6 44.8 30.6 42.2 27.6 46.2 22.6 32.6Z" strokeWidth={2.2} />
      <g>{dientes}</g>
      <circle cx="24" cy={CY} r="11.4" strokeWidth={2.4} />
      <circle cx="24" cy={CY} r="6.6" strokeWidth={2.1} />
    </svg>
  );
}

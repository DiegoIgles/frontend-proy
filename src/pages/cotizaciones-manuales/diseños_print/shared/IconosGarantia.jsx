import React from "react";
import { COLORS } from "./constants";
import {
  IconPanelSolar, IconInversor, IconHerramientas, IconEscudo, IconMonitoreo, IconLlave, IconAuricular,
  IconEstrella, IconCalendario, IconRendimiento,
} from "./IconosProteccion";

// ---------------------------------------------------------------------------
// Set de iconos elegibles para las tarjetas de GARANTÍAS (página 8).
// ---------------------------------------------------------------------------
// Todos se pintan CALADOS EN BLANCO sobre el disco navy de la tarjeta, así que
// acá cada uno se adapta a una firma única: `({ color, ...props })` con line-art
// del color pedido. Los que ya existían en el sistema se reutilizan tal cual;
// los que en su origen pintan disco propio (soluciones de la página 2) se
// redibujan en línea para que lean sobre el navy. La clave (`panel`, `bombeo`…)
// es lo que se guarda en la cotización (`garantias[].icono`); el backend valida
// contra la misma lista (ICONOS_GARANTIA en cotizacion-manual.entity.ts).

const linea = (color, grosor = 2.8) => ({
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: color,
  strokeWidth: grosor,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

// Batería: cuerpo con borne y símbolos + / −, como en el arte de la página 8.
export function IconBateria({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color)} {...props}>
      <rect x="5" y="14" width="34" height="20" rx="3" />
      <path d="M39 20h3.5v8H39" />
      <path d="M14 24h7M17.5 20.5v7" />
      <path d="M27 24h7" />
    </svg>
  );
}

// Bombeo solar: sol y reservorio con ondas, en línea.
export function IconBombeo({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <circle cx="35" cy="11" r="3.2" />
      <path d="M35 4.5v2M35 15.5v2M28.5 11h2M39.5 11h2M30.4 6.4l1.4 1.4M38.2 14.2l1.4 1.4M30.4 15.6l1.4-1.4M38.2 7.8l1.4-1.4" strokeWidth="1.8" />
      <path d="M12 9h7v13" />
      <path d="M19 22h15.5a1.5 1.5 0 0 1 1.5 1.5V37a1.5 1.5 0 0 1-1.5 1.5H10.5A1.5 1.5 0 0 1 9 37V23.5a1.5 1.5 0 0 1 1.5-1.5H12" />
      <path d="M11 28.5q3.2-2.4 6.4 0t6.4 0 6.4 0 3.8-.4M11 33q3.2-2.4 6.4 0t6.4 0 6.4 0 3.8-.4" strokeWidth="2" />
    </svg>
  );
}

// On Grid: casa con panel y poste de red.
export function IconOnGridLinea({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M7 24 21 12l14 12" />
      <path d="M11 22v16h20V22" />
      <path d="M15 18.5 21 14l6 4.5" strokeWidth="2" />
      <path d="M38 8v30M33 12h10M34.5 17h7" />
    </svg>
  );
}

// Off Grid: panel con batería.
export function IconOffGridLinea({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M9 7h22l3.5 14H5.5z" />
      <path d="M7.5 14h24.5M20 7v14" strokeWidth="2" />
      <rect x="14" y="27" width="22" height="12" rx="2.5" />
      <path d="M36 31h3v4h-3M20 33h5M22.5 30.5v5" />
    </svg>
  );
}

// Carga de vehículos: auto con enchufe.
export function IconCargaLinea({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M8 30v-8l4-9h20l4 9v8" />
      <path d="M6 30h36M12 30v5h6v-5M30 30v5h6v-5" />
      <path d="M12 22h24" strokeWidth="2" />
      <path d="M40 22V11m0 0h3v5h-6v-5h3" />
    </svg>
  );
}

// Tramitación: documento con tilde.
export function IconTramiteLinea({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <path d="M12 6h16l8 8v28H12z" />
      <path d="M28 6v8h8" />
      <path d="M18 30l4 4 8-9" />
    </svg>
  );
}

// Rayo, casa, hoja y medalla existen en el sistema con disco propio de color
// (IconosRoi / IconosDiseno); acá van en línea para calar sobre el navy.
export function IconRayoLinea({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color)} {...props}>
      <path d="M27.4 6 12 27.5h9L19.2 42 35 20.5h-9.2z" />
    </svg>
  );
}
export function IconCasaLinea({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color)} {...props}>
      <path d="M6 24 24 8l18 16" />
      <path d="M11 21v19h26V21" />
      <path d="M20 40V29h8v11" />
    </svg>
  );
}
export function IconHojaLinea({ color = COLORS.blanco, ...props }) {
  return (
    <svg {...linea(color)} {...props}>
      <path d="M39 8C22 8 10 18 9 36c18 1 28-11 30-28z" />
      <path d="M9 36c8-10 16-16 24-20" strokeWidth="2.2" />
    </svg>
  );
}
export function IconMedallaLinea({ color = COLORS.blanco, ...props }) {
  const dientes = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * 2 * Math.PI) / 12;
    const p = (r) => `${(24 + Math.cos(a) * r).toFixed(2)} ${(18 + Math.sin(a) * r).toFixed(2)}`;
    dientes.push(<path key={i} d={`M${p(11.5)} L${p(14.2)}`} />);
  }
  return (
    <svg {...linea(color, 2.6)} {...props}>
      <circle cx="24" cy="18" r="10" />
      {dientes}
      <path d="M19 17.5l3.5 3.5 6.5-7" />
      <path d="M17 30l-3 13 10-5 10 5-3-13" />
    </svg>
  );
}

const conColor = (Comp) => ({ color = COLORS.blanco, ...p }) => <Comp color={color} {...p} />;

/**
 * Registro clave → { Icono, nombre }. `nombre` es lo que ve el usuario en el
 * selector del formulario. Mantener sincronizado con ICONOS_GARANTIA del backend.
 */
export const ICONOS_GARANTIA = {
  panel: { Icono: conColor(IconPanelSolar), nombre: "Panel solar" },
  inversor: { Icono: conColor(IconInversor), nombre: "Inversor" },
  herramientas: { Icono: conColor(IconHerramientas), nombre: "Herramientas / instalación" },
  bombeo: { Icono: IconBombeo, nombre: "Bombeo solar" },
  bateria: { Icono: IconBateria, nombre: "Batería" },
  escudo: { Icono: conColor(IconEscudo), nombre: "Escudo" },
  rayo: { Icono: IconRayoLinea, nombre: "Rayo / energía" },
  casa: { Icono: IconCasaLinea, nombre: "Casa" },
  hoja: { Icono: IconHojaLinea, nombre: "Hoja / sostenible" },
  monitoreo: { Icono: conColor(IconMonitoreo), nombre: "Monitoreo" },
  llave: { Icono: conColor(IconLlave), nombre: "Llave / mantenimiento" },
  auricular: { Icono: conColor(IconAuricular), nombre: "Posventa / soporte" },
  medalla: { Icono: IconMedallaLinea, nombre: "Medalla / calidad" },
  estrella: { Icono: conColor(IconEstrella), nombre: "Estrella" },
  calendario: { Icono: conColor(IconCalendario), nombre: "Calendario" },
  rendimiento: { Icono: conColor(IconRendimiento), nombre: "Rendimiento" },
  ongrid: { Icono: IconOnGridLinea, nombre: "Sistema On Grid" },
  offgrid: { Icono: IconOffGridLinea, nombre: "Sistema Off Grid" },
  cargaVehiculos: { Icono: IconCargaLinea, nombre: "Carga de vehículos" },
  tramitacion: { Icono: IconTramiteLinea, nombre: "Trámites / gestión" },
};

export const CLAVES_ICONO_GARANTIA = Object.keys(ICONOS_GARANTIA);

export function IconoGarantia({ clave, ...props }) {
  const def = ICONOS_GARANTIA[clave] ?? ICONOS_GARANTIA.escudo;
  return <def.Icono {...props} />;
}

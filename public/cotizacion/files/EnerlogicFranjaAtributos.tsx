import React from "react";

/**
 * Franja de atributos Enerlogic.
 * Estilos en línea a propósito: así funciona igual dentro de la app,
 * en un correo o cuando el HTML se manda a un generador de PDF.
 */

export const ENERLOGIC = {
  navy: "#001B3D",
  navy800: "#0A2A52",
  azul: "#0062B7",
  verde: "#2C9826",
  verde900: "#056125",
  naranja: "#EE9C02",
  hueso: "#F1F1F1",
  blanco: "#FFFFFF",
} as const;

const V = ENERLOGIC.verde;
const B = ENERLOGIC.blanco;

const svgBase = {
  width: "100%",
  height: "100%",
  viewBox: "0 0 48 48",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const IconoIngenieria = () => (
  <svg {...svgBase} role="img" aria-label="Ingeniería especializada">
    <g stroke={V} strokeWidth={2.2}>
      <circle cx="24" cy="12.5" r="4.6" />
      <path d="M24 3.4v2.6M24 19v2.6M15.6 12.5h-2.6M35 12.5h-2.6M18.1 6.6 16.3 4.8M31.7 20.2l-1.8-1.8M29.9 6.6l1.8-1.8M18.1 18.4l-1.8 1.8" />
    </g>
    <g stroke={B} strokeWidth={2.2}>
      <path d="M13.4 26.2h21.2L38 39.4H10z" />
      <path d="M11.7 32.8h24.6M24 26.2v13.2M17.4 39.4l1.6-13.2M30.6 39.4 29 26.2" />
      <path d="M24 39.4v4.8M19.6 44.2h8.8" />
    </g>
  </svg>
);

export const IconoConfiables = () => (
  <svg {...svgBase} role="img" aria-label="Soluciones confiables">
    <path
      d="M24 3.6 6.4 11.1v13.1c0 10.4 7.2 17.9 17.6 20.2 10.4-2.3 17.6-9.8 17.6-20.2V11.1z"
      fill={V}
      stroke={V}
      strokeWidth={2.2}
    />
    <path d="M15.6 23.9 21.7 30l10.7-11.4" stroke={B} strokeWidth={3.2} />
  </svg>
);

export const IconoEficiencia = () => (
  <svg {...svgBase} role="img" aria-label="Energía eficiente y sostenible">
    <g stroke={V} strokeWidth={2.6}>
      <path d="M8.5 24.4 18 14.9l6.6 6.6L39.5 6.6" />
      <path d="M30.4 6.6h9.1v9.1" />
    </g>
    <g stroke={B} strokeWidth={2.6}>
      <path d="M11.4 41.4V30.2M21.7 41.4V26.9M32 41.4V21.6" />
      <path d="M5.4 41.4h37.2" />
    </g>
  </svg>
);

export const IconoPosventa = () => (
  <svg {...svgBase} role="img" aria-label="Acompañamiento posventa">
    <circle cx="24" cy="24" r="20.4" stroke={V} strokeWidth={2.2} />
    <path d="M13.6 25.6v-2.2a10.4 10.4 0 0 1 20.8 0v2.2" stroke={B} strokeWidth={2.2} />
    <path
      d="M13.6 22.6h1.6a1.9 1.9 0 0 1 1.9 1.9v4.4a1.9 1.9 0 0 1-1.9 1.9h-1.6a2.6 2.6 0 0 1-2.6-2.6v-3a2.6 2.6 0 0 1 2.6-2.6Z"
      fill={V}
      stroke={V}
      strokeWidth={1.6}
    />
    <path
      d="M34.4 22.6h-1.6a1.9 1.9 0 0 0-1.9 1.9v4.4a1.9 1.9 0 0 0 1.9 1.9h1.6a2.6 2.6 0 0 0 2.6-2.6v-3a2.6 2.6 0 0 0-2.6-2.6Z"
      fill={V}
      stroke={V}
      strokeWidth={1.6}
    />
    <path d="M34.9 30.8v1.6a3.4 3.4 0 0 1-3.4 3.4H26" stroke={B} strokeWidth={2.2} />
    <rect x="21.4" y="33.2" width="4.8" height="5" rx="2.4" fill={B} />
  </svg>
);

type Atributo = { icono: React.ReactNode; texto: string };

const ATRIBUTOS: Atributo[] = [
  { icono: <IconoIngenieria />, texto: "Ingeniería especializada" },
  { icono: <IconoConfiables />, texto: "Soluciones confiables" },
  { icono: <IconoEficiencia />, texto: "Energía eficiente y sostenible" },
  { icono: <IconoPosventa />, texto: "Acompañamiento posventa" },
];

/**
 * escala="carta"  -> tamanos reducidos para que "ENERGIA EFICIENTE Y SOSTENIBLE"
 *                 entre en UNA sola linea dentro de una hoja carta horizontal (279.4 mm).
 * escala="web" -> tamanos de pantalla.
 */
export function EnerlogicFranjaAtributos({
  atributos = ATRIBUTOS,
  mostrarBarra = true,
  escala = "web",
}: {
  atributos?: Atributo[];
  mostrarBarra?: boolean;
  escala?: "web" | "carta";
}) {
  const carta = escala === "carta";
  const fs = carta ? 8 : 13;
  const icono = carta ? 30 : 44;

  return (
    <div style={{ background: ENERLOGIC.navy, padding: carta ? "16px 18px" : "26px 40px" }}>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          maxWidth: carta ? 756 : undefined, // 200 mm: los 4 items ocupan la izquierda de la banda
          gap: carta ? 0 : "20px 0",
          alignItems: "center",
        }}
      >
        {atributos.map((a, i) => (
          <li
            key={a.texto}
            style={{
              display: "flex",
              alignItems: "center",
              gap: carta ? 9 : 14,
              padding: i === 0 ? (carta ? "0 12px 0 0" : "0 26px 0 0") : carta ? "0 12px" : "0 26px",
              borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,.18)",
            }}
          >
            <span style={{ display: "flex", width: icono, height: icono, flex: "0 0 auto" }}>
              {a.icono}
            </span>
            <span
              style={{
                color: ENERLOGIC.blanco,
                fontFamily: "Montserrat, system-ui, sans-serif",
                fontSize: fs,
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: carta ? ".03em" : ".05em",
                textTransform: "uppercase",
                whiteSpace: "nowrap", // una sola linea, siempre
              }}
            >
              {a.texto}
            </span>
          </li>
        ))}
      </ul>

      {mostrarBarra && (
        <div
          style={{ display: "flex", width: carta ? 180 : 290, height: carta ? 4 : 5, marginTop: carta ? 14 : 26 }}
          aria-hidden
        >
          <span style={{ flex: 1, background: ENERLOGIC.verde }} />
          <span style={{ flex: 1, background: ENERLOGIC.azul }} />
          <span style={{ flex: 1, background: ENERLOGIC.naranja }} />
        </div>
      )}
    </div>
  );
}

export default EnerlogicFranjaAtributos;

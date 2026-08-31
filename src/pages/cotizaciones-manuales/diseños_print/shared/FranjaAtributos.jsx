import React from "react";
import { COLORS } from "./constants";

// Íconos de la franja — trazo verde + blanco, sin relleno salvo donde se indica.
const svgBase = {
  width: "100%",
  height: "100%",
  viewBox: "0 0 48 48",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function IconoIngenieria() {
  return (
    <svg {...svgBase} role="img" aria-label="Ingeniería especializada">
      <g stroke={COLORS.verde} strokeWidth={2.2}>
        <circle cx="24" cy="12.5" r="4.6" />
        <path d="M24 3.4v2.6M24 19v2.6M15.6 12.5h-2.6M35 12.5h-2.6M18.1 6.6 16.3 4.8M31.7 20.2l-1.8-1.8M29.9 6.6l1.8-1.8M18.1 18.4l-1.8 1.8" />
      </g>
      <g stroke={COLORS.blanco} strokeWidth={2.2}>
        <path d="M13.4 26.2h21.2L38 39.4H10z" />
        <path d="M11.7 32.8h24.6M24 26.2v13.2M17.4 39.4l1.6-13.2M30.6 39.4 29 26.2" />
        <path d="M24 39.4v4.8M19.6 44.2h8.8" />
      </g>
    </svg>
  );
}

function IconoConfiables() {
  return (
    <svg {...svgBase} role="img" aria-label="Soluciones confiables">
      <path
        d="M24 3.6 6.4 11.1v13.1c0 10.4 7.2 17.9 17.6 20.2 10.4-2.3 17.6-9.8 17.6-20.2V11.1z"
        fill={COLORS.verde}
        stroke={COLORS.verde}
        strokeWidth={2.2}
      />
      <path d="M15.6 23.9 21.7 30l10.7-11.4" stroke={COLORS.blanco} strokeWidth={3.2} />
    </svg>
  );
}

function IconoEficiencia() {
  return (
    <svg {...svgBase} role="img" aria-label="Energía eficiente y sostenible">
      <g stroke={COLORS.verde} strokeWidth={2.6}>
        <path d="M8.5 24.4 18 14.9l6.6 6.6L39.5 6.6" />
        <path d="M30.4 6.6h9.1v9.1" />
      </g>
      <g stroke={COLORS.blanco} strokeWidth={2.6}>
        <path d="M11.4 41.4V30.2M21.7 41.4V26.9M32 41.4V21.6" />
        <path d="M5.4 41.4h37.2" />
      </g>
    </svg>
  );
}

function IconoPosventa() {
  return (
    <svg {...svgBase} role="img" aria-label="Acompañamiento posventa">
      <circle cx="24" cy="24" r="20.4" stroke={COLORS.verde} strokeWidth={2.2} />
      <path d="M13.6 25.6v-2.2a10.4 10.4 0 0 1 20.8 0v2.2" stroke={COLORS.blanco} strokeWidth={2.2} />
      <path
        d="M13.6 22.6h1.6a1.9 1.9 0 0 1 1.9 1.9v4.4a1.9 1.9 0 0 1-1.9 1.9h-1.6a2.6 2.6 0 0 1-2.6-2.6v-3a2.6 2.6 0 0 1 2.6-2.6Z"
        fill={COLORS.verde}
        stroke={COLORS.verde}
        strokeWidth={1.6}
      />
      <path
        d="M34.4 22.6h-1.6a1.9 1.9 0 0 0-1.9 1.9v4.4a1.9 1.9 0 0 0 1.9 1.9h1.6a2.6 2.6 0 0 0 2.6-2.6v-3a2.6 2.6 0 0 0-2.6-2.6Z"
        fill={COLORS.verde}
        stroke={COLORS.verde}
        strokeWidth={1.6}
      />
      <path d="M34.9 30.8v1.6a3.4 3.4 0 0 1-3.4 3.4H26" stroke={COLORS.blanco} strokeWidth={2.2} />
      <rect x="21.4" y="33.2" width="4.8" height="5" rx="2.4" fill={COLORS.blanco} />
    </svg>
  );
}

// Cada etiqueta va en 2 renglones, igual que el arte aprobado — no en una
// sola línea. El salto está fijo (no depende del ancho disponible) porque
// el punto de quiebre no siempre es tras la primera palabra.
const ATRIBUTOS = [
  { icono: <IconoIngenieria />, texto: "Ingeniería\nEspecializada" },
  { icono: <IconoConfiables />, texto: "Soluciones\nConfiables" },
  { icono: <IconoEficiencia />, texto: "Energía eficiente\ny sostenible" },
  { icono: <IconoPosventa />, texto: "Acompañamiento\nPosventa" },
];

// `fondo`: normalmente el navy de la banda. En la portada se pasa "transparent"
// porque ahí el navy lo pinta el SVG del arte por debajo de las curvas, y esta
// franja se monta encima para que los rótulos se lean sobre la media luna azul.
export function FranjaAtributos({ atributos = ATRIBUTOS, mostrarBarra = true, escala = "web", fondo = COLORS.navy }) {
  const carta = escala === "carta";
  // La fila del arte va de x 8.9 a 175.5 mm y los cuatro ítems entran SIEMPRE en
  // un solo renglón. El arte usa una tipografía más angosta que Montserrat
  // (0.41 em por carácter contra 0.64), así que con la mayúscula de 2.4 mm del
  // original los rótulos no entrarían y el cuarto ítem se caería a una segunda
  // fila encima de la barra tricolor. Estos valores son el máximo que entra:
  // ícono 7.9 mm y mayúscula 2.0 mm dejan ~17 px de aire en los 166.6 mm.
  const fs = carta ? 11 : 13;
  const icono = carta ? 30 : 44;

  return (
    <div style={{ background: fondo, padding: carta ? "20px 18px 14px 34px" : "26px 40px", width: "100%", height: "100%", boxSizing: "border-box", position: "relative" }}>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          // En carta los cuatro ítems van sí o sí en un renglón: si se envuelven,
          // el cuarto cae sobre la barra tricolor.
          flexWrap: carta ? "nowrap" : "wrap",
          justifyContent: "space-between",
          // 166.6 mm: en el arte los cuatro ítems van de x 8.9 a 175.5 mm, o sea
          // ocupan solo el tercio izquierdo largo de la banda, no el ancho entero.
          maxWidth: carta ? 630 : undefined,
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
              flex: "0 0 auto",
              gap: carta ? 11 : 14,
              padding: i === 0 ? (carta ? "0 10px 0 0" : "0 26px 0 0") : carta ? "0 10px" : "0 26px",
              borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,.18)",
            }}
          >
            <span style={{ display: "flex", width: icono, height: icono, flex: "0 0 auto" }}>
              {a.icono}
            </span>
            <span
              style={{
                color: COLORS.blanco,
                fontFamily: "Montserrat, 'Segoe UI', system-ui, sans-serif",
                fontSize: fs,
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: carta ? ".02em" : ".05em",
                textTransform: "uppercase",
                whiteSpace: "pre-line",
              }}
            >
              {a.texto}
            </span>
          </li>
        ))}
      </ul>

      {mostrarBarra && (
        <div
          style={
            carta
              ? { display: "flex", position: "absolute", top: "22.0mm", left: "8.7mm", width: "49.9mm", height: "0.9mm" }
              : { display: "flex", width: 290, height: 5, marginTop: 26 }
          }
          aria-hidden="true"
        >
          <span style={{ flex: 1, background: COLORS.verde }} />
          <span style={{ flex: 1, background: COLORS.azul }} />
          <span style={{ flex: 1, background: COLORS.naranja }} />
        </div>
      )}
    </div>
  );
}

export default FranjaAtributos;

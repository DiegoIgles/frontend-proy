import React from "react";

// Logo corporativo único, fondo transparente — no usar variantes ni el
// logo_1.jpg original (trae caja blanca de fondo).
export function Logo({ heightMm = 16 }) {
  return (
    <img
      src="/cotizacion/assets/logo_1-transparente.png"
      alt="Enerlogic - Energía Inteligente"
      style={{
        height: `${heightMm}mm`,
        width: "auto",
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}

import React from "react";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS } from "./constants";

// Escalas del arte apaisado (1536×1024), las mismas que usan las páginas 2 a 5.
const X = (px) => +(px * (PAGE_WIDTH_MM / 1536)).toFixed(2);
const Y = (px) => +(px * (PAGE_HEIGHT_MM / 1024)).toFixed(2);

// La cinta de la esquina inferior derecha. No es una familia de arcos
// concéntricos —con eso las cuatro bandas tendrían el mismo grosor en todo el
// recorrido— sino un barrido: nacen anchas en el borde inferior y se afinan
// hasta juntarse contra el borde derecho, donde la naranja y la azul ya se
// terminaron y solo quedan el blanco y el verde.
//
// Cada frontera de color se midió en el arte en cinco alturas (y = 1024, 1006,
// 980, 955 y el borde derecho) y se ajustó como una cuadrática de Bézier que va
// del borde inferior al derecho. Se pintan de afuera hacia adentro y cada una
// cierra por la esquina inferior derecha: lo que se ve de cada color es la
// franja que la siguiente no llegó a tapar, y el verde, que va último, se queda
// con la esquina.
const CINTA = [
  { x0: 1189, cx: 1337.5, cy: 925.0, y1: 926, color: COLORS.naranja },
  { x0: 1225, cx: 1279.5, cy: 948.5, y1: 927, color: COLORS.azul },
  { x0: 1353, cx: 1405.5, cy: 960.0, y1: 928, color: COLORS.blanco },
  { x0: 1385, cx: 1439.5, cy: 964.0, y1: 916, color: COLORS.verde },
];

export function CintaEsquina() {
  return (
    <svg
      viewBox={`0 0 ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM}`}
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 4, pointerEvents: "none" }}
    >
      {CINTA.map((b) => (
        <path
          key={b.color}
          d={`M ${X(b.x0)} ${PAGE_HEIGHT_MM} Q ${X(b.cx)} ${Y(b.cy)} ${PAGE_WIDTH_MM} ${Y(b.y1)} L ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM} Z`}
          fill={b.color}
        />
      ))}
    </svg>
  );
}

export default CintaEsquina;

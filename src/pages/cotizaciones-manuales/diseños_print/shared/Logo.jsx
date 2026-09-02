import React from "react";

// Lockup oficial de Enerlogic, tal cual lo entregó el diseñador: isotipo +
// "ENERLOGIC" en navy + bajada verde, con transparencia real (bordes con
// antialias, no recortados a filo). Es la versión que va sobre los fondos
// claros del impreso; la de wordmark blanco solo lee sobre navy y se usa en el
// sistema (sidebar, login, 404), no acá.
//
// Vive en public/ y se pide por URL absoluta a propósito: estas páginas se
// exportan a PDF con Puppeteer y necesitan una ruta servible, no un import de
// webpack. Hay una copia gemela en src/assets/brand/ para el formulario de
// login, que sí se importa. Si el diseñador manda un logo nuevo, HAY QUE
// ACTUALIZAR LAS DOS o el impreso y el sistema quedan con logos distintos.
// `variante`: "navy" es el lockup con el wordmark en navy, que solo lee sobre
// los fondos claros de las páginas 1 y 2. "blanco" es el mismo lockup con el
// wordmark en blanco y la bajada en verde claro, el único que lee sobre el navy
// pleno de la página 3. Son dos archivos distintos del mismo diseñador, no una
// inversión hecha por código: si manda un logo nuevo hay que actualizar AMBOS.
const ARCHIVO = {
  navy: "/cotizacion/assets/enerlogic_v1_oficial_transparent.png",
  blanco: "/cotizacion/assets/enerlogic_v2_blanco_transparent.png",
};

export function Logo({ heightMm = 16, variante = "navy" }) {
  return (
    <img
      src={ARCHIVO[variante]}
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

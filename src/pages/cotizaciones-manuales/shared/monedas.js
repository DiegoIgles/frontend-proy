// Monedas que puede llevar cada página del impreso. El código es lo que se
// guarda en la API (monedasPagina.pagina5/6/7); el resto es cómo se muestra.
//
// Estamos en Bolivia: si el usuario no toca nada, todo sale en bolivianos.
export const MONEDAS = {
  BS:  { codigo: "BS",  simbolo: "Bs.", corto: "BS",  nombre: "Bolivianos", plural: "BOLIVIANOS (BS)" },
  USD: { codigo: "USD", simbolo: "$us", corto: "$us", nombre: "Dólares",    plural: "DÓLARES ($us)" },
};

export const CODIGOS_MONEDA = Object.keys(MONEDAS);
export const MONEDA_DEFAULT = "BS";

// Páginas del impreso que muestran montos, con la etiqueta que ve el usuario
// en el formulario. Es la única lista: el formulario y el impreso la comparten.
export const PAGINAS_CON_MONEDA = [
  { key: "pagina5", label: "Página 5 — Cotización y totales" },
  { key: "pagina6", label: "Página 6 — Retorno de inversión (ROI)" },
  { key: "pagina7", label: "Página 7 — Protección de inversión" },
];

export const MONEDAS_PAGINA_DEFAULT = Object.fromEntries(
  PAGINAS_CON_MONEDA.map((p) => [p.key, MONEDA_DEFAULT])
);

/** Normaliza lo que venga de la API (puede faltar en registros viejos). */
export function monedasDe(cot) {
  return { ...MONEDAS_PAGINA_DEFAULT, ...(cot?.monedasPagina ?? {}) };
}

/** Definición de la moneda de una página (`monedaDe(cot, "pagina5").simbolo`). */
export function monedaDe(cot, pagina) {
  const codigo = monedasDe(cot)[pagina];
  return MONEDAS[codigo] ?? MONEDAS[MONEDA_DEFAULT];
}

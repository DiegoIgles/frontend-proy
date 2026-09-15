// Copia en JS del motor de cálculo del backend
// (src/cotizaciones-tecnicas/utils/calcular-cotizacion-tecnica.util.ts).
// Sirve SOLO para mostrar los números en vivo mientras se edita; lo que se
// guarda e imprime es lo que calcula el servidor. Si se cambia una fórmula,
// hay que cambiarla en los dos lados.

export const FINANZAS_DEFAULT = { utilidadPct: 50, ivaPct: 14.94, itPct: 3 };
export const PARAMETROS_DEFAULT = { cantidadPaneles: 0, potenciaPanelW: 0, horasSolPico: 3.9, panelAnchoM: 1.15, panelLargoM: 2.4 };

const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const num = (v) => (v === null || v === undefined || v === "" ? 0 : Number(v) || 0);

export function calcularConsulta(parametros) {
  const p = { ...PARAMETROS_DEFAULT, ...(parametros ?? {}) };
  const potenciaKw = r2((num(p.cantidadPaneles) * num(p.potenciaPanelW)) / 1000);
  return {
    ...p,
    potenciaKw,
    energiaMensualKwh: r2(num(p.horasSolPico) * potenciaKw * 30.5),
    superficieM2: r2(num(p.panelAnchoM) * num(p.panelLargoM) * num(p.cantidadPaneles)),
  };
}

export function calcularCotizacionTecnica({ parametros, finanzas, secciones }) {
  const f = { ...FINANZAS_DEFAULT, ...(finanzas ?? {}) };
  const parciales = (secciones ?? []).map((s) => {
    const items = (s.items ?? []).map((it) => ({ ...it, subtotal: r2(num(it.cantidad) * num(it.precioUnitario)) }));
    return { seccion: s, items, subtotal: r2(items.reduce((t, i) => t + i.subtotal, 0)) };
  });
  const totalCostos = r2(parciales.reduce((t, s) => t + s.subtotal, 0));
  const utilidad = r2(totalCostos * (num(f.utilidadPct) / 100));
  const totalAntesImpuestos = r2(totalCostos + utilidad);
  const facturado = r2(parciales.reduce((t, s) => t + s.items.filter((i) => i.factura).reduce((a, i) => a + i.subtotal, 0), 0));
  const noFacturado = r2(totalCostos - facturado + utilidad);
  const iva = r2(noFacturado * (num(f.ivaPct) / 100));
  const totalConIva = r2(totalAntesImpuestos + iva);
  const it = r2(totalConIva * (num(f.itPct) / 100));
  const totalProyecto = r2(totalConIva + it);
  const factorVenta = totalCostos > 0 ? totalProyecto / totalCostos : 0;
  const margen = totalProyecto > 0 ? utilidad / totalProyecto : 0;

  return {
    consulta: calcularConsulta(parametros),
    finanzas: f,
    secciones: parciales.map(({ seccion, items, subtotal }) => ({
      numeral: seccion.numeral, nombre: seccion.nombre, resumen: seccion.resumen ?? null,
      subtotal, precioVenta: r2(subtotal * factorVenta),
      items: items.map((i) => {
        const precioVenta = r2(i.subtotal * factorVenta);
        return { ...i, precioVenta, precioVentaUnitario: num(i.cantidad) > 0 ? r2(precioVenta / num(i.cantidad)) : 0 };
      }),
    })),
    totalCostos, utilidad, totalAntesImpuestos, facturado, noFacturado, iva, totalConIva, it, totalProyecto, factorVenta, margen,
  };
}

// Colores de las secciones, los mismos del Excel de los ingenieros.
export const COLORES_SECCION = ["#FFFF00", "#9DC3E6", "#FFE699", "#F4B183", "#B4C6E7", "#C5E0B4", "#92D050", "#FFD966", "#A9D18E", "#B4C7E7"];
export const colorSeccion = (idx) => COLORES_SECCION[idx % COLORES_SECCION.length];

export const fmt = (n, dec = 2) =>
  n === null || n === undefined || n === "" || Number.isNaN(Number(n))
    ? "—"
    : Number(n).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// Agrupa los ítems de una sección por la subcategoría con la que entraron
// (copiada en `categoriaNombre`). Los sin subcategoría (libres o de la raíz)
// van primero en un grupo sin título. Devuelve el índice original de cada
// ítem para poder editarlo. Mismo criterio que el backend (Excel y vista).
export function agruparPorSubcategoria(items, nombreSeccion) {
  const grupos = [];
  (items ?? []).forEach((item, indice) => {
    const nombre = (item.categoriaNombre || "").trim() || null;
    const titulo = nombre && nombre !== nombreSeccion ? nombre : null;
    let g = grupos.find((x) => x.titulo === titulo);
    if (!g) { g = { titulo, items: [] }; grupos.push(g); }
    g.items.push({ item, indice });
  });
  return grupos.sort((a, b) => (a.titulo === null ? -1 : b.titulo === null ? 1 : 0));
}

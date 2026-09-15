// Datos de la empresa que se imprimen en documentos (orden de compra, etc.).
// Si cambia un teléfono, NIT o dirección, se cambia acá y sale en todos.
export const EMPRESA = {
  razonSocial: "ENERLOGIC SRL",
  telefono: "( 591 - 3 ) 3420257",
  fax: "( 591 - 3 ) 3435244",
  nit: "696858025",
  direccion: 'Av. Banzer calle "J. Lara" N° 3610',
  casilla: "1864",
  ciudad: "Santa Cruz - Bolivia",
  email: "juan.ramirez@enerlogic.com.bo",
  // Cuadro de control del formulario administrativo (arte de la orden de compra).
  formulario: { codigo: "FA - 005", validoDesde: "01/04/2026", revision: "Revisión 1" },
  // Firmante por defecto de la orden de compra (se puede cambiar por compra).
  firmante: { nombre: "Juan Francisco Ramirez Boglioli", cargo: "GERENTE GENERAL" },
};

// Defaults de los términos de la orden de compra (editables por compra).
export const ORDEN_COMPRA_DEFAULTS = {
  terminosEnvio: "Almacenes del proveedor / Santa Cruz - Bolivia",
  entrega: "Stock",
  terminosPago: "Wire Transfer",
};

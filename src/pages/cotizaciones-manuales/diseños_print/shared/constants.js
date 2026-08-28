// Tamaño de página: Carta horizontal / Letter landscape (11 x 8.5 in).
// No Oficio, no A4, no vertical.
export const PAGE_WIDTH_MM = 279.4;
export const PAGE_HEIGHT_MM = 215.9;

// Paleta oficial de marca Enerlogic — únicos colores permitidos en el
// documento impreso. No usar hex sueltos ni variantes: siempre estos tokens.
export const COLORS = {
  navy: "#001B3D",
  navy800: "#0A2A52",
  azul: "#0062B7",
  verde: "#2C9826",
  verde900: "#056125",
  naranja: "#EE9C02",
  hueso: "#F1F1F1",
  blanco: "#FFFFFF",
};

// El arte aprobado usa Montserrat — cargada en public/index.html. El
// ancho/alto de mayúscula del título depende de esta familia exacta.
export const FONT_FAMILY = "'Montserrat', 'Segoe UI', Arial, sans-serif";

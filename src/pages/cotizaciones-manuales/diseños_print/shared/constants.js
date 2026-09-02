// Tamaño de página: Carta horizontal / Letter landscape (11 x 8.5 in).
// No Oficio, no A4, no vertical.
export const PAGE_WIDTH_MM = 279.4;
export const PAGE_HEIGHT_MM = 215.9;

// Paleta oficial de marca Enerlogic — únicos colores permitidos en el
// documento impreso. No usar hex sueltos ni variantes: siempre estos tokens.
export const COLORS = {
  navy: "#001B3D",
  navy800: "#0A2A52",
  // Fondo pleno de la página 3. Es más oscuro que `navy` y no es un capricho:
  // el arte aprobado lo usa plano en toda la hoja (medido en ocho zonas, de la
  // esquina superior izquierda al pie derecho: media RGB 0.7/18.6/36.4 con
  // desviación de ~2 niveles). Sobre `navy` los rótulos blancos y el verde
  // pierden contraste. No usarlo en las páginas 1 y 2, que son de fondo claro.
  navy900: "#001226",
  azul: "#0062B7",
  verde: "#2C9826",
  verde900: "#056125",
  naranja: "#EE9C02",
  hueso: "#F1F1F1",
  blanco: "#FFFFFF",

  // Tokens que estrena la página 2 ("¿Quiénes somos?"). Medidos sobre el arte
  // aprobado: los tintes son el disco claro detrás de cada icono de solución y
  // la regla es el hilo que separa la grilla 3×2. No inventar más grises.
  tinta: "#2C3440",       // cuerpo de párrafo y primera línea de cada etiqueta
  tinteAzul: "#E9F0FA",   // disco de iconos "fríos"
  tinteVerde: "#E9F5EC",  // disco de iconos verdes
  regla: "#DCE0E4",       // divisores de la grilla de soluciones
};

// El arte aprobado usa Montserrat — cargada en public/index.html. El
// ancho/alto de mayúscula del título depende de esta familia exacta.
export const FONT_FAMILY = "'Montserrat', 'Segoe UI', Arial, sans-serif";

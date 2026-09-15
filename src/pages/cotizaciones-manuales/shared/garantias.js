// Garantías por defecto de la Página 8 (las 5 del arte aprobado). Copia del
// backend (GARANTIAS_DEFAULT en cotizacion-manual.entity.ts): el formulario
// arranca con estas y el impreso las usa si la cotización no trae ninguna.
export const GARANTIAS_MAX = 10;

export const GARANTIAS_DEFAULT = [
  { icono: "panel", rotulo: "PANELES SOLARES", anios: 15, descripcion: "Garantía premium que respalda el rendimiento y la durabilidad de los paneles solares.", activa: true },
  { icono: "inversor", rotulo: "INVERSORES", anios: 10, descripcion: "Garantía estándar que asegura el funcionamiento confiable del inversor.", activa: true },
  { icono: "herramientas", rotulo: "INSTALACIÓN", anios: 2, descripcion: "Garantía que cubre los materiales y la instalación del sistema.", activa: true },
  { icono: "bombeo", rotulo: "BOMBEO SOLAR", anios: 5, descripcion: "Garantía que asegura el funcionamiento confiable del sistema de bombeo solar.", activa: true },
  { icono: "bateria", rotulo: "BANCO DE BATERÍAS", anios: 10, descripcion: "Garantía que respalda el rendimiento y la vida útil del banco de baterías.", activa: true },
];

// Opciones basadas en los comentarios de la entidad DatoLead del backend
// (backend-proy/biovida-backend/src/ventas/entities/dato-lead.entity.ts).
// Los campos son texto libre en la base de datos; estas listas son sugerencias
// usadas en los formularios y no restringen valores ya guardados con otro texto.

export const TIPOS_SERVICIO = [
  { value: "solar_ongrid", label: "Solar On-Grid" },
  { value: "solar_offgrid", label: "Solar Off-Grid" },
  { value: "cargador_ev", label: "Cargador EV" },
];

export const TIPOS_SUMINISTRO = ["Residencial", "Comercial", "Industrial", "Otra actividad"];

export const TIPOS_CUBIERTA = ["Losa", "Calamina", "Teja colonial", "Duralit", "Otro"];

export const formatTipoServicio = (value) => {
  if (!value) return "—";
  const known = TIPOS_SERVICIO.find((t) => t.value === value);
  if (known) return known.label;
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
};

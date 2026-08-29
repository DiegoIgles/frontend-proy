const ESTADO_STYLES = {
  PAGADO:         { background: "#E6F3E5", color: "#056125", label: "Pagado" },
  PAGADO_PARCIAL: { background: "#E3EEF9", color: "#00509A", label: "Pagado Parcial" },
  PENDIENTE:      { background: "#fef3c7", color: "#8A5A02", label: "Pendiente" },
  VENCIDO:        { background: "#FBE9E7", color: "#96291D", label: "Vencido" },
};

function EstadoBadge({ estado, fallback = "—" }) {
  if (!estado) return <span style={{ color: "#6b7280" }}>{fallback}</span>;
  const style = ESTADO_STYLES[estado] ?? { background: "#e5e7eb", color: "#374151", label: estado };
  return (
    <span style={{ background: style.background, color: style.color, padding: "3px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      {style.label}
    </span>
  );
}

export default EstadoBadge;

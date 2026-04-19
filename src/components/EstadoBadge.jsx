const ESTADO_STYLES = {
  PAGADO:         { background: "#d1fae5", color: "#065f46", label: "Pagado" },
  PAGADO_PARCIAL: { background: "#dbeafe", color: "#1e40af", label: "Pagado Parcial" },
  PENDIENTE:      { background: "#fef3c7", color: "#92400e", label: "Pendiente" },
  VENCIDO:        { background: "#fee2e2", color: "#991b1b", label: "Vencido" },
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

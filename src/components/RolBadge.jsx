import React from "react";
import { ROLES_INFO, rolLabel } from "../auth/roles";

/** Chip de rol con el color de `ROLES_INFO`; roles desconocidos salen en gris. */
function RolBadge({ rol, size = "sm" }) {
  const info = ROLES_INFO[rol] ?? { bg: "#f3f4f6", color: "#374151" };
  const chico = size === "sm";
  return (
    <span style={{
      padding: chico ? "2px 10px" : "3px 12px",
      borderRadius: 10,
      fontSize: chico ? 11 : 12,
      fontWeight: 700,
      background: info.bg,
      color: info.color,
      marginRight: 4,
      whiteSpace: "nowrap",
    }}>
      {rolLabel(rol)}
    </span>
  );
}

export default RolBadge;

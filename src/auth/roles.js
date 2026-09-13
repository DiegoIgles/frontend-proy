/**
 * Roles del sistema. Espejo de `ValidRoles` en el backend: cualquier cambio
 * acá debe ir acompañado del cambio allá, porque el guard del servidor es el
 * que manda; lo de este lado solo esconde lo que igual sería rechazado.
 *
 *  - admin:    acceso total.
 *  - vendedor: proyectos, cotizaciones, ventas, clientes, leads, cuentas por
 *              cobrar; inventario solo lectura.
 *  - bodega:   inventario completo, ajustes de stock, compras y proveedores;
 *              proyectos solo lectura.
 */
export const ROL = {
  ADMIN: "admin",
  VENDEDOR: "vendedor",
  BODEGA: "bodega",
};

/** Etiqueta y colores de cada rol, para badges y selects. */
export const ROLES_INFO = {
  [ROL.ADMIN]:    { label: "Administrador", bg: "#E3EEF9", color: "#00509A" },
  [ROL.VENDEDOR]: { label: "Vendedor",      bg: "#E8F5E9", color: "#1B7F3A" },
  [ROL.BODEGA]:   { label: "Bodega",        bg: "#FFF3E0", color: "#B35C00" },
};

/** Lista ordenada para selects: [{ value, label }]. */
export const ROLES_OPCIONES = Object.entries(ROLES_INFO).map(([value, { label }]) => ({ value, label }));

export const rolLabel = (rol) => ROLES_INFO[rol]?.label ?? rol;

/** Rol que se preselecciona al crear un usuario (mismo default del backend). */
export const ROL_POR_DEFECTO = ROL.VENDEDOR;

// ─── Grupos de acceso ────────────────────────────────────────────────────────
// Se usan tanto en las rutas (App.js) como en el menú (Sidebar) para que ambos
// digan lo mismo.
export const TODOS          = [ROL.ADMIN, ROL.VENDEDOR, ROL.BODEGA];
export const SOLO_ADMIN     = [ROL.ADMIN];
export const ADMIN_VENDEDOR = [ROL.ADMIN, ROL.VENDEDOR];
export const ADMIN_BODEGA   = [ROL.ADMIN, ROL.BODEGA];

/** true si el usuario tiene al menos uno de los roles indicados. */
export function tieneRol(user, roles) {
  if (!roles || roles.length === 0) return true;
  return roles.some((r) => user?.roles?.includes(r));
}

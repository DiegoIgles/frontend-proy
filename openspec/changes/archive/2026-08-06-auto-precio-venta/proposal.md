# Proposal: Auto-fill sale price on product select (auto-precio-venta)

## Intent

Creating a sale note requires typing the sale price per line, even though it is almost always the product's latest price. User goal (original wording): "al seleccionar un producto para la venta el precio de venta sea jalado automáticamente, el último precio de ese producto". Backend already returns that price as `precioActual` (number) in `GET /inventario/productos`; the frontend must use it.

## Scope

### In Scope
- `src/pages/ventas/CreateNotaVenta.jsx` only: auto-fill `precioVenta` from `prod.precioActual` when `productoId` changes.
- Field stays editable (per-line discount/override).
- No price registered → field stays empty, user types (fallback); never silently set 0.

### Out of Scope (follow-ups)
- Backend contract changes; server-side price validation at `POST /ventas/nota-venta`.
- Unique `(producto_id, fecha)` constraint on price history.
- Rename of `precio` table / `CreatePrecioDto` semantics (compra/costo vs venta ambiguity).

## Key Decisions & Assumptions

- Auto-fill fires only on `productoId` change; re-selecting the SAME product overwrites (consistent with `CreateProyecto.jsx:163-166`).
- Latest price = max `fecha` from `precio` table, as already resolved by backend `precioActual` (list endpoint shape: number).
- Empty price stays empty — DTO requires a positive number, user must type.
- MAY: append price to select option label (`[codigo] nombre — Bs. X`, Spanish UI copy) so the auto-fill source is visible.

## Capabilities

### New Capabilities
- `sale-price-autofill`: auto-fill of the sale price field from the product's latest price on product selection in the create-sale-note flow.

### Modified Capabilities
- None (`openspec/specs/` is empty).

## Approach

Copy the proven pattern: in `handleDetalleChange` (CreateNotaVenta.jsx:139), when `field === "productoId"`, find `prod` in the already-loaded `productos` and set `precioVenta: prod?.precioActual ?? ""` alongside the existing `productoAlmacenId` reset. ~10 lines, no new dependencies.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/ventas/CreateNotaVenta.jsx` | Modified | Auto-fill in `handleDetalleChange`; optional price in select option label |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Same-`fecha` duplicates make "latest" tie undefined | Low | Pre-existing backend behavior; `fecha DESC` order authoritative; out of scope |
| `precioActual` shape inconsistency (list number vs detail object) | Low | Only list endpoint used (number confirmed) |
| Catalog >200 products missing from select | Low | Pre-existing limit-200 behavior, unchanged |
| Auto-fill overwrites manual price on product change | Low | Intentional, matches CreateProyecto; re-editable after change |

## Rollback Plan

Revert the single-file change (`git revert` of the change commit). No migration, no data impact.

## Dependencies

- None new. Relies on shipped list endpoint returning `precioActual` (number).

## Success Criteria

- [ ] Selecting a product fills `precioVenta` with its latest price.
- [ ] Product with no registered price → empty field, user can type.
- [ ] Manual override persists until the product changes.
- [ ] Re-selecting the same product overwrites the price.
- [ ] No files beyond `CreateNotaVenta.jsx` touched; no new API calls.

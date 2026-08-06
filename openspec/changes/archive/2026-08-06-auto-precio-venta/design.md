# Design: Auto-fill sale price on product select (auto-precio-venta)

## Technical Approach

Single-file frontend change in `src/pages/ventas/CreateNotaVenta.jsx`. When the user selects a product in a detail line, `handleDetalleChange` (lines 139-146) looks up the already-loaded `productos` state and sets `precioVenta` from `prod.precioActual`, alongside the existing `productoAlmacenId` reset. The price logic is extracted into a tiny exported pure helper so it can be unit-tested without rendering the page. No new API calls, no new dependencies, no backend changes. Maps to proposal approach and spec requirement `Auto-fill sale price on product selection` (5 scenarios).

## Architecture Decisions

### Decision: Auto-fill from already-loaded `productos` (Approach A)

| Option | Tradeoff | Decision |
|---|---|---|
| **A. Lookup in `handleDetalleChange` from loaded `productos`** | Zero new calls; ~5 lines; data is always current (loaded at mount) | **Chosen** |
| B. Per-product price fetch on selection | Fresh price per selection; N extra requests per line, latency, loading states, violates "no new API calls" (spec scenario 1) | Rejected |
| C. Server-authoritative price (backend derives at submit) | Kills per-line override/discount (spec scenario 3); changes backend contract; out of scope per proposal | Rejected |

### Decision: Empty string `""`, never `0`

The proven pattern `CreateProyecto.jsx:165` uses `?? 0`, but that field is a calculated total where `0` is semantically valid. For `precioVenta` the DTO requires a positive number and `handleSubmit` does `Number(d.precioVenta)` (line 172) — `Number("") === 0` would silently submit 0 and fail backend validation. `""` keeps the field visibly empty, the `required` attribute blocks submit, and the user types (spec scenarios 2). Deliberate, documented deviation from the pattern.

### Decision: Exported pure helper + unit test instead of full-page render

| Option | Tradeoff | Decision |
|---|---|---|
| Pure helper `resolvePrecioVenta` exported from the page, unit-tested | No DOM harness; covers 4/5 scenario shapes cheaply; one `export` keyword on a page file | **Chosen** |
| Full jsdom render of `CreateNotaVenta` | Real coverage of all 5 scenarios, but needs MemoryRouter + AuthProvider + ToastProvider + mocks for `getClientesAction`/`getProductosAction`/`getProductoStockAction` (Layout renders Header/Sidebar which call `useAuth`) — brittle, ~80 lines of harness for a 5-line change | Rejected |
| No test | Violates `apply.tdd: true` in `openspec/config.yaml` | Rejected |

## Data Flow

```
Mount ── getProductosAction({limit: 200}) ──> GET /inventario/productos
          └─> productos[] (each: { productoId, precioActual: number, ... })

DetalleRow select onChange
  ──> handleDetalleChange(index, "productoId", value)
        ├─ resolvePrecioVenta(productos, value) ──> prod?.precioActual ?? ""
        └─ setDetalles: { ...row, productoId: value, productoAlmacenId: "", precioVenta: <resolved> }
```

`productos` is component state captured by the `handleDetalleChange` closure — the same list already rendered in the select options. No additional request.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/ventas/CreateNotaVenta.jsx` | Modify | Export `resolvePrecioVenta`; in `handleDetalleChange` on `field === "productoId"` set `precioVenta` (keep `productoAlmacenId` reset). MAY: option label `[{p.codigo}] {p.nombre} — Bs. {p.precioActual}` (Spanish UI copy), rendering the price suffix only when `p.precioActual != null` |
| `src/pages/ventas/CreateNotaVenta.test.js` | Create | Unit tests for `resolvePrecioVenta` (below) |

## Interfaces / Contracts

```js
// CreateNotaVenta.jsx — new exported helper (production behavior unchanged otherwise)
export function resolvePrecioVenta(productos, productoId) {
  return productos.find((p) => p.productoId === productoId)?.precioActual ?? "";
}

// handleDetalleChange — added branch (existing reset kept)
if (field === "productoId") {
  updated[index].productoAlmacenId = "";
  updated[index].precioVenta = resolvePrecioVenta(productos, value);
}
```

`precioActual` comes from `GET /inventario/productos` as a number (confirmed in `src/pages/inventario/interfaces/listar-productos.response.json`, e.g. `280`, `3.5`).

### Edge cases

- **Re-select same product**: still `field === "productoId"` → overwrites manual override (spec scenario 4, matches `CreateProyecto`).
- **Quantity change**: `field === "cantidad"` → different branch → price untouched (scenario 5).
- **Unknown/reset `productoId`** (`""` or stale): `find` → `undefined` → `""`.
- **No registered price / `precioActual` undefined**: `""` → empty typeable field, `required` blocks submit until filled (scenario 2).
- **Manual override**: editing `precioVenta` never enters the `productoId` branch → persists (scenario 3).

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `resolvePrecioVenta` returns price for found product; `""` for unknown id, empty id, product without `precioActual` | Jest + RTL, no DOM |
| Regression | Login smoke test stays green; suite green under `CI=true npm test -- --watchAll=false` | Existing `src/App.test.js` |

Verification plan for `sdd-verify`: run the suite (must be green — it is today per `openspec/config.yaml`); no full-page render test (cost weighed in ADR-3); full-page behaviors not unit-testable (re-select overwrite, override persistence, quantity no-op) follow from the branch structure and are confirmed by the pure-helper tests + manual browser check. `npm run build` expected warnings-only (pre-existing lint warnings), not a gate.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary in this change.

## Migration / Rollout

No migration required. Rollback: `git revert` of the single-file commit; no data impact.

## Open Questions

- [ ] Include the MAY price suffix in the select option label, or defer? (Non-blocking; defaults to include in tasks, per proposal MAY)

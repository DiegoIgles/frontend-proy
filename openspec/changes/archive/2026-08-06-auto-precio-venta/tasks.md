# Tasks: Auto-fill sale price on product select (auto-precio-venta)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~70-100 (1 page file + 1 new test file) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Pure helper + wiring + unit tests for `resolvePrecioVenta` | PR 1 | `CI=true npm test -- --watchAll=false src/pages/ventas/CreateNotaVenta.test.js` | N/A - pure function, no DOM (design ADR-3) | Revert `CreateNotaVenta.jsx` diff; delete `CreateNotaVenta.test.js` |

## Phase 1: Unit Tests - RED (TDD first, per `apply.tdd: true`)

- [x] 1.1 Create `src/pages/ventas/CreateNotaVenta.test.js` importing named export `{ resolvePrecioVenta }` from `./CreateNotaVenta` (no render, no DOM).
- [x] 1.2 Test: product with `precioActual: 280` found by `productoId` returns `280` (spec scenario 1).
- [x] 1.3 Test: unknown `productoId` returns `""` (reset/unknown edge).
- [x] 1.4 Test: empty string `productoId` returns `""`.
- [x] 1.5 Test: product WITHOUT `precioActual` property returns `""`, never `0` (spec scenario 2, DTO positive number).
- [x] 1.6 Run focused test -> confirm RED (export missing, import is `undefined`).

## Phase 2: Core Implementation - GREEN

- [x] 2.1 In `src/pages/ventas/CreateNotaVenta.jsx`, add exported pure helper near the `today` const: `export function resolvePrecioVenta(productos, productoId) { return productos.find((p) => p.productoId === productoId)?.precioActual ?? ""; }`.
- [x] 2.2 In `handleDetalleChange` (line 139), extend the existing `if (field === "productoId")` branch (line 143): set `updated[index].precioVenta = resolvePrecioVenta(productos, value);` while keeping the `updated[index].productoAlmacenId = ""` reset.
- [x] 2.3 Confirm quantity change (`field === "cantidad"`) never opens the `productoId` branch -> `precioVenta` untouched (spec scenario 5).
- [x] 2.4 Run focused test -> GREEN.

## Phase 3: Optional UI Polish (MAY, default include)

- [x] 3.1 In `DetalleRow` product select (lines 38-41), append price suffix to option label - `[{p.codigo}] {p.nombre} — Bs. {p.precioActual}` - only when `p.precioActual != null` (Spanish UI copy).

## Phase 4: Verification / Cleanup

- [x] 4.1 Run full suite `CI=true npm test -- --watchAll=false` - green incl. existing `src/App.test.js` smoke test.
- [x] 4.2 Run `npm run build` - compiles; pre-existing lint warnings only, not a gate.
- [x] 4.3 Confirm diff: only `CreateNotaVenta.jsx` + new test file; no new deps, no new API calls, no `precioVenta: 0` path.
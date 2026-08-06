# Archive Report — auto-precio-venta

**Change**: auto-precio-venta (Auto-fill sale price on product select)
**Mode**: openspec | **Archived**: 2026-08-06
**Archived to**: `openspec/changes/archive/2026-08-06-auto-precio-venta/`

## Final State (at close)

- **Verdict**: `pass` per verify-report, `blockers: 0`, `critical_findings: 0` (verify-report.md YAML front matter).
- **Commits on `main`**: `b0dcc47` test(ventas): unit tests for `resolvePrecioVenta`; `ded5789` feat(ventas): auto-fill sale price on product select. Confirmed present in git log at archive time.
- **Suite**: 2 suites / 6 tests GREEN per `CI=true npm test -- --watchAll=false` (exit 0, apply/verify). Build `npm run build` exit 0, warnings only in pre-existing files (documented non-gate).
- **Implementation**: single-file change `src/pages/ventas/CreateNotaVenta.jsx` (exported pure helper `resolvePrecioVenta` + `productoId` branch wiring + MAY label suffix) and new `src/pages/ventas/CreateNotaVenta.test.js` (5 unit tests). No new dependencies, no new API calls (ADR-1).

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| Task Completion | PASS | `tasks.md` archived: 14 checked task lines, **0 unchecked** (verified 2026-08-06). |
| Review Receipt | PASS (disabled/unmanaged) | No native review artifacts exist for this change; delivery kill switch off → deadline to demand a receipt would deadlock, so the gate treats review as unmanaged. No commit changes in the task tree outside apply's escapes. |
| CRITICAL findings | PASS | 0 CRITICAL in verify-report. W-02 carried as non-blocking documented caveat (below). |
| Action Context | PASS | `actionContext` not `workspace-planning`; no `allowedEditRoots` restriction; archive stayed inside `openspec/`. |

### Task count discrepancy (recorded, not silently resolved)

`apply-progress` (#70) and `verify-report` (#71) both state "13/13 tasks complete", while the persisted `tasks.md` artifact contains **14 checked lines** (1.1–1.6, 2.1–2.4, 3.1, 4.1–4.3). Both sources agree every task is complete; the count differs (13 vs 14) with no runtime impact. Per Final-State Authority the persisted tasks artifact governs the completion gate; the snapshots' "13" claims are recorded here for traceability, not echoed as the authoritative count.

## Spec Sync

| Domain | Action | Details |
|--------|--------|---------|
| `ventas` | Created | `openspec/specs/ventas/spec.md` — main specs previously empty (`openspec/specs/` only had `.gitkeep`). Delta spec is a full spec (no ADDED/MODIFIED/REMOVED sections) → copied verbatim. 1 requirement "Auto-fill sale price on product selection", 5 scenarios. |

## Archive Contents

- `proposal.md` — intent, scope, risks, rollback
- `specs/ventas/spec.md` — delta spec (1 req, 5 scenarios)
- `design.md` — 3 ADRs (ADR-1 loaded-list lookup, ADR-2 `""` never `0`, ADR-3 pure helper + unit test)
- `tasks.md` — 14/14 checked
- `verify-report.md` — verdict pass, 0 CRITICAL, W-02
- `archive-report.md` — this file

## Engram lineage

| Artifact | Observation | Topic |
|----------|-------------|-------|
| apply-progress | #70 | `sdd/auto-precio-venta/apply-progress` → re-saved `state: archived` |
| verify-report | #71 | `sdd/auto-precio-venta/verify-report` → re-saved `state: archived` |
| archive-report | this save | `sdd/auto-precio-venta/archive-report` |

## Caveats / Warnings carried (open at close)

- **W-02 (non-blocking)**: Spec scenarios 3 (manual override persists) and 4 (re-select overwrites) are exercised only by the branch structure of `handleDetalleChange` — the design's ADR-3 tradeoff (no full-page render harness; cost weighed in design). The helper they invoke is fully unit-tested (5/5), and the branch is the only writer of the price. A manual browser check is **recommended but NOT blocking** per the verify report's own verdict and the orchestrator's final-state handoff. Carried as documented caveat, not a defect.
- **S-01 (suggestion, no action)**: a literal backend `precioActual: 0` would be returned as `0` (falsy) — fixture shows none; spec defines "no price" as absent property.
- **S-02 (suggestion, no action)**: option-label price suffix lacks thousand/decimal formatting — cosmetic, consistent with the page.
- **S-03 (out of scope, honored)**: 5 uncommitted workspace files (`.env`, `.gitignore`, `package.json`, `src/App.test.js`, `src/setupTests.js`) hold the earlier Jest/react-router infra fix and are unrelated to this change. They were **not staged, not committed, not included** in any archive action; `git status` confirms they remain uncommitted. `openspec/` itself is untracked and is the SDD store.

## Source of Truth Updated

- `openspec/specs/ventas/spec.md` now reflects the auto-fill behavior (new spec — merge was a copy, not destructive; config `rules.archive` "warn before merging destructive deltas" not triggered).

## SDD Cycle Complete

Change fully planned (propose/spec/design/tasks), implemented (apply, TDD RED→GREEN), verified (`pass`), and archived. Ready for the next change. No git commit performed by archive (skill does not prescribe one; `openspec/` remains untracked per convention).
import React from "react";

const LIMIT_OPTIONS = [10, 25, 100];

function Pagination({ total, limit, offset, onLimitChange, onOffsetChange }) {
  const page       = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from       = total === 0 ? 0 : offset + 1;
  const to         = Math.min(offset + limit, total);

  const goTo = (p) => onOffsetChange((p - 1) * limit);

  const pages = buildPageRange(page, totalPages);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0 0",
      flexWrap: "wrap",
      gap: 10,
      fontSize: 13,
      color: "#6b7280",
    }}>
      {/* Info */}
      <span>
        Mostrando <strong style={{ color: "#111827" }}>{from}–{to}</strong> de{" "}
        <strong style={{ color: "#111827" }}>{total}</strong> resultados
      </span>

      {/* Páginas + prev/next */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <PageBtn label="‹" disabled={page === 1}        onClick={() => goTo(page - 1)} />
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} style={{ padding: "0 6px", color: "#9ca3af" }}>…</span>
          ) : (
            <PageBtn key={p} label={p} active={p === page} onClick={() => goTo(p)} />
          )
        )}
        <PageBtn label="›" disabled={page === totalPages} onClick={() => goTo(page + 1)} />
      </div>

      {/* Límite por página */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>Filas por página:</span>
        <select
          value={limit}
          onChange={(e) => { onLimitChange(Number(e.target.value)); onOffsetChange(0); }}
          style={{
            padding: "4px 8px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 13,
            cursor: "pointer",
            background: "#fff",
          }}
        >
          {LIMIT_OPTIONS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PageBtn({ label, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32,
        height: 32,
        padding: "0 6px",
        border: active ? "none" : "1px solid #d1d5db",
        borderRadius: 6,
        background: active ? "#1d4ed8" : disabled ? "#f9fafb" : "#fff",
        color: active ? "#fff" : disabled ? "#d1d5db" : "#374151",
        fontWeight: active ? 700 : 400,
        fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)  return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default Pagination;

import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const TIPOS = [
  { value: "number", label: "Número" },
  { value: "text", label: "Texto" },
  { value: "boolean", label: "Sí/No" },
  { value: "select", label: "Selección (lista)" },
];

/**
 * Editor de esquemaAtributos de una categoría: filas { key, label, tipo, unidad, requerido, opciones }.
 */
function EsquemaAtributosEditor({ campos = [], onChange }) {
  const addCampo = () => {
    onChange([...campos, { key: "", label: "", tipo: "number", unidad: "", requerido: false, opciones: [] }]);
  };

  const removeCampo = (idx) => {
    onChange(campos.filter((_, i) => i !== idx));
  };

  const setCampo = (idx, patch) => {
    onChange(campos.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  return (
    <div>
      {campos.length === 0 ? (
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#9ca3af" }}>
          Sin atributos técnicos definidos para esta categoría.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
          {campos.map((campo, idx) => (
            <div key={idx} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.7fr auto auto",
              gap: 6, alignItems: "center", background: "#f9fafb", padding: 8, borderRadius: 6,
            }}>
              <input placeholder="key (ej. potenciaPico)" value={campo.key}
                onChange={(e) => setCampo(idx, { key: e.target.value })} />
              <input placeholder="Etiqueta" value={campo.label}
                onChange={(e) => setCampo(idx, { label: e.target.value })} />
              <select value={campo.tipo} onChange={(e) => setCampo(idx, { tipo: e.target.value })}>
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input placeholder="Unidad" value={campo.unidad || ""}
                onChange={(e) => setCampo(idx, { unidad: e.target.value })} />
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, whiteSpace: "nowrap" }}>
                <input type="checkbox" checked={!!campo.requerido}
                  onChange={(e) => setCampo(idx, { requerido: e.target.checked })} />
                Requerido
              </label>
              <button type="button" onClick={() => removeCampo(idx)} title="Quitar campo"
                style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}>
                <FaTrash />
              </button>
              {campo.tipo === "select" && (
                <input
                  placeholder="Opciones separadas por coma"
                  style={{ gridColumn: "1 / -1" }}
                  value={(campo.opciones || []).join(", ")}
                  onChange={(e) => setCampo(idx, {
                    opciones: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <button type="button" className="btn-secondary" onClick={addCampo}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <FaPlus size={10} /> Agregar campo
      </button>
    </div>
  );
}

export default EsquemaAtributosEditor;

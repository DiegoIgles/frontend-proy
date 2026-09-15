import React from "react";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaUndo } from "react-icons/fa";
import { ICONOS_GARANTIA, CLAVES_ICONO_GARANTIA, IconoGarantia } from "../diseños_print/shared/IconosGarantia";
import { GARANTIAS_DEFAULT, GARANTIAS_MAX } from "../shared/garantias";

// ── Página 8: tarjetas de garantía ─────────────────────────────
//
// Cada cotización lleva su lista (máx. 10). Arranca con las cinco del arte;
// cada una se puede desactivar (no se imprime pero se conserva), reescribir,
// cambiar de icono, reordenar o quitar, y se pueden agregar otras.

const inputStyle = { width: "100%", padding: "7px 9px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, boxSizing: "border-box" };
const labelMini = { display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 };

const NUEVA = { icono: "escudo", rotulo: "", anios: 1, descripcion: "", activa: true };

function GarantiasEditor({ value = [], onChange }) {
  const lista = value;
  const set = (i, campo, v) => onChange(lista.map((g, k) => (k === i ? { ...g, [campo]: v } : g)));
  const quitar = (i) => onChange(lista.filter((_, k) => k !== i));
  const mover = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= lista.length) return;
    const n = [...lista];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  const agregar = () => lista.length < GARANTIAS_MAX && onChange([...lista, { ...NUEVA }]);
  const restaurar = () => onChange(GARANTIAS_DEFAULT.map((g) => ({ ...g })));

  const activas = lista.filter((g) => g.activa !== false).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: activas ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
          {activas} de {lista.length} tarjeta(s) se imprimen · máximo {GARANTIAS_MAX}
          {activas > 5 ? " · con más de 5 se arman dos filas" : ""}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn-secondary" onClick={restaurar} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }} title="Vuelve a las 5 tarjetas del arte">
            <FaUndo /> Restaurar las 5 del arte
          </button>
          <button type="button" className="btn-primary" onClick={agregar} disabled={lista.length >= GARANTIAS_MAX} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <FaPlus /> Agregar garantía
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 12 }}>
        {lista.map((g, i) => {
          const activa = g.activa !== false;
          return (
            <div key={i} style={{ border: activa ? "1px solid #16a34a" : "1px solid #e5e7eb", background: activa ? "#fff" : "#f9fafb", borderRadius: 10, padding: 12, opacity: activa ? 1 : 0.7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                {/* Vista previa del disco como sale impreso */}
                <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#0f2a4a", position: "relative" }}>
                    <IconoGarantia clave={g.icono} color="#fff" style={{ position: "absolute", left: "24%", top: "24%", width: "52%", height: "52%" }} />
                  </div>
                  <div style={{ position: "absolute", right: -4, top: -4, width: 20, height: 20, borderRadius: "50%", background: "#2C9826", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label style={labelMini}>Icono</label>
                  <select style={inputStyle} value={g.icono} onChange={(e) => set(i, "icono", e.target.value)}>
                    {CLAVES_ICONO_GARANTIA.map((k) => <option key={k} value={k}>{ICONOS_GARANTIA[k].nombre}</option>)}
                  </select>
                </div>
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 10, color: "#374151", cursor: "pointer" }} title="Desactivar: no se imprime pero se conserva">
                  <input type="checkbox" checked={activa} onChange={(e) => set(i, "activa", e.target.checked)} style={{ width: 16, height: 16 }} />
                  Imprimir
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 8, marginBottom: 8 }}>
                <div>
                  <label style={labelMini}>Rótulo</label>
                  <input style={{ ...inputStyle, textTransform: "uppercase", fontWeight: 700 }} maxLength={40} value={g.rotulo} onChange={(e) => set(i, "rotulo", e.target.value)} placeholder="PANELES SOLARES" />
                </div>
                <div>
                  <label style={labelMini}>Años</label>
                  <input style={{ ...inputStyle, fontWeight: 800, color: "#15803d" }} type="number" min="0" step="1" value={g.anios} onChange={(e) => set(i, "anios", e.target.value)} />
                </div>
              </div>
              <label style={labelMini}>Descripción</label>
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 56, lineHeight: 1.4, fontFamily: "inherit" }} maxLength={220} value={g.descripcion} onChange={(e) => set(i, "descripcion", e.target.value)} placeholder="Garantía que cubre..." />

              <div style={{ display: "flex", gap: 4, marginTop: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={() => mover(i, -1)} disabled={i === 0} style={{ padding: "4px 8px" }} title="Mover antes"><FaArrowUp /></button>
                <button type="button" className="btn-secondary" onClick={() => mover(i, 1)} disabled={i === lista.length - 1} style={{ padding: "4px 8px" }} title="Mover después"><FaArrowDown /></button>
                <button type="button" className="btn-secondary" onClick={() => quitar(i)} style={{ padding: "4px 8px", color: "#dc2626" }} title="Quitar"><FaTrash /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GarantiasEditor;

import React from "react";

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4,
};

function campoInput(campo, valor, onChange) {
  if (campo.tipo === "boolean") {
    return (
      <input
        type="checkbox"
        checked={!!valor}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }
  if (campo.tipo === "select") {
    return (
      <select value={valor ?? ""} onChange={(e) => onChange(e.target.value)} style={{ width: "100%" }}>
        <option value="">Seleccionar...</option>
        {(campo.opciones || []).map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    );
  }
  if (campo.tipo === "number") {
    return (
      <input
        type="number"
        value={valor ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        style={{ width: "100%" }}
      />
    );
  }
  return (
    <input
      type="text"
      value={valor ?? ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%" }}
    />
  );
}

/**
 * Selector de categorías (múltiples, con una principal) + campos dinámicos
 * según el esquemaAtributos de la categoría principal elegida.
 */
function ProductoCategoriasYAtributos({
  categoriasDisponibles = [],
  categoriaIds = [],
  categoriaPrincipalId = "",
  atributos = {},
  onChangeCategoriaIds,
  onChangeCategoriaPrincipalId,
  onChangeAtributos,
}) {
  const toggleCategoria = (categoriaId) => {
    const yaMarcada = categoriaIds.includes(categoriaId);
    const nuevas = yaMarcada
      ? categoriaIds.filter((id) => id !== categoriaId)
      : [...categoriaIds, categoriaId];
    onChangeCategoriaIds(nuevas);
    if (yaMarcada && categoriaPrincipalId === categoriaId) {
      onChangeCategoriaPrincipalId("");
    }
  };

  const categoriaPrincipal = categoriasDisponibles.find((c) => c.categoriaId === categoriaPrincipalId);
  const esquema = categoriaPrincipal?.esquemaAtributos ?? [];

  const setAtributo = (key, valor) => {
    onChangeAtributos({ ...atributos, [key]: valor });
  };

  return (
    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={labelStyle}>Categorías *</label>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, padding: 8,
          border: "1px solid #d1d5db", borderRadius: 6, maxHeight: 140, overflowY: "auto",
        }}>
          {categoriasDisponibles.map((c) => (
            <label key={c.categoriaId} style={{
              display: "flex", alignItems: "center", gap: 4, fontSize: 12,
              background: categoriaIds.includes(c.categoriaId) ? "#eff6ff" : "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: 999, padding: "3px 10px", cursor: "pointer",
            }}>
              <input
                type="checkbox"
                checked={categoriaIds.includes(c.categoriaId)}
                onChange={() => toggleCategoria(c.categoriaId)}
              />
              {c.nombre}
            </label>
          ))}
        </div>
      </div>

      {categoriaIds.length > 0 && (
        <div>
          <label style={labelStyle}>Categoría principal * (define los atributos técnicos habilitados)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {categoriaIds.map((catId) => {
              const cat = categoriasDisponibles.find((c) => c.categoriaId === catId);
              if (!cat) return null;
              return (
                <label key={catId} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                  <input
                    type="radio"
                    name="categoriaPrincipal"
                    checked={categoriaPrincipalId === catId}
                    onChange={() => onChangeCategoriaPrincipalId(catId)}
                  />
                  {cat.nombre}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label style={labelStyle}>Atributos técnicos</label>
        {!categoriaPrincipalId ? (
          <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
            Elegí una categoría principal para ver sus campos técnicos.
          </p>
        ) : esquema.length === 0 ? (
          <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
            Esta categoría no tiene atributos técnicos definidos.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {esquema.map((campo) => (
              <div key={campo.key}>
                <label style={{ ...labelStyle, fontWeight: campo.requerido ? 700 : 500 }}>
                  {campo.label}{campo.unidad ? ` [${campo.unidad}]` : ""}{campo.requerido ? " *" : ""}
                </label>
                {campoInput(campo, atributos[campo.key], (valor) => setAtributo(campo.key, valor))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductoCategoriasYAtributos;

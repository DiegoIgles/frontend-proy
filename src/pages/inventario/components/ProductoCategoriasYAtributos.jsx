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
  // Árbol a partir de la lista plana (/categorias/flat trae `categoriaPadre`).
  // Se muestran SOLO las categorías raíz; las subcategorías aparecen recién
  // cuando su padre está marcado, agrupadas debajo de él. Así el listado no
  // mezcla "Paneles" con "Paneles > Monocristalinos" en una misma sopa.
  const porId = new Map(categoriasDisponibles.map((c) => [c.categoriaId, c]));
  const hijasDe = (id) =>
    categoriasDisponibles
      .filter((c) => c.categoriaPadre?.categoriaId === id)
      .sort((x, y) => x.nombre.localeCompare(y.nombre));
  const raices = categoriasDisponibles
    .filter((c) => !c.categoriaPadre)
    .sort((x, y) => x.nombre.localeCompare(y.nombre));

  // Todas las descendientes (a cualquier nivel) de una categoría.
  const descendientesDe = (id) => hijasDe(id).flatMap((h) => [h.categoriaId, ...descendientesDe(h.categoriaId)]);

  const toggleCategoria = (categoriaId) => {
    const yaMarcada = categoriaIds.includes(categoriaId);
    let nuevas;
    if (yaMarcada) {
      // Al desmarcar un padre se van también sus subcategorías: sin el padre
      // marcado ya no se muestran, y no tiene sentido dejarlas elegidas a ciegas.
      const quitar = new Set([categoriaId, ...descendientesDe(categoriaId)]);
      nuevas = categoriaIds.filter((id) => !quitar.has(id));
    } else {
      nuevas = [...categoriaIds, categoriaId];
    }
    onChangeCategoriaIds(nuevas);
    if (yaMarcada && categoriaPrincipalId && !nuevas.includes(categoriaPrincipalId)) {
      onChangeCategoriaPrincipalId("");
    }
  };

  const chipStyle = (marcada) => ({
    display: "flex", alignItems: "center", gap: 4, fontSize: 12,
    background: marcada ? "#eff6ff" : "#f9fafb",
    border: "1px solid #e5e7eb", borderRadius: 999, padding: "3px 10px", cursor: "pointer",
  });

  const renderChip = (c) => (
    <label key={c.categoriaId} style={chipStyle(categoriaIds.includes(c.categoriaId))}>
      <input
        type="checkbox"
        checked={categoriaIds.includes(c.categoriaId)}
        onChange={() => toggleCategoria(c.categoriaId)}
      />
      {c.nombre}
    </label>
  );

  // Grupo de subcategorías de una categoría marcada; recursivo para que las
  // nietas aparezcan bajo su madre cuando ésta también se marque.
  const renderGrupo = (padreId, nivel = 1) => {
    if (!categoriaIds.includes(padreId)) return null;
    const hijas = hijasDe(padreId);
    if (!hijas.length) return null;
    const padre = porId.get(padreId);
    return (
      <div key={`g-${padreId}`} style={{ marginLeft: nivel * 14, paddingLeft: 10, borderLeft: "2px solid #bfdbfe" }}>
        <p style={{ margin: "6px 0 4px", fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
          Subcategorías de {padre?.nombre}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {hijas.map(renderChip)}
        </div>
        {hijas.map((h) => renderGrupo(h.categoriaId, nivel + 1))}
      </div>
    );
  };

  // Ruta legible "Padre > Hija" para el radio de categoría principal.
  const rutaDe = (id) => {
    const partes = [];
    let actual = porId.get(id);
    while (actual) {
      partes.unshift(actual.nombre);
      actual = actual.categoriaPadre ? porId.get(actual.categoriaPadre.categoriaId) : null;
    }
    return partes.join(" › ");
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
        <p style={{ margin: "0 0 6px", fontSize: 11, color: "#6b7280" }}>
          Marcá la categoría principal; sus subcategorías aparecen debajo, agrupadas por cada categoría que elijas.
        </p>
        <div style={{
          display: "flex", flexDirection: "column", gap: 6, padding: 8,
          border: "1px solid #d1d5db", borderRadius: 6, maxHeight: 220, overflowY: "auto",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {raices.map(renderChip)}
          </div>
          {raices.map((c) => renderGrupo(c.categoriaId))}
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
                  {rutaDe(catId)}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
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

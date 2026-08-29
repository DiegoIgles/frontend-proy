import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../../../styles/esquema-atributos.css";

const TIPOS = [
  { value: "number", label: "Número" },
  { value: "text", label: "Texto" },
  { value: "boolean", label: "Sí/No" },
  { value: "select", label: "Selección (lista)" },
];

/**
 * Editor de esquemaAtributos de una categoría: filas
 * { key, label, tipo, unidad, requerido, opciones }.
 *
 * El maquetado vive en esquema-atributos.css y responde al ancho del PROPIO
 * editor (container query), no al de la pantalla: acá dentro el ancho
 * disponible depende de si el sidebar está desplegado, así que medir el
 * viewport da respuestas equivocadas. Ver el comentario de esa hoja.
 *
 * Los rótulos <span class="esquema-etiqueta"> solo se ven en el modo apilado.
 * En la fila alineada, la posición de cada campo ya dice qué es y los rótulos
 * se ocultan — pero apilado no hay posición que valga, y el placeholder
 * desaparece apenas escribís, así que ahí hacen falta.
 */
function EsquemaAtributosEditor({ campos = [], onChange }) {
  const addCampo = () => {
    onChange([
      ...campos,
      { key: "", label: "", tipo: "number", unidad: "", requerido: false, opciones: [] },
    ]);
  };

  const removeCampo = (idx) => {
    onChange(campos.filter((_, i) => i !== idx));
  };

  const setCampo = (idx, patch) => {
    onChange(campos.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  return (
    <div className="esquema-editor">
      {campos.length === 0 ? (
        <p className="esquema-vacio">
          Sin atributos técnicos definidos para esta categoría.
        </p>
      ) : (
        <div className="esquema-lista">
          {campos.map((campo, idx) => (
            <div key={idx} className="esquema-fila">
              <span className="esquema-etiqueta">Clave</span>
              <input
                placeholder="key (ej. potenciaPico)"
                value={campo.key}
                onChange={(e) => setCampo(idx, { key: e.target.value })}
              />

              <span className="esquema-etiqueta">Etiqueta</span>
              <input
                placeholder="Etiqueta"
                value={campo.label}
                onChange={(e) => setCampo(idx, { label: e.target.value })}
              />

              <span className="esquema-etiqueta">Tipo</span>
              <select
                value={campo.tipo}
                onChange={(e) => setCampo(idx, { tipo: e.target.value })}
              >
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              <span className="esquema-etiqueta">Unidad</span>
              <input
                placeholder="Unidad"
                value={campo.unidad || ""}
                onChange={(e) => setCampo(idx, { unidad: e.target.value })}
              />

              <label className="esquema-requerido">
                <input
                  type="checkbox"
                  checked={!!campo.requerido}
                  onChange={(e) => setCampo(idx, { requerido: e.target.checked })}
                />
                Requerido
              </label>

              <button
                type="button"
                className="esquema-quitar"
                onClick={() => removeCampo(idx)}
                title="Quitar campo"
                aria-label={`Quitar el atributo ${campo.label || campo.key || idx + 1}`}
              >
                <FaTrash />
              </button>

              {campo.tipo === "select" && (
                <>
                  <span className="esquema-etiqueta">Opciones</span>
                  <input
                    className="esquema-opciones"
                    placeholder="Opciones separadas por coma"
                    value={(campo.opciones || []).join(", ")}
                    onChange={(e) =>
                      setCampo(idx, {
                        opciones: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn-secondary"
        onClick={addCampo}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
      >
        <FaPlus size={10} /> Agregar campo
      </button>
    </div>
  );
}

export default EsquemaAtributosEditor;

import React, { useRef, useState } from "react";
import { FaUpload, FaTrash, FaSpinner, FaFilePdf, FaFileImage, FaFileAlt, FaExternalLinkAlt } from "react-icons/fa";
import { uploadDocumentoAction } from "../actions/upload-documento.action";
import { updateProductoAction } from "../actions/update-producto.action";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

// Documentos adjuntos de un producto (ficha técnica, manual, certificado,
// foto...): cualquier tipo de archivo. Se suben a Cloudinary y en el producto
// queda la lista { nombre, url, tipo } en `documentos`. Cada alta o baja se
// guarda de inmediato con un PATCH al producto.

function iconoDe(tipo = "") {
  if (tipo.includes("pdf")) return <FaFilePdf style={{ color: "#dc2626" }} />;
  if (tipo.startsWith("image/")) return <FaFileImage style={{ color: "#2563eb" }} />;
  return <FaFileAlt style={{ color: "#6b7280" }} />;
}

function DocumentosProducto({ productoId, documentos = [], puedeEditar, onChange }) {
  const [subiendo, setSubiendo] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();
  const confirm = useConfirm();

  const guardar = async (lista) => {
    await updateProductoAction(productoId, { documentos: lista });
    onChange?.(lista);
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSubiendo(true);
    try {
      let lista = [...documentos];
      for (const file of files) {
        const { secureUrl } = await uploadDocumentoAction(file);
        lista = [...lista, { nombre: file.name, url: secureUrl, tipo: file.type || "" }];
      }
      await guardar(lista);
      toast.success(files.length === 1 ? "Documento subido." : `${files.length} documentos subidos.`);
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "Error al subir el documento."));
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const quitar = async (doc) => {
    const ok = await confirm({
      title: "Quitar documento",
      message: `¿Quitar "${doc.nombre}" del producto?`,
      confirmLabel: "Quitar",
      danger: true,
    });
    if (!ok) return;
    try {
      await guardar(documentos.filter((d) => d.url !== doc.url));
      toast.success("Documento quitado.");
    } catch {
      toast.error("No se pudo quitar el documento.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
          Fichas técnicas, manuales, certificados o fotos del producto. Se acepta cualquier tipo de archivo (hasta 20 MB).
        </p>
        {puedeEditar && (
          <>
            <button type="button" className="btn-primary" onClick={() => inputRef.current?.click()} disabled={subiendo}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "6px 12px" }}>
              {subiendo ? <FaSpinner className="spin" /> : <FaUpload />} {subiendo ? "Subiendo..." : "Subir documento"}
            </button>
            <input ref={inputRef} type="file" multiple onChange={handleFiles} style={{ display: "none" }} />
          </>
        )}
      </div>

      {documentos.length === 0 ? (
        <p style={{ margin: 0, padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13,
          background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8 }}>
          Este producto no tiene documentos adjuntos.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {documentos.map((d) => (
            <div key={d.url} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
              <span style={{ fontSize: 20 }}>{iconoDe(d.tipo)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <a href={d.url} target="_blank" rel="noreferrer"
                  style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f2a4a", textDecoration: "none",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={d.nombre}>
                  {d.nombre}
                </a>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{d.tipo || "archivo"}</span>
              </div>
              <a href={d.url} target="_blank" rel="noreferrer" title="Abrir" style={{ color: "#2563eb" }}>
                <FaExternalLinkAlt />
              </a>
              {puedeEditar && (
                <button type="button" onClick={() => quitar(d)} title="Quitar"
                  style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}>
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentosProducto;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { createCotizacionManualAction } from "./actions/create-cotizacion.action";
import { updateCotizacionManualAction } from "./actions/update-cotizacion.action";
import { getCotizacionManualAction } from "./actions/get-cotizacion.action";
import { uploadImagenCotizacionAction } from "./actions/upload-imagen.action";
import { useToast } from "../../context/ToastContext";
import {
  FaSave, FaTimes, FaUpload, FaTrash, FaPlus, FaImage, FaSpinner,
} from "react-icons/fa";

const INITIAL_FORM = {
  // Página 1
  nroPropuesta: "",
  nombreCliente: "",
  fecha: "",
  // Página 2
  imagenesProyecto: [],
  potenciaInstalada: "",
  cantidadPaneles: "",
  superficieRequerida: "",
  produccionAnualEstimada: "",
  // Página 3
  lugar: "Santa Cruz de la Sierra",
  validezOfertaDias: 30,
  realizadoPor: "",
  imagenCuadroProductos: "",
  tiempoMontaje: "15 a 20 días",
  precioSubTotal: "",
  iva: "",
  total: "",
  // Página 5
  inversionAnualUsd: "",
  valorContratacionTotalUsd: "",
  // Página 6
  ahorroAnualBs: "",
  retornoInversionAnios: "",
  ahorroTotal30AniosUsd: "",
  imagenRoi: "",
  roiBarras: [],
};

// ── Subida de imagen individual con preview ───────────────────

function ImageUploader({ label, value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const inputRef = useRef(null);

  const images = multiple ? (value || []) : (value ? [value] : []);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const { secureUrl } = await uploadImagenCotizacionAction(file);
        if (multiple) {
          onChange([...(value || []), secureUrl]);
        } else {
          onChange(secureUrl);
        }
      }
      toast.success("Imagen subida correctamente.");
    } catch (err) {
      toast.error("Error al subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (url) => {
    if (multiple) {
      onChange((value || []).filter((u) => u !== url));
    } else {
      onChange("");
    }
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        {images.map((url) => (
          <div key={url} style={{ position: "relative", width: 110, height: 80 }}>
            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover",
              borderRadius: 6, border: "1px solid #e5e7eb" }} />
            <button type="button" onClick={() => removeImage(url)} title="Quitar"
              style={{ position: "absolute", top: -6, right: -6, background: "#dc2626", color: "#fff",
                border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: "#f3f4f6", border: "1px dashed #9ca3af", borderRadius: 6,
            cursor: "pointer", fontSize: 12, color: "#374151", fontWeight: 600 }}>
          {uploading ? <FaSpinner className="spin" /> : (images.length > 0 ? <FaPlus /> : <FaUpload />)}
          {uploading ? "Subiendo..." : (images.length > 0 ? "Agregar" : "Subir imagen")}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple}
          onChange={handleFiles} style={{ display: "none" }} />
      </div>
      {images.length === 0 && !uploading && (
        <p style={{ margin: "6px 0 0", fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
          <FaImage /> Se sube a Cloudinary y se guarda la URL en la cotización.
        </p>
      )}
    </div>
  );
}

// ── Campos helpers ────────────────────────────────────────────

const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#374151",
  marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" };

const inputStyle = { width: "100%", padding: "8px 10px", border: "1px solid #d1d5db",
  borderRadius: 6, fontSize: 13, boxSizing: "border-box" };

function Field({ label, children, flex = "1 1 200px" }) {
  return (
    <div style={{ flex, minWidth: 160 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function SectionCard({ titulo, descripcion, children }) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800, color: "#0f2a4a" }}>{titulo}</h2>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>{descripcion}</p>
      {children}
    </div>
  );
}

// ── Formulario principal ──────────────────────────────────────

function CotizacionManualForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate  = useNavigate();
  const toast     = useToast();

  const [form,    setForm]    = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(esEdicion);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (!esEdicion) return;
    getCotizacionManualAction(id)
      .then((data) => {
        setForm({
          ...INITIAL_FORM,
          ...data,
          fecha: data.fecha ? String(data.fecha).slice(0, 10) : "",
          imagenesProyecto: data.imagenesProyecto ?? [],
          imagenCuadroProductos: data.imagenCuadroProductos ?? "",
          imagenRoi: data.imagenRoi ?? "",
          roiBarras: data.roiBarras ?? [],
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("No se pudo cargar la cotización.");
        navigate("/cotizaciones-manuales");
      });
  }, [id, esEdicion, navigate, toast]);

  const set = (campo) => (e) => {
    const v = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [campo]: v }));
  };

  // ── ROI barras dinámicas ──
  const addBarra    = () => setForm((f) => ({ ...f, roiBarras: [...f.roiBarras, { etiqueta: "", valor: "" }] }));
  const removeBarra = (i) => setForm((f) => ({ ...f, roiBarras: f.roiBarras.filter((_, idx) => idx !== i) }));
  const setBarra    = (i, campo, valor) =>
    setForm((f) => ({
      ...f,
      roiBarras: f.roiBarras.map((b, idx) => (idx === i ? { ...b, [campo]: valor } : b)),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nroPropuesta.trim() || !form.nombreCliente.trim() || !form.fecha) {
      toast.error("Completa al menos: Nro de propuesta, cliente y fecha.");
      return;
    }

    const num = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));

    const dto = {
      nroPropuesta: form.nroPropuesta.trim(),
      nombreCliente: form.nombreCliente.trim(),
      fecha: form.fecha,
      imagenesProyecto: form.imagenesProyecto,
      potenciaInstalada: num(form.potenciaInstalada),
      cantidadPaneles: num(form.cantidadPaneles),
      superficieRequerida: num(form.superficieRequerida),
      produccionAnualEstimada: num(form.produccionAnualEstimada),
      lugar: form.lugar || undefined,
      validezOfertaDias: num(form.validezOfertaDias),
      realizadoPor: form.realizadoPor.trim(),
      imagenCuadroProductos: form.imagenCuadroProductos || undefined,
      tiempoMontaje: form.tiempoMontaje || undefined,
      precioSubTotal: num(form.precioSubTotal),
      iva: num(form.iva),
      total: num(form.total),
      inversionAnualUsd: num(form.inversionAnualUsd),
      valorContratacionTotalUsd: num(form.valorContratacionTotalUsd),
      ahorroAnualBs: num(form.ahorroAnualBs),
      retornoInversionAnios: num(form.retornoInversionAnios),
      ahorroTotal30AniosUsd: num(form.ahorroTotal30AniosUsd),
      imagenRoi: form.imagenRoi || undefined,
      roiBarras: form.roiBarras
        .filter((b) => b.valor !== "" && b.valor !== null)
        .map((b) => ({ etiqueta: b.etiqueta || undefined, valor: Number(b.valor) })),
    };

    setSaving(true);
    try {
      const guardada = esEdicion
        ? await updateCotizacionManualAction(id, dto)
        : await createCotizacionManualAction(dto);
      toast.success(esEdicion ? "Cotización actualizada." : "Cotización creada correctamente.");
      navigate(`/cotizaciones-manuales/${guardada.cotizacionManualId}/imprimir`);
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "Error al guardar la cotización."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Layout><p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Cargando...</p></Layout>;
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>{esEdicion ? `Editar ${form.nroPropuesta}` : "Nueva Cotización Manual"}</h1>
        <button className="btn-secondary" onClick={() => navigate("/cotizaciones-manuales")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaTimes /> Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── Página 1: Portada ── */}
        <SectionCard titulo="Página 1 — Portada" descripcion="Datos principales de la propuesta comercial.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Field label="Nro de Propuesta *">
              <input style={inputStyle} placeholder="CT-314-2026" value={form.nroPropuesta} onChange={set("nroPropuesta")} />
            </Field>
            <Field label="Nombre del Cliente *" flex="2 1 260px">
              <input style={inputStyle} placeholder="Miguel Torrejon" value={form.nombreCliente} onChange={set("nombreCliente")} />
            </Field>
            <Field label="Fecha *">
              <input style={inputStyle} type="date" value={form.fecha} onChange={set("fecha")} />
            </Field>
          </div>
        </SectionCard>

        {/* ── Página 2: Diseño del Sistema ── */}
        <SectionCard titulo="Página 2 — Diseño del Sistema" descripcion="Imágenes del proyecto y datos técnicos (KPIs).">
          <ImageUploader
            label="Imágenes del proyecto (vista tejado, render 3D, etc.)"
            multiple
            value={form.imagenesProyecto}
            onChange={set("imagenesProyecto")}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Field label="Potencia Instalada (kWp)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="5.04" value={form.potenciaInstalada} onChange={set("potenciaInstalada")} />
            </Field>
            <Field label="Cantidad de Paneles">
              <input style={inputStyle} type="number" step="1" min="0" placeholder="8" value={form.cantidadPaneles} onChange={set("cantidadPaneles")} />
            </Field>
            <Field label="Superficie Requerida (m²)">
              <input style={inputStyle} type="number" step="0.1" min="0" placeholder="21.5" value={form.superficieRequerida} onChange={set("superficieRequerida")} />
            </Field>
            <Field label="Producción Anual (kWh)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="7200" value={form.produccionAnualEstimada} onChange={set("produccionAnualEstimada")} />
            </Field>
          </div>
        </SectionCard>

        {/* ── Página 3: Cotización y Totales ── */}
        <SectionCard titulo="Página 3 — Cotización y Totales" descripcion="Oferta económica, cuadro de productos y condiciones.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 4 }}>
            <Field label="Lugar">
              <input style={inputStyle} value={form.lugar} onChange={set("lugar")} />
            </Field>
            <Field label="Validez de la Oferta (días)">
              <input style={inputStyle} type="number" step="1" min="1" value={form.validezOfertaDias} onChange={set("validezOfertaDias")} />
            </Field>
            <Field label="Realizado por">
              <input style={inputStyle} placeholder="Marvin Salguero" value={form.realizadoPor} onChange={set("realizadoPor")} />
            </Field>
            <Field label="Tiempo de Montaje">
              <input style={inputStyle} placeholder="15 a 20 días" value={form.tiempoMontaje} onChange={set("tiempoMontaje")} />
            </Field>
          </div>
          <ImageUploader
            label="Imagen del cuadro de productos (Nro, Cant, Und, Descripción, Total Bs)"
            value={form.imagenCuadroProductos}
            onChange={set("imagenCuadroProductos")}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Field label="Sub Total (Bs)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="47298.12" value={form.precioSubTotal} onChange={set("precioSubTotal")} />
            </Field>
            <Field label="IVA (Bs)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="4060.19" value={form.iva} onChange={set("iva")} />
            </Field>
            <Field label="Total (Bs)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="51358.31" value={form.total} onChange={set("total")} />
            </Field>
          </div>
        </SectionCard>

        {/* ── Página 5: Protección de Inversión ── */}
        <SectionCard titulo="Página 5 — Protección de Inversión" descripcion="Montos del plan de protección (página 4 es estática).">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Field label="Inversión Anual ($us)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="90" value={form.inversionAnualUsd} onChange={set("inversionAnualUsd")} />
            </Field>
            <Field label="Contratación Total 5 años ($us)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="270" value={form.valorContratacionTotalUsd} onChange={set("valorContratacionTotalUsd")} />
            </Field>
          </div>
        </SectionCard>

        {/* ── Página 6: ROI ── */}
        <SectionCard titulo="Página 6 — Retorno de Inversión (ROI)" descripcion="Métricas de ahorro y valores de las barras del gráfico.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 4 }}>
            <Field label="Ahorro Anual (Bs)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="8640" value={form.ahorroAnualBs} onChange={set("ahorroAnualBs")} />
            </Field>
            <Field label="Retorno de Inversión (años)">
              <input style={inputStyle} type="number" step="0.5" min="0" placeholder="5" value={form.retornoInversionAnios} onChange={set("retornoInversionAnios")} />
            </Field>
            <Field label="Ahorro Total 30 años (USD)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="56965" value={form.ahorroTotal30AniosUsd} onChange={set("ahorroTotal30AniosUsd")} />
            </Field>
          </div>

          <ImageUploader
            label="Imagen del gráfico ROI (opcional, se usa como referencia/fondo)"
            value={form.imagenRoi}
            onChange={set("imagenRoi")}
          />

          <label style={labelStyle}>Valores de las barras del gráfico (en orden)</label>
          {form.roiBarras.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, flex: "0 1 180px" }} placeholder={`Etiqueta (ej. Año ${i + 1})`}
                value={b.etiqueta} onChange={(e) => setBarra(i, "etiqueta", e.target.value)} />
              <input style={{ ...inputStyle, flex: "0 1 160px" }} type="number" step="0.01" placeholder="Valor"
                value={b.valor} onChange={(e) => setBarra(i, "valor", e.target.value)} />
              <button type="button" onClick={() => removeBarra(i)} title="Quitar barra"
                style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 14 }}>
                <FaTrash />
              </button>
            </div>
          ))}
          <button type="button" onClick={addBarra} className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <FaPlus /> Agregar barra
          </button>
        </SectionCard>

        {/* ── Acciones ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 30 }}>
          <button type="button" className="btn-secondary" onClick={() => navigate("/cotizaciones-manuales")}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaSave /> {saving ? "Guardando..." : (esEdicion ? "Guardar cambios" : "Crear cotización")}
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default CotizacionManualForm;

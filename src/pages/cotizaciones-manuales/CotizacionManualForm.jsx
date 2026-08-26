import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { createCotizacionManualAction } from "./actions/create-cotizacion.action";
import { updateCotizacionManualAction } from "./actions/update-cotizacion.action";
import { getCotizacionManualAction } from "./actions/get-cotizacion.action";
import { uploadImagenCotizacionAction } from "./actions/upload-imagen.action";
import { getCategoriasFlatAction } from "../Categorias/actions/get-categorias-flat.action";
import { getProductosAction } from "../inventario/actions/get-productos.action";
import { useToast } from "../../context/ToastContext";
import {
  FaSave, FaTimes, FaUpload, FaTrash, FaPlus, FaImage, FaSpinner, FaBoxOpen, FaSearch,
} from "react-icons/fa";

const DEFAULT_ROI_BARRAS = [
  { etiqueta: "5 años", valor: "" },
  { etiqueta: "10 años", valor: "" },
  { etiqueta: "15 años", valor: "" },
  { etiqueta: "20 años", valor: "" },
  { etiqueta: "25 años", valor: "" },
  { etiqueta: "30 años", valor: "" },
];

const INITIAL_FORM = {
  // Página 1
  nroPropuesta: "",
  nombreCliente: "",
  subtituloPropuesta: "Propuesta de Sistema Fotovoltaico On Grid",
  ubicacion: "Santa Cruz de la Sierra",
  fecha: "",
  // Página 4 (Diseño del Sistema)
  imagenesProyecto: [],
  potenciaInstalada: "",
  cantidadPaneles: "",
  superficieRequerida: "",
  produccionAnualEstimada: "",
  // Página 5 (Cotización y Totales)
  lugar: "Santa Cruz de la Sierra",
  validezOfertaDias: 30,
  realizadoPor: "",
  imagenCuadroProductos: "",
  items: [],
  tiempoMontaje: "15 a 20 días",
  notas: "",
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
  roiBarras: DEFAULT_ROI_BARRAS,
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
            <img src={url} alt="" style={{
              width: "100%", height: "100%", objectFit: "cover",
              borderRadius: 6, border: "1px solid #e5e7eb"
            }} />
            <button type="button" onClick={() => removeImage(url)} title="Quitar"
              style={{
                position: "absolute", top: -6, right: -6, background: "#dc2626", color: "#fff",
                border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10
              }}>
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: "#f3f4f6", border: "1px dashed #9ca3af", borderRadius: 6,
            cursor: "pointer", fontSize: 12, color: "#374151", fontWeight: 600
          }}>
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

// ── Subida de 4 imágenes para Página 4 (Diseño del Sistema) ────

const PAGINA4_SLOTS = [
  { label: "1. Vista Superior (Principal)", ratio: "16:9 (~1.7:1)", res: "1600 × 936 px", marco: "135 × 79 mm" },
  { label: "2. Vista 3D (Secundaria 1)", ratio: "4:3 (~1.2:1)", res: "720 × 608 px", marco: "56.5 × 47.7 mm" },
  { label: "3. Vista Inclinada (Secundaria 2)", ratio: "4:3 (~1.2:1)", res: "720 × 608 px", marco: "56.5 × 47.7 mm" },
  { label: "4. Vista Lateral (Secundaria 3)", ratio: "4:3 (~1.2:1)", res: "720 × 608 px", marco: "56.5 × 47.7 mm" },
];

function ProyectoImagesUploader({ value = [], onChange }) {
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const toast = useToast();
  const inputRefs = useRef([]);

  const handleFileSlot = async (e, slotIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(slotIndex);
    try {
      const { secureUrl } = await uploadImagenCotizacionAction(file);
      const newImages = [...(value || [])];
      newImages[slotIndex] = secureUrl;
      onChange(newImages);
      toast.success(`Imagen (${PAGINA4_SLOTS[slotIndex].label}) subida correctamente.`);
    } catch (err) {
      toast.error("Error al subir la imagen.");
    } finally {
      setUploadingIndex(null);
      if (inputRefs.current[slotIndex]) inputRefs.current[slotIndex].value = "";
    }
  };

  const removeSlotImage = (slotIndex) => {
    const newImages = [...(value || [])];
    newImages[slotIndex] = "";
    onChange(newImages);
  };

  const uploadedCount = (value || []).filter(Boolean).length;

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>
        Imágenes del Proyecto (Página 4 — 4 Imágenes Requeridas *)
      </label>

      {/* ── Guía de proporciones y dimensiones de imagen ── */}
      <div style={{
        background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
        padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#1e40af"
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          💡 Guía de Proporciones y Medidas para la Página 4
        </div>
        <ul style={{ margin: "4px 0 0", paddingLeft: 18, lineHeight: "1.5" }}>
          <li>
            <strong>Vista Superior (Principal)</strong>: Proporción <strong>16:9</strong> (~1.7:1). Medida ideal: <strong>1600 × 936 px</strong>.
            <span style={{ color: "#b91c1c", display: "block", fontSize: 11, fontWeight: 600 }}>
              * Evitar imágenes ultra panorámicas o angostas (ej. 1135 × 265 px), ya que el marco A4 es rectangular estándar.
            </span>
          </li>
          <li>
            <strong>Vistas Secundarias (3D, Inclinada, Lateral)</strong>: Proporción <strong>4:3</strong> (~1.2:1). Medida ideal: <strong>720 × 608 px</strong>.
          </li>
        </ul>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 8 }}>
        {PAGINA4_SLOTS.map((slot, idx) => {
          const url = value[idx];
          const isUploading = uploadingIndex === idx;
          return (
            <div key={idx} style={{
              border: url ? "1px solid #16a34a" : "1px dashed #cbd5e1",
              borderRadius: 8, padding: 10, background: url ? "#f0fdf4" : "#fafafa",
              display: "flex", flexDirection: "column", alignItems: "center", position: "relative"
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0f2a4a", marginBottom: 2, textAlign: "center" }}>
                {slot.label}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 8, textAlign: "center" }}>
                Ideal: <strong>{slot.res}</strong> ({slot.ratio})
              </span>

              {url ? (
                <div style={{ position: "relative", width: "100%", height: 100 }}>
                  <img src={url} alt={slot.label} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                  <button type="button" onClick={() => removeSlotImage(idx)} title="Quitar imagen"
                    style={{
                      position: "absolute", top: -6, right: -6, background: "#dc2626", color: "#fff",
                      border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10
                    }}>
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => inputRefs.current[idx]?.click()} disabled={isUploading}
                  style={{
                    width: "100%", height: 100, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 6, background: "#fff",
                    border: "1px dashed #9ca3af", borderRadius: 6, cursor: "pointer", color: "#4b5563", fontSize: 12
                  }}>
                  {isUploading ? <FaSpinner className="spin" /> : <FaUpload style={{ color: "#16a34a" }} />}
                  <span>{isUploading ? "Subiendo..." : "Subir imagen"}</span>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>{slot.res}</span>
                </button>
              )}

              <input
                ref={(el) => (inputRefs.current[idx] = el)}
                type="file" accept="image/*"
                onChange={(e) => handleFileSlot(e, idx)}
                style={{ display: "none" }}
              />
            </div>
          );
        })}
      </div>
      <p style={{
        margin: "8px 0 0", fontSize: 12, fontWeight: 600,
        color: uploadedCount === 4 ? "#15803d" : "#b91c1c",
        display: "flex", alignItems: "center", gap: 6
      }}>
        {uploadedCount === 4
          ? "✓ Se han subido las 4 imágenes requeridas."
          : `⚠ Obligatorio: Faltan ${4 - uploadedCount} de las 4 imágenes requeridas.`}
      </p>
    </div>
  );
}

// ── Campos helpers ────────────────────────────────────────────

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700, color: "#374151",
  marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px"
};

const inputStyle = {
  width: "100%", padding: "8px 10px", border: "1px solid #d1d5db",
  borderRadius: 6, fontSize: 13, boxSizing: "border-box"
};

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
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(esEdicion);
  const [saving, setSaving] = useState(false);

  // ── Agregar ítem desde el catálogo de productos ──
  const [showCatalogo, setShowCatalogo] = useState(false);
  const [categoriasCatalogo, setCategoriasCatalogo] = useState([]);
  const [catalogoCategoriaId, setCatalogoCategoriaId] = useState("");
  const [catalogoBusqueda, setCatalogoBusqueda] = useState("");
  const [catalogoResultados, setCatalogoResultados] = useState([]);
  const [catalogoSeleccionado, setCatalogoSeleccionado] = useState(null);
  const [catalogoCantidad, setCatalogoCantidad] = useState(1);

  useEffect(() => {
    getCategoriasFlatAction().then((d) => setCategoriasCatalogo(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // Al crear una nueva cotización, autocompletar 'realizadoPor' con el usuario logueado
  useEffect(() => {
    if (!esEdicion && user) {
      const nombreUsuario = user.nombreCompleto || user.nombre || "";
      if (nombreUsuario && !form.realizadoPor) {
        setForm((f) => ({ ...f, realizadoPor: nombreUsuario }));
      }
    }
  }, [user, esEdicion]);

  useEffect(() => {
    if (!esEdicion) return;
    getCotizacionManualAction(id)
      .then((data) => {
        setForm({
          ...INITIAL_FORM,
          ...data,
          subtituloPropuesta: data.subtituloPropuesta ?? INITIAL_FORM.subtituloPropuesta,
          ubicacion: data.ubicacion ?? data.lugar ?? INITIAL_FORM.ubicacion,
          fecha: data.fecha ? String(data.fecha).slice(0, 10) : "",
          imagenesProyecto: data.imagenesProyecto ?? [],
          imagenCuadroProductos: data.imagenCuadroProductos ?? "",
          items: data.items ?? [],
          realizadoPor: data.realizadoPor || (user?.nombreCompleto || user?.nombre || ""),
          roiBarras: DEFAULT_ROI_BARRAS.map((def, idx) => {
            const loaded = data.roiBarras ?? [];
            const match = loaded[idx] || loaded.find((b) => String(b.etiqueta).includes(String(idx * 5 + 5)));
            return {
              etiqueta: def.etiqueta,
              valor: match ? match.valor : "",
            };
          }),
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("No se pudo cargar la cotización.");
        navigate("/cotizaciones-manuales");
      });
  }, [id, esEdicion, navigate, toast, user]);

  const set = (campo) => (e) => {
    const v = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [campo]: v }));
  };

  // ── Gestión dinámica de Ítems (Productos / Servicios) ──
  const updateItemsAndTotals = (newItems) => {
    const subtotal = newItems.reduce((acc, it) => acc + (Number(it.totalBs) || 0), 0);
    const ivaVal = Number((subtotal * 0.13).toFixed(2));
    const totalVal = Number((subtotal + ivaVal).toFixed(2));

    setForm((f) => ({
      ...f,
      items: newItems,
      precioSubTotal: subtotal ? subtotal.toFixed(2) : f.precioSubTotal,
      iva: ivaVal ? ivaVal.toFixed(2) : f.iva,
      total: totalVal ? totalVal.toFixed(2) : f.total,
    }));
  };

  const addItem = () => {
    const nextNro = form.items.length + 1;
    const newItems = [
      ...form.items,
      { nro: nextNro, cantidad: 1, unidad: "und", descripcion: "", precioUnitario: "", totalBs: "" },
    ];
    updateItemsAndTotals(newItems);
  };

  const removeItem = (index) => {
    const newItems = form.items
      .filter((_, i) => i !== index)
      .map((it, idx) => ({ ...it, nro: idx + 1 }));
    updateItemsAndTotals(newItems);
  };

  const setItemField = (index, field, value) => {
    const newItems = form.items.map((it, idx) => {
      if (idx !== index) return it;
      const updated = { ...it, [field]: value };
      if (field === "cantidad" || field === "precioUnitario") {
        const cant = Number(field === "cantidad" ? value : updated.cantidad) || 0;
        const pu = Number(field === "precioUnitario" ? value : updated.precioUnitario) || 0;
        updated.totalBs = (cant * pu).toFixed(2);
      }
      return updated;
    });
    updateItemsAndTotals(newItems);
  };

  // ── Agregar ítem desde catálogo ──
  const abrirCatalogo = () => {
    setCatalogoCategoriaId(""); setCatalogoBusqueda(""); setCatalogoResultados([]);
    setCatalogoSeleccionado(null); setCatalogoCantidad(1);
    setShowCatalogo(true);
  };

  const buscarEnCatalogo = async () => {
    try {
      const filtros = { limit: 20 };
      if (catalogoCategoriaId) filtros.categoriaId = catalogoCategoriaId;
      if (catalogoBusqueda) filtros.search = catalogoBusqueda;
      const res = await getProductosAction(filtros);
      setCatalogoResultados(Array.isArray(res) ? res : (res.data ?? []));
    } catch {
      setCatalogoResultados([]);
    }
  };

  const confirmarAgregarDesdeCatalogo = () => {
    if (!catalogoSeleccionado) return;
    const cantidad = Number(catalogoCantidad) || 1;
    const precioUnitario = catalogoSeleccionado.precioActual ?? 0;
    const nextNro = form.items.length + 1;
    const newItems = [
      ...form.items,
      {
        nro: nextNro, cantidad, unidad: "und",
        descripcion: catalogoSeleccionado.nombre,
        precioUnitario, totalBs: (cantidad * precioUnitario).toFixed(2),
        productoId: catalogoSeleccionado.productoId,
      },
    ];
    updateItemsAndTotals(newItems);
    setShowCatalogo(false);
  };

  // ── ROI barras dinámicas ──
  const addBarra = () => setForm((f) => ({ ...f, roiBarras: [...f.roiBarras, { etiqueta: "", valor: "" }] }));
  const removeBarra = (i) => setForm((f) => ({ ...f, roiBarras: f.roiBarras.filter((_, idx) => idx !== i) }));
  const setBarra = (i, campo, valor) =>
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

    const imgsCount = (form.imagenesProyecto || []).filter(Boolean).length;
    if (imgsCount < 4) {
      toast.error(`Debes subir las 4 imágenes requeridas para la Página 4 (Faltan ${4 - imgsCount}).`);
      return;
    }

    const num = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));

    const dto = {
      nroPropuesta: form.nroPropuesta.trim(),
      nombreCliente: form.nombreCliente.trim(),
      subtituloPropuesta: form.subtituloPropuesta ? form.subtituloPropuesta.trim() : undefined,
      ubicacion: form.ubicacion ? form.ubicacion.trim() : undefined,
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
      items: (form.items || []).map((it, idx) => ({
        nro: idx + 1,
        cantidad: Number(it.cantidad) || 0,
        unidad: it.unidad || "und",
        descripcion: it.descripcion || "",
        precioUnitario: num(it.precioUnitario),
        totalBs: num(it.totalBs),
        productoId: it.productoId || undefined,
      })),
      tiempoMontaje: form.tiempoMontaje || undefined,
      notas: form.notas ? form.notas.trim() : undefined,
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
            <Field label="Subtítulo de la Propuesta (Portada)" flex="1 1 240px">
              <input style={inputStyle} placeholder="Propuesta de Sistema Fotovoltaico On Grid" value={form.subtituloPropuesta} onChange={set("subtituloPropuesta")} />
            </Field>
            <Field label="Ubicación (Portada)" flex="1 1 200px">
              <input style={inputStyle} placeholder="Santa Cruz de la Sierra" value={form.ubicacion} onChange={set("ubicacion")} />
            </Field>
          </div>
        </SectionCard>

        {/* ── Página 4: Diseño del Sistema ── */}
        <SectionCard titulo="Página 4 — Diseño del Sistema" descripcion="Subí las 4 imágenes requeridas del proyecto (Vista Superior, 3D, Inclinada y Lateral) y datos técnicos.">
          <ProyectoImagesUploader
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

        {/* ── Página 5: Cotización y Totales ── */}
        <SectionCard titulo="Página 5 — Cotización y Totales" descripcion="Oferta económica, cuadro dinámico de productos y servicios, y totales (Se generan páginas adicionales automáticamente si se cargan más de 8 ítems).">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
            <Field label="Lugar">
              <input style={inputStyle} value={form.lugar} onChange={set("lugar")} />
            </Field>
            <Field label="Validez de la Oferta (días)">
              <input style={inputStyle} type="number" step="1" min="1" value={form.validezOfertaDias} onChange={set("validezOfertaDias")} />
            </Field>
            <Field label="Realizado por (Usuario logueado)">
              <input style={inputStyle} placeholder="Nombre del usuario" value={form.realizadoPor} onChange={set("realizadoPor")} />
            </Field>
            <Field label="Tiempo de Montaje">
              <input style={inputStyle} placeholder="15 a 20 días" value={form.tiempoMontaje} onChange={set("tiempoMontaje")} />
            </Field>
            <Field label="Notas / Observaciones (Página 5)" flex="1 1 100%">
              <input style={inputStyle} placeholder="Observaciones o notas adicionales..." value={form.notas} onChange={set("notas")} />
            </Field>
          </div>

          {/* ── Tabla Dinámica de Productos / Servicios ── */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={labelStyle}>Cuadro de Productos y Servicios ({form.items.length} ítems)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={abrirCatalogo}
                  className="btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "6px 12px" }}
                >
                  <FaBoxOpen /> Agregar desde catálogo
                </button>
                <button
                  type="button"
                  onClick={addItem}
                  className="btn-secondary"
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "6px 12px" }}
                >
                  <FaPlus /> Agregar ítem
                </button>
              </div>
            </div>

            {form.items.length === 0 ? (
              <div style={{ padding: "20px", textStyle: "center", textAlign: "center", background: "#f8fafc", borderRadius: 8, border: "1px dashed #cbd5e1", color: "#64748b", fontSize: 13 }}>
                No hay productos o servicios agregados. Haz clic en "Agregar ítem" para armar el cuadro de la cotización.
              </div>
            ) : (
              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", textAlign: "left", color: "#0f2a4a" }}>
                      <th style={{ padding: "8px 10px", width: 45, textAlign: "center" }}>N°</th>
                      <th style={{ padding: "8px 10px", width: 90 }}>Cant.</th>
                      <th style={{ padding: "8px 10px", width: 90 }}>Unidad</th>
                      <th style={{ padding: "8px 10px" }}>Descripción del Producto / Servicio</th>
                      <th style={{ padding: "8px 10px", width: 130 }}>P. Unitario (Bs)</th>
                      <th style={{ padding: "8px 10px", width: 130 }}>Total (Bs)</th>
                      <th style={{ padding: "8px 10px", width: 50, textAlign: "center" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, color: "#64748b" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            style={inputStyle}
                            value={it.cantidad}
                            onChange={(e) => setItemField(idx, "cantidad", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <input
                            type="text"
                            placeholder="und"
                            style={inputStyle}
                            value={it.unidad}
                            onChange={(e) => setItemField(idx, "unidad", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <input
                            type="text"
                            placeholder="Descripción del ítem..."
                            style={inputStyle}
                            value={it.descripcion}
                            onChange={(e) => setItemField(idx, "descripcion", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            style={inputStyle}
                            value={it.precioUnitario}
                            onChange={(e) => setItemField(idx, "precioUnitario", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            style={{ ...inputStyle, fontWeight: 700, color: "#0f2a4a" }}
                            value={it.totalBs}
                            onChange={(e) => setItemField(idx, "totalBs", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            title="Eliminar ítem"
                            style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 13 }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Field label="Sub Total (Bs)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="0.00" value={form.precioSubTotal} onChange={set("precioSubTotal")} />
            </Field>
            <Field label="IVA (Bs)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="0.00" value={form.iva} onChange={set("iva")} />
            </Field>
            <Field label="Total (Bs)">
              <input style={inputStyle} type="number" step="0.01" min="0" placeholder="0.00" value={form.total} onChange={set("total")} />
            </Field>
          </div>
        </SectionCard>

        {/* ── Página 7: Protección de Inversión ── */}
        <SectionCard titulo="Página 7 — Protección de Inversión" descripcion="Montos del plan de protección de inversión (inversión anual y contratación total a 5 años).">
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
        <SectionCard titulo="Página 6 — Retorno de Inversión (ROI)" descripcion="Métricas de ahorro y montos en Bolivianos (Bs) para las barras del gráfico de 5 en 5 años (5 a 30 años).">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
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

          <div style={{ marginTop: 14 }}>
            <label style={{ ...labelStyle, marginBottom: 8, display: "block" }}>
              Valores del Gráfico en Bolivianos (Bs) — Intervalos de 5 a 30 años
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              {form.roiBarras.map((b, i) => (
                <div key={i} style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#0f2a4a", display: "block", marginBottom: 4 }}>
                    {b.etiqueta || `${(i + 1) * 5} años`} (Bs)
                  </label>
                  <input
                    style={inputStyle}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Monto en Bs..."
                    value={b.valor}
                    onChange={(e) => setBarra(i, "valor", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
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

      {/* Modal: Agregar ítem desde catálogo */}
      {showCatalogo && (
        <div className="modal-backdrop" onClick={() => setShowCatalogo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>Agregar desde catálogo</h3>
              <button className="modal-close" onClick={() => setShowCatalogo(false)}>×</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={catalogoCategoriaId} onChange={(e) => setCatalogoCategoriaId(e.target.value)} style={{ flex: 1 }}>
                  <option value="">Todas las categorías</option>
                  {categoriasCatalogo.map((c) => (
                    <option key={c.categoriaId} value={c.categoriaId}>{c.nombre}</option>
                  ))}
                </select>
                <input
                  value={catalogoBusqueda}
                  onChange={(e) => setCatalogoBusqueda(e.target.value)}
                  placeholder="Buscar por nombre, código o SKU..."
                  style={{ flex: 2 }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); buscarEnCatalogo(); } }}
                />
                <button type="button" className="btn-secondary" onClick={buscarEnCatalogo}>
                  <FaSearch />
                </button>
              </div>

              {catalogoResultados.length > 0 && (
                <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: 6 }}>
                  {catalogoResultados.map((p) => (
                    <div key={p.productoId}
                      onClick={() => setCatalogoSeleccionado(p)}
                      style={{
                        padding: "8px 10px", cursor: "pointer", fontSize: 13,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        background: catalogoSeleccionado?.productoId === p.productoId ? "#eff6ff" : "#fff",
                        borderBottom: "1px solid #f3f4f6",
                      }}>
                      <div>
                        <strong>{p.nombre}</strong>
                        <span style={{ color: "#9ca3af", marginLeft: 6, fontSize: 11 }}>{p.codigo}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: "#1d4ed8" }}>
                        {p.precioActual != null ? `$${Number(p.precioActual).toFixed(2)}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {catalogoSeleccionado && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#059669" }}>
                    Seleccionado: <strong>{catalogoSeleccionado.nombre}</strong>
                  </span>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    <label style={{ fontSize: 12 }}>Cantidad</label>
                    <input type="number" min="0.01" step="0.01" style={{ width: 80 }}
                      value={catalogoCantidad} onChange={(e) => setCatalogoCantidad(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowCatalogo(false)}>Cancelar</button>
              <button type="button" className="btn-primary" onClick={confirmarAgregarDesdeCatalogo} disabled={!catalogoSeleccionado}>
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CotizacionManualForm;

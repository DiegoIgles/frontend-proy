import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import {
  getCotizacionTecnicaAction, updateCotizacionTecnicaAction, generarComercialAction, descargarExcelTecnicaAction,
  sincronizarSeccionesAction, traerProductosComercialAction,
} from "./actions/cotizaciones-tecnicas.actions";
import { getProductosAction } from "../inventario/actions/get-productos.action";
import { MONEDAS, CODIGOS_MONEDA } from "../cotizaciones-manuales/shared/monedas";
import { calcularCotizacionTecnica, colorSeccion, fmt, FINANZAS_DEFAULT, PARAMETROS_DEFAULT, agruparPorSubcategoria } from "./calculo";
import {
  FaSave, FaTimes, FaPlus, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaFileExcel,
  FaFileContract, FaEye, FaSpinner, FaBoxOpen, FaHistory, FaSync, FaTag, FaLock,
} from "react-icons/fa";

// ── Estilos base (mismos del formulario de cotización manual) ──
const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" };
const inputStyle = { width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, boxSizing: "border-box" };
const celdaInput = { ...inputStyle, padding: "5px 7px", fontSize: 12 };

function Field({ label, children, flex = "1 1 200px" }) {
  return (
    <div style={{ flex, minWidth: 150 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function SectionCard({ titulo, descripcion, children, extra }) {
  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800, color: "#0f2a4a" }}>{titulo}</h2>
          {descripcion && <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>{descripcion}</p>}
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
}

const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

const ITEM_VACIO = { productoId: null, categoriaId: null, categoriaNombre: "", codigo: "", sku: "", descripcion: "", unidad: "", cantidad: 1, precioUnitario: "", factura: true, nota: "" };

// ── Buscador de catálogo inline (por sección) ─────────────────
//
// Escribís código (ESTR.), SKU o nombre y elegís; el producto se COPIA a la
// fila (snapshot). Reemplaza el INDEX/MATCH del Excel contra "I. Materiales".
function BuscadorCatalogo({ onElegir, onCerrar, categoriaId, categoriaNombre }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState([]);
  const [buscando, setBuscando] = useState(false);
  // Por defecto se busca dentro de la categoría de la sección (con sus
  // subcategorías); se puede abrir a todo el catálogo.
  const [soloCategoria, setSoloCategoria] = useState(Boolean(categoriaId));
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    // Con categoría se listan sus productos aun sin texto; sin categoría hay que escribir.
    if (!q.trim() && !(soloCategoria && categoriaId)) { setRes([]); return; }
    const t = setTimeout(async () => {
      setBuscando(true);
      try {
        const filtros = { limit: 15 };
        if (q.trim()) filtros.search = q.trim();
        if (soloCategoria && categoriaId) filtros.categoriaId = categoriaId;
        const r = await getProductosAction(filtros);
        setRes(Array.isArray(r) ? r : (r.data ?? []));
      } catch { setRes([]); }
      finally { setBuscando(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [q, soloCategoria, categoriaId]);

  return (
    <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 8, padding: 10, marginTop: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <FaSearch style={{ color: "#1d4ed8" }} />
        <input ref={inputRef} style={{ ...inputStyle, flex: "1 1 260px" }} placeholder="Buscar por código (ESTR.), SKU o nombre..."
          value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") onCerrar(); if (e.key === "Enter" && res[0]) { e.preventDefault(); onElegir(res[0]); } }} />
        {categoriaId && (
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#1e40af", whiteSpace: "nowrap" }}>
            <input type="checkbox" checked={soloCategoria} onChange={(e) => setSoloCategoria(e.target.checked)} style={{ width: 14, height: 14 }} />
            Solo "{categoriaNombre}" y sus subcategorías
          </label>
        )}
        <button type="button" className="btn-secondary" onClick={onCerrar} style={{ padding: "6px 10px" }}><FaTimes /></button>
      </div>
      {(buscando || res.length > 0 || q.trim()) && (
        <div style={{ maxHeight: 220, overflowY: "auto", marginTop: 8, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6 }}>
          {buscando && <p style={{ margin: 0, padding: 8, fontSize: 12, color: "#6b7280" }}>Buscando...</p>}
          {!buscando && q.trim() && res.length === 0 && <p style={{ margin: 0, padding: 8, fontSize: 12, color: "#9ca3af" }}>Sin resultados. Podés cargar el ítem a mano.</p>}
          {res.map((p) => (
            <div key={p.productoId} onClick={() => onElegir(p)}
              style={{ padding: "7px 10px", cursor: "pointer", fontSize: 12, display: "flex", justifyContent: "space-between", gap: 10, borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0f2a4a" }}>{p.codigo}</span>
                {p.sku && <span style={{ color: "#9ca3af", marginLeft: 6 }}>{p.sku}</span>}
                <span style={{ marginLeft: 8 }}>{p.nombre}</span>
                {p.unidad && <span style={{ color: "#6b7280", marginLeft: 6 }}>· {p.unidad}</span>}
                {p.categoriaPrincipal?.nombre && <span style={{ color: "#7c3aed", marginLeft: 6, fontSize: 11 }}>[{p.categoriaPrincipal.nombre}]</span>}
              </div>
              <span style={{ fontWeight: 700, color: "#1d4ed8", whiteSpace: "nowrap" }}>{p.precioActual != null ? fmt(p.precioActual) : "sin precio"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sección (bloque romano) ───────────────────────────────────

function SeccionEditor({ seccion, idx, total, calcSeccion, sim, onChange, onMover, onQuitar }) {
  const [buscando, setBuscando] = useState(false);
  const color = colorSeccion(idx);

  const setCampo = (campo, v) => onChange({ ...seccion, [campo]: v });
  const setItem = (i, campo, v) =>
    onChange({ ...seccion, items: seccion.items.map((it, k) => (k === i ? { ...it, [campo]: v } : it)) });
  const quitarItem = (i) => onChange({ ...seccion, items: seccion.items.filter((_, k) => k !== i) });
  const agregarLibre = () => onChange({ ...seccion, items: [...seccion.items, { ...ITEM_VACIO }] });
  const agregarDeCatalogo = (p) => {
    onChange({
      ...seccion,
      items: [...seccion.items, {
        ...ITEM_VACIO,
        productoId: p.productoId, codigo: p.codigo ?? "", sku: p.sku ?? "",
        // Se copia la categoría (hoja) del producto para agrupar dentro de la
        // sección; queda congelada aunque el producto cambie de categoría.
        categoriaId: p.categoriaPrincipal?.categoriaId ?? null,
        categoriaNombre: p.categoriaPrincipal?.nombre ?? "",
        descripcion: p.nombre ?? "", unidad: p.unidad ?? "", precioUnitario: p.precioActual ?? "",
      }],
    });
    setBuscando(false);
  };

  const th = { padding: "6px 8px", fontSize: 11, textAlign: "left", color: "#0f2a4a", whiteSpace: "nowrap" };
  const td = { padding: "4px 4px", verticalAlign: "middle" };

  return (
    <div className="card" style={{ marginBottom: 14, padding: 0, overflow: "hidden", borderLeft: `6px solid ${color}` }}>
      {/* Cabecera de la sección */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: `${color}33`, flexWrap: "wrap" }}>
        <input style={{ ...celdaInput, width: 56, fontWeight: 800, textAlign: "center" }} value={seccion.numeral} onChange={(e) => setCampo("numeral", e.target.value)} title="Numeral" />
        <input style={{ ...celdaInput, flex: "1 1 220px", fontWeight: 700 }} value={seccion.nombre} onChange={(e) => setCampo("nombre", e.target.value)} placeholder="Nombre de la sección" />
        <input style={{ ...celdaInput, flex: "1 1 220px" }} value={seccion.resumen ?? ""} onChange={(e) => setCampo("resumen", e.target.value)} placeholder="Rótulo para la comercial (ej. Tablero de Protecciones en AC)" title="Cómo se llama esta sección en la cotización comercial" />
        {seccion.categoriaId ? (
          <span title="Sección creada desde esta categoría del sistema. El nombre quedó copiado: si la categoría cambia, la hoja no." style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#5b21b6", background: "#ede9fe", padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
            <FaTag /> Categoría del sistema
          </span>
        ) : (
          <span title="Sección agregada a mano (no viene de una categoría)" style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
            Manual
          </span>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button type="button" className="btn-secondary" onClick={() => onMover(-1)} disabled={idx === 0} style={{ padding: "5px 8px" }} title="Subir"><FaArrowUp /></button>
          <button type="button" className="btn-secondary" onClick={() => onMover(1)} disabled={idx === total - 1} style={{ padding: "5px 8px" }} title="Bajar"><FaArrowDown /></button>
          <button type="button" className="btn-secondary" onClick={onQuitar} style={{ padding: "5px 8px", color: "#dc2626" }} title="Quitar sección"><FaTrash /></button>
        </div>
      </div>

      <div style={{ padding: "8px 12px 12px" }}>
        {seccion.items.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ ...th, width: 96 }}>ESTR.</th>
                  <th style={{ ...th, width: 72 }}>CÓD.</th>
                  <th style={th}>Ítem / descripción</th>
                  <th style={{ ...th, width: 50 }}>Ud.</th>
                  <th style={{ ...th, width: 66 }}>Cant.</th>
                  <th style={{ ...th, width: 90 }}>P/U ({sim})</th>
                  <th style={{ ...th, width: 90, textAlign: "right" }}>Subtotal</th>
                  <th style={{ ...th, width: 48, textAlign: "center" }} title="¿El proveedor factura este ítem?">Fact.</th>
                  <th style={{ ...th, width: 90, textAlign: "right" }} title="Precio de venta prorrateado (col. M del Excel)">P. Venta</th>
                  <th style={{ ...th, width: 120 }}>Obs.</th>
                  <th style={{ ...th, width: 30 }}></th>
                </tr>
              </thead>
              <tbody>
                {agruparPorSubcategoria(seccion.items, seccion.nombre).map((g) => (
                  <React.Fragment key={g.titulo ?? "__sin"}>
                    {g.titulo && (
                      <tr style={{ background: `${color}22` }}>
                        <td colSpan={11} style={{ ...td, padding: "5px 8px", fontSize: 11, fontWeight: 700, color: "#374151", fontStyle: "italic" }}>
                          <FaTag style={{ marginRight: 5, color: "#7c3aed" }} />{g.titulo}
                        </td>
                      </tr>
                    )}
                    {g.items.map(({ item: it, indice: i }) => {
                  const calcIt = calcSeccion?.items?.[i];
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: it.productoId ? "#fff" : "#fffbeb" }}>
                      <td style={td}><input style={{ ...celdaInput, fontFamily: "monospace" }} value={it.codigo ?? ""} onChange={(e) => setItem(i, "codigo", e.target.value)} placeholder="libre" title={it.productoId ? "Copiado del catálogo: editar acá no cambia el producto del sistema" : "Ítem libre"} /></td>
                      <td style={td}><input style={{ ...celdaInput, fontFamily: "monospace" }} value={it.sku ?? ""} onChange={(e) => setItem(i, "sku", e.target.value)} /></td>
                      <td style={td}><input style={celdaInput} value={it.descripcion} onChange={(e) => setItem(i, "descripcion", e.target.value)} placeholder="Descripción del ítem" /></td>
                      <td style={td}><input style={celdaInput} value={it.unidad ?? ""} onChange={(e) => setItem(i, "unidad", e.target.value)} placeholder="Ud." /></td>
                      <td style={td}><input type="number" step="0.01" min="0" style={celdaInput} value={it.cantidad} onChange={(e) => setItem(i, "cantidad", e.target.value)} /></td>
                      <td style={td}><input type="number" step="0.01" min="0" style={celdaInput} value={it.precioUnitario} onChange={(e) => setItem(i, "precioUnitario", e.target.value)} placeholder="0.00" /></td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 700, color: "#0f2a4a", fontSize: 12 }}>{fmt(calcIt?.subtotal)}</td>
                      <td style={{ ...td, textAlign: "center" }}><input type="checkbox" checked={!!it.factura} onChange={(e) => setItem(i, "factura", e.target.checked)} /></td>
                      <td style={{ ...td, textAlign: "right", fontSize: 12, color: "#15803d", fontWeight: 600 }}>{fmt(calcIt?.precioVenta)}</td>
                      <td style={td}><input style={celdaInput} value={it.nota ?? ""} onChange={(e) => setItem(i, "nota", e.target.value)} placeholder="Str.1 40 m / Str.2 40 m" /></td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <button type="button" onClick={() => quitarItem(i)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }} title="Quitar ítem"><FaTrash /></button>
                      </td>
                    </tr>
                  );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: `${color}55`, fontWeight: 800, fontSize: 12 }}>
                  <td colSpan={6} style={{ ...td, textAlign: "right", color: "#0f2a4a", textTransform: "uppercase" }}>{seccion.resumen || seccion.nombre}</td>
                  <td style={{ ...td, textAlign: "right", color: "#0f2a4a" }}>{sim} {fmt(calcSeccion?.subtotal)}</td>
                  <td></td>
                  <td style={{ ...td, textAlign: "right", color: "#15803d" }}>{sim} {fmt(calcSeccion?.precioVenta)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {seccion.items.length === 0 && !buscando && (
          <p style={{ margin: "4px 0 8px", fontSize: 12, color: "#9ca3af" }}>Sin ítems. Agregá desde el catálogo o una fila libre.</p>
        )}

        {buscando ? (
          <BuscadorCatalogo onElegir={agregarDeCatalogo} onCerrar={() => setBuscando(false)} categoriaId={seccion.categoriaId} categoriaNombre={seccion.nombre} />
        ) : (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" className="btn-primary" onClick={() => setBuscando(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "5px 10px" }}>
              <FaBoxOpen /> Desde catálogo
            </button>
            <button type="button" className="btn-secondary" onClick={agregarLibre} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "5px 10px" }}>
              <FaPlus /> Ítem libre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Panel de cierre financiero (en vivo) ──────────────────────

function PanelCierre({ calc, sim, finanzas }) {
  const fila = (label, valor, opts = {}) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "5px 0", borderBottom: opts.fuerte ? "none" : "1px dashed #e5e7eb", fontSize: opts.fuerte ? 14 : 12, fontWeight: opts.fuerte ? 800 : 500, color: opts.color ?? "#374151" }}>
      <span>{label}</span>
      <span style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{opts.pct ? `${fmt(valor * 100, 1)} %` : `${sim} ${fmt(valor)}`}</span>
    </div>
  );
  return (
    <div className="card">
      <h2 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 800, color: "#0f2a4a" }}>Cierre financiero</h2>
      {fila("Total costos", calc.totalCostos, { fuerte: true, color: "#0f2a4a" })}
      {fila(`Utilidad (${finanzas.utilidadPct}%)`, calc.utilidad)}
      {fila("Total antes de impuestos", calc.totalAntesImpuestos)}
      {fila("Facturado", calc.facturado, { color: "#6b7280" })}
      {fila("No facturado (+ utilidad)", calc.noFacturado, { color: "#6b7280" })}
      {fila(`IVA (${finanzas.ivaPct}% s/ no fact.)`, calc.iva)}
      {fila("Total + IVA", calc.totalConIva)}
      {fila(`IT (${finanzas.itPct}%)`, calc.it)}
      <div style={{ background: "#0f2a4a", color: "#fff", borderRadius: 8, padding: "10px 12px", marginTop: 8 }}>
        <span style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>Total proyecto</span>
        <span style={{ fontSize: 20, fontWeight: 800 }}>{sim} {fmt(calc.totalProyecto)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
        <span style={{ color: "#6b7280" }}>Margen s/ venta</span>
        <strong style={{ color: "#15803d" }}>{fmt(calc.margen * 100, 1)} %</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span style={{ color: "#6b7280" }}>Factor de venta</span>
        <strong>× {fmt(calc.factorVenta, 4)}</strong>
      </div>
    </div>
  );
}

// ── Formulario ────────────────────────────────────────────────

const INITIAL_FORM = {
  nroPropuesta: "", nombreCliente: "", titulo: "", fecha: new Date().toISOString().slice(0, 10),
  realizadoPor: "", notas: "", moneda: "BS",
  parametros: { ...PARAMETROS_DEFAULT }, finanzas: { ...FINANZAS_DEFAULT }, secciones: [],
};

function CotizacionTecnicaForm() {
  // La hoja técnica siempre existe (nace con la comercial): esta pantalla es solo edición.
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cotManual, setCotManual] = useState(null);
  const [showGenerar, setShowGenerar] = useState(false);
  const [modoGenerar, setModoGenerar] = useState("porSeccion");
  const [generando, setGenerando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCotizacionTecnicaAction(id);
        setCotManual(data.cotizacionManual ?? null);
        setForm({
          ...INITIAL_FORM, ...data,
          titulo: data.titulo ?? "", notas: data.notas ?? "",
          fecha: String(data.fecha).slice(0, 10),
          parametros: { ...PARAMETROS_DEFAULT, ...(data.parametros ?? {}) },
          finanzas: { ...FINANZAS_DEFAULT, ...(data.finanzas ?? {}) },
          secciones: (data.secciones ?? []).map((s) => ({ ...s, resumen: s.resumen ?? "", items: (s.items ?? []).map((it) => ({ ...ITEM_VACIO, ...it, nota: it.nota ?? "", codigo: it.codigo ?? "", sku: it.sku ?? "", unidad: it.unidad ?? "", categoriaNombre: it.categoriaNombre ?? "" })) })),
        });
      } catch {
        toast.error("No se pudo cargar la hoja técnica.");
        navigate("/cotizaciones-tecnicas");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate, toast]);

  const calc = useMemo(() => calcularCotizacionTecnica(form), [form]);
  const sim = (MONEDAS[form.moneda] ?? MONEDAS.BS).simbolo;

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e?.target ? e.target.value : e }));
  const setParam = (k) => (e) => setForm((f) => ({ ...f, parametros: { ...f.parametros, [k]: e.target.value } }));
  const setFin = (k) => (e) => setForm((f) => ({ ...f, finanzas: { ...f.finanzas, [k]: e.target.value } }));

  const setSeccion = (i, s) => setForm((f) => ({ ...f, secciones: f.secciones.map((x, k) => (k === i ? s : x)) }));
  const moverSeccion = (i, d) => setForm((f) => {
    const j = i + d;
    if (j < 0 || j >= f.secciones.length) return f;
    const s = [...f.secciones];
    [s[i], s[j]] = [s[j], s[i]];
    return { ...f, secciones: s };
  });
  const quitarSeccion = async (i) => {
    const s = form.secciones[i];
    if (s.items.length) {
      const ok = await confirm({ title: "Quitar sección", message: `La sección ${s.numeral} · ${s.nombre} tiene ${s.items.length} ítem(s). ¿Quitarla igual?`, confirmLabel: "Quitar", danger: true });
      if (!ok) return;
    }
    setForm((f) => ({ ...f, secciones: f.secciones.filter((_, k) => k !== i) }));
  };
  // Recarga secciones desde una respuesta del servidor (misma normalización que al abrir).
  const aplicarSecciones = (r) =>
    setForm((f) => ({
      ...f, versionActual: r.versionActual,
      secciones: (r.secciones ?? []).map((s) => ({ ...s, resumen: s.resumen ?? "", items: (s.items ?? []).map((it) => ({ ...ITEM_VACIO, ...it, nota: it.nota ?? "", codigo: it.codigo ?? "", sku: it.sku ?? "", unidad: it.unidad ?? "", categoriaNombre: it.categoriaNombre ?? "" })) })),
    }));

  // Guarda lo que hay y trae los productos de la comercial que falten en la hoja.
  const traerProductos = () => guardar(async (g) => {
    setSincronizando(true);
    try {
      const r = await traerProductosComercialAction(g.cotizacionTecnicaId);
      if (!r.agregados) toast.success("La hoja ya tiene todos los productos de la comercial.");
      else toast.success(`${r.agregados} producto(s) de la comercial agregados y clasificados.`);
      aplicarSecciones(r);
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudieron traer los productos.");
    } finally { setSincronizando(false); }
  });

  // Guarda lo que hay y pide al servidor que agregue las categorías raíz nuevas.
  const sincronizarSecciones = () => guardar(async (g) => {
    setSincronizando(true);
    try {
      const r = await sincronizarSeccionesAction(g.cotizacionTecnicaId);
      if (!r.agregadas?.length) { toast.info ? toast.info("La hoja ya tiene todas las categorías del sistema.") : toast.success("La hoja ya tiene todas las categorías del sistema."); }
      else toast.success(`Secciones agregadas: ${r.agregadas.join(", ")}.`);
      aplicarSecciones(r);
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudieron sincronizar las secciones.");
    } finally { setSincronizando(false); }
  });

  const agregarSeccion = () =>
    setForm((f) => ({ ...f, secciones: [...f.secciones, { numeral: ROMANOS[f.secciones.length] ?? String(f.secciones.length + 1), nombre: "", resumen: "", items: [] }] }));

  const armarDto = () => {
    const num = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));
    return {
      nroPropuesta: form.nroPropuesta.trim(),
      nombreCliente: form.nombreCliente.trim(),
      titulo: form.titulo?.trim() || undefined,
      fecha: form.fecha,
      realizadoPor: form.realizadoPor.trim(),
      notas: form.notas?.trim() || undefined,
      moneda: form.moneda,
      parametros: Object.fromEntries(Object.entries(form.parametros).map(([k, v]) => [k, num(v) ?? 0])),
      finanzas: Object.fromEntries(Object.entries(form.finanzas).map(([k, v]) => [k, num(v) ?? 0])),
      secciones: form.secciones.map((s) => ({
        numeral: s.numeral.trim() || "-",
        nombre: s.nombre.trim() || "Sección",
        categoriaId: s.categoriaId || undefined,
        resumen: s.resumen?.trim() || undefined,
        items: s.items
          .filter((it) => it.descripcion?.trim())
          .map((it) => ({
            productoId: it.productoId || undefined,
            categoriaId: it.categoriaId || undefined,
            categoriaNombre: it.categoriaNombre?.trim() || undefined,
            codigo: it.codigo?.trim() || undefined,
            sku: it.sku?.trim() || undefined,
            descripcion: it.descripcion.trim(),
            unidad: it.unidad?.trim() || undefined,
            cantidad: num(it.cantidad) ?? 0,
            precioUnitario: num(it.precioUnitario) ?? 0,
            factura: Boolean(it.factura),
            nota: it.nota?.trim() || undefined,
          })),
      })),
    };
  };

  const guardar = async (despues) => {
    if (!form.nroPropuesta.trim() || !form.nombreCliente.trim() || !form.fecha || !form.realizadoPor.trim()) {
      toast.error("Completá nro de propuesta, cliente, fecha y realizado por.");
      return null;
    }
    setSaving(true);
    try {
      const guardada = await updateCotizacionTecnicaAction(id, armarDto());
      setForm((f) => ({ ...f, versionActual: guardada.versionActual }));
      toast.success(`Guardada como versión ${guardada.versionActual}.`);
      if (despues) despues(guardada);
      return guardada;
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "Error al guardar."));
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); guardar(); };

  const exportarExcel = () => guardar(async (g) => {
    try { await descargarExcelTecnicaAction(g.cotizacionTecnicaId, `${g.nroPropuesta}_costos.xlsx`); }
    catch { toast.error("No se pudo descargar el Excel."); }
  });

  const generarComercial = () => guardar(async (g) => {
    setGenerando(true);
    try {
      const r = await generarComercialAction(g.cotizacionTecnicaId, modoGenerar);
      toast.success(`Precios enviados a la comercial ${r.nroPropuesta} (v${r.versionActual}) con ${r.items} ítems.`);
      setShowGenerar(false);
      navigate(`/cotizaciones-manuales/${r.cotizacionManualId}/imprimir`);
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "No se pudo generar la comercial."));
    } finally { setGenerando(false); }
  });

  if (loading) return <Layout><p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Cargando...</p></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <h1>
          Hoja técnica {form.nroPropuesta}
          {form.versionActual && (
            <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 700, color: "#0f2a4a", background: "#e0f2fe", padding: "3px 10px", borderRadius: 12, verticalAlign: "middle" }}>v{form.versionActual} vigente</span>
          )}
        </h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cotManual && (
            <button type="button" className="btn-secondary" onClick={() => navigate(`/cotizaciones-manuales/${cotManual.cotizacionManualId}/imprimir`)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaFileContract /> Ver comercial
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={() => navigate(`/cotizaciones-tecnicas/${id}/ver`)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaEye /> Ver / versiones
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/cotizaciones-tecnicas")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaTimes /> Cancelar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: 18 }}>
          <div style={{ minWidth: 0 }}>
            {/* ── Datos generales ── */}
            <SectionCard titulo="Datos de la propuesta" descripcion="Nro, cliente y fecha vienen de la cotización comercial (se editan allá). Acá se define quién arma los costos y en qué moneda.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Field label="Nro de propuesta"><input style={{ ...inputStyle, background: "#f3f4f6" }} value={form.nroPropuesta} readOnly /></Field>
                <Field label="Cliente" flex="2 1 240px"><input style={{ ...inputStyle, background: "#f3f4f6" }} value={form.nombreCliente} readOnly /></Field>
                <Field label="Título / sistema" flex="2 1 240px"><input style={inputStyle} placeholder="Sistema ON Grid 15 kW" value={form.titulo} onChange={set("titulo")} /></Field>
                <Field label="Fecha"><input style={{ ...inputStyle, background: "#f3f4f6" }} type="date" value={form.fecha} readOnly /></Field>
                <Field label="Realizado por *"><input style={inputStyle} value={form.realizadoPor} onChange={set("realizadoPor")} /></Field>
                <Field label="Moneda de la hoja" flex="0 1 160px">
                  <select style={inputStyle} value={form.moneda} onChange={set("moneda")}>
                    {CODIGOS_MONEDA.map((c) => <option key={c} value={c}>{MONEDAS[c].simbolo} · {MONEDAS[c].nombre}</option>)}
                  </select>
                </Field>
                <Field label="Notas internas" flex="1 1 100%"><input style={inputStyle} value={form.notas} onChange={set("notas")} placeholder="Opcional" /></Field>
              </div>
            </SectionCard>

            {/* ── CONSULTA ── */}
            <SectionCard titulo="Consulta — dimensionamiento" descripcion="Los mismos datos del bloque CONSULTA del Excel. Los derivados se calculan solos.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Field label="Cantidad de paneles" flex="1 1 140px"><input style={inputStyle} type="number" step="1" min="0" value={form.parametros.cantidadPaneles} onChange={setParam("cantidadPaneles")} /></Field>
                <Field label="Potencia por panel (W)" flex="1 1 140px"><input style={inputStyle} type="number" step="1" min="0" value={form.parametros.potenciaPanelW} onChange={setParam("potenciaPanelW")} /></Field>
                <Field label="Horas sol pico (hr/día)" flex="1 1 140px"><input style={inputStyle} type="number" step="0.1" min="0" value={form.parametros.horasSolPico} onChange={setParam("horasSolPico")} /></Field>
                <Field label="Ancho panel (m)" flex="1 1 120px"><input style={inputStyle} type="number" step="0.01" min="0" value={form.parametros.panelAnchoM} onChange={setParam("panelAnchoM")} /></Field>
                <Field label="Largo panel (m)" flex="1 1 120px"><input style={inputStyle} type="number" step="0.01" min="0" value={form.parametros.panelLargoM} onChange={setParam("panelLargoM")} /></Field>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                {[["Potencia instalada", calc.consulta.potenciaKw, "kWp"], ["Energía mensual estimada", calc.consulta.energiaMensualKwh, "kWh/mes"], ["Superficie requerida", calc.consulta.superficieM2, "m²"]].map(([l, v, u]) => (
                  <div key={l} style={{ flex: "1 1 160px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px" }}>
                    <span style={{ display: "block", fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>{l}</span>
                    <span style={{ fontWeight: 800, color: "#0f2a4a", fontSize: 16 }}>{fmt(v)} <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>{u}</span></span>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Finanzas ── */}
            <SectionCard titulo="Porcentajes financieros" descripcion="Se guardan con la cotización. Utilidad sobre costos; IVA sobre lo NO facturado más la utilidad; IT sobre el total con IVA.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Field label="Utilidad antes de impuestos (%)" flex="1 1 160px"><input style={inputStyle} type="number" step="0.01" min="0" value={form.finanzas.utilidadPct} onChange={setFin("utilidadPct")} /></Field>
                <Field label="IVA sobre no facturado (%)" flex="1 1 160px"><input style={inputStyle} type="number" step="0.01" min="0" value={form.finanzas.ivaPct} onChange={setFin("ivaPct")} /></Field>
                <Field label="IT (%)" flex="1 1 160px"><input style={inputStyle} type="number" step="0.01" min="0" value={form.finanzas.itPct} onChange={setFin("itPct")} /></Field>
              </div>
            </SectionCard>

            {/* ── Secciones ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "6px 0 10px", flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f2a4a" }}>Secciones y materiales</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {cotManual && (
                  <button type="button" className="btn-primary" onClick={traerProductos} disabled={saving || sincronizando} title="Agrega los productos de la comercial que todavía no estén en la hoja, clasificados por categoría. No toca lo ya cargado." style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <FaFileContract /> {sincronizando ? "Trayendo..." : "Traer productos de la comercial"}
                  </button>
                )}
                <button type="button" className="btn-secondary" onClick={sincronizarSecciones} disabled={saving || sincronizando} title="Trae como secciones nuevas las categorías creadas en el sistema después de esta hoja" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <FaSync /> {sincronizando ? "Sincronizando..." : "Traer categorías nuevas"}
                </button>
                <button type="button" className="btn-secondary" onClick={agregarSeccion} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}><FaPlus /> Sección manual</button>
              </div>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#6b7280", display: "flex", alignItems: "flex-start", gap: 6 }}>
              <FaLock style={{ marginTop: 2, flexShrink: 0 }} />
              <span>
                La hoja nace con los <strong>productos de la comercial</strong> ya clasificados en su sección; si la comercial suma productos, entran solos (lo ya cargado no se pisa).
                Las secciones salen de las <strong>categorías del sistema</strong> y los ítems se agrupan por <strong>subcategoría</strong>. Todo lo que entra acá es una
                <strong> copia congelada</strong>: editar un ítem no cambia el producto del catálogo, y si el catálogo o las categorías cambian después, esta hoja queda como estaba.
                Filas amarillas = ítems libres. "Fact." = el proveedor factura ese ítem (define facturado / no facturado).
              </span>
            </p>
            {form.secciones.map((s, i) => (
              <SeccionEditor
                key={i} seccion={s} idx={i} total={form.secciones.length}
                calcSeccion={calc.secciones[i]} sim={sim}
                onChange={(ns) => setSeccion(i, ns)}
                onMover={(d) => moverSeccion(i, d)}
                onQuitar={() => quitarSeccion(i)}
              />
            ))}
          </div>

          {/* ── Lateral: cierre + acciones (pegado al scroll) ── */}
          <div>
            <div style={{ position: "sticky", top: 16 }}>
            <PanelCierre calc={calc} sim={sim} finanzas={form.finanzas} />
            <div className="card" style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <button type="submit" className="btn-primary" disabled={saving} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {saving ? <FaSpinner className="spin" /> : <FaSave />} {saving ? "Guardando..." : "Guardar (nueva versión)"}
              </button>
              <button type="button" className="btn-secondary" disabled={saving} onClick={exportarExcel} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#15803d" }}>
                <FaFileExcel /> Guardar y descargar Excel
              </button>
              <button type="button" className="btn-secondary" disabled={saving} onClick={() => setShowGenerar(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1d4ed8" }}>
                <FaFileContract /> Enviar precios a la comercial
              </button>
              {cotManual ? (
                <p style={{ margin: 0, fontSize: 11, color: "#6b7280", textAlign: "center" }}>
                  Comercial <strong>{cotManual.nroPropuesta}</strong> (v{cotManual.versionActual}): recibe el cuadro de la Página 5 con los precios de venta y queda como versión nueva.
                </p>
              ) : (
                <p style={{ margin: 0, fontSize: 11, color: "#b45309", textAlign: "center" }}>Sin cotización comercial vinculada.</p>
              )}
              <p style={{ margin: 0, fontSize: 11, color: "#6b7280", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <FaHistory /> Al guardar se crea la versión {(Number(form.versionActual) || 1) + 1}.
              </p>
            </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal: generar comercial */}
      {showGenerar && (
        <div className="modal-backdrop" onClick={() => setShowGenerar(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>Enviar precios a la cotización comercial</h3>
              <button className="modal-close" onClick={() => setShowGenerar(false)}>×</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <p style={{ margin: 0, color: "#374151" }}>
                Se guarda esta hoja y la comercial <strong>{cotManual?.nroPropuesta}</strong> recibe (como versión nueva) el cuadro de productos con el
                <strong> total proyecto {sim} {fmt(calc.totalProyecto)}</strong> repartido según el precio de venta prorrateado de cada línea.
              </p>
              {[
                ["porSeccion", "Un ítem por sección", "Como las filas resumen del Excel: 'Tablero de Protecciones en AC' con sus materiales como viñetas debajo y el precio de la sección."],
                ["porItem", "Un ítem por cada línea", "Cada material/servicio como fila propia con su precio de venta unitario."],
              ].map(([v, t, d]) => (
                <label key={v} style={{ display: "flex", gap: 10, padding: 10, borderRadius: 8, border: modoGenerar === v ? "2px solid #16a34a" : "1px solid #e5e7eb", background: modoGenerar === v ? "#f0fdf4" : "#fff", cursor: "pointer" }}>
                  <input type="radio" name="modo" checked={modoGenerar === v} onChange={() => setModoGenerar(v)} style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                  <span><strong>{t}</strong><span style={{ display: "block", fontSize: 11, color: "#6b7280" }}>{d}</span></span>
                </label>
              ))}
              <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
                Después podés completar en la comercial las imágenes de la Página 4, el ROI y demás datos del impreso.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowGenerar(false)}>Cancelar</button>
              <button type="button" className="btn-primary" onClick={generarComercial} disabled={generando || saving || !cotManual}>
                {generando ? "Generando..." : "Continuar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CotizacionTecnicaForm;

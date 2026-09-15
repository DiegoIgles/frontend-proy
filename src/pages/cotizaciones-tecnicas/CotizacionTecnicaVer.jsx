import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  getCotizacionTecnicaAction, getVersionesTecnicaAction, getVersionTecnicaAction,
  restaurarVersionTecnicaAction, descargarExcelTecnicaAction,
} from "./actions/cotizaciones-tecnicas.actions";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { MONEDAS } from "../cotizaciones-manuales/shared/monedas";
import { colorSeccion, fmt, agruparPorSubcategoria } from "./calculo";
import { FaPrint, FaArrowLeft, FaHistory, FaChevronLeft, FaChevronRight, FaUndo, FaEdit, FaFileExcel } from "react-icons/fa";

const ORIGEN_LABEL = { creacion: "Creación", edicion: "Edición", restauracion: "Restauración" };
const fmtFechaHora = (d) => (d ? new Date(d).toLocaleString("es-BO", { dateStyle: "short", timeStyle: "short" }) : "");
const fmtFecha = (d) => (d ? new Date(String(d).slice(0, 10) + "T00:00:00").toLocaleDateString("es-BO") : "—");
const nombreUsuario = (u) => (u ? [u.name, u.lastName].filter(Boolean).join(" ") : "");

// ── Vista técnica (pantalla + impresión) ──────────────────────
//
// Documento interno para ingeniería: consulta, secciones con subtotales y el
// cierre financiero. Mismo navegador de versiones que la cotización comercial.

function CotizacionTecnicaVer() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const versionParam = Number(searchParams.get("version")) || null;

  const [cot, setCot] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurando, setRestaurando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [data, hist] = await Promise.all([
        versionParam ? getVersionTecnicaAction(id, versionParam) : getCotizacionTecnicaAction(id),
        getVersionesTecnicaAction(id).catch(() => null),
      ]);
      setCot(data); setHistorial(hist); setError(null);
    } catch (err) { setError(err); }
    finally { setLoading(false); }
  }, [id, versionParam]);

  useEffect(() => { cargar(); }, [cargar]);

  const irAVersion = (n) => {
    if (!n || (historial && n === historial.versionActual)) setSearchParams({});
    else setSearchParams({ version: String(n) });
  };

  const restaurar = async () => {
    if (!cot?.version || cot.version.esActual) return;
    const ok = await confirm({
      title: `Hacer vigente la versión ${cot.version.numero}`,
      message: `La hoja pasará a tener exactamente lo de la versión ${cot.version.numero}. Se registra como versión nueva; nada se pierde.`,
      confirmLabel: "Sí, restaurar",
    });
    if (!ok) return;
    setRestaurando(true);
    try {
      await restaurarVersionTecnicaAction(id, cot.version.numero);
      toast.success(`Versión ${cot.version.numero} restaurada como la vigente.`);
      setSearchParams({});
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "No se pudo restaurar."));
    } finally { setRestaurando(false); }
  };

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando cotización técnica...</p>;
  if (error) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar la cotización técnica.</p>;
  if (!cot) return null;

  const calc = cot.calculo;
  const c = calc.consulta;
  const f = calc.finanzas;
  const sim = (MONEDAS[cot.moneda] ?? MONEDAS.BS).simbolo;
  const versiones = historial?.versiones ?? [];
  const versionActual = historial?.versionActual ?? cot.versionActual ?? 1;
  const numeroVisto = cot.version?.numero ?? versionActual;
  const esHistorica = numeroVisto !== versionActual;
  const versionVista = cot.version ?? versiones.find((v) => v.numero === numeroVisto) ?? null;
  const idx = versiones.findIndex((v) => v.numero === numeroVisto);
  const masVieja = idx >= 0 && idx < versiones.length - 1 ? versiones[idx + 1] : null;
  const masNueva = idx > 0 ? versiones[idx - 1] : null;

  const cierre = [
    ["Total costos", calc.totalCostos, true],
    [`Utilidad antes de impuestos (${f.utilidadPct} %)`, calc.utilidad],
    ["Total antes de impuestos", calc.totalAntesImpuestos],
    ["Facturado", calc.facturado],
    ["No facturado (+ utilidad)", calc.noFacturado],
    [`IVA (${f.ivaPct} % sobre no facturado)`, calc.iva],
    ["Total + IVA", calc.totalConIva],
    [`IT (${f.itPct} %)`, calc.it],
    ["TOTAL PROYECTO", calc.totalProyecto, true],
  ];

  return (
    <>
      <div className="acciones no-print">
        <button onClick={() => window.print()} className="btn-print"><FaPrint style={{ marginRight: 6 }} /> Imprimir / PDF</button>
        <button onClick={() => descargarExcelTecnicaAction(id, `${cot.nroPropuesta}_costos.xlsx`).catch(() => toast.error("No se pudo descargar el Excel."))} className="btn-volver" title={esHistorica ? "El Excel siempre exporta la versión vigente" : ""}>
          <FaFileExcel style={{ marginRight: 6, color: "#15803d" }} /> Excel
        </button>
        {!esHistorica && (
          <button onClick={() => navigate(`/cotizaciones-tecnicas/${id}/editar`)} className="btn-volver"><FaEdit style={{ marginRight: 6 }} /> Editar</button>
        )}
        <Link to="/cotizaciones-tecnicas" className="btn-volver"><FaArrowLeft style={{ marginRight: 6 }} /> Volver</Link>

        {versiones.length > 0 && (
          <div className="versiones">
            <FaHistory style={{ color: "#0f2a4a" }} />
            <button className="btn-nav" onClick={() => irAVersion(masVieja?.numero)} disabled={!masVieja} title="Versión anterior"><FaChevronLeft /></button>
            <select value={numeroVisto} onChange={(e) => irAVersion(Number(e.target.value))}>
              {versiones.map((v) => (
                <option key={v.numero} value={v.numero}>
                  v{v.numero} · {ORIGEN_LABEL[v.origen] ?? v.origen}{v.restauradaDesde ? ` de v${v.restauradaDesde}` : ""} · {fmtFechaHora(v.creadoEn)}{v.esActual ? " · VIGENTE" : ""}
                </option>
              ))}
            </select>
            <button className="btn-nav" onClick={() => irAVersion(masNueva?.numero)} disabled={!masNueva} title="Versión siguiente"><FaChevronRight /></button>
            {esHistorica && (
              <button className="btn-restaurar" onClick={restaurar} disabled={restaurando}>
                <FaUndo style={{ marginRight: 6 }} /> {restaurando ? "Restaurando..." : "Hacer esta la vigente"}
              </button>
            )}
          </div>
        )}
      </div>

      {esHistorica && (
        <div className="aviso-version no-print">
          Estás viendo la <strong>versión {numeroVisto}</strong> ({ORIGEN_LABEL[versionVista?.origen] ?? ""}
          {versionVista?.usuario ? ` por ${nombreUsuario(versionVista.usuario)}` : ""}{versionVista?.creadoEn ? `, ${fmtFechaHora(versionVista.creadoEn)}` : ""}).
          La vigente es la <strong>versión {versionActual}</strong>.
        </div>
      )}

      <div className="doc">
        {/* Cabecera */}
        <div className="doc-head">
          <div>
            <p className="doc-kicker">Cotización técnica · hoja de costos</p>
            <h1 className="doc-title">{cot.nroPropuesta} <span>· {cot.nombreCliente}</span></h1>
            {cot.titulo && <p className="doc-sub">{cot.titulo}</p>}
          </div>
          <div className="doc-meta">
            <div><span>Fecha</span><strong>{fmtFecha(cot.fecha)}</strong></div>
            <div><span>Realizado por</span><strong>{cot.realizadoPor}</strong></div>
            <div><span>Moneda</span><strong>{sim}</strong></div>
            <div><span>Versión</span><strong>v{numeroVisto}{esHistorica ? " (histórica)" : ""}</strong></div>
          </div>
        </div>

        {/* Consulta */}
        <div className="kpis">
          {[
            ["Paneles", c.cantidadPaneles, "ud."], ["Potencia por panel", c.potenciaPanelW, "W"], ["Potencia instalada", c.potenciaKw, "kWp"],
            ["Horas sol pico", c.horasSolPico, "hr/día"], ["Energía mensual", c.energiaMensualKwh, "kWh/mes"], ["Superficie", c.superficieM2, "m²"],
          ].map(([l, v, u]) => (
            <div className="kpi" key={l}><span>{l}</span><strong>{fmt(v, Number.isInteger(Number(v)) ? 0 : 2)} <em>{u}</em></strong></div>
          ))}
        </div>

        {/* Secciones */}
        <table className="tabla">
          <thead>
            <tr>
              <th style={{ width: 36 }}></th>
              <th style={{ width: 110 }}>ESTR.</th>
              <th style={{ width: 70 }}>CÓD.</th>
              <th>Ítem</th>
              <th style={{ width: 50 }}>Ud.</th>
              <th style={{ width: 60, textAlign: "right" }}>Cant.</th>
              <th style={{ width: 90, textAlign: "right" }}>P/U</th>
              <th style={{ width: 100, textAlign: "right" }}>Subtotal</th>
              <th style={{ width: 50, textAlign: "center" }}>Fact.</th>
              <th style={{ width: 100, textAlign: "right" }}>P. Venta</th>
            </tr>
          </thead>
          <tbody>
            {calc.secciones.map((s, i) => {
              const color = colorSeccion(i);
              return (
                <React.Fragment key={i}>
                  {s.items.length === 0 && (
                    <tr style={{ background: `${color}33` }}>
                      <td className="num">{s.numeral}</td>
                      <td colSpan={9} style={{ color: "#9ca3af", fontStyle: "italic" }}>{s.nombre} — sin ítems</td>
                    </tr>
                  )}
                  {agruparPorSubcategoria(s.items, s.nombre).map((g) => (
                    <React.Fragment key={g.titulo ?? "__sin"}>
                      {g.titulo && (
                        <tr style={{ background: `${color}22` }}>
                          <td className="num">{g.items[0].indice === 0 ? s.numeral : ""}</td>
                          <td colSpan={9} className="subcat">{g.titulo}</td>
                        </tr>
                      )}
                      {g.items.map(({ item: it, indice: k }) => (
                    <tr key={k} style={{ background: `${color}33` }}>
                      <td className="num">{k === 0 && !g.titulo ? s.numeral : ""}</td>
                      <td className="mono">{it.codigo ?? ""}</td>
                      <td className="mono">{it.sku ?? ""}</td>
                      <td>{it.descripcion}{it.nota ? <span className="nota"> · {it.nota}</span> : null}</td>
                      <td>{it.unidad ?? ""}</td>
                      <td className="r">{fmt(it.cantidad, Number.isInteger(Number(it.cantidad)) ? 0 : 2)}</td>
                      <td className="r">{fmt(it.precioUnitario)}</td>
                      <td className="r b">{fmt(it.subtotal)}</td>
                      <td className="c">{it.factura ? "Sí" : "No"}</td>
                      <td className="r venta">{fmt(it.precioVenta)}</td>
                    </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  <tr className="sub" style={{ background: `${color}88` }}>
                    <td></td>
                    <td colSpan={6}>{s.nombre.toUpperCase()}{s.resumen && s.resumen !== s.nombre ? <span className="nota"> · {s.resumen}</span> : null}</td>
                    <td className="r b">{sim} {fmt(s.subtotal)}</td>
                    <td></td>
                    <td className="r venta b">{sim} {fmt(s.precioVenta)}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* Cierre */}
        <div className="cierre-wrap">
          {cot.notas && <div className="notas"><strong>Notas:</strong> {cot.notas}</div>}
          <table className="cierre">
            <tbody>
              {cierre.map(([l, v, fuerte]) => (
                <tr key={l} className={fuerte ? "fuerte" : ""}><td>{l}</td><td className="r">{sim} {fmt(v)}</td></tr>
              ))}
              <tr><td>Margen sobre venta</td><td className="r">{fmt(calc.margen * 100, 1)} %</td></tr>
              <tr><td>Factor de venta (P. Venta = subtotal × factor)</td><td className="r">× {fmt(calc.factorVenta, 4)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #e5e7eb; font-family: 'Segoe UI', Arial, sans-serif; }
        .acciones { display: flex; gap: 10px; padding: 14px 24px; flex-wrap: wrap; align-items: center; background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10; }
        .btn-print { display: flex; align-items: center; padding: 8px 20px; background: #0f2a4a; color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-volver { display: flex; align-items: center; padding: 8px 16px; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; text-decoration: none; font-weight: 500; cursor: pointer; }
        .versiones { display: flex; align-items: center; gap: 6px; margin-left: auto; font-size: 13px; }
        .versiones select { padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; background: #fff; max-width: 360px; }
        .btn-nav { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #374151; cursor: pointer; }
        .btn-nav:disabled { opacity: 0.4; cursor: default; }
        .btn-restaurar { display: flex; align-items: center; padding: 7px 14px; background: #f59e0b; color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .aviso-version { background: #fef3c7; color: #92400e; border-bottom: 1px solid #fcd34d; padding: 10px 24px; font-size: 13px; }

        .doc { width: 279.4mm; min-height: 215.9mm; margin: 24px auto; background: #fff; padding: 14mm 12mm; box-shadow: 0 2px 16px rgba(0,0,0,0.18); color: #1f2937; font-size: 11px; }
        .doc-head { display: flex; justify-content: space-between; gap: 20px; border-bottom: 3px solid #0f2a4a; padding-bottom: 10px; margin-bottom: 12px; }
        .doc-kicker { margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #16a34a; font-weight: 700; }
        .doc-title { margin: 2px 0 0; font-size: 22px; color: #0f2a4a; font-weight: 800; }
        .doc-title span { font-weight: 500; color: #374151; }
        .doc-sub { margin: 2px 0 0; font-size: 12px; color: #6b7280; }
        .doc-meta { display: grid; grid-template-columns: repeat(2, auto); gap: 4px 18px; font-size: 11px; align-content: start; }
        .doc-meta span { display: block; font-size: 9px; text-transform: uppercase; color: #6b7280; }
        .kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 12px; }
        .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; }
        .kpi span { display: block; font-size: 9px; text-transform: uppercase; color: #6b7280; }
        .kpi strong { font-size: 14px; color: #0f2a4a; }
        .kpi em { font-style: normal; font-size: 10px; color: #6b7280; font-weight: 600; }
        .tabla { width: 100%; border-collapse: collapse; }
        .tabla th { background: #0f2a4a; color: #fff; padding: 5px 6px; font-size: 10px; text-align: left; }
        .tabla td { padding: 3px 6px; border-bottom: 1px solid #fff; vertical-align: top; }
        .tabla .num { font-weight: 800; text-align: center; color: #0f2a4a; }
        .tabla .mono { font-family: Consolas, monospace; font-size: 10px; }
        .tabla .r { text-align: right; font-variant-numeric: tabular-nums; }
        .tabla .c { text-align: center; }
        .tabla .b { font-weight: 700; color: #0f2a4a; }
        .tabla .venta { color: #15803d; }
        .tabla .nota { color: #6b7280; font-style: italic; }
        .tabla .subcat { font-style: italic; font-weight: 700; color: #374151; font-size: 10px; }
        .tabla .sub td { font-weight: 800; border-top: 1.5px solid #0f2a4a; border-bottom: 1.5px solid #0f2a4a; }
        .cierre-wrap { display: flex; justify-content: space-between; gap: 20px; margin-top: 14px; align-items: flex-start; page-break-inside: avoid; }
        .notas { flex: 1; font-size: 11px; color: #374151; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; }
        .cierre { border-collapse: collapse; min-width: 320px; margin-left: auto; }
        .cierre td { padding: 4px 8px; border-bottom: 1px solid #e5e7eb; }
        .cierre .r { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .cierre .fuerte td { font-weight: 800; color: #0f2a4a; font-size: 12px; }
        .cierre .fuerte:last-of-type td, .cierre tr.fuerte:nth-last-child(3) td { background: #0f2a4a; color: #fff; font-size: 13px; }

        @page { size: letter landscape; margin: 0; }
        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .doc { margin: 0; box-shadow: none; width: 279.4mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  );
}

export default CotizacionTecnicaVer;

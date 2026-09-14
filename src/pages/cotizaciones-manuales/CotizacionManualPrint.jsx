import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { getCotizacionManualAction } from "./actions/get-cotizacion.action";
import {
  getVersionesCotizacionAction, getVersionCotizacionAction, restaurarVersionCotizacionAction,
} from "./actions/get-versiones-cotizacion.action";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { FaPrint, FaArrowLeft, FaHistory, FaChevronLeft, FaChevronRight, FaUndo, FaEdit } from "react-icons/fa";
import { Pagina1Portada } from "./diseños_print/Pagina1Portada";
import { Pagina2QuienesSomos } from "./diseños_print/Pagina2QuienesSomos";
import { Pagina3Experiencia } from "./diseños_print/Pagina3Experiencia";
import { Pagina4Diseno } from "./diseños_print/Pagina4Diseno";
import { Pagina5Cotizacion } from "./diseños_print/Pagina5Cotizacion";
import { Pagina6Roi } from "./diseños_print/Pagina6Roi";
import { Pagina7Proteccion } from "./diseños_print/Pagina7Proteccion";
import { Pagina8Garantias } from "./diseños_print/Pagina8Garantias";
import { Pagina9Alcance } from "./diseños_print/Pagina9Alcance";
import { Pagina10Cierre } from "./diseños_print/Pagina10Cierre";

const ORIGEN_LABEL = { creacion: "Creación", edicion: "Edición", restauracion: "Restauración" };

function fmtFechaHora(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("es-BO", { dateStyle: "short", timeStyle: "short" });
}

function nombreUsuario(u) {
  if (!u) return "";
  return [u.name, u.lastName].filter(Boolean).join(" ");
}

// ── Documento imprimible (10 Páginas) ─────────────────────────
//
// Cada cotización guarda una copia completa (snapshot) por cada vez que se crea,
// edita o restaura. Sin `?version=N` se imprime la vigente; con él, esa versión
// histórica tal cual quedó, sin consultar catálogo ni precios actuales.

function CotizacionManualPrint() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const versionParam = Number(searchParams.get("version")) || null;

  const [cot, setCot] = useState(null);
  const [historial, setHistorial] = useState(null); // { versionActual, versiones }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurando, setRestaurando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [data, hist] = await Promise.all([
        versionParam ? getVersionCotizacionAction(id, versionParam) : getCotizacionManualAction(id),
        getVersionesCotizacionAction(id).catch(() => null),
      ]);
      setCot(data);
      setHistorial(hist);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id, versionParam]);

  useEffect(() => { cargar(); }, [cargar]);

  const irAVersion = (numero) => {
    if (!numero || (historial && numero === historial.versionActual)) {
      setSearchParams({});
    } else {
      setSearchParams({ version: String(numero) });
    }
  };

  const restaurar = async () => {
    if (!cot?.version || cot.version.esActual) return;
    const ok = await confirm({
      title: `Hacer vigente la versión ${cot.version.numero}`,
      message: `La cotización pasará a mostrar exactamente lo que tenía la versión ${cot.version.numero}. Se registrará como una versión nueva (v${(historial?.versionActual ?? 0) + 1}); las anteriores no se pierden.`,
      confirmLabel: "Sí, restaurar",
    });
    if (!ok) return;
    setRestaurando(true);
    try {
      await restaurarVersionCotizacionAction(id, cot.version.numero);
      toast.success(`Versión ${cot.version.numero} restaurada como la vigente.`);
      setSearchParams({});
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "No se pudo restaurar la versión."));
    } finally {
      setRestaurando(false);
    }
  };

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando cotización...</p>;
  if (error) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar la cotización.</p>;
  if (!cot) return null;

  const versiones = historial?.versiones ?? [];
  const versionActual = historial?.versionActual ?? cot.versionActual ?? 1;
  const numeroVisto = cot.version?.numero ?? versionActual;
  const esHistorica = numeroVisto !== versionActual;
  const versionVista = cot.version ?? versiones.find((v) => v.numero === numeroVisto) ?? null;
  const idx = versiones.findIndex((v) => v.numero === numeroVisto);
  // La lista viene de la más nueva a la más vieja.
  const masVieja = idx >= 0 && idx < versiones.length - 1 ? versiones[idx + 1] : null;
  const masNueva = idx > 0 ? versiones[idx - 1] : null;

  return (
    <>
      {/* Barra de acciones — solo pantalla */}
      <div className="acciones no-print">
        <button onClick={() => window.print()} className="btn-print">
          <FaPrint style={{ marginRight: 6 }} /> Imprimir / Guardar PDF
        </button>
        {!esHistorica && (
          <button onClick={() => navigate(`/cotizaciones-manuales/${id}/editar`)} className="btn-volver">
            <FaEdit style={{ marginRight: 6 }} /> Editar
          </button>
        )}
        <Link to="/cotizaciones-manuales" className="btn-volver">
          <FaArrowLeft style={{ marginRight: 6 }} /> Volver
        </Link>

        {/* ── Navegador de versiones ── */}
        {versiones.length > 0 && (
          <div className="versiones">
            <FaHistory style={{ color: "#0f2a4a" }} />
            <button className="btn-nav" onClick={() => irAVersion(masVieja?.numero)} disabled={!masVieja} title="Versión anterior">
              <FaChevronLeft />
            </button>
            <select value={numeroVisto} onChange={(e) => irAVersion(Number(e.target.value))}>
              {versiones.map((v) => (
                <option key={v.numero} value={v.numero}>
                  v{v.numero} · {ORIGEN_LABEL[v.origen] ?? v.origen}
                  {v.restauradaDesde ? ` de v${v.restauradaDesde}` : ""} · {fmtFechaHora(v.creadoEn)}
                  {v.esActual ? " · VIGENTE" : ""}
                </option>
              ))}
            </select>
            <button className="btn-nav" onClick={() => irAVersion(masNueva?.numero)} disabled={!masNueva} title="Versión siguiente">
              <FaChevronRight />
            </button>
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
          {versionVista?.usuario ? ` por ${nombreUsuario(versionVista.usuario)}` : ""}
          {versionVista?.creadoEn ? `, ${fmtFechaHora(versionVista.creadoEn)}` : ""}). La vigente es la
          <strong> versión {versionActual}</strong>. Esta copia es fija: no cambia aunque cambien productos o precios del catálogo.
        </div>
      )}

      <div className="documento">

        {/* ═══════════ PÁGINA 1: PORTADA (CLONADA DINÁMICA) ═══════════ */}
        <Pagina1Portada cot={cot} />

        {/* ═══════════ PÁGINA 2: ¿QUIÉNES SOMOS? (CLONADA) ═══════════ */}
        <Pagina2QuienesSomos />

        {/* ═══════════ PÁGINA 3: LA CONFIANZA DE NUESTRA EXPERIENCIA (CLONADA) ═══════════ */}
        <Pagina3Experiencia />

        {/* ═══════════ PÁGINA 4: DISEÑO DEL SISTEMA (DINÁMICA - NUEVA PORTADA 4) ═══════════ */}
        <Pagina4Diseno cot={cot} />

        {/* ═══════════ PÁGINA 5: COTIZACIÓN Y TOTALES (DINÁMICA) ═══════════ */}
        <Pagina5Cotizacion cot={cot} />

        {/* ═══════════ PÁGINA 6: RETORNO DE INVERSIÓN (DINÁMICA) ═══════════ */}
        <Pagina6Roi cot={cot} />

        {/* ═══════════ PÁGINA 7: ALCANCE Y PROTECCIÓN DE INVERSIÓN (DINÁMICA) ═══════════ */}
        <Pagina7Proteccion cot={cot} />

        {/* ═══════════ PÁGINA 8: GARANTÍAS (CLONADA) ═══════════ */}
        <Pagina8Garantias />

        {/* ═══════════ PÁGINA 9: ALCANCE DEL PROYECTO (CLONADA) ═══════════ */}
        <Pagina9Alcance />

        {/* ═══════════ PÁGINA 10: CIERRE (CLONADA) ═══════════ */}
        <Pagina10Cierre />

      </div>

      {/* ── Estilos de impresión ── */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #e5e7eb; font-family: 'Segoe UI', Arial, sans-serif; }

        .acciones {
          display: flex; gap: 10px; padding: 14px 24px; flex-wrap: wrap; align-items: center;
          background: #fff; border-bottom: 1px solid #e5e7eb;
          position: sticky; top: 0; z-index: 10;
        }
        .btn-print {
          display: flex; align-items: center;
          padding: 8px 20px; background: #0f2a4a; color: #fff;
          border: none; border-radius: 6px; font-size: 14px;
          font-weight: 600; cursor: pointer;
        }
        .btn-volver {
          display: flex; align-items: center;
          padding: 8px 20px; background: #f3f4f6; color: #374151;
          border: 1px solid #d1d5db; border-radius: 6px;
          font-size: 14px; text-decoration: none; font-weight: 500; cursor: pointer;
        }

        .versiones {
          display: flex; align-items: center; gap: 6px; margin-left: auto;
          font-size: 13px;
        }
        .versiones select {
          padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px;
          font-size: 13px; background: #fff; max-width: 360px;
        }
        .btn-nav {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border: 1px solid #d1d5db; border-radius: 6px;
          background: #fff; color: #374151; cursor: pointer;
        }
        .btn-nav:disabled { opacity: 0.4; cursor: default; }
        .btn-restaurar {
          display: flex; align-items: center;
          padding: 7px 14px; background: #f59e0b; color: #fff;
          border: none; border-radius: 6px; font-size: 13px;
          font-weight: 700; cursor: pointer;
        }
        .btn-restaurar:disabled { opacity: 0.6; cursor: default; }
        .aviso-version {
          background: #fef3c7; color: #92400e; border-bottom: 1px solid #fcd34d;
          padding: 10px 24px; font-size: 13px;
        }

        .documento { padding: 24px 0; }

        .pagina {
          position: relative;
          width: 279.4mm;
          height: 215.9mm;
          margin: 0 auto 24px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
          page-break-after: always;
          break-after: page;
        }
        .pagina-estatica {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }
        .pagina-estatica img {
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .pagina:last-child { page-break-after: auto; break-after: auto; margin-bottom: 0; }

        @page { size: letter landscape; margin: 0; }

        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .documento { padding: 0; }
          .pagina {
            margin: 0;
            box-shadow: none;
            width: 279.4mm;
            height: 215.9mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}

export default CotizacionManualPrint;

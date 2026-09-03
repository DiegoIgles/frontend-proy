import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCotizacionManualAction } from "./actions/get-cotizacion.action";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
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

// ── Documento imprimible (10 Páginas) ─────────────────────────

function CotizacionManualPrint() {
  const { id } = useParams();
  const [cot, setCot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCotizacionManualAction(id)
      .then((data) => { setCot(data); setLoading(false); })
      .catch((err) => { setError(err); setLoading(false); });
  }, [id]);

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando cotización...</p>;
  if (error) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar la cotización.</p>;
  if (!cot) return null;

  return (
    <>
      {/* Barra de acciones — solo pantalla */}
      <div className="acciones no-print">
        <button onClick={() => window.print()} className="btn-print">
          <FaPrint style={{ marginRight: 6 }} /> Imprimir / Guardar PDF
        </button>
        <Link to="/cotizaciones-manuales" className="btn-volver">
          <FaArrowLeft style={{ marginRight: 6 }} /> Volver
        </Link>
      </div>

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
          display: flex; gap: 10px; padding: 14px 24px;
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
          font-size: 14px; text-decoration: none; font-weight: 500;
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

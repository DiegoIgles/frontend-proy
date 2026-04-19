import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProyectoAction } from "./actions/get-proyecto.action";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

function fmt(n) {
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-BO", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function CotizacionProyecto() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    getProyectoAction(id)
      .then((data) => { setProyecto(data); setLoading(false); })
      .catch((err)  => { setError(err);    setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (proyecto) {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [proyecto]);

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando cotización...</p>;
  if (error)   return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar la cotización.</p>;
  if (!proyecto) return null;

  const items      = proyecto.proyectoProductoAlmacenes ?? [];
  const totalItems = items.reduce((s, i) => s + Number(i.subtotal ?? 0), 0);
  const manoObra   = Number(proyecto.manoObra  ?? 0);
  const costoExtra = Number(proyecto.costoExtra ?? 0);
  const montoFinal = Number(proyecto.montoFinal ?? 0);

  const docNum = proyecto.proyectoId.slice(0, 8).toUpperCase();
  const hoy    = new Date().toLocaleDateString("es-BO", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      {/* Barra de acciones — solo en pantalla */}
      <div className="cot-acciones">
        <button onClick={() => window.print()} className="cot-btn-print">
          <FaPrint style={{ marginRight: 6 }} /> Imprimir / Guardar PDF
        </button>
        <Link to={`/proyectos/${id}`} className="cot-btn-volver">
          <FaArrowLeft style={{ marginRight: 6 }} /> Volver al proyecto
        </Link>
      </div>

      {/* Documento */}
      <div className="cot-wrapper">

        {/* ── Encabezado ── */}
        <div className="cot-header">
          <div className="cot-header-empresa">
            <h1 className="cot-logo">Mi ERP</h1>
            <p className="cot-logo-sub">Sistema de Gestión Empresarial</p>
          </div>
          <div className="cot-header-meta">
            <div className="cot-badge-cotizacion">COTIZACIÓN</div>
            <table className="cot-meta-table">
              <tbody>
                <tr><td>N°</td><td><strong>{docNum}</strong></td></tr>
                <tr><td>Fecha</td><td><strong>{hoy}</strong></td></tr>
                <tr>
                  <td>Estado</td>
                  <td>
                    <span className={`cot-estado cot-estado-${proyecto.estado.toLowerCase()}`}>
                      {proyecto.estado === "COTIZACION" ? "Cotización" : "Proyecto Aprobado"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="cot-divider" />

        {/* ── Datos del proyecto y responsable ── */}
        <div className="cot-partes">
          <div>
            <p className="cot-label">PROYECTO</p>
            <p className="cot-valor-grande">{proyecto.nombre}</p>
            {proyecto.descripcion && (
              <p className="cot-sub">{proyecto.descripcion}</p>
            )}
          </div>
          <div>
            <p className="cot-label">RESPONSABLE</p>
            <p className="cot-valor-grande">{proyecto.usuario.name} {proyecto.usuario.lastName}</p>
            <p className="cot-sub">{proyecto.usuario.email}</p>
          </div>
        </div>

        {/* Fechas */}
        <div className="cot-fechas">
          <div className="cot-fecha-item">
            <span className="cot-label">FECHA DE INICIO</span>
            <span className="cot-fecha-val">{fmtDate(proyecto.fechaInicio)}</span>
          </div>
          <div className="cot-fecha-sep">→</div>
          <div className="cot-fecha-item">
            <span className="cot-label">FECHA ESTIMADA DE FINALIZACIÓN</span>
            <span className="cot-fecha-val">{fmtDate(proyecto.fechaFinal)}</span>
          </div>
        </div>

        <div className="cot-divider" />

        {/* ── Detalle de materiales ── */}
        <p className="cot-seccion-titulo">DETALLE DE MATERIALES Y EQUIPOS</p>

        {items.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 13, margin: "12px 0" }}>
            Sin productos asignados a esta cotización.
          </p>
        ) : (
          <table className="cot-tabla">
            <thead>
              <tr>
                <th style={{ width: "8%" }}>Código</th>
                <th>Descripción</th>
                <th style={{ width: "14%" }}>Almacén</th>
                <th style={{ width: "8%", textAlign: "center" }}>Cant.</th>
                <th style={{ width: "14%", textAlign: "right" }}>P. Unitario</th>
                <th style={{ width: "14%", textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const prod    = item.productoAlmacen.producto;
                const almacen = item.productoAlmacen.almacen;
                const precio  = Number(item.precioUnitario ?? 0);
                const sub     = Number(item.subtotal ?? 0);
                return (
                  <tr key={item.proyectoProductoAlmacenId}>
                    <td style={{ fontFamily: "monospace", fontSize: 11 }}>{prod.codigo}</td>
                    <td>
                      <strong>{prod.nombre}</strong>
                      {prod.descripcion && <br />}
                      {prod.descripcion && <span style={{ fontSize: 11, color: "#6b7280" }}>{prod.descripcion}</span>}
                    </td>
                    <td>{almacen.nombre}</td>
                    <td style={{ textAlign: "center", fontWeight: 700 }}>{item.cantidad}</td>
                    <td style={{ textAlign: "right" }}>
                      {precio > 0 ? `Bs. ${fmt(precio)}` : "—"}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      {sub > 0 ? `Bs. ${fmt(sub)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {totalItems > 0 && (
              <tfoot>
                <tr className="cot-subtotal-row">
                  <td colSpan={5} style={{ textAlign: "right" }}>Subtotal materiales</td>
                  <td style={{ textAlign: "right" }}>Bs. {fmt(totalItems)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}

        <div className="cot-divider" />

        {/* ── Resumen de costos ── */}
        <div className="cot-resumen">
          <div className="cot-resumen-izq">
            <p className="cot-seccion-titulo">CONDICIONES</p>
            <p className="cot-condicion">• Cotización válida por 30 días a partir de la fecha de emisión.</p>
            <p className="cot-condicion">• Los precios están expresados en Bolivianos (Bs.).</p>
            <p className="cot-condicion">• Los plazos de entrega están sujetos a disponibilidad de stock.</p>
            <p className="cot-condicion">• El presente documento no constituye factura.</p>
          </div>

          <div className="cot-resumen-der">
            {totalItems > 0 && (
              <div className="cot-linea-resumen">
                <span>Materiales y Equipos</span>
                <span>Bs. {fmt(totalItems)}</span>
              </div>
            )}
            {manoObra > 0 && (
              <div className="cot-linea-resumen">
                <span>Mano de Obra</span>
                <span>Bs. {fmt(manoObra)}</span>
              </div>
            )}
            {costoExtra > 0 && (
              <div className="cot-linea-resumen">
                <span>Costos Adicionales</span>
                <span>Bs. {fmt(costoExtra)}</span>
              </div>
            )}
            <div className="cot-divider" style={{ margin: "8px 0" }} />
            <div className="cot-linea-total">
              <span>TOTAL COTIZACIÓN</span>
              <span>Bs. {fmt(montoFinal > 0 ? montoFinal : totalItems + manoObra + costoExtra)}</span>
            </div>
          </div>
        </div>

        <div className="cot-divider" />

        {/* ── Firmas ── */}
        <div className="cot-firmas">
          <div className="cot-firma">
            <div className="cot-firma-linea" />
            <p><strong>{proyecto.usuario.name} {proyecto.usuario.lastName}</strong></p>
            <p>Responsable del Proyecto</p>
          </div>
          <div className="cot-firma">
            <div className="cot-firma-linea" />
            <p><strong>Cliente</strong></p>
            <p>Firma y Sello de Conformidad</p>
          </div>
        </div>

        <p className="cot-footer">
          Documento generado el {hoy} — Mi ERP · Sistema de Gestión Empresarial
        </p>
      </div>

      {/* ── Estilos ── */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; }

        /* Barra acciones */
        .cot-acciones {
          display: flex; gap: 10px; padding: 14px 24px;
          background: #fff; border-bottom: 1px solid #e5e7eb;
          align-items: center;
        }
        .cot-btn-print {
          display: flex; align-items: center;
          padding: 8px 20px; background: #1d4ed8; color: #fff;
          border: none; border-radius: 6px; font-size: 14px;
          font-weight: 600; cursor: pointer;
        }
        .cot-btn-volver {
          display: flex; align-items: center;
          padding: 8px 20px; background: #f3f4f6; color: #374151;
          border: 1px solid #d1d5db; border-radius: 6px;
          font-size: 14px; text-decoration: none; font-weight: 500;
        }

        /* Wrapper A4 */
        .cot-wrapper {
          width: 210mm;
          min-height: 297mm;
          margin: 24px auto;
          background: #fff;
          padding: 36px 44px;
          font-size: 13px;
          color: #111827;
          box-shadow: 0 2px 16px rgba(0,0,0,0.12);
        }

        /* Header */
        .cot-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .cot-logo { margin: 0; font-size: 28px; font-weight: 800; color: #1d4ed8; letter-spacing: -0.5px; }
        .cot-logo-sub { margin: 2px 0 0; font-size: 11px; color: #6b7280; }
        .cot-header-meta { text-align: right; }
        .cot-badge-cotizacion {
          display: inline-block; padding: 6px 18px;
          background: #1d4ed8; color: #fff;
          font-size: 16px; font-weight: 800; letter-spacing: 2px;
          border-radius: 4px; margin-bottom: 10px;
        }
        .cot-meta-table { font-size: 12px; border-collapse: collapse; margin-left: auto; }
        .cot-meta-table td { padding: 2px 6px; color: #374151; }
        .cot-meta-table td:first-child { color: #6b7280; text-align: right; padding-right: 8px; }
        .cot-estado { padding: 2px 10px; border-radius: 10px; font-weight: 700; font-size: 11px; }
        .cot-estado-cotizacion { background: #fef3c7; color: #92400e; }
        .cot-estado-proyecto   { background: #d1fae5; color: #065f46; }

        /* Divider */
        .cot-divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }

        /* Partes */
        .cot-partes { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 14px; }
        .cot-label { margin: 0 0 4px; font-size: 10px; font-weight: 700; color: #6b7280;
          letter-spacing: 0.8px; text-transform: uppercase; }
        .cot-valor-grande { margin: 0 0 3px; font-size: 15px; font-weight: 700; }
        .cot-sub { margin: 2px 0; font-size: 12px; color: #6b7280; }

        /* Fechas */
        .cot-fechas {
          display: flex; align-items: center; gap: 16px;
          background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 8px; padding: 12px 16px;
        }
        .cot-fecha-item { display: flex; flex-direction: column; gap: 3px; }
        .cot-fecha-val { font-size: 14px; font-weight: 700; }
        .cot-fecha-sep { font-size: 20px; color: #9ca3af; flex-shrink: 0; }

        /* Sección título */
        .cot-seccion-titulo {
          font-size: 11px; font-weight: 700; color: #6b7280;
          letter-spacing: 0.8px; text-transform: uppercase; margin: 0 0 10px;
        }

        /* Tabla */
        .cot-tabla { width: 100%; border-collapse: collapse; font-size: 12px; }
        .cot-tabla th {
          background: #1d4ed8; color: #fff;
          padding: 8px 10px; text-align: left;
          font-size: 11px; font-weight: 600;
        }
        .cot-tabla td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
        .cot-tabla tbody tr:nth-child(even) td { background: #f9fafb; }
        .cot-subtotal-row td {
          font-weight: 700; font-size: 13px; padding-top: 10px;
          border-top: 2px solid #e5e7eb; border-bottom: none;
          background: #f9fafb !important;
        }

        /* Resumen */
        .cot-resumen { display: grid; grid-template-columns: 1fr 280px; gap: 28px; align-items: start; }
        .cot-condicion { margin: 4px 0; font-size: 12px; color: #6b7280; }
        .cot-resumen-der {
          border: 2px solid #e5e7eb; border-radius: 8px;
          padding: 14px 18px;
        }
        .cot-linea-resumen {
          display: flex; justify-content: space-between;
          font-size: 13px; padding: 4px 0;
          color: #374151;
        }
        .cot-linea-total {
          display: flex; justify-content: space-between;
          font-size: 16px; font-weight: 800;
          color: #1d4ed8; padding: 6px 0 0;
        }

        /* Firmas */
        .cot-firmas { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 44px; }
        .cot-firma { text-align: center; font-size: 12px; color: #374151; }
        .cot-firma-linea { border-top: 1px solid #374151; margin-bottom: 8px; }
        .cot-firma p { margin: 2px 0; }

        /* Footer */
        .cot-footer {
          text-align: center; font-size: 11px; color: #9ca3af; margin-top: 28px;
          border-top: 1px dashed #e5e7eb; padding-top: 12px;
        }

        /* Print */
        @media print {
          body { background: #fff; }
          .cot-acciones { display: none !important; }
          .cot-wrapper { margin: 0; padding: 20px 28px; box-shadow: none; width: 100%; min-height: unset; }
          .cot-tabla th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cot-tabla tbody tr:nth-child(even) td { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cot-badge-cotizacion { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  );
}

export default CotizacionProyecto;

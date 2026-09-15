import React from "react";
import { useParams, Link } from "react-router-dom";
import { useNotaCompra } from "./hooks/useNotaCompra";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { Logo } from "../cotizaciones-manuales/diseños_print/shared/Logo";
import { EMPRESA, ORDEN_COMPRA_DEFAULTS } from "../../shared/empresa";

// ── Orden de compra ("PURCHASE ORDER") ─────────────────────────
//
// Reproduce el arte del formulario administrativo FA-005: cuadro de cabecera
// con el logo y los datos de la empresa, N° de orden correlativo, bloque del
// proveedor, tabla Item/Descripción/Cant./Unid./P. Unit./P. Total, términos y
// firma del gerente. Carta vertical.

const fmt = (n) => Number(n ?? 0).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtFecha = (d) => {
  if (!d) return "—";
  const f = new Date(String(d).slice(0, 10) + "T00:00:00");
  return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
};
const anioDe = (d) => new Date(String(d).slice(0, 10) + "T00:00:00").getFullYear();

function OrdenCompra() {
  const { id } = useParams();
  const { nota, loading, error } = useNotaCompra(id);

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando orden de compra...</p>;
  if (error) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar la orden de compra.</p>;
  if (!nota) return null;

  const prov = nota.proveedor ?? {};
  const nroOrden = nota.nroOrden ? `${nota.nroOrden}-${anioDe(nota.fecha)}` : nota.notaCompraId.slice(0, 8).toUpperCase();
  const total = (nota.detallesCompra ?? []).reduce((acc, d) => acc + d.cantidad * parseFloat(d.precioCompra), 0);
  const firmante = { nombre: nota.firmanteNombre || EMPRESA.firmante.nombre, cargo: nota.firmanteCargo || EMPRESA.firmante.cargo };
  const terminos = [
    ["Shiping Terms", nota.terminosEnvio || ORDEN_COMPRA_DEFAULTS.terminosEnvio],
    ["Delivery", nota.entrega || ORDEN_COMPRA_DEFAULTS.entrega],
    ["Payment Terms", nota.terminosPago || ORDEN_COMPRA_DEFAULTS.terminosPago],
  ];

  return (
    <>
      <div className="oc-acciones no-print">
        <button onClick={() => window.print()} className="oc-btn-imprimir"><FaPrint style={{ marginRight: 6 }} /> Imprimir / PDF</button>
        <Link to={`/compras/notas/${id}`} className="oc-btn-volver"><FaArrowLeft style={{ marginRight: 6 }} /> Volver</Link>
      </div>

      <div className="oc">
        {/* ── Cuadro de cabecera ── */}
        <table className="oc-cab">
          <tbody>
            <tr>
              <td className="oc-cab-logo" rowSpan={3}>
                <Logo heightMm={17} />
              </td>
              <td className="oc-cab-datos" colSpan={2}>
                <div>Telf.: <em>{EMPRESA.telefono}</em> &nbsp;*&nbsp; Fax <em>{EMPRESA.fax}</em> &nbsp;*&nbsp; NIT <em>{EMPRESA.nit}</em></div>
                <div><em>{EMPRESA.direccion}</em> &nbsp;*&nbsp; Casilla N° <em>{EMPRESA.casilla}</em> &nbsp;*&nbsp; <em>{EMPRESA.ciudad}</em></div>
              </td>
            </tr>
            <tr>
              <td className="oc-cab-mail">E - mail: <u>{EMPRESA.email}</u></td>
              <td className="oc-cab-ref">Ref.: {nota.referencia || `OC-${nroOrden}`}</td>
            </tr>
            <tr>
              <td className="oc-cab-titulo">PURCHASE ORDER</td>
              <td className="oc-cab-fecha">{fmtFecha(nota.fecha)}</td>
            </tr>
            <tr>
              <td className="oc-cab-form">
                <div><span>FORMULARIO ADM.</span><span>{EMPRESA.formulario.codigo}</span></div>
                <div><span>Válido desde: {EMPRESA.formulario.validoDesde}</span><span>{EMPRESA.formulario.revision}</span></div>
              </td>
              <td className="oc-cab-nro" colSpan={2}>{nroOrden}</td>
            </tr>
          </tbody>
        </table>

        {/* ── Proveedor ── */}
        <div className="oc-prov">
          <div>Srs:</div>
          {prov.contacto && <div className="b">{prov.contacto}</div>}
          <div className="b">{prov.nombre}</div>
          {prov.direccion && <div className="b">{prov.direccion}</div>}
          {(prov.ciudad || prov.pais) && <div className="b">{[prov.ciudad, prov.pais].filter(Boolean).join(" - ")}</div>}
          {prov.telefono && <div className="b">Ph.: {prov.telefono}</div>}
          {prov.email && <div className="mail">{prov.email}</div>}
        </div>

        {/* ── Detalle ── */}
        <table className="oc-tabla">
          <thead>
            <tr>
              <th className="c-item">Item</th>
              <th className="c-desc"><span className="spaced">D e s c r i p c i ó n</span></th>
              <th className="c-cant">Cant.</th>
              <th className="c-unid">Unid.</th>
              <th className="c-pu">P. Unit.<br />(Bs)</th>
              <th className="c-pt">P. Total<br />(Bs)</th>
            </tr>
          </thead>
          <tbody>
            {(nota.detallesCompra ?? []).map((d, i) => {
              const prod = d.productoAlmacen?.producto ?? {};
              const marca = prod.marcaModelo?.marca?.nombre;
              const modelo = prod.marcaModelo?.modelo?.nombre;
              return (
                <tr key={d.detalleCompraId}>
                  <td className="c-item b">{i + 1}</td>
                  <td className="c-desc">
                    <div className="b">{prod.nombre}</div>
                    {marca && <div><span className="b">Marca:</span> {marca}{modelo ? ` ${modelo}` : ""}</div>}
                    {prod.descripcion && <div className="muted">{prod.descripcion}</div>}
                  </td>
                  <td className="c-cant">{d.cantidad}</td>
                  <td className="c-unid">{prod.unidad || "EA"}</td>
                  <td className="c-pu">{fmt(d.precioCompra)}</td>
                  <td className="c-pt">{fmt(d.cantidad * parseFloat(d.precioCompra))}</td>
                </tr>
              );
            })}
            <tr className="oc-relleno"><td colSpan={6} /></tr>
          </tbody>
        </table>
        <table className="oc-total">
          <tbody>
            <tr><td className="b">TOTAL</td><td className="b r">{fmt(total)}</td></tr>
          </tbody>
        </table>

        {/* ── Términos ── */}
        <div className="oc-terminos">
          {terminos.map(([k, v]) => <div key={k}>{k}: {v}</div>)}
        </div>

        {nota.glosa && <div className="oc-glosa">{nota.glosa}</div>}

        <div className="oc-atte">Atentamente,</div>

        {/* ── Firma ── */}
        <div className="oc-firma">
          <div>{firmante.nombre}</div>
          <div>{firmante.cargo}</div>
          <div>{EMPRESA.razonSocial}</div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #e5e7eb; }
        .oc-acciones { display: flex; gap: 10px; padding: 14px 24px; background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10; }
        .oc-btn-imprimir { display: flex; align-items: center; padding: 8px 20px; background: #0f2a4a; color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .oc-btn-volver { display: flex; align-items: center; padding: 8px 20px; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; text-decoration: none; font-weight: 500; }

        .oc { width: 215.9mm; min-height: 279.4mm; margin: 24px auto; background: #fff; padding: 12mm 12mm 14mm; box-shadow: 0 2px 16px rgba(0,0,0,0.18); font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; }
        .b { font-weight: 700; }
        .r { text-align: right; }
        .muted { color: #444; font-size: 9.5pt; }

        /* Cuadro de cabecera: bordes gruesos como el formulario */
        .oc-cab { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 9.5pt; }
        .oc-cab td { border: 1.5px solid #000; padding: 3px 6px; vertical-align: middle; }
        .oc-cab-logo { width: 36%; text-align: center; }
        .oc-cab-logo img { margin: 4px auto; }
        .oc-cab-datos { text-align: center; line-height: 1.35; }
        .oc-cab-datos em { font-style: italic; }
        .oc-cab-mail { width: 44%; }
        .oc-cab-ref { }
        .oc-cab-titulo { text-align: center; font-weight: 700; font-size: 12pt; letter-spacing: 0.3px; }
        .oc-cab-fecha { }
        .oc-cab-form { font-size: 7.5pt; line-height: 1.5; }
        .oc-cab-form div { display: flex; justify-content: space-between; gap: 8px; }
        .oc-cab-nro { text-align: center; font-weight: 700; font-size: 12pt; }

        .oc-prov { margin: 10mm 0 12mm; line-height: 1.4; }
        .oc-prov .mail { color: #0000ee; text-decoration: underline; }

        .oc-tabla { width: 100%; border-collapse: collapse; }
        .oc-tabla th { text-align: left; font-weight: 400; text-decoration: underline; padding: 4px 6px 6px; vertical-align: bottom; font-size: 10.5pt; }
        .oc-tabla th.c-cant, .oc-tabla th.c-unid, .oc-tabla th.c-pu, .oc-tabla th.c-pt { text-align: center; }
        .oc-tabla .spaced { letter-spacing: 2px; }
        .oc-tabla tbody { border: 2px solid #000; }
        .oc-tabla td { padding: 4px 6px; vertical-align: top; font-size: 10.5pt; }
        .c-item { width: 12mm; text-align: center; }
        .c-cant { width: 16mm; text-align: center; }
        .c-unid { width: 16mm; text-align: center; }
        .c-pu { width: 24mm; text-align: right; }
        .c-pt { width: 26mm; text-align: right; }
        .oc-relleno td { height: 10mm; }

        .oc-total { border-collapse: collapse; margin-left: auto; margin-top: -2px; }
        .oc-total td { border: 2px solid #000; padding: 3px 8px; font-size: 10.5pt; }
        .oc-total td:first-child { width: 22mm; }
        .oc-total td:last-child { width: 28mm; }

        .oc-terminos { margin-top: 12mm; line-height: 1.45; }
        .oc-glosa { margin-top: 5mm; font-size: 10pt; color: #333; }
        .oc-atte { margin-top: 12mm; }
        .oc-firma { margin: 22mm auto 0; text-align: center; line-height: 1.5; }

        @page { size: letter portrait; margin: 0; }
        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .oc { margin: 0; box-shadow: none; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  );
}

export default OrdenCompra;

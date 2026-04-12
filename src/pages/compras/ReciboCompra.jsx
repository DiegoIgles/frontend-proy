import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNotaCompra } from "./hooks/useNotaCompra";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

const ESTADO_LABEL = {
  PAGADO:         "Pagado",
  PAGADO_PARCIAL: "Pagado Parcial",
  PENDIENTE:      "Pendiente",
  VENCIDO:        "Vencido",
};

function ReciboCompra() {
  const { id } = useParams();
  const { nota, loading, error } = useNotaCompra(id);

  useEffect(() => {
    if (nota) {
      // pequeño delay para que el DOM renderice antes de imprimir
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [nota]);

  if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Cargando recibo...</p>;
  if (error)   return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Error al cargar el recibo.</p>;
  if (!nota)   return null;

  const subtotal = nota.detallesCompra.reduce(
    (acc, d) => acc + d.cantidad * parseFloat(d.precioCompra),
    0
  );

  return (
    <>
      {/* Botones — solo visibles en pantalla, ocultos al imprimir */}
      <div className="recibo-acciones">
        <button onClick={() => window.print()} className="recibo-btn-imprimir" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPrint /> Imprimir
        </button>
        <Link to={`/compras/notas/${id}`} className="recibo-btn-volver" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaArrowLeft /> Volver
        </Link>
      </div>

      {/* Recibo */}
      <div className="recibo-wrapper">

        {/* Encabezado */}
        <div className="recibo-header">
          <div>
            <h1 className="recibo-empresa">Mi ERP</h1>
            <p className="recibo-empresa-sub">Sistema de Gestión Empresarial</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 className="recibo-titulo">RECIBO DE COMPRA</h2>
            <p className="recibo-meta">N° <strong>{nota.notaCompraId.slice(0, 8).toUpperCase()}</strong></p>
            <p className="recibo-meta">Fecha: <strong>{new Date(nota.fecha).toLocaleDateString("es-BO")}</strong></p>
            <p className="recibo-meta">
              Tipo: <strong style={{ color: nota.esCredito ? "#d97706" : "#059669" }}>
                {nota.esCredito ? "CRÉDITO" : "CONTADO"}
              </strong>
            </p>
          </div>
        </div>

        <div className="recibo-divider" />

        {/* Proveedor + Usuario */}
        <div className="recibo-partes">
          <div className="recibo-parte">
            <p className="recibo-parte-titulo">PROVEEDOR</p>
            <p className="recibo-parte-nombre">{nota.proveedor.nombre}</p>
            <p className="recibo-parte-detalle">Contacto: {nota.proveedor.contacto}</p>
            <p className="recibo-parte-detalle">Email: {nota.proveedor.email}</p>
            <p className="recibo-parte-detalle">Tel: {nota.proveedor.telefono}</p>
            <p className="recibo-parte-detalle">{nota.proveedor.direccion}, {nota.proveedor.ciudad}, {nota.proveedor.pais}</p>
          </div>
          <div className="recibo-parte">
            <p className="recibo-parte-titulo">REGISTRADO POR</p>
            <p className="recibo-parte-nombre">{nota.usuario.name} {nota.usuario.lastName}</p>
            <p className="recibo-parte-detalle">{nota.usuario.email}</p>
            {nota.glosa && (
              <>
                <p className="recibo-parte-titulo" style={{ marginTop: 10 }}>GLOSA</p>
                <p className="recibo-parte-detalle">{nota.glosa}</p>
              </>
            )}
          </div>
        </div>

        <div className="recibo-divider" />

        {/* Detalle de productos */}
        <p className="recibo-seccion-titulo">DETALLE DE PRODUCTOS</p>
        <table className="recibo-tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Almacén</th>
              <th style={{ textAlign: "center" }}>Cant.</th>
              <th style={{ textAlign: "right" }}>P. Unitario</th>
              <th style={{ textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {nota.detallesCompra.map((d) => {
              const prod    = d.productoAlmacen.producto;
              const almacen = d.productoAlmacen.almacen;
              const sub     = d.cantidad * parseFloat(d.precioCompra);
              return (
                <tr key={d.detalleCompraId}>
                  <td>{prod.codigo}</td>
                  <td>{prod.nombre}</td>
                  <td>{almacen.nombre}</td>
                  <td style={{ textAlign: "center" }}>{d.cantidad}</td>
                  <td style={{ textAlign: "right" }}>Bs. {Number(d.precioCompra).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>Bs. {sub.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="recibo-total-row">
              <td colSpan={5} style={{ textAlign: "right" }}>TOTAL COMPRA</td>
              <td style={{ textAlign: "right" }}>Bs. {subtotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="recibo-divider" />

        {/* Información de pago */}
        <p className="recibo-seccion-titulo">INFORMACIÓN DE PAGO</p>

        {!nota.esCredito && nota.movimientoCaja && (
          <div className="recibo-pago-contado">
            <p>Modalidad: <strong>Pago al contado</strong></p>
            <p>Fecha de pago: <strong>{new Date(nota.movimientoCaja.fecha).toLocaleDateString("es-BO")}</strong></p>
            <p>Monto pagado: <strong>Bs. {Number(nota.movimientoCaja.monto).toFixed(2)}</strong></p>
            <p>Glosa: {nota.movimientoCaja.glosa}</p>
          </div>
        )}

        {nota.esCredito && nota.cuentaPorPagar && (
          <div className="recibo-pago-credito">
            <div className="recibo-pago-credito-grid">
              <div>
                <p className="recibo-parte-titulo">ESTADO</p>
                <p style={{ fontWeight: 700 }}>{ESTADO_LABEL[nota.cuentaPorPagar.estado] ?? nota.cuentaPorPagar.estado}</p>
              </div>
              <div>
                <p className="recibo-parte-titulo">MONTO PAGADO</p>
                <p style={{ fontWeight: 700, color: "#059669" }}>Bs. {Number(nota.cuentaPorPagar.montoPagado).toFixed(2)}</p>
              </div>
              <div>
                <p className="recibo-parte-titulo">SALDO PENDIENTE</p>
                <p style={{ fontWeight: 700, color: "#dc2626" }}>Bs. {Number(nota.cuentaPorPagar.saldo).toFixed(2)}</p>
              </div>
              <div>
                <p className="recibo-parte-titulo">VENCIMIENTO</p>
                <p style={{ fontWeight: 700 }}>
                  {nota.cuentaPorPagar.fechaVencimiento
                    ? new Date(nota.cuentaPorPagar.fechaVencimiento).toLocaleDateString("es-BO")
                    : "—"}
                </p>
              </div>
            </div>

            {nota.cuentaPorPagar.movimientosCaja.length > 0 && (
              <>
                <p className="recibo-parte-titulo" style={{ marginTop: 12 }}>HISTORIAL DE PAGOS</p>
                <table className="recibo-tabla" style={{ marginTop: 6 }}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Glosa</th>
                      <th style={{ textAlign: "right" }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nota.cuentaPorPagar.movimientosCaja.map((mov) => (
                      <tr key={mov.movimientoCajaId}>
                        <td>{new Date(mov.fecha).toLocaleDateString("es-BO")}</td>
                        <td>{mov.glosa}</td>
                        <td style={{ textAlign: "right" }}>Bs. {Number(mov.monto).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        <div className="recibo-divider" />

        {/* Firmas */}
        <div className="recibo-firmas">
          <div className="recibo-firma">
            <div className="recibo-firma-linea" />
            <p>Firma Responsable de Compra</p>
          </div>
          <div className="recibo-firma">
            <div className="recibo-firma-linea" />
            <p>Firma Proveedor</p>
          </div>
        </div>

        <p className="recibo-footer">
          Documento generado el {new Date().toLocaleDateString("es-BO")} — Mi ERP
        </p>
      </div>

      {/* Estilos */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f3f4f6; }

        .recibo-acciones {
          display: flex;
          gap: 10px;
          padding: 16px 24px;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
        }
        .recibo-btn-imprimir {
          padding: 8px 20px;
          background: #1d4ed8;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .recibo-btn-volver {
          padding: 8px 20px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          text-decoration: none;
          font-weight: 500;
        }

        .recibo-wrapper {
          width: 210mm;
          min-height: 297mm;
          margin: 24px auto;
          background: #fff;
          padding: 32px 40px;
          font-family: 'Segoe UI', Arial, sans-serif;
          font-size: 13px;
          color: #111827;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        .recibo-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .recibo-empresa { margin: 0; font-size: 24px; font-weight: 800; color: #1d4ed8; }
        .recibo-empresa-sub { margin: 2px 0 0; font-size: 12px; color: #6b7280; }
        .recibo-titulo { margin: 0; font-size: 18px; font-weight: 700; }
        .recibo-meta { margin: 3px 0; font-size: 12px; color: #374151; }

        .recibo-divider { border: none; border-top: 1px solid #e5e7eb; margin: 18px 0; }

        .recibo-partes { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .recibo-parte-titulo { margin: 0 0 4px; font-size: 10px; font-weight: 700; color: #6b7280; letter-spacing: 0.5px; text-transform: uppercase; }
        .recibo-parte-nombre { margin: 0 0 4px; font-size: 14px; font-weight: 700; }
        .recibo-parte-detalle { margin: 2px 0; font-size: 12px; color: #374151; }

        .recibo-seccion-titulo { font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 10px; }

        .recibo-tabla { width: 100%; border-collapse: collapse; font-size: 12px; }
        .recibo-tabla th { background: #f9fafb; padding: 7px 10px; text-align: left; font-size: 11px; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
        .recibo-tabla td { padding: 7px 10px; border-bottom: 1px solid #f3f4f6; }
        .recibo-total-row td { font-weight: 700; font-size: 14px; padding-top: 10px; border-top: 2px solid #111827; border-bottom: none; }

        .recibo-pago-contado p { margin: 4px 0; font-size: 13px; }
        .recibo-pago-credito-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

        .recibo-firmas { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
        .recibo-firma { text-align: center; font-size: 12px; color: #374151; }
        .recibo-firma-linea { border-top: 1px solid #374151; margin-bottom: 6px; }

        .recibo-footer { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 24px; }

        @media print {
          body { background: #fff; }
          .recibo-acciones { display: none; }
          .recibo-wrapper { margin: 0; padding: 20px 28px; box-shadow: none; width: 100%; }
        }
      `}</style>
    </>
  );
}

export default ReciboCompra;

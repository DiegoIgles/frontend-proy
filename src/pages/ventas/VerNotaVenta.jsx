import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useNotaVenta } from "./hooks/useNotaVenta";
import { deleteNotaVentaAction } from "./actions/delete-nota-venta.action";
import { FaPrint, FaMoneyBillWave, FaTrash, FaArrowLeft } from "react-icons/fa";
import EstadoBadge from "../../components/EstadoBadge";

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#6b7280", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 500, fontSize: 14 }}>{value}</span>
    </div>
  );
}

function VerNotaVenta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { nota, loading, error } = useNotaVenta(id);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota de venta? Se revertirá el stock.")) return;
    try {
      setDeleting(true);
      await deleteNotaVentaAction(id);
      navigate("/ventas/notas");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la venta");
      setDeleting(false);
    }
  };

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error al cargar la nota de venta.</p></Layout>;
  if (!nota)   return null;

  const subtotalDetalle = nota.detallesVenta.reduce(
    (acc, d) => acc + d.cantidad * parseFloat(d.precioVenta),
    0
  );

  const cliente = nota.cliente;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <Link to="/ventas/notas" style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver a Notas de Venta
          </Link>
          <h1 style={{ marginTop: 4 }}>Nota de Venta</h1>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>#{nota.notaVentaId}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/ventas/notas/${nota.notaVentaId}/recibo`} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaPrint /> Imprimir Recibo
          </Link>
          {nota.puedeRegistrarCobro && (
            <Link to={`/ventas/notas/${nota.notaVentaId}/cobro`} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaMoneyBillWave /> Registrar Cobro
            </Link>
          )}
          <button className="btn-danger" onClick={handleDelete} disabled={deleting} title="Eliminar">
            <FaTrash />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Información general */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Información General</h3>
          <InfoRow label="Fecha"       value={new Date(nota.fecha).toLocaleDateString("es-BO")} />
          <InfoRow label="Glosa"       value={nota.glosa || "—"} />
          <InfoRow label="Tipo"        value={nota.esCredito
            ? <span style={{ color: "#d97706", fontWeight: 600 }}>Crédito</span>
            : <span style={{ color: "#059669", fontWeight: 600 }}>Contado</span>}
          />
          {Number(nota.descuento) > 0 && (
            <InfoRow label="Descuento" value={`${Number(nota.descuento).toFixed(2)}%`} />
          )}
          <InfoRow label="Monto Total" value={<strong>Bs. {Number(nota.montoTotal).toFixed(2)}</strong>} />
          {nota.esCredito && (
            <InfoRow
              label="Saldo Pendiente"
              value={
                <span style={{ color: nota.saldoPendiente > 0 ? "#dc2626" : "#059669", fontWeight: 600 }}>
                  Bs. {Number(nota.saldoPendiente).toFixed(2)}
                </span>
              }
            />
          )}
          <InfoRow label="Registrado por" value={`${nota.usuario.name} ${nota.usuario.lastName}`} />
          <InfoRow label="Email usuario"  value={nota.usuario.email} />
        </div>

        {/* Cliente */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Cliente</h3>
          <InfoRow label="Nombre"    value={`${cliente.nombre} ${cliente.apellidoPaterno}${cliente.apellidoMaterno ? ` ${cliente.apellidoMaterno}` : ""}`} />
          <InfoRow label="Correo"    value={cliente.correo} />
          <InfoRow label="Teléfono"  value={cliente.telefono} />
          <InfoRow label="Dirección" value={cliente.direccion} />
        </div>
      </div>

      {/* Detalle de productos */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Detalle de Productos</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Almacén</th>
              <th>Stock Actual</th>
              <th>Cantidad</th>
              <th>Precio Venta</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {nota.detallesVenta.map((detalle) => {
              const prod = detalle.productoAlmacen.producto;
              const almacen = detalle.productoAlmacen.almacen;
              const subtotal = detalle.cantidad * parseFloat(detalle.precioVenta);
              return (
                <tr key={detalle.detalleVentaId}>
                  <td><code>{prod.codigo}</code></td>
                  <td>
                    <strong>{prod.nombre}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>{prod.descripcion}</small>
                  </td>
                  <td>{almacen.nombre}</td>
                  <td>{detalle.productoAlmacen.stock}</td>
                  <td><strong>{detalle.cantidad}</strong></td>
                  <td>Bs. {Number(detalle.precioVenta).toFixed(2)}</td>
                  <td><strong>Bs. {subtotal.toFixed(2)}</strong></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {Number(nota.descuento) > 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "right", fontSize: 13, color: "#6b7280", paddingTop: 8 }}>
                  Subtotal bruto
                </td>
                <td style={{ fontSize: 13, color: "#374151" }}>Bs. {subtotalDetalle.toFixed(2)}</td>
              </tr>
            )}
            <tr>
              <td colSpan={6} style={{ textAlign: "right", fontWeight: 600, paddingTop: 8 }}>Total</td>
              <td style={{ fontWeight: 700, fontSize: 15 }}>Bs. {Number(nota.montoTotal).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pago al contado */}
      {!nota.esCredito && nota.movimientoCaja && (
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Cobro al Contado</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Glosa</th>
                <th>Tipo</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{new Date(nota.movimientoCaja.fecha).toLocaleDateString("es-BO")}</td>
                <td>{nota.movimientoCaja.glosa}</td>
                <td>
                  <span style={{ color: "#059669", fontWeight: 600 }}>
                    {nota.movimientoCaja.tipoMovimiento}
                  </span>
                </td>
                <td><strong>Bs. {Number(nota.movimientoCaja.monto).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Cuenta por cobrar (crédito) */}
      {nota.esCredito && nota.cuentaPorCobrar && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3>Cuenta por Cobrar</h3>
            <EstadoBadge estado={nota.cuentaPorCobrar.estado} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Monto Total",   value: `Bs. ${Number(nota.cuentaPorCobrar.montoTotal).toFixed(2)}` },
              { label: "Monto Cobrado", value: `Bs. ${Number(nota.cuentaPorCobrar.montoCobrado).toFixed(2)}`, color: "#059669" },
              { label: "Saldo",         value: `Bs. ${Number(nota.cuentaPorCobrar.saldo).toFixed(2)}`, color: Number(nota.cuentaPorCobrar.saldo) > 0 ? "#dc2626" : "#059669" },
              { label: "Vencimiento",   value: nota.cuentaPorCobrar.fechaVencimiento ? new Date(nota.cuentaPorCobrar.fechaVencimiento).toLocaleDateString("es-BO") : "—" },
            ].map((item) => (
              <div key={item.label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, margin: "4px 0 0", color: item.color ?? "#111827" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: 8 }}>Historial de Cobros</h4>
          {nota.cuentaPorCobrar.movimientosCaja.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>Sin cobros registrados aún.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Glosa</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {nota.cuentaPorCobrar.movimientosCaja.map((mov) => (
                  <tr key={mov.movimientoCajaId}>
                    <td>{new Date(mov.fecha).toLocaleDateString("es-BO")}</td>
                    <td>{mov.glosa}</td>
                    <td>
                      <span style={{ color: "#059669", fontWeight: 600 }}>
                        {mov.tipoMovimiento}
                      </span>
                    </td>
                    <td><strong>Bs. {Number(mov.monto).toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Layout>
  );
}

export default VerNotaVenta;

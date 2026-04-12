import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useNotaCompra } from "./hooks/useNotaCompra";
import { deleteNotaCompraAction } from "./actions/delete-nota-compra.action";
import { FaPrint, FaMoneyBillWave, FaTrash, FaArrowLeft } from "react-icons/fa";

const ESTADO_STYLES = {
  PAGADO:         { background: "#d1fae5", color: "#065f46", label: "Pagado" },
  PAGADO_PARCIAL: { background: "#dbeafe", color: "#1e40af", label: "Pagado Parcial" },
  PENDIENTE:      { background: "#fef3c7", color: "#92400e", label: "Pendiente" },
  VENCIDO:        { background: "#fee2e2", color: "#991b1b", label: "Vencido" },
};

function EstadoBadge({ estado }) {
  if (!estado) return null;
  const style = ESTADO_STYLES[estado] ?? { background: "#e5e7eb", color: "#374151", label: estado };
  return (
    <span style={{ background: style.background, color: style.color, padding: "3px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      {style.label}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#6b7280", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 500, fontSize: 14 }}>{value}</span>
    </div>
  );
}

function VerNotaCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { nota, loading, error } = useNotaCompra(id);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota de compra? Se revertirá el stock.")) return;
    try {
      setDeleting(true);
      await deleteNotaCompraAction(id);
      navigate("/compras/notas");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la compra");
      setDeleting(false);
    }
  };

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error al cargar la nota de compra.</p></Layout>;
  if (!nota)   return null;

  const subtotalDetalle = nota.detallesCompra.reduce(
    (acc, d) => acc + d.cantidad * parseFloat(d.precioCompra),
    0
  );

  return (
    <Layout>
      {/* Encabezado */}
      <div className="page-header">
        <div>
          <Link to="/compras/notas" style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver a Notas de Compra
          </Link>
          <h1 style={{ marginTop: 4 }}>Nota de Compra</h1>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>#{nota.notaCompraId}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/compras/notas/${nota.notaCompraId}/recibo`} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaPrint /> Imprimir Recibo
          </Link>
          {nota.puedeRegistrarPago && (
            <Link to={`/compras/notas/${nota.notaCompraId}/pago`} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaMoneyBillWave /> Registrar Pago
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
          <InfoRow label="Glosa"       value={nota.glosa} />
          <InfoRow label="Tipo"        value={nota.esCredito
            ? <span style={{ color: "#d97706", fontWeight: 600 }}>Crédito</span>
            : <span style={{ color: "#059669", fontWeight: 600 }}>Contado</span>}
          />
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

        {/* Proveedor */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Proveedor</h3>
          <InfoRow label="Nombre"    value={nota.proveedor.nombre} />
          <InfoRow label="Contacto"  value={nota.proveedor.contacto} />
          <InfoRow label="Email"     value={nota.proveedor.email} />
          <InfoRow label="Teléfono"  value={nota.proveedor.telefono} />
          <InfoRow label="Dirección" value={nota.proveedor.direccion} />
          <InfoRow label="Ciudad"    value={`${nota.proveedor.ciudad}, ${nota.proveedor.pais}`} />
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
              <th>Precio Compra</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {nota.detallesCompra.map((detalle) => {
              const prod = detalle.productoAlmacen.producto;
              const almacen = detalle.productoAlmacen.almacen;
              const subtotal = detalle.cantidad * parseFloat(detalle.precioCompra);
              return (
                <tr key={detalle.detalleCompraId}>
                  <td><code>{prod.codigo}</code></td>
                  <td>
                    <strong>{prod.nombre}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>{prod.descripcion}</small>
                  </td>
                  <td>{almacen.nombre}</td>
                  <td>{detalle.productoAlmacen.stock}</td>
                  <td><strong>{detalle.cantidad}</strong></td>
                  <td>Bs. {Number(detalle.precioCompra).toFixed(2)}</td>
                  <td><strong>Bs. {subtotal.toFixed(2)}</strong></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} style={{ textAlign: "right", fontWeight: 600, paddingTop: 10 }}>Total</td>
              <td style={{ fontWeight: 700, fontSize: 15 }}>Bs. {subtotalDetalle.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pago al contado */}
      {!nota.esCredito && nota.movimientoCaja && (
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Pago al Contado</h3>
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
                  <span style={{ color: "#dc2626", fontWeight: 600 }}>
                    {nota.movimientoCaja.tipoMovimiento}
                  </span>
                </td>
                <td><strong>Bs. {Number(nota.movimientoCaja.monto).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Cuenta por pagar (crédito) */}
      {nota.esCredito && nota.cuentaPorPagar && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3>Cuenta por Pagar</h3>
            <EstadoBadge estado={nota.cuentaPorPagar.estado} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Monto Total",   value: `Bs. ${Number(nota.cuentaPorPagar.montoTotal).toFixed(2)}` },
              { label: "Monto Pagado",  value: `Bs. ${Number(nota.cuentaPorPagar.montoPagado).toFixed(2)}`, color: "#059669" },
              { label: "Saldo",         value: `Bs. ${Number(nota.cuentaPorPagar.saldo).toFixed(2)}`,        color: Number(nota.cuentaPorPagar.saldo) > 0 ? "#dc2626" : "#059669" },
              { label: "Vencimiento",   value: new Date(nota.cuentaPorPagar.fechaVencimiento).toLocaleDateString("es-BO") },
            ].map((item) => (
              <div key={item.label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, margin: "4px 0 0", color: item.color ?? "#111827" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: 8 }}>Historial de Pagos</h4>
          {nota.cuentaPorPagar.movimientosCaja.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>Sin pagos registrados aún.</p>
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
                {nota.cuentaPorPagar.movimientosCaja.map((mov) => (
                  <tr key={mov.movimientoCajaId}>
                    <td>{new Date(mov.fecha).toLocaleDateString("es-BO")}</td>
                    <td>{mov.glosa}</td>
                    <td>
                      <span style={{ color: "#dc2626", fontWeight: 600 }}>
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

export default VerNotaCompra;

import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { useNotasVenta } from "./hooks/useNotasVenta";
import { deleteNotaVentaAction } from "./actions/delete-nota-venta.action";
import { FaPlus, FaEye, FaMoneyBillWave, FaTrash } from "react-icons/fa";
import EstadoBadge from "../../components/EstadoBadge";

function NotasVenta() {
  const { notas, setNotas, loading, error } = useNotasVenta();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota de venta? Se revertirá el stock.")) return;
    try {
      setDeletingId(id);
      await deleteNotaVentaAction(id);
      setNotas((prev) => prev.filter((n) => n.notaVentaId !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la venta");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error al cargar las notas de venta.</p></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <h1>Notas de Venta</h1>
        <Link to="/ventas/notas/crear" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Venta
        </Link>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th className="col-hide-mobile">Glosa</th>
                <th className="col-hide-mobile">Usuario</th>
                <th>Monto Total</th>
                <th className="col-hide-mobile">Tipo</th>
                <th className="col-hide-mobile">Saldo Pendiente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((nota) => (
                <tr key={nota.notaVentaId}>
                  <td>{new Date(nota.fecha).toLocaleDateString("es-BO")}</td>
                  <td>
                    <strong>{nota.cliente.nombre} {nota.cliente.apellidoPaterno}{nota.cliente.apellidoMaterno ? ` ${nota.cliente.apellidoMaterno}` : ""}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>{nota.cliente.telefono}</small>
                  </td>
                  <td className="col-hide-mobile">{nota.glosa || "—"}</td>
                  <td className="col-hide-mobile">{nota.usuario.name} {nota.usuario.lastName}</td>
                  <td><strong>Bs. {Number(nota.montoTotal).toFixed(2)}</strong></td>
                  <td className="col-hide-mobile">
                    {nota.esCredito ? (
                      <span style={{ color: "#d97706", fontWeight: 600 }}>Crédito</span>
                    ) : (
                      <span style={{ color: "#059669", fontWeight: 600 }}>Contado</span>
                    )}
                  </td>
                  <td className="col-hide-mobile">
                    {nota.saldoPendiente > 0
                      ? <span style={{ color: "#dc2626" }}>Bs. {Number(nota.saldoPendiente).toFixed(2)}</span>
                      : <span style={{ color: "#059669" }}>Bs. 0.00</span>
                    }
                  </td>
                  <td><EstadoBadge estado={nota.estadoDeuda} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link to={`/ventas/notas/${nota.notaVentaId}`} className="btn-secondary" title="Ver detalle">
                        <FaEye />
                      </Link>
                      {nota.puedeRegistrarCobro && (
                        <Link to={`/ventas/notas/${nota.notaVentaId}/cobro`} className="btn-primary" title="Registrar cobro">
                          <FaMoneyBillWave />
                        </Link>
                      )}
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(nota.notaVentaId)}
                        disabled={deletingId === nota.notaVentaId}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default NotasVenta;

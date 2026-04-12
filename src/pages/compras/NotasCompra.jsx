import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { useNotasCompra } from "./hooks/useNotasCompra";
import { deleteNotaCompraAction } from "./actions/delete-nota-compra.action";
import { FaPlus, FaEye, FaMoneyBillWave, FaTrash } from "react-icons/fa";

const ESTADO_STYLES = {
  PAGADO:          { background: "#d1fae5", color: "#065f46", label: "Pagado" },
  PAGADO_PARCIAL:  { background: "#dbeafe", color: "#1e40af", label: "Pagado Parcial" },
  PENDIENTE:       { background: "#fef3c7", color: "#92400e", label: "Pendiente" },
  VENCIDO:         { background: "#fee2e2", color: "#991b1b", label: "Vencido" },
};

function EstadoBadge({ estado }) {
  if (!estado) return <span style={{ color: "#6b7280" }}>—</span>;
  const style = ESTADO_STYLES[estado] ?? { background: "#e5e7eb", color: "#374151", label: estado };
  return (
    <span style={{ background: style.background, color: style.color, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      {style.label}
    </span>
  );
}

function NotasCompra() {
  const { notas, setNotas, loading, error } = useNotasCompra();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota de compra? Se revertirá el stock.")) return;
    try {
      setDeletingId(id);
      await deleteNotaCompraAction(id);
      setNotas((prev) => prev.filter((n) => n.notaCompraId !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la compra");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error al cargar las notas de compra.</p></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <h1>Notas de Compra</h1>
        <Link to="/compras/notas/crear" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Nota
        </Link>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th className="col-hide-mobile">Glosa</th>
                <th className="col-hide-mobile">Usuario</th>
                <th>Monto Total</th>
                <th className="col-hide-mobile">Crédito</th>
                <th className="col-hide-mobile">Saldo Pendiente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((nota) => (
                <tr key={nota.notaCompraId}>
                  <td>{new Date(nota.fecha).toLocaleDateString("es-BO")}</td>
                  <td>
                    <strong>{nota.proveedor.nombre}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>{nota.proveedor.ciudad}, {nota.proveedor.pais}</small>
                  </td>
                  <td className="col-hide-mobile">{nota.glosa}</td>
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
                      <Link to={`/compras/notas/${nota.notaCompraId}`} className="btn-secondary" title="Ver detalle">
                        <FaEye />
                      </Link>
                      {nota.puedeRegistrarPago && (
                        <Link to={`/compras/notas/${nota.notaCompraId}/pago`} className="btn-primary" title="Registrar pago">
                          <FaMoneyBillWave />
                        </Link>
                      )}
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(nota.notaCompraId)}
                        disabled={deletingId === nota.notaCompraId}
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

export default NotasCompra;

import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { useAjustes } from "./hooks/useAjustes";
import { deleteAjusteAction } from "./actions/delete-ajuste.action";
import { FaPlus, FaEye, FaTrash } from "react-icons/fa";

function TipoBadge({ tipo }) {
  if (tipo === "ENTRADA") {
    return (
      <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
        ENTRADA
      </span>
    );
  }
  return (
    <span style={{ background: "#fee2e2", color: "#991b1b", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      SALIDA
    </span>
  );
}

function Ajustes() {
  const { ajustes, setAjustes, loading, error } = useAjustes();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este ajuste? Se revertirá el stock.")) return;
    try {
      setDeletingId(id);
      await deleteAjusteAction(id);
      setAjustes((prev) => prev.filter((a) => a.ajusteId !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el ajuste");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error al cargar los ajustes.</p></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <h1>Ajustes de Stock</h1>
        <Link to="/ajustes/crear" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nuevo Ajuste
        </Link>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th className="col-hide-mobile">Glosa</th>
                <th className="col-hide-mobile">Usuario</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ajustes.map((ajuste) => (
                <tr key={ajuste.ajusteId}>
                  <td>{new Date(ajuste.fecha).toLocaleDateString("es-BO")}</td>
                  <td><TipoBadge tipo={ajuste.tipo} /></td>
                  <td className="col-hide-mobile">{ajuste.glosa || "—"}</td>
                  <td className="col-hide-mobile">{ajuste.usuario.name} {ajuste.usuario.lastName}</td>
                  <td>
                    <span style={{ fontSize: 13 }}>
                      {ajuste.detallesAjuste.map((d) => (
                        <span key={d.detalleAjusteId} style={{ display: "block" }}>
                          {d.productoAlmacen.producto.nombre}
                          <span style={{ color: "#6b7280", marginLeft: 4 }}>× {d.cantidad}</span>
                        </span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link to={`/ajustes/${ajuste.ajusteId}`} className="btn-secondary" title="Ver detalle">
                        <FaEye />
                      </Link>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(ajuste.ajusteId)}
                        disabled={deletingId === ajuste.ajusteId}
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

export default Ajustes;

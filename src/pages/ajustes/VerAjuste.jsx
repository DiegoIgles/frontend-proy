import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAjuste } from "./hooks/useAjuste";
import { deleteAjusteAction } from "./actions/delete-ajuste.action";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

function TipoBadge({ tipo }) {
  if (tipo === "ENTRADA") {
    return (
      <span style={{ background: "#d1fae5", color: "#065f46", padding: "3px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
        ENTRADA
      </span>
    );
  }
  return (
    <span style={{ background: "#fee2e2", color: "#991b1b", padding: "3px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      SALIDA
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

function VerAjuste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ajuste, loading, error } = useAjuste(id);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este ajuste? Se revertirá el stock.")) return;
    try {
      setDeleting(true);
      await deleteAjusteAction(id);
      navigate("/ajustes");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el ajuste");
      setDeleting(false);
    }
  };

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error al cargar el ajuste.</p></Layout>;
  if (!ajuste) return null;

  const totalUnidades = ajuste.detallesAjuste.reduce((acc, d) => acc + d.cantidad, 0);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <Link to="/ajustes" style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver a Ajustes
          </Link>
          <h1 style={{ marginTop: 4 }}>Ajuste de Stock</h1>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>#{ajuste.ajusteId}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <TipoBadge tipo={ajuste.tipo} />
          <button className="btn-danger" onClick={handleDelete} disabled={deleting} title="Eliminar">
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Info general */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Información General</h3>
          <InfoRow label="Fecha"   value={new Date(ajuste.fecha).toLocaleDateString("es-BO")} />
          <InfoRow label="Tipo"    value={<TipoBadge tipo={ajuste.tipo} />} />
          <InfoRow label="Glosa"   value={ajuste.glosa || "—"} />
          <InfoRow label="Total unidades ajustadas" value={<strong>{totalUnidades}</strong>} />
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Registrado por</h3>
          <InfoRow label="Nombre" value={`${ajuste.usuario.name} ${ajuste.usuario.lastName}`} />
          <InfoRow label="Email"  value={ajuste.usuario.email} />
        </div>
      </div>

      {/* Detalle de productos */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Productos Ajustados</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Almacén</th>
              <th>Stock Actual</th>
              <th>Cantidad Ajustada</th>
              <th>Stock Antes del Ajuste</th>
            </tr>
          </thead>
          <tbody>
            {ajuste.detallesAjuste.map((detalle) => {
              const prod    = detalle.productoAlmacen.producto;
              const almacen = detalle.productoAlmacen.almacen;
              const stockActual = detalle.productoAlmacen.stock;
              const stockAntes  = ajuste.tipo === "ENTRADA"
                ? stockActual - detalle.cantidad
                : stockActual + detalle.cantidad;

              return (
                <tr key={detalle.detalleAjusteId}>
                  <td><code>{prod.codigo}</code></td>
                  <td>
                    <strong>{prod.nombre}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>{prod.descripcion}</small>
                  </td>
                  <td>{almacen.nombre}</td>
                  <td><strong>{stockActual}</strong></td>
                  <td>
                    <span style={{
                      color: ajuste.tipo === "ENTRADA" ? "#065f46" : "#991b1b",
                      fontWeight: 700,
                    }}>
                      {ajuste.tipo === "ENTRADA" ? "+" : "−"}{detalle.cantidad}
                    </span>
                  </td>
                  <td style={{ color: "#6b7280" }}>{stockAntes}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} style={{ textAlign: "right", fontWeight: 600, paddingTop: 10 }}>
                Total unidades
              </td>
              <td style={{ fontWeight: 700, fontSize: 15 }}>{totalUnidades}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </Layout>
  );
}

export default VerAjuste;

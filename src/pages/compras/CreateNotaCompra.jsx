import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useProveedores } from "./hooks/useProveedores";
import { getProductosAction } from "../inventario/actions/get-productos.action";
import { getProductoStockAction } from "../inventario/actions/get-producto-stock.action";
import { createNotaCompraAction } from "./actions/create-nota-compra.action";
import { FaArrowLeft, FaPlus, FaTrash, FaTimes, FaSave } from "react-icons/fa";

const today = new Date().toISOString().split("T")[0];

function DetalleRow({ detalle, index, productos, onChange, onRemove }) {
  const [stockOptions, setStockOptions] = useState([]);

  useEffect(() => {
    if (!detalle.productoId) {
      setStockOptions([]);
      return;
    }
    getProductoStockAction(detalle.productoId)
      .then(setStockOptions)
      .catch(console.error);
  }, [detalle.productoId]);

  const subtotal = (Number(detalle.cantidad) || 0) * (Number(detalle.precioCompra) || 0);

  return (
    <tr>
      {/* Producto */}
      <td>
        <select
          value={detalle.productoId}
          onChange={(e) => onChange(index, "productoId", e.target.value)}
          required
          style={{ width: "100%", minWidth: 180 }}
        >
          <option value="">Seleccionar...</option>
          {productos.map((p) => (
            <option key={p.productoId} value={p.productoId}>
              [{p.codigo}] {p.nombre}
            </option>
          ))}
        </select>
      </td>

      {/* Almacén */}
      <td>
        <select
          value={detalle.productoAlmacenId}
          onChange={(e) => onChange(index, "productoAlmacenId", e.target.value)}
          required
          disabled={!detalle.productoId}
          style={{ width: "100%", minWidth: 150 }}
        >
          <option value="">Seleccionar...</option>
          {stockOptions.map((s) => (
            <option key={s.productoAlmacenId} value={s.productoAlmacenId}>
              {s.almacen} (stock: {s.stock})
            </option>
          ))}
        </select>
      </td>

      {/* Cantidad */}
      <td>
        <input
          type="number"
          min={1}
          value={detalle.cantidad}
          onChange={(e) => onChange(index, "cantidad", e.target.value)}
          required
          style={{ width: 80 }}
        />
      </td>

      {/* Precio compra */}
      <td>
        <input
          type="number"
          min={0}
          step="0.01"
          placeholder="0.00"
          value={detalle.precioCompra}
          onChange={(e) => onChange(index, "precioCompra", e.target.value)}
          required
          style={{ width: 100 }}
        />
      </td>

      {/* Subtotal */}
      <td style={{ fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>
        Bs. {subtotal.toFixed(2)}
      </td>

      {/* Quitar */}
      <td>
        <button type="button" className="btn-danger" onClick={() => onRemove(index)} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

function CreateNotaCompra() {
  const navigate = useNavigate();
  const { proveedores, loading: loadingProveedores } = useProveedores();
  const [productos, setProductos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fecha: today,
    glosa: "",
    proveedorId: "",
    esCredito: false,
    credito: { fechaVencimiento: "", montoPagadoInicial: 0 },
  });

  const [detalles, setDetalles] = useState([
    { productoId: "", productoAlmacenId: "", cantidad: 1, precioCompra: "" },
  ]);

  useEffect(() => {
    getProductosAction().then(setProductos).catch(console.error);
  }, []);

  const total = detalles.reduce(
    (acc, d) => acc + (Number(d.cantidad) || 0) * (Number(d.precioCompra) || 0),
    0
  );

  // --- Handlers form general ---
  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreditoChange = (field, value) => {
    setForm((prev) => ({ ...prev, credito: { ...prev.credito, [field]: value } }));
  };

  // --- Handlers detalles ---
  const handleDetalleChange = (index, field, value) => {
    setDetalles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Si cambia el producto, resetear el almacén
      if (field === "productoId") updated[index].productoAlmacenId = "";
      return updated;
    });
  };

  const addDetalle = () => {
    setDetalles((prev) => [
      ...prev,
      { productoId: "", productoAlmacenId: "", cantidad: 1, precioCompra: "" },
    ]);
  };

  const removeDetalle = (index) => {
    if (detalles.length === 1) return;
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fecha: form.fecha,
      glosa: form.glosa || undefined,
      proveedorId: form.proveedorId,
      esCredito: form.esCredito,
      detalles: detalles.map((d) => ({
        productoAlmacenId: d.productoAlmacenId,
        cantidad: Number(d.cantidad),
        precioCompra: Number(d.precioCompra),
      })),
      ...(form.esCredito && {
        credito: {
          fechaVencimiento: form.credito.fechaVencimiento || undefined,
          montoPagadoInicial: Number(form.credito.montoPagadoInicial),
        },
      }),
    };

    try {
      setSubmitting(true);
      const nueva = await createNotaCompraAction(payload);
      navigate(`/compras/notas/${nueva.notaCompraId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar la compra");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProveedores) return <Layout><p>Cargando...</p></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <Link to="/compras/notas" style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver a Notas de Compra
          </Link>
          <h1 style={{ marginTop: 4 }}>Nueva Nota de Compra</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Información general */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 14 }}>Información General</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => handleFormChange("fecha", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Proveedor *</label>
              <select
                value={form.proveedorId}
                onChange={(e) => handleFormChange("proveedorId", e.target.value)}
                required
              >
                <option value="">Seleccionar proveedor...</option>
                {proveedores.map((p) => (
                  <option key={p.proveedorId} value={p.proveedorId}>
                    {p.nombre} — {p.ciudad}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Glosa</label>
              <input
                type="text"
                placeholder="Descripción de la compra"
                value={form.glosa}
                onChange={(e) => handleFormChange("glosa", e.target.value)}
              />
            </div>
          </div>

          {/* Tipo de pago */}
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 14, color: "#374151", marginRight: 12 }}>Tipo de Pago:</label>
            <label style={{ marginRight: 20, cursor: "pointer" }}>
              <input
                type="radio"
                name="esCredito"
                value="false"
                checked={!form.esCredito}
                onChange={() => handleFormChange("esCredito", false)}
                style={{ marginRight: 6 }}
              />
              <span style={{ color: "#059669", fontWeight: 600 }}>Contado</span>
            </label>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="esCredito"
                value="true"
                checked={form.esCredito}
                onChange={() => handleFormChange("esCredito", true)}
                style={{ marginRight: 6 }}
              />
              <span style={{ color: "#d97706", fontWeight: 600 }}>Crédito</span>
            </label>
          </div>
        </div>

        {/* Sección crédito */}
        {form.esCredito && (
          <div className="card" style={{ marginBottom: 16, borderLeft: "4px solid #d97706" }}>
            <h3 style={{ marginBottom: 14, color: "#d97706" }}>Condiciones de Crédito</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>Fecha de Vencimiento <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
                <input
                  type="date"
                  value={form.credito.fechaVencimiento}
                  onChange={(e) => handleCreditoChange("fechaVencimiento", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Pago Inicial (Bs.) *</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={form.credito.montoPagadoInicial}
                  onChange={(e) => handleCreditoChange("montoPagadoInicial", e.target.value)}
                  required
                />
                <small style={{ color: "#6b7280" }}>Puede ser 0 si no se realiza ningún pago inicial.</small>
              </div>
            </div>
          </div>
        )}

        {/* Detalle de productos */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3>Detalle de Productos</h3>
            <button type="button" className="btn-primary" onClick={addDetalle} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaPlus /> Agregar Producto
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Almacén</th>
                  <th>Cantidad</th>
                  <th>Precio Compra (Bs.)</th>
                  <th style={{ textAlign: "right" }}>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle, index) => (
                  <DetalleRow
                    key={index}
                    detalle={detalle}
                    index={index}
                    productos={productos}
                    onChange={handleDetalleChange}
                    onRemove={removeDetalle}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ textAlign: "right", fontWeight: 600, paddingTop: 12 }}>
                    Total Compra
                  </td>
                  <td style={{ fontWeight: 700, fontSize: 16, textAlign: "right", color: "#111827" }}>
                    Bs. {total.toFixed(2)}
                  </td>
                  <td />
                </tr>
                {form.esCredito && Number(form.credito.montoPagadoInicial) > 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "right", fontSize: 13, color: "#6b7280", paddingTop: 4 }}>
                      Pago inicial
                    </td>
                    <td style={{ fontSize: 13, color: "#059669", fontWeight: 600, textAlign: "right" }}>
                      − Bs. {Number(form.credito.montoPagadoInicial).toFixed(2)}
                    </td>
                    <td />
                  </tr>
                )}
                {form.esCredito && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "right", fontSize: 13, color: "#6b7280", paddingTop: 4 }}>
                      Saldo pendiente
                    </td>
                    <td style={{ fontSize: 14, color: "#dc2626", fontWeight: 700, textAlign: "right" }}>
                      Bs. {Math.max(0, total - Number(form.credito.montoPagadoInicial)).toFixed(2)}
                    </td>
                    <td />
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Link to="/compras/notas" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaTimes /> Cancelar
          </Link>
          <button type="submit" className="btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaSave /> {submitting ? "Guardando..." : "Registrar Compra"}
          </button>
        </div>

      </form>
    </Layout>
  );
}

export default CreateNotaCompra;

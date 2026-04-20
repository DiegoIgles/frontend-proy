import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getProductosAction } from "../inventario/actions/get-productos.action";
import { getProductoStockAction } from "../inventario/actions/get-producto-stock.action";
import { createAjusteAction } from "./actions/create-ajuste.action";
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

  return (
    <tr>
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

      <td>
        <input
          type="number"
          min={1}
          value={detalle.cantidad}
          onChange={(e) => onChange(index, "cantidad", e.target.value)}
          required
          style={{ width: 90 }}
        />
      </td>

      <td>
        <button type="button" className="btn-danger" onClick={() => onRemove(index)} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

function CreateAjuste() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    tipo: "ENTRADA",
    glosa: "",
  });

  const [detalles, setDetalles] = useState([
    { productoId: "", productoAlmacenId: "", cantidad: 1 },
  ]);

  useEffect(() => {
    getProductosAction({ limit: 200 }).then((res) => setProductos(Array.isArray(res) ? res : (res.data ?? []))).catch(console.error);
  }, []);

  const handleDetalleChange = (index, field, value) => {
    setDetalles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "productoId") updated[index].productoAlmacenId = "";
      return updated;
    });
  };

  const addDetalle = () => {
    setDetalles((prev) => [...prev, { productoId: "", productoAlmacenId: "", cantidad: 1 }]);
  };

  const removeDetalle = (index) => {
    if (detalles.length === 1) return;
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tipo: form.tipo,
      glosa: form.glosa || undefined,
      detalles: detalles.map((d) => ({
        productoAlmacenId: d.productoAlmacenId,
        cantidad: Number(d.cantidad),
      })),
    };

    try {
      setSubmitting(true);
      const nuevo = await createAjusteAction(payload);
      navigate(`/ajustes/${nuevo.ajusteId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar el ajuste");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <Link to="/ajustes" style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
            <FaArrowLeft /> Volver a Ajustes
          </Link>
          <h1 style={{ marginTop: 4 }}>Nuevo Ajuste de Stock</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Información general */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 14 }}>Información General</h3>

          {/* Tipo de ajuste */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, color: "#374151", marginRight: 12 }}>Tipo de Ajuste *</label>
            <label style={{ marginRight: 24, cursor: "pointer" }}>
              <input
                type="radio"
                name="tipo"
                value="ENTRADA"
                checked={form.tipo === "ENTRADA"}
                onChange={() => setForm((p) => ({ ...p, tipo: "ENTRADA" }))}
                style={{ marginRight: 6 }}
              />
              <span style={{ color: "#065f46", fontWeight: 600 }}>ENTRADA</span>
              <span style={{ color: "#6b7280", fontSize: 12, marginLeft: 4 }}>(incrementa stock)</span>
            </label>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="tipo"
                value="SALIDA"
                checked={form.tipo === "SALIDA"}
                onChange={() => setForm((p) => ({ ...p, tipo: "SALIDA" }))}
                style={{ marginRight: 6 }}
              />
              <span style={{ color: "#991b1b", fontWeight: 600 }}>SALIDA</span>
              <span style={{ color: "#6b7280", fontSize: 12, marginLeft: 4 }}>(decrementa stock)</span>
            </label>
          </div>

          <div className="form-group" style={{ maxWidth: 480 }}>
            <label>Glosa <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
            <input
              type="text"
              placeholder="Ej: Corrección por conteo físico"
              value={form.glosa}
              onChange={(e) => setForm((p) => ({ ...p, glosa: e.target.value }))}
            />
          </div>

          {/* Banner informativo según tipo */}
          <div style={{
            marginTop: 8,
            padding: "8px 14px",
            borderRadius: 6,
            fontSize: 13,
            background: form.tipo === "ENTRADA" ? "#f0fdf4" : "#fef2f2",
            borderLeft: `4px solid ${form.tipo === "ENTRADA" ? "#22c55e" : "#ef4444"}`,
            color: form.tipo === "ENTRADA" ? "#14532d" : "#7f1d1d",
          }}>
            {form.tipo === "ENTRADA"
              ? "Las cantidades ingresadas se sumarán al stock actual de cada almacén."
              : "Las cantidades ingresadas se restarán del stock actual. El backend validará que no quede stock negativo."}
          </div>
        </div>

        {/* Detalle de productos */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3>Productos a Ajustar</h3>
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
            </table>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Link to="/ajustes" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaTimes /> Cancelar
          </Link>
          <button type="submit" className="btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaSave /> {submitting ? "Guardando..." : "Registrar Ajuste"}
          </button>
        </div>

      </form>
    </Layout>
  );
}

export default CreateAjuste;

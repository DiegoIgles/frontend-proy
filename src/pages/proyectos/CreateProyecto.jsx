import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { createProyectoAction } from "./actions/create-proyecto.action";
import { getProductosAction } from "../inventario/actions/get-productos.action";
import { getProductoStockAction } from "../inventario/actions/get-producto-stock.action";
import { FaArrowLeft, FaPlus, FaTimes, FaCheckCircle, FaSyncAlt } from "react-icons/fa";

function fmt(n) {
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

// ── Fila de producto ──────────────────────────────────────────

function ProductoRow({ index, fila, productos, onChange, onRemove }) {
  const [stockOptions, setStockOptions] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);

  useEffect(() => {
    if (!fila.productoId) { setStockOptions([]); return; }
    setLoadingStock(true);
    getProductoStockAction(fila.productoId)
      .then(setStockOptions)
      .catch(() => setStockOptions([]))
      .finally(() => setLoadingStock(false));
  }, [fila.productoId]);

  const stockSeleccionado = stockOptions.find((s) => s.productoAlmacenId === fila.productoAlmacenId);
  const subtotal = Number(fila.precioActual || 0) * Number(fila.cantidad || 0);

  return (
    <tr>
      {/* Producto */}
      <td>
        <select
          value={fila.productoId}
          onChange={(e) => onChange(index, "productoId", e.target.value)}
          required
          style={{ width: "100%", minWidth: 200 }}
        >
          <option value="">Seleccionar producto...</option>
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
          value={fila.productoAlmacenId}
          onChange={(e) => onChange(index, "productoAlmacenId", e.target.value)}
          required
          disabled={!fila.productoId || loadingStock}
          style={{ width: "100%", minWidth: 150 }}
        >
          <option value="">{loadingStock ? "Cargando..." : "Seleccionar almacén..."}</option>
          {stockOptions.map((s) => (
            <option key={s.productoAlmacenId} value={s.productoAlmacenId}>
              {s.almacen} (stock: {s.stock})
            </option>
          ))}
        </select>
      </td>

      {/* Stock disponible */}
      <td style={{ textAlign: "center" }}>
        {stockSeleccionado ? (
          <span style={{
            fontWeight: 600, fontSize: 13,
            color: stockSeleccionado.stock < Number(fila.cantidad) ? "#dc2626" : "#059669",
          }}>
            {stockSeleccionado.stock}
          </span>
        ) : "—"}
      </td>

      {/* Cantidad */}
      <td>
        <input
          type="number" min={1} value={fila.cantidad}
          onChange={(e) => onChange(index, "cantidad", e.target.value)}
          required
          style={{ width: 72, textAlign: "right", padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 6 }}
        />
      </td>

      {/* Precio unitario */}
      <td style={{ textAlign: "right", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
        {fila.precioActual > 0 ? `Bs. ${fmt(fila.precioActual)}` : "—"}
      </td>

      {/* Subtotal */}
      <td style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap",
        color: subtotal > 0 ? "#111827" : "#9ca3af" }}>
        {subtotal > 0 ? `Bs. ${fmt(subtotal)}` : "—"}
      </td>

      {/* Eliminar */}
      <td style={{ textAlign: "center" }}>
        <button type="button" onClick={() => onRemove(index)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 14, padding: "4px 8px" }}>
          <FaTimes />
        </button>
      </td>
    </tr>
  );
}

// ── Página principal ──────────────────────────────────────────

const FILA_VACIA = () => ({ productoId: "", productoAlmacenId: "", cantidad: 1, precioActual: 0 });

function CreateProyecto() {
  const navigate = useNavigate();
  const [productos, setProductos]     = useState([]);
  const [filas, setFilas]             = useState([]);
  const [submitting, setSubmitting]   = useState(false);
  const [montoOverride, setMontoOverride] = useState(false);
  const [form, setForm] = useState({
    nombre: "", descripcion: "", fechaInicio: "", fechaFinal: "",
    manoObra: "", costoExtra: "", montoFinal: "",
  });

  useEffect(() => {
    getProductosAction().then(setProductos).catch(console.error);
  }, []);

  // Totales derivados
  const totalProductos = filas.reduce(
    (s, f) => s + Number(f.precioActual || 0) * Number(f.cantidad || 0), 0
  );
  const totalCalculado = totalProductos + Number(form.manoObra || 0) + Number(form.costoExtra || 0);

  // Auto-rellena montoFinal a menos que el usuario lo haya editado manualmente
  useEffect(() => {
    if (!montoOverride) {
      setForm((p) => ({ ...p, montoFinal: totalCalculado > 0 ? totalCalculado.toFixed(2) : "" }));
    }
  }, [totalCalculado, montoOverride]);

  const set = (k) => (e) => {
    const val = e.target.value;
    if (k === "montoFinal") setMontoOverride(true);
    setForm((p) => ({ ...p, [k]: val }));
  };

  const recalcularMonto = () => {
    setMontoOverride(false);
    setForm((p) => ({ ...p, montoFinal: totalCalculado > 0 ? totalCalculado.toFixed(2) : "" }));
  };

  const addFila = () => setFilas((prev) => [...prev, FILA_VACIA()]);

  const updateFila = (index, field, value) =>
    setFilas((prev) =>
      prev.map((f, i) => {
        if (i !== index) return f;
        if (field === "productoId") {
          const prod = productos.find((p) => p.productoId === value);
          return { ...f, productoId: value, productoAlmacenId: "", precioActual: prod?.precioActual ?? 0 };
        }
        return { ...f, [field]: value };
      })
    );

  const removeFila = (index) => setFilas((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { alert("El nombre es obligatorio."); return; }
    if (!form.fechaInicio)   { alert("La fecha de inicio es obligatoria."); return; }

    const productosValidos = filas.filter(
      (f) => f.productoId && f.productoAlmacenId && Number(f.cantidad) >= 1
    );

    const dto = {
      nombre:      form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      fechaInicio: form.fechaInicio,
      fechaFinal:  form.fechaFinal  || undefined,
      manoObra:    form.manoObra    ? Number(form.manoObra)   : undefined,
      costoExtra:  form.costoExtra  ? Number(form.costoExtra) : undefined,
      montoFinal:  form.montoFinal  ? Number(form.montoFinal) : undefined,
      productos:   productosValidos.length > 0
        ? productosValidos.map(({ productoAlmacenId, cantidad }) => ({ productoAlmacenId, cantidad: Number(cantidad) }))
        : undefined,
    };

    try {
      setSubmitting(true);
      const created = await createProyectoAction(dto);
      navigate(`/proyectos/${created.proyectoId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear la cotización");
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn-secondary" onClick={() => navigate("/proyectos")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaArrowLeft /> Volver
          </button>
          <h1 style={{ margin: 0 }}>Nueva Cotización / Proyecto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Datos principales */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Datos del Proyecto</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Nombre *</label>
              <input type="text" placeholder="Ej: Instalación Solar 10kW - Casa García"
                value={form.nombre} onChange={set("nombre")} required />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Descripción <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
              <input type="text" placeholder="Descripción del alcance del proyecto"
                value={form.descripcion} onChange={set("descripcion")} />
            </div>
            <div className="form-group">
              <label>Fecha de Inicio *</label>
              <input type="date" value={form.fechaInicio} onChange={set("fechaInicio")} required />
            </div>
            <div className="form-group">
              <label>Fecha Final <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
              <input type="date" value={form.fechaFinal} onChange={set("fechaFinal")} />
            </div>
          </div>
        </div>

        {/* Productos estimados */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>
              Productos Estimados
              <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 400, color: "#6b7280" }}>(opcional)</span>
            </h3>
            <button type="button" className="btn-secondary" onClick={addFila}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <FaPlus /> Agregar producto
            </button>
          </div>

          {filas.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
              Sin productos agregados. Puedes añadirlos ahora o editarlos después.
            </p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Almacén</th>
                      <th style={{ textAlign: "center" }}>Stock</th>
                      <th style={{ textAlign: "right" }}>Cant.</th>
                      <th style={{ textAlign: "right" }}>Precio Unit.</th>
                      <th style={{ textAlign: "right" }}>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((fila, i) => (
                      <ProductoRow
                        key={i}
                        index={i}
                        fila={fila}
                        productos={productos}
                        onChange={updateFila}
                        onRemove={removeFila}
                      />
                    ))}
                  </tbody>
                  {totalProductos > 0 && (
                    <tfoot>
                      <tr style={{ borderTop: "2px solid #e5e7eb" }}>
                        <td colSpan={5} style={{ textAlign: "right", fontSize: 13, color: "#6b7280", fontWeight: 600, paddingTop: 10 }}>
                          Total productos:
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 800, fontSize: 15, paddingTop: 10, whiteSpace: "nowrap" }}>
                          Bs. {fmt(totalProductos)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </>
          )}
        </div>

        {/* Presupuesto — ahora debajo de productos para que el cálculo tenga sentido */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Presupuesto</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            <div className="form-group">
              <label>Mano de Obra (Bs.) <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
              <input type="number" min={0} step="0.01" placeholder="0.00"
                value={form.manoObra} onChange={set("manoObra")} />
            </div>

            <div className="form-group">
              <label>Costos Extra (Bs.) <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
              <input type="number" min={0} step="0.01" placeholder="0.00"
                value={form.costoExtra} onChange={set("costoExtra")} />
            </div>

            <div className="form-group">
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Monto Final Cotizado (Bs.)</span>
                {montoOverride && (
                  <button type="button" onClick={recalcularMonto}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#1d4ed8", fontSize: 12, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                    <FaSyncAlt /> Recalcular
                  </button>
                )}
              </label>
              <input type="number" min={0} step="0.01" placeholder="0.00"
                value={form.montoFinal} onChange={set("montoFinal")} />
              {/* Desglose del cálculo automático */}
              {totalCalculado > 0 && (
                <div style={{ marginTop: 6, padding: "8px 10px", background: "#f0fdf4", borderRadius: 6, border: "1px solid #bbf7d0" }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#166534" }}>
                    <strong>Cálculo automático:</strong>{" "}
                    {totalProductos > 0 && `Productos Bs. ${fmt(totalProductos)}`}
                    {totalProductos > 0 && Number(form.manoObra) > 0 && " + "}
                    {Number(form.manoObra) > 0 && `M.O. Bs. ${fmt(form.manoObra)}`}
                    {(totalProductos > 0 || Number(form.manoObra) > 0) && Number(form.costoExtra) > 0 && " + "}
                    {Number(form.costoExtra) > 0 && `Extra Bs. ${fmt(form.costoExtra)}`}
                    {" = "}<strong>Bs. {fmt(totalCalculado)}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={() => navigate("/proyectos")} className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaTimes /> Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaCheckCircle /> {submitting ? "Creando..." : "Crear Cotización"}
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default CreateProyecto;

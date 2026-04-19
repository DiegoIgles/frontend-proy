import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/Pagination";
import { getProyectosAction } from "./actions/get-proyectos.action";
import {
  FaPlus, FaTimes, FaSearch, FaFilter,
  FaProjectDiagram, FaFileAlt, FaCalendarAlt, FaUser, FaChevronDown, FaChevronUp,
} from "react-icons/fa";

function fmt(n) {
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-BO");
}

function EstadoBadge({ estado }) {
  const s = estado === "COTIZACION"
    ? { background: "#fef3c7", color: "#92400e" }
    : { background: "#dbeafe", color: "#1e40af" };
  return (
    <span style={{ ...s, padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
      {estado === "COTIZACION" ? "Cotización" : "Proyecto"}
    </span>
  );
}

// ── Tarjeta de proyecto ───────────────────────────────────────

function ProyectoCard({ p, onClick }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: "pointer", transition: "box-shadow 0.2s",
        borderLeft: `4px solid ${p.estado === "PROYECTO" ? "#1d4ed8" : "#d97706"}`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = ""}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827", flex: 1, minWidth: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 10 }}>
          {p.nombre}
        </p>
        <EstadoBadge estado={p.estado} />
      </div>

      {p.descripcion && (
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.descripcion}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 12 }}>
        <MetaItem icon={<FaCalendarAlt />} label="Inicio" value={fmtDate(p.fechaInicio)} />
        <MetaItem icon={<FaCalendarAlt />} label="Final"  value={fmtDate(p.fechaFinal)} />
        <MetaItem icon={<FaUser />}        label="Resp."  value={`${p.usuario.name} ${p.usuario.lastName}`} />
        <MetaItem label="Productos" value={`${p.proyectoProductoAlmacenes?.length ?? 0} ítem(s)`} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 12, paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
        <span style={{ fontSize: 11, color: "#6b7280" }}>Monto cotizado</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
          {p.montoFinal ? `Bs. ${fmt(p.montoFinal)}` : "—"}
        </span>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {icon && <span style={{ color: "#9ca3af", fontSize: 11 }}>{icon}</span>}
      <span style={{ color: "#6b7280" }}>{label}:</span>
      <span style={{ fontWeight: 600, color: "#374151" }}>{value}</span>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────

function Proyectos() {
  const navigate = useNavigate();

  // Filtros principales
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");

  // Filtros avanzados
  const [showAdvanced,    setShowAdvanced]    = useState(false);
  const [fechaInicioDesde, setFechaInicioDesde] = useState("");
  const [fechaInicioHasta, setFechaInicioHasta] = useState("");
  const [fechaFinalDesde,  setFechaFinalDesde]  = useState("");
  const [fechaFinalHasta,  setFechaFinalHasta]  = useState("");

  // Paginación
  const [limit,  setLimit]  = useState(10);
  const [offset, setOffset] = useState(0);

  // Datos
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProyectosAction({
        search:           search           || undefined,
        estado:           estado           || undefined,
        fechaInicioDesde: fechaInicioDesde || undefined,
        fechaInicioHasta: fechaInicioHasta || undefined,
        fechaFinalDesde:  fechaFinalDesde  || undefined,
        fechaFinalHasta:  fechaFinalHasta  || undefined,
        limit,
        offset,
      });
      // Soporta tanto array plano como objeto paginado {data, total}
      if (Array.isArray(data)) {
        setResult({ data, total: data.length, limit, offset });
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [search, estado, fechaInicioDesde, fechaInicioHasta, fechaFinalDesde, fechaFinalHasta, limit, offset]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const applyFilter = (setter) => (val) => { setter(val); setOffset(0); };

  const hasAdvanced = fechaInicioDesde || fechaInicioHasta || fechaFinalDesde || fechaFinalHasta;
  const hasAnyFilter = search || estado || hasAdvanced;

  const clearAll = () => {
    applyFilter(setSearch)("");
    applyFilter(setEstado)("");
    applyFilter(setFechaInicioDesde)("");
    applyFilter(setFechaInicioHasta)("");
    applyFilter(setFechaFinalDesde)("");
    applyFilter(setFechaFinalHasta)("");
  };

  const proyectos    = result?.data ?? [];
  const cotizaciones = proyectos.filter((p) => p.estado === "COTIZACION");
  const enEjecucion  = proyectos.filter((p) => p.estado === "PROYECTO");

  return (
    <Layout>
      <div className="page-header">
        <h1>Gestión de Proyectos</h1>
        <button className="btn-primary" onClick={() => navigate("/proyectos/crear")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Cotización
        </button>
      </div>

      {/* Métricas rápidas */}
      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total (filtro actual)</p>
            <p style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#111827" }}>{result.total}</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Cotizaciones</p>
            <p style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#d97706" }}>{cotizaciones.length}</p>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>en esta página</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>En Ejecución</p>
            <p style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#1d4ed8" }}>{enEjecucion.length}</p>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>en esta página</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 20 }}>

        {/* Fila principal */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>

          {/* Búsqueda */}
          <div className="form-group" style={{ flex: "1 1 220px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
              <input
                type="text" placeholder="Nombre o descripción..."
                value={search}
                onChange={(e) => applyFilter(setSearch)(e.target.value)}
                style={{ paddingLeft: 32, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="form-group" style={{ flex: "0 1 180px", margin: 0 }}>
            <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Estado</label>
            <select value={estado} onChange={(e) => applyFilter(setEstado)(e.target.value)}>
              <option value="">Todos</option>
              <option value="COTIZACION">Cotización</option>
              <option value="PROYECTO">Proyecto</option>
            </select>
          </div>

          {/* Toggle filtros avanzados */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1,
              color: hasAdvanced ? "#1d4ed8" : undefined,
              borderColor: hasAdvanced ? "#1d4ed8" : undefined }}
          >
            <FaFilter /> Fechas {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
            {hasAdvanced && <span style={{ background: "#1d4ed8", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {[fechaInicioDesde, fechaInicioHasta, fechaFinalDesde, fechaFinalHasta].filter(Boolean).length}
            </span>}
          </button>

          {hasAnyFilter && (
            <button className="btn-secondary" onClick={clearAll}
              style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
              <FaTimes /> Limpiar todo
            </button>
          )}
        </div>

        {/* Filtros avanzados — fecha de inicio y fecha final */}
        {showAdvanced && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f3f4f6",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Inicio desde</label>
              <input type="date" value={fechaInicioDesde}
                onChange={(e) => applyFilter(setFechaInicioDesde)(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Inicio hasta</label>
              <input type="date" value={fechaInicioHasta}
                onChange={(e) => applyFilter(setFechaInicioHasta)(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Finalización desde</label>
              <input type="date" value={fechaFinalDesde}
                onChange={(e) => applyFilter(setFechaFinalDesde)(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Finalización hasta</label>
              <input type="date" value={fechaFinalHasta}
                onChange={(e) => applyFilter(setFechaFinalHasta)(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      {loading && <p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Cargando...</p>}
      {error   && <p style={{ color: "#dc2626", textAlign: "center", padding: 40 }}>Error al cargar los proyectos.</p>}

      {!loading && !error && (
        <>
          {proyectos.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: "#6b7280", margin: 0 }}>No se encontraron proyectos con los filtros aplicados.</p>
            </div>
          ) : (
            <>
              {/* Cotizaciones */}
              {cotizaciones.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 13, color: "#92400e", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.5px", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <FaFileAlt /> Cotizaciones ({cotizaciones.length})
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {cotizaciones.map((p) => (
                      <ProyectoCard key={p.proyectoId} p={p} onClick={() => navigate(`/proyectos/${p.proyectoId}`)} />
                    ))}
                  </div>
                </section>
              )}

              {/* Proyectos en ejecución */}
              {enEjecucion.length > 0 && (
                <section style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: 13, color: "#1e40af", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.5px", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <FaProjectDiagram /> En Ejecución ({enEjecucion.length})
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {enEjecucion.map((p) => (
                      <ProyectoCard key={p.proyectoId} p={p} onClick={() => navigate(`/proyectos/${p.proyectoId}`)} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Paginación */}
          {result && result.total > 0 && (
            <div className="card" style={{ marginTop: 8 }}>
              <Pagination
                total={result.total}
                limit={limit}
                offset={offset}
                onLimitChange={(l) => { setLimit(l); setOffset(0); }}
                onOffsetChange={setOffset}
              />
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default Proyectos;

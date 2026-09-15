import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getCotizacionesTecnicasAction, deleteCotizacionTecnicaAction, descargarExcelTecnicaAction } from "./actions/cotizaciones-tecnicas.actions";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { MONEDAS } from "../cotizaciones-manuales/shared/monedas";
import { fmt } from "./calculo";
import {
  FaTimes, FaSearch, FaCalculator, FaEdit, FaTrash, FaFileExcel, FaPrint,
  FaCalendarAlt, FaUser, FaSolarPanel, FaFileContract,
} from "react-icons/fa";

function fmtDate(d) {
  if (!d) return "—";
  return new Date(String(d).slice(0, 10) + "T00:00:00").toLocaleDateString("es-BO");
}

function btnAction(color) {
  return {
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 10px", fontSize: 12, fontWeight: 600,
    background: "#fff", color, border: `1px solid ${color}`,
    borderRadius: 6, cursor: "pointer",
  };
}

function MetaItem({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
      {icon && <span style={{ color: "#9ca3af", fontSize: 11 }}>{icon}</span>}
      <span style={{ color: "#6b7280" }}>{label}:</span>
      <span style={{ fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

// ── Tarjeta ───────────────────────────────────────────────────

function TarjetaTecnica({ c, onEdit, onPrint, onExcel, onDelete, onComercial, deleting }) {
  const sim = (MONEDAS[c.moneda] ?? MONEDAS.BS).simbolo;
  const r = c.resumen ?? {};
  return (
    <div className="card" style={{ borderLeft: "4px solid #0f2a4a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#0f2a4a", fontFamily: "monospace" }}>{c.nroPropuesta}</p>
          {c.titulo && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{c.titulo}</p>}
        </div>
        <span style={{ display: "flex", gap: 6 }}>
          {c.versionActual > 1 && (
            <span style={{ background: "#e0f2fe", color: "#075985", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>v{c.versionActual}</span>
          )}
          <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>Técnica</span>
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "6px 12px", fontSize: 12 }}>
        <MetaItem icon={<FaUser />} label="Cliente" value={c.nombreCliente} />
        <MetaItem icon={<FaCalendarAlt />} label="Fecha" value={fmtDate(c.fecha)} />
        <MetaItem icon={<FaSolarPanel />} label="Potencia" value={`${fmt(r.potenciaKw)} kWp`} />
        <MetaItem label="Ítems" value={c.cantidadItems ?? 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid #f3f4f6", fontSize: 12 }}>
        <div>
          <span style={{ display: "block", fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Costos</span>
          <span style={{ fontWeight: 700, color: "#374151" }}>{sim} {fmt(r.totalCostos)}</span>
        </div>
        <div>
          <span style={{ display: "block", fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Total proyecto</span>
          <span style={{ fontWeight: 800, color: "#0f2a4a", fontSize: 14 }}>{sim} {fmt(r.totalProyecto)}</span>
        </div>
        <div>
          <span style={{ display: "block", fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Margen</span>
          <span style={{ fontWeight: 700, color: "#15803d" }}>{fmt((r.margen ?? 0) * 100, 1)} %</span>
        </div>
      </div>

      {c.cotizacionManual && (
        <p style={{ margin: "8px 0 0", fontSize: 11, color: "#0369a1", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={onComercial}>
          <FaFileContract /> Comercial vinculada: {c.cotizacionManual.nroPropuesta} (v{c.cotizacionManual.versionActual})
        </p>
      )}

      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={onEdit} style={btnAction("#6b7280")} title="Editar"><FaEdit /> Editar</button>
        <button onClick={onPrint} style={btnAction("#1d4ed8")} title="Vista técnica / imprimir"><FaPrint /> Ver</button>
        <button onClick={onExcel} style={btnAction("#15803d")} title="Descargar Excel"><FaFileExcel /> Excel</button>
        <button onClick={onDelete} disabled={deleting} style={{ ...btnAction("#dc2626"), marginLeft: "auto" }} title="Eliminar"><FaTrash /></button>
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────

function CotizacionesTecnicas() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCotizacionesTecnicasAction({ search: search || undefined });
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (c) => {
    const ok = await confirm({
      title: "Eliminar cotización técnica",
      message: `¿Eliminar la hoja técnica ${c.nroPropuesta} de ${c.nombreCliente}? La cotización comercial no se toca; podés volver a generar la hoja desde ella.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    try {
      setDeleting(c.cotizacionTecnicaId);
      await deleteCotizacionTecnicaAction(c.cotizacionTecnicaId);
      toast.success("Cotización técnica eliminada.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  };

  const handleExcel = async (c) => {
    try {
      await descargarExcelTecnicaAction(c.cotizacionTecnicaId, `${c.nroPropuesta}_costos.xlsx`);
    } catch {
      toast.error("No se pudo descargar el Excel.");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Hojas Técnicas de Costos</h1>
        <button className="btn-secondary" onClick={() => navigate("/cotizaciones-manuales")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaFileContract /> Ir a cotizaciones comerciales
        </button>
      </div>

      <p style={{ margin: "-6px 0 14px", fontSize: 12, color: "#6b7280" }}>
        Cada cotización comercial tiene su hoja técnica (equivale a la pestaña <em>03_COSTOS P</em> del Excel): se crea sola al crear la
        comercial. Acá ingeniería carga materiales y costos por sección; el cierre financiero calcula el precio de venta y se envía a la comercial.
      </p>

      <div className="filters-bar">
        <div className="filter-field filter-search" style={{ flex: "1 1 280px" }}>
          <label>Buscar</label>
          <FaSearch className="filter-search-icon" />
          <input type="text" placeholder="Nro de propuesta, cliente o título..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {search && (
          <button className="filters-bar-clear" onClick={() => setSearch("")}><FaTimes /> Limpiar</button>
        )}
      </div>

      {loading && <p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Cargando...</p>}
      {error && <p style={{ color: "#dc2626", textAlign: "center", padding: 40 }}>Error al cargar las cotizaciones técnicas.</p>}

      {!loading && !error && (
        data.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <FaCalculator style={{ fontSize: 36, color: "#d1d5db", marginBottom: 10 }} />
            <p style={{ color: "#6b7280", margin: 0 }}>No hay hojas técnicas. Se crean solas al crear una cotización comercial (o con "Hoja técnica" en una existente).</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {data.map((c) => (
              <TarjetaTecnica
                key={c.cotizacionTecnicaId}
                c={c}
                deleting={deleting === c.cotizacionTecnicaId}
                onEdit={() => navigate(`/cotizaciones-tecnicas/${c.cotizacionTecnicaId}/editar`)}
                onPrint={() => navigate(`/cotizaciones-tecnicas/${c.cotizacionTecnicaId}/ver`)}
                onExcel={() => handleExcel(c)}
                onDelete={() => handleDelete(c)}
                onComercial={() => c.cotizacionManual && navigate(`/cotizaciones-manuales/${c.cotizacionManual.cotizacionManualId}/imprimir`)}
              />
            ))}
          </div>
        )
      )}
    </Layout>
  );
}

export default CotizacionesTecnicas;

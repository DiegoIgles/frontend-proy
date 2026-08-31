import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getCotizacionesManualesAction } from "./actions/get-cotizaciones.action";
import { deleteCotizacionManualAction } from "./actions/delete-cotizacion.action";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import {
  FaPlus, FaTimes, FaSearch, FaFileContract, FaPrint, FaEdit, FaTrash,
  FaCalendarAlt, FaUser, FaSolarPanel,
} from "react-icons/fa";

function fmt(n) {
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-BO");
}

// ── Tarjeta de cotización manual ──────────────────────────────

function CotizacionCard({ c, onPrint, onEdit, onDelete, deleting }) {
  return (
    <div
      className="card"
      style={{ borderLeft: "4px solid #16a34a", transition: "box-shadow 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#0f2a4a", fontFamily: "monospace" }}>
          {c.nroPropuesta}
        </p>
        <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 10px",
          borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
          Manual
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "6px 12px", fontSize: 12 }}>
        <MetaItem icon={<FaUser />} label="Cliente" value={c.nombreCliente} />
        <MetaItem icon={<FaCalendarAlt />} label="Fecha" value={fmtDate(c.fecha)} />
        <MetaItem icon={<FaSolarPanel />} label="Paneles" value={`${c.cantidadPaneles} und.`} />
        <MetaItem label="Potencia" value={`${fmt(c.potenciaInstalada)} kWp`} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 12, paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
        <span style={{ fontSize: 11, color: "#6b7280" }}>Total cotizado</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: "#0f2a4a" }}>
          {c.total ? `Bs. ${fmt(c.total)}` : "—"}
        </span>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onPrint} title="Imprimir / PDF" style={btnAction("#1d4ed8")}>
          <FaPrint /> Imprimir
        </button>
        <button onClick={onEdit} title="Editar" style={btnAction("#6b7280")}>
          <FaEdit /> Editar
        </button>
        <button onClick={onDelete} disabled={deleting} title="Eliminar" style={btnAction("#dc2626")}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

function btnAction(color) {
  return {
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 12px", fontSize: 12, fontWeight: 600,
    background: "#fff", color, border: `1px solid ${color}`,
    borderRadius: 6, cursor: "pointer",
  };
}

function MetaItem({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
      {icon && <span style={{ color: "#9ca3af", fontSize: 11 }}>{icon}</span>}
      <span style={{ color: "#6b7280" }}>{label}:</span>
      <span style={{ fontWeight: 600, color: "#374151", overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────

function CotizacionesManuales() {
  const navigate = useNavigate();
  const toast    = useToast();
  const confirm  = useConfirm();

  const [search,   setSearch]   = useState("");
  const [data,     setData]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCotizacionesManualesAction({ search: search || undefined });
      setData(Array.isArray(result) ? result : (result.data ?? []));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300); // debounce búsqueda
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDelete = async (c) => {
    const ok = await confirm({
      title: "Eliminar cotización",
      message: `¿Eliminar la cotización ${c.nroPropuesta} de ${c.nombreCliente}?`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    try {
      setDeleting(c.cotizacionManualId);
      await deleteCotizacionManualAction(c.cotizacionManualId);
      toast.success("Cotización eliminada correctamente.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar la cotización");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Cotizaciones Manuales</h1>
        <button className="btn-primary" onClick={() => navigate("/cotizaciones-manuales/crear")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Cotización Manual
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-field filter-search" style={{ flex: "1 1 280px" }}>
          <label>Buscar</label>
          <FaSearch className="filter-search-icon" />
          <input
            type="text" placeholder="Nro de propuesta o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <button className="filters-bar-clear" onClick={() => setSearch("")}>
            <FaTimes /> Limpiar
          </button>
        )}
      </div>

      {/* Contenido */}
      {loading && <p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Cargando...</p>}
      {error   && <p style={{ color: "#dc2626", textAlign: "center", padding: 40 }}>Error al cargar las cotizaciones.</p>}

      {!loading && !error && (
        data.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <FaFileContract style={{ fontSize: 36, color: "#d1d5db", marginBottom: 10 }} />
            <p style={{ color: "#6b7280", margin: 0 }}>
              No se encontraron cotizaciones manuales. Crea la primera con el botón superior.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {data.map((c) => (
              <CotizacionCard
                key={c.cotizacionManualId}
                c={c}
                deleting={deleting === c.cotizacionManualId}
                onPrint={() => navigate(`/cotizaciones-manuales/${c.cotizacionManualId}/imprimir`)}
                onEdit={() => navigate(`/cotizaciones-manuales/${c.cotizacionManualId}/editar`)}
                onDelete={() => handleDelete(c)}
              />
            ))}
          </div>
        )
      )}
    </Layout>
  );
}

export default CotizacionesManuales;

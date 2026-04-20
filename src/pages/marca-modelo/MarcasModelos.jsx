import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import {
  getMarcasAction, createMarcaAction, updateMarcaAction, deleteMarcaAction,
} from "./actions/marcas.action";
import {
  getModelosAction, createModeloAction, updateModeloAction, deleteModeloAction,
} from "./actions/modelos.action";
import {
  getMarcaModelosAction, createMarcaModeloAction, deleteMarcaModeloAction,
} from "./actions/marca-modelos.action";
import { FaTrademark, FaPlus, FaEdit, FaTrash, FaLink, FaUnlink, FaTag } from "react-icons/fa";

// ── helpers ──────────────────────────────────────────────────────────────────

function TabBtn({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 20px", border: "none", cursor: "pointer", fontWeight: 600,
      fontSize: 13, background: "none",
      borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
      color: active ? "#3b82f6" : "#6b7280",
    }}>
      {icon} {label}
    </button>
  );
}

function ActionBtn({ onClick, disabled, color = "#6c757d", bg = "#f3f4f6", children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 10px", borderRadius: 6, border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      background: bg, color, fontWeight: 600, fontSize: 12,
    }}>
      {children}
    </button>
  );
}

// ── modales genéricos ─────────────────────────────────────────────────────────

function NombreModal({ title, value, onChange, onSave, onClose, saving, error }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 360 }}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div className="modal-body">
            <label>Nombre *</label>
            <input value={value} onChange={(e) => onChange(e.target.value)}
              placeholder="Ej: Victron Energy" autoFocus />
            {error && <p style={{ margin: "8px 0 0", color: "#dc2626", fontSize: 13 }}>{error}</p>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── componente principal ──────────────────────────────────────────────────────

function MarcasModelos() {
  const [tab, setTab] = useState("marcas");

  // datos
  const [marcas,       setMarcas]       = useState([]);
  const [modelos,      setModelos]      = useState([]);
  const [combinaciones,setCombinaciones]= useState([]);
  const [loading,      setLoading]      = useState(true);

  // modal nombre (marca / modelo)
  const [modal, setModal] = useState(null);
  // { mode: "createMarca"|"editMarca"|"createModelo"|"editModelo", item: {id,nombre} }
  const [modalNombre, setModalNombre] = useState("");
  const [modalSaving, setModalSaving] = useState(false);
  const [modalErr,    setModalErr]    = useState("");

  // modal combinación
  const [showCombo,  setShowCombo]  = useState(false);
  const [comboMarca, setComboMarca] = useState("");
  const [comboModelo,setComboModelo]= useState("");
  const [comboSaving,setComboSaving]= useState(false);
  const [comboErr,   setComboErr]   = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [m, mo, c] = await Promise.all([
        getMarcasAction(),
        getModelosAction(),
        getMarcaModelosAction(),
      ]);
      setMarcas(Array.isArray(m) ? m : []);
      setModelos(Array.isArray(mo) ? mo : []);
      setCombinaciones(Array.isArray(c) ? c : []);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── acciones nombre ──
  const openCreate = (type) => {
    setModal({ mode: type === "marca" ? "createMarca" : "createModelo" });
    setModalNombre(""); setModalErr("");
  };

  const openEdit = (type, item) => {
    setModal({ mode: type === "marca" ? "editMarca" : "editModelo", item });
    setModalNombre(item.nombre); setModalErr("");
  };

  const handleSaveNombre = async () => {
    if (!modalNombre.trim()) { setModalErr("El nombre es obligatorio."); return; }
    setModalErr(""); setModalSaving(true);
    try {
      const dto = { nombre: modalNombre.trim() };
      if (modal.mode === "createMarca")  await createMarcaAction(dto);
      if (modal.mode === "editMarca")    await updateMarcaAction(modal.item.marcaId ?? modal.item.id, dto);
      if (modal.mode === "createModelo") await createModeloAction(dto);
      if (modal.mode === "editModelo")   await updateModeloAction(modal.item.modeloId ?? modal.item.id, dto);
      setModal(null);
      fetchAll();
    } catch (err) {
      setModalErr(err.response?.data?.message || "Error al guardar");
    } finally {
      setModalSaving(false);
    }
  };

  const handleDelete = async (type, id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      if (type === "marca")  await deleteMarcaAction(id);
      if (type === "modelo") await deleteModeloAction(id);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    }
  };

  // ── acciones combinación ──
  const handleSaveCombo = async (e) => {
    e.preventDefault();
    setComboErr("");
    if (!comboMarca || !comboModelo) { setComboErr("Selecciona marca y modelo."); return; }
    setComboSaving(true);
    try {
      await createMarcaModeloAction({ marcaId: comboMarca, modeloId: comboModelo });
      setShowCombo(false); setComboMarca(""); setComboModelo("");
      fetchAll();
    } catch (err) {
      setComboErr(err.response?.data?.message || "Error al vincular");
    } finally {
      setComboSaving(false);
    }
  };

  const handleDeleteCombo = async (id, label) => {
    if (!window.confirm(`¿Eliminar combinación "${label}"?`)) return;
    try {
      await deleteMarcaModeloAction(id);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    }
  };

  // ── resumen ──────────────────────────────────────────────────────────────
  const titleFor = () => {
    if (!modal) return "";
    if (modal.mode === "createMarca")  return "Nueva Marca";
    if (modal.mode === "editMarca")    return "Editar Marca";
    if (modal.mode === "createModelo") return "Nuevo Modelo";
    return "Editar Modelo";
  };

  return (
    <Layout>
      <div className="page-header">
        <h1><FaTrademark style={{ marginRight: 8 }} />Marcas y Modelos</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {tab === "marcas" && (
            <button className="btn-primary" onClick={() => openCreate("marca")}
              style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaPlus /> Nueva Marca
            </button>
          )}
          {tab === "modelos" && (
            <button className="btn-primary" onClick={() => openCreate("modelo")}
              style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaPlus /> Nuevo Modelo
            </button>
          )}
          {tab === "combinaciones" && (
            <button className="btn-primary"
              onClick={() => { setComboMarca(""); setComboModelo(""); setComboErr(""); setShowCombo(true); }}
              style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaLink /> Vincular Marca-Modelo
            </button>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Marcas",        value: marcas.length,        color: "#1d4ed8" },
          { label: "Modelos",       value: modelos.length,       color: "#7c3aed" },
          { label: "Combinaciones", value: combinaciones.length, color: "#059669" },
        ].map((m) => (
          <div key={m.label} className="card" style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6b7280",
              textTransform: "uppercase", fontWeight: 600 }}>{m.label}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", paddingLeft: 4 }}>
          <TabBtn label="Marcas"        icon={<FaTrademark />} active={tab === "marcas"}        onClick={() => setTab("marcas")} />
          <TabBtn label="Modelos"       icon={<FaTag />}       active={tab === "modelos"}       onClick={() => setTab("modelos")} />
          <TabBtn label="Combinaciones" icon={<FaLink />}      active={tab === "combinaciones"} onClick={() => setTab("combinaciones")} />
        </div>

        <div style={{ padding: 20 }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#9ca3af" }}>Cargando...</p>
          ) : (

            /* ── Tab Marcas ── */
            tab === "marcas" ? (
              marcas.length === 0
                ? <p style={{ textAlign: "center", color: "#9ca3af" }}>No hay marcas registradas.</p>
                : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Marca</th>
                        <th>Modelos vinculados</th>
                        <th style={{ textAlign: "center" }}>Combinaciones</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marcas.map((m) => (
                        <tr key={m.marcaId}>
                          <td style={{ fontWeight: 700 }}>{m.nombre}</td>
                          <td>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {m.marcaModelos?.map((mm) => (
                                <span key={mm.marcaModeloId} style={{
                                  padding: "2px 10px", borderRadius: 10, fontSize: 12,
                                  background: "#ede9fe", color: "#5b21b6", fontWeight: 600,
                                }}>
                                  {mm.modelo?.nombre}
                                </span>
                              ))}
                              {!m.marcaModelos?.length && <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>}
                            </div>
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 700 }}>
                            {m.marcaModelos?.length ?? 0}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <ActionBtn onClick={() => openEdit("marca", m)} bg="#dbeafe" color="#1e40af">
                                <FaEdit /> Editar
                              </ActionBtn>
                              <ActionBtn onClick={() => handleDelete("marca", m.marcaId, m.nombre)}
                                bg="#fee2e2" color="#991b1b">
                                <FaTrash /> Eliminar
                              </ActionBtn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )

            /* ── Tab Modelos ── */
            ) : tab === "modelos" ? (
              modelos.length === 0
                ? <p style={{ textAlign: "center", color: "#9ca3af" }}>No hay modelos registrados.</p>
                : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Modelo</th>
                        <th>Marcas vinculadas</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelos.map((m) => (
                        <tr key={m.modeloId}>
                          <td style={{ fontWeight: 700 }}>{m.nombre}</td>
                          <td>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {m.marcaModelos?.map((mm) => (
                                <span key={mm.marcaModeloId} style={{
                                  padding: "2px 10px", borderRadius: 10, fontSize: 12,
                                  background: "#dbeafe", color: "#1e40af", fontWeight: 600,
                                }}>
                                  {mm.marca?.nombre}
                                </span>
                              ))}
                              {!m.marcaModelos?.length && <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <ActionBtn onClick={() => openEdit("modelo", m)} bg="#dbeafe" color="#1e40af">
                                <FaEdit /> Editar
                              </ActionBtn>
                              <ActionBtn onClick={() => handleDelete("modelo", m.modeloId, m.nombre)}
                                bg="#fee2e2" color="#991b1b">
                                <FaTrash /> Eliminar
                              </ActionBtn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )

            /* ── Tab Combinaciones ── */
            ) : (
              combinaciones.length === 0
                ? <p style={{ textAlign: "center", color: "#9ca3af" }}>No hay combinaciones registradas.</p>
                : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinaciones.map((c) => (
                        <tr key={c.marcaModeloId}>
                          <td>
                            <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 12,
                              background: "#dbeafe", color: "#1e40af", fontWeight: 600 }}>
                              {c.marca?.nombre}
                            </span>
                          </td>
                          <td>
                            <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 12,
                              background: "#ede9fe", color: "#5b21b6", fontWeight: 600 }}>
                              {c.modelo?.nombre}
                            </span>
                          </td>
                          <td>
                            <ActionBtn
                              onClick={() => handleDeleteCombo(c.marcaModeloId, `${c.marca?.nombre} / ${c.modelo?.nombre}`)}
                              bg="#fee2e2" color="#991b1b">
                              <FaUnlink /> Desvincular
                            </ActionBtn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
            )
          )}
        </div>
      </div>

      {/* Modal nombre (crear/editar marca o modelo) */}
      {modal && (
        <NombreModal
          title={titleFor()}
          value={modalNombre}
          onChange={setModalNombre}
          onSave={handleSaveNombre}
          onClose={() => setModal(null)}
          saving={modalSaving}
          error={modalErr}
        />
      )}

      {/* Modal vincular marca-modelo */}
      {showCombo && (
        <div className="modal-backdrop" onClick={() => setShowCombo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Vincular Marca con Modelo</h3>
              <button className="modal-close" onClick={() => setShowCombo(false)}>×</button>
            </div>
            <form onSubmit={handleSaveCombo}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label>Marca *</label>
                  <select value={comboMarca} onChange={(e) => setComboMarca(e.target.value)}
                    style={{ width: "100%" }}>
                    <option value="">Selecciona una marca...</option>
                    {marcas.map((m) => (
                      <option key={m.marcaId} value={m.marcaId}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Modelo *</label>
                  <select value={comboModelo} onChange={(e) => setComboModelo(e.target.value)}
                    style={{ width: "100%" }}>
                    <option value="">Selecciona un modelo...</option>
                    {modelos.map((m) => (
                      <option key={m.modeloId} value={m.modeloId}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
                {comboErr && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{comboErr}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCombo(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={comboSaving}>
                  {comboSaving ? "Vinculando..." : "Vincular"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default MarcasModelos;

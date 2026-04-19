import React, { useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { uploadProfileImageAction } from "./auth/actions/upload-profile-image.action";
import { deleteProfileImageAction } from "./auth/actions/delete-profile-image.action";
import { updateGenderAction } from "./auth/actions/update-gender.action";
import {
  FaUserCircle, FaCamera, FaTimes, FaSave, FaCheckCircle,
} from "react-icons/fa";

const GENEROS = [
  { value: "",            label: "Sin especificar" },
  { value: "masculino",   label: "Masculino" },
  { value: "femenino",    label: "Femenino" },
  { value: "otro",        label: "Otro" },
];

function Avatar({ photoUrl, initiales, size = 100 }) {
  return photoUrl ? (
    <img
      src={photoUrl}
      alt="avatar"
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover",
        border: "3px solid #e5e7eb" }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "#1d4ed8", color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.32,
    }}>
      {initiales || <FaUserCircle style={{ fontSize: size * 0.55 }} />}
    </div>
  );
}

function Perfil() {
  const { user, refreshUser } = useAuth();
  const fileRef               = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingPhoto,  setDeletingPhoto]  = useState(false);

  const [gender,        setGender]        = useState(user?.profile?.gender ?? "");
  const [savingGender,  setSavingGender]  = useState(false);
  const [genderSaved,   setGenderSaved]   = useState(false);

  if (!user) return null;

  const profileId = user.profile?.id ?? user.profile?.profileId;
  const photoUrl  = previewUrl ?? (user.profile?.photo || null);
  const initiales = `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  // ── Foto ──────────────────────────────────────────────────

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploadingPhoto(true);
      await uploadProfileImageAction(profileId, selectedFile, gender);
      await refreshUser();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error al subir la foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDeletePhoto = async () => {
    if (!user.profile?.photo) return;
    if (!window.confirm("¿Eliminar tu foto de perfil?")) return;
    try {
      setDeletingPhoto(true);
      await deleteProfileImageAction(profileId);
      await refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la foto");
    } finally {
      setDeletingPhoto(false);
    }
  };

  // ── Género ────────────────────────────────────────────────

  const handleSaveGender = async () => {
    try {
      setSavingGender(true);
      await updateGenderAction(profileId, gender);
      await refreshUser();
      setGenderSaved(true);
      setTimeout(() => setGenderSaved(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar el género");
    } finally {
      setSavingGender(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Mi Perfil</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, maxWidth: 820 }}>

        {/* ── Tarjeta foto ── */}
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <Avatar photoUrl={photoUrl} initiales={initiales} size={100} />

            {/* Botón cámara */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 30, height: 30, borderRadius: "50%",
                background: "#1d4ed8", color: "#fff", border: "2px solid #fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13,
              }}
              title="Cambiar foto"
            >
              <FaCamera />
            </button>
          </div>

          <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16 }}>
            {user.name} {user.lastName}
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>{user.email}</p>

          <span style={{
            display: "inline-block", padding: "3px 12px", borderRadius: 12, fontSize: 12,
            fontWeight: 700, background: user.roles?.includes("admin") ? "#dbeafe" : "#f3f4f6",
            color: user.roles?.includes("admin") ? "#1e40af" : "#374151",
          }}>
            {user.roles?.includes("admin") ? "Administrador" : "Usuario"}
          </span>

          {/* Input oculto */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Previsualización pendiente de subir */}
          {selectedFile && (
            <div style={{ marginTop: 14, padding: "10px", background: "#f0fdf4",
              borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#166534" }}>
                Nueva foto seleccionada
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleUpload}
                  disabled={uploadingPhoto}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, padding: "6px 14px" }}
                >
                  <FaSave /> {uploadingPhoto ? "Subiendo..." : "Guardar foto"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelPreview}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, padding: "6px 10px" }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          {/* Eliminar foto actual */}
          {user.profile?.photo && !selectedFile && (
            <button
              type="button"
              onClick={handleDeletePhoto}
              disabled={deletingPhoto}
              style={{
                marginTop: 12, background: "none", border: "none", cursor: "pointer",
                color: "#dc2626", fontSize: 12, display: "flex", alignItems: "center",
                gap: 5, margin: "12px auto 0",
              }}
            >
              <FaTimes /> {deletingPhoto ? "Eliminando..." : "Quitar foto"}
            </button>
          )}
        </div>

        {/* ── Datos de la cuenta ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Información personal */}
          <div className="card">
            <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Información de la Cuenta</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Nombre</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{user.name}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Apellido</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{user.lastName}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Correo electrónico</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{user.email}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Estado</p>
                <span style={{
                  padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                  background: user.isActive ? "#d1fae5" : "#fee2e2",
                  color: user.isActive ? "#065f46" : "#991b1b",
                }}>
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.5px", fontWeight: 600 }}>Roles</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {user.roles?.map((r) => (
                    <span key={r} style={{ padding: "2px 10px", borderRadius: 10, fontSize: 12,
                      fontWeight: 600, background: "#dbeafe", color: "#1e40af" }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Género */}
          <div className="card">
            <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>Género</h3>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>
              Actual: <strong>{user.profile?.gender
                ? GENEROS.find((g) => g.value === user.profile.gender)?.label ?? user.profile.gender
                : "Sin especificar"}</strong>
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ flex: 1 }}
              >
                {GENEROS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveGender}
                disabled={savingGender}
                style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
              >
                {genderSaved
                  ? <><FaCheckCircle /> Guardado</>
                  : <><FaSave /> {savingGender ? "Guardando..." : "Guardar"}</>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Perfil;

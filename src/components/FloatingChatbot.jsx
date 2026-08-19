// src/components/FloatingChatbot.jsx

import React, { useState, useRef, useEffect } from "react";
import "./floatingChatbot.css";
import LocationPickerModal from "./LocationPickerModal";

const WEBHOOK_URL =
  "http://localhost:5678/webhook-test/472d94d7-cd57-446e-aa40-fcdcc6b6b41e";

// Webhook aparte en n8n para recibir la foto de la factura (multipart/form-data)
const UPLOAD_WEBHOOK_URL =
  "http://localhost:5678/webhook-test/472d94d7-cd57-446e-aa40-fcdcc6b6b41e";

function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Crear una sesión única para el usuario
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("enerlogic_session");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("enerlogic_session", id);
    }

    return id;
  });

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  // Imagen seleccionada pero aún no enviada (se adjunta al próximo mensaje)
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);

  // Confirmación visual temporal al copiar el link de ubicación
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Modal para elegir la ubicación en un mapa (disparado por el botón
  // "Abrir GPS" que manda el bot en su respuesta)
  const [showLocationModal, setShowLocationModal] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Pide el mensaje de bienvenida la primera vez que se abre el chat
  useEffect(() => {
    if (open && !initialized) {
      fetchWelcomeMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchWelcomeMessage = async () => {
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: "__init__",
        }),
      });

      if (!res.ok) {
        throw new Error("Error del servidor");
      }

      const data = await res.json();

      setMessages([
        {
          sender: "bot",
          text: data.reply,
          buttons: data.buttons || null,
        },
      ]);

      setInitialized(true);
    } catch (error) {
      console.error(error);

      setMessages([
        {
          sender: "bot",
          text: "⚠️ No se pudo conectar con el asistente. Intenta de nuevo más tarde.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Cuando el usuario hace click en un botón, mandamos el "value" como
  // mensaje real, pero mostramos el "label" en la burbuja del usuario
  // para que se vea natural en el historial del chat.
  const sendMessage = async (overrideValue, overrideLabel) => {
    const textToSend = (overrideValue ?? input).trim();
    const textToShow = (overrideLabel ?? overrideValue ?? input).trim();
    const fileToSend = attachedFile;
    const previewToShow = attachedPreview;

    if (!textToSend && !fileToSend) return;

    // Una vez que el usuario elige un botón, ocultamos los botones de
    // ese mensaje del bot para que no los pueda volver a tocar.
    setMessages((prev) =>
      prev.map((msg) =>
        msg.buttons ? { ...msg, buttons: null } : msg
      )
    );

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: textToShow,
        imageUrl: previewToShow || undefined,
      },
    ]);

    setInput("");
    setAttachedFile(null);
    setAttachedPreview(null);
    setLoading(true);

    try {
      let res;

      if (fileToSend) {
        const formData = new FormData();
        formData.append("sessionId", sessionId);
        formData.append("message", textToSend);
        formData.append("file", fileToSend);

        res = await fetch(UPLOAD_WEBHOOK_URL, {
          method: "POST",
          // No pongas Content-Type manualmente: el navegador arma el
          // boundary correcto de multipart/form-data automáticamente.
          body: formData,
        });
      } else {
        res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            message: textToSend,
          }),
        });
      }

      if (!res.ok) {
        throw new Error("Error del servidor");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          buttons: data.buttons || null,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Ocurrió un error al conectar con el asistente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // ---- Botones de respuesta rápida ----

  const handleButtonClick = (btn) => {
    // El botón "Abrir GPS" que manda el bot (value: "gps") no se envía
    // directo: abre el mapa para que el usuario confirme el pin exacto.
    if (btn.value === "gps") {
      setShowLocationModal(true);
      return;
    }

    sendMessage(btn.value, btn.label);
  };

  // ---- Modal de selección de ubicación en el mapa ----

  const handleLocationConfirm = (mapsLink) => {
    setShowLocationModal(false);
    sendMessage(mapsLink, "📍 Ubicación compartida");
  };

  const handleLocationModalClose = () => {
    setShowLocationModal(false);
  };

  // ---- Adjuntar foto de la factura ----

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (attachedPreview) {
      URL.revokeObjectURL(attachedPreview);
    }

    setAttachedFile(file);
    setAttachedPreview(URL.createObjectURL(file));

    e.target.value = ""; // permite volver a seleccionar el mismo archivo si hace falta
  };

  const handleRemoveAttachment = () => {
    if (attachedPreview) {
      URL.revokeObjectURL(attachedPreview);
    }

    setAttachedFile(null);
    setAttachedPreview(null);
  };

  // ---- Compartir ubicación ----

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const appendLink = (prev) =>
          prev.trim() ? `${prev.trim()} ${mapsLink}` : mapsLink;

        try {
          await navigator.clipboard.writeText(mapsLink);
          setInput(appendLink);
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        } catch (error) {
          console.error(error);
          setInput(appendLink);
          alert(
            "No se pudo copiar automáticamente. El link quedó en el campo de texto para copiarlo manualmente."
          );
        }
      },
      (error) => {
        console.error(error);
        alert(
          "No se pudo obtener tu ubicación. Puedes pegar el link de Google Maps manualmente."
        );
      }
    );
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className="chatbot-float-btn"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {/* Ventana del Chat */}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>Asistente Virtual</span>

            <button onClick={() => setOpen(false)}>
              ✖
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-msg ${msg.sender}`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Imagen adjunta"
                    className="chat-msg-image"
                  />
                )}
                {msg.text && (
  <div className="chat-msg-text">
    {msg.text}
  </div>
)}

                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="chat-msg-buttons">
                    {msg.buttons.map((btn, i) => (
                      <button
                        key={i}
                        className="chat-quick-reply-btn"
                        onClick={() => handleButtonClick(btn)}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                Escribiendo...
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          {attachedFile && (
            <div className="chatbot-attachment-preview">
              <img src={attachedPreview} alt="Vista previa" />
              <span className="chatbot-attachment-name">
                {attachedFile.name}
              </span>
              <button
                onClick={handleRemoveAttachment}
                className="chatbot-attachment-remove"
                title="Quitar imagen"
              >
                ✖
              </button>
            </div>
          )}

          <div className="chatbot-footer">
            {/* Input de archivo oculto, disparado por el botón 📎 */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <button
              onClick={handleAttachClick}
              title="Adjuntar foto de la factura"
              className="chatbot-icon-btn"
            >
              📎
            </button>

            <button
              onClick={handleShareLocation}
              title="Copiar link de mi ubicación"
              className="chatbot-icon-btn"
            >
              {copyFeedback ? "✅" : "📍"}
            </button>

            <input
              type="text"
              placeholder={
                attachedFile
                  ? "Escribe un mensaje para tu imagen..."
                  : "Escribe aquí..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
              disabled={!initialized && loading}
            />

            <button onClick={() => sendMessage()}>
              Enviar
            </button>
          </div>
        </div>
      )}

      {showLocationModal && (
        <LocationPickerModal
          onConfirm={handleLocationConfirm}
          onClose={handleLocationModalClose}
        />
      )}
    </>
  );
}

export default FloatingChatbot;
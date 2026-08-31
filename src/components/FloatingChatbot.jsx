// src/components/FloatingChatbot.jsx

import React, { useState, useRef, useEffect } from "react";
import "./floatingChatbot.css";
import LocationPickerModal from "./LocationPickerModal";

const WEBHOOK_URL =
  "http://localhost:5678/webhook/472d94d7-cd57-446e-aa40-fcdcc6b6b41e";

// Webhook aparte en n8n para recibir la foto de la factura (multipart/form-data)
const UPLOAD_WEBHOOK_URL =
  "http://localhost:5678/webhook/472d94d7-cd57-446e-aa40-fcdcc6b6b41e";

function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Sesión nueva en cada carga de la página: no se persiste en localStorage
  // a propósito, así al recargar el navegador el chat arranca de cero.
  const [sessionId] = useState(() => crypto.randomUUID());

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  // Imágenes seleccionadas pero aún no enviadas (se adjuntan al próximo
  // mensaje). Puede ser más de una: el backend ahora guarda las fotos del
  // cargador como arreglo (dato_lead.imagenCargadorUrl).
  const [attachments, setAttachments] = useState([]); // [{ file, previewUrl }]

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
    const filesToSend = attachments.map((a) => a.file);
    const previewsToShow = attachments.map((a) => a.previewUrl);

    if (!textToSend && filesToSend.length === 0) return;

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
        imageUrls: previewsToShow.length > 0 ? previewsToShow : undefined,
      },
    ]);

    setInput("");
    setAttachments([]);
    setLoading(true);

    try {
      let res;

      if (filesToSend.length > 0) {
        const formData = new FormData();
        formData.append("sessionId", sessionId);
        formData.append("message", textToSend);
        // Mismo nombre de campo repetido por archivo: así n8n/multer lo
        // recibe como arreglo (coincide con dato_lead.imagenCargadorUrl).
        filesToSend.forEach((file) => formData.append("file", file));

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

    // El botón "Abrir Imagen" que manda el bot (value: "imagen") abre el
    // selector de archivos en vez de enviarse como mensaje.
    if (btn.value === "imagen") {
      handleAttachClick();
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const nuevos = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    // Se acumulan: el usuario puede abrir el selector varias veces para
    // ir juntando fotos antes de mandarlas todas juntas.
    setAttachments((prev) => [...prev, ...nuevos]);

    e.target.value = ""; // permite volver a seleccionar el mismo archivo si hace falta
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
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
                {msg.imageUrls && msg.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Imagen adjunta"
                    className="chat-msg-image"
                  />
                ))}
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

          {attachments.length > 0 && (
            <div className="chatbot-attachment-preview">
              {attachments.map((att, i) => (
                <div key={i} className="chatbot-attachment-item">
                  <img src={att.previewUrl} alt="Vista previa" />
                  <button
                    onClick={() => handleRemoveAttachment(i)}
                    className="chatbot-attachment-remove"
                    title="Quitar imagen"
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button
                onClick={handleAttachClick}
                className="chatbot-attachment-add"
                title="Agregar otra imagen"
              >
                +
              </button>
            </div>
          )}

          <div className="chatbot-footer">
            {/* Input de archivo oculto: lo dispara el botón "Abrir Imagen"
                que manda el bot (value: "imagen"), ya no hay ícono fijo */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />

            <input
              type="text"
              placeholder={
                attachments.length > 0
                  ? "Escribe un mensaje para tus imágenes..."
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
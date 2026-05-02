// src/components/FloatingChatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import "./floatingChatbot.css";

function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hola 👋 Soy el asistente virtual de Enerlogic. ¿En qué puedo ayudarte?",
    },
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply }
      ]);
    } catch (error) {
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
    if (e.key === "Enter") sendMessage();
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

      {/* Ventana */}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>Asistente Virtual</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-msg ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">Escribiendo...</div>
            )}

            <div ref={bottomRef}></div>
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Escribe aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
            />

            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingChatbot;
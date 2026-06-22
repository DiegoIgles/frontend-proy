import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext(null);

const ICONOS = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
};

const DURACION_DEFAULT = { success: 3500, info: 3500, error: 5500 };

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback((type, message, opts = {}) => {
    const id = ++nextId;
    const duration = opts.duration ?? DURACION_DEFAULT[type];
    setToasts((prev) => [...prev, { id, type, title: opts.title, message, duration }]);
    timers.current[id] = setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const toast = useRef({
    success: (message, opts) => push("success", message, opts),
    error: (message, opts) => push("error", message, opts),
    info: (message, opts) => push("info", message, opts),
  }).current;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            <span className="toast-icon">{ICONOS[t.type]}</span>
            <div className="toast-body">
              {t.title && <p className="toast-title">{t.title}</p>}
              <p className="toast-message">{t.message}</p>
            </div>
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Cerrar">
              <FaTimes />
            </button>
            <span className="toast-progress" style={{ animationDuration: `${t.duration}ms` }} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

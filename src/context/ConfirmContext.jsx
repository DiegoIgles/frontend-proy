import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { FaExclamationTriangle, FaQuestionCircle } from "react-icons/fa";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setRequest({
        title: opts.title ?? "¿Confirmar acción?",
        message: opts.message ?? "¿Estás seguro? Esta acción no se puede deshacer.",
        confirmLabel: opts.confirmLabel ?? "Confirmar",
        cancelLabel: opts.cancelLabel ?? "Cancelar",
        danger: opts.danger ?? false,
      });
    });
  }, []);

  const settle = (result) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request && (
        <div className="modal-backdrop" onClick={() => settle(false)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`confirm-icon ${request.danger ? "danger" : "default"}`}>
              {request.danger ? <FaExclamationTriangle /> : <FaQuestionCircle />}
            </div>
            <h3 className="confirm-title">{request.title}</h3>
            <p className="confirm-message">{request.message}</p>
            <div className="confirm-actions">
              <button type="button" className="btn-secondary" onClick={() => settle(false)}>
                {request.cancelLabel}
              </button>
              <button
                type="button"
                className={request.danger ? "btn-danger" : "btn-primary"}
                onClick={() => settle(true)}
              >
                {request.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}

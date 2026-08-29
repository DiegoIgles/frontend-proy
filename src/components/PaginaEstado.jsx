import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import logoBlanco from "../assets/brand/enerlogic-blanco.png";
import "../styles/pagina-estado.css";

/**
 * Pantalla de estado a página completa: 404, sin permiso, error inesperado.
 *
 * Va fuera del Layout a propósito. Si el usuario llegó acá es porque la ruta
 * no existe o no le corresponde, y meterlo dentro del panel con el menú
 * completo alrededor sugiere que la navegación funcionó — que es justo lo
 * contrario de lo que pasó.
 *
 * El destino del botón principal depende de la sesión: al panel si hay usuario,
 * al login si no. Mandar a /dashboard a alguien deslogueado solo lo rebota.
 */
function PaginaEstado({ codigo, titulo, mensaje, mostrarRuta = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const destino = user ? "/dashboard" : "/";
  const etiquetaDestino = user ? "Volver al panel" : "Ir al inicio de sesión";

  return (
    <div className="estado-pagina">
      <div className="estado-caja">
        <img src={logoBlanco} alt="Enerlogic" className="estado-logo" />

        <PanelSolar />

        {codigo && (
          <p className="estado-codigo">
            {String(codigo)[0]}
            <span>{String(codigo).slice(1, 2)}</span>
            {String(codigo).slice(2)}
          </p>
        )}

        <h1 className="estado-titulo">{titulo}</h1>
        <p className="estado-texto">{mensaje}</p>

        <div className="estado-acciones">
          <Link to={destino} className="estado-btn estado-btn-primario">
            {etiquetaDestino}
          </Link>
          <button
            type="button"
            className="estado-btn estado-btn-secundario"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Volver atrás
          </button>
        </div>

        {mostrarRuta && (
          <p className="estado-ruta">
            Ruta solicitada: <code>{window.location.pathname}</code>
          </p>
        )}
      </div>
    </div>
  );
}

/* Panel fotovoltaico de 4×3 con una celda apagada, parpadeando. Es el mismo
   recurso gráfico de los iconos de la cotización: trazo plano, sin sombras. */
function PanelSolar() {
  const celdas = [];
  for (let f = 0; f < 3; f++) {
    for (let c = 0; c < 4; c++) {
      const apagada = f === 1 && c === 2;
      celdas.push(
        <rect
          key={`${f}-${c}`}
          x={10 + c * 20}
          y={8 + f * 16}
          width="16"
          height="12"
          rx="1.5"
          fill={apagada ? "#FFFFFF" : "#0062B7"}
          fillOpacity={apagada ? 0.2 : 0.85}
          className={apagada ? "estado-celda-apagada" : undefined}
        />
      );
    }
  }

  return (
    <svg viewBox="0 0 100 78" className="estado-grafico" aria-hidden="true">
      <rect x="7" y="5" width="86" height="53" rx="3" fill="rgba(255,255,255,0.10)" />
      {celdas}
      <path
        d="M50 58 V70 M38 74 L50 70 L62 74"
        stroke="#FFFFFF"
        strokeOpacity="0.55"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default PaginaEstado;

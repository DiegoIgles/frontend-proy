import React, { useState } from "react";
import { FaPlus, FaTimes, FaSave } from "react-icons/fa";
import { useToast } from "../../../context/ToastContext";
import { getMarcasAction } from "../../marca-modelo/actions/marcas.action";
import { getModelosAction } from "../../marca-modelo/actions/modelos.action";
import { resolverMarcaModeloAction } from "../../marca-modelo/actions/marca-modelos.action";
import "../../../styles/selector-marca-modelo.css";

/**
 * Selector de marca-modelo con alta al vuelo.
 *
 * Antes, si la combinación no existía había que abandonar el formulario, ir a
 * Marcas y Modelos, crearla y volver a empezar el producto desde cero. Ahora se
 * da de alta acá mismo.
 *
 * Los dos campos son "escribí o elegí": un input con <datalist>. Si lo tipeado
 * coincide exactamente con algo de la lista se manda el id; si no, se manda el
 * nombre y el backend decide si reutiliza uno que ya existe (compara sin
 * distinguir mayúsculas) o lo crea. Esa distinción importa: mandar siempre el
 * nombre funcionaría, pero si algún día hay dos marcas homónimas, elegir una de
 * la lista tiene que resolver a ESA y no a la primera que aparezca.
 *
 * Props:
 *   value      marcaModeloId seleccionado ("" = sin marca-modelo)
 *   onChange   (marcaModeloId) => void
 *   opciones   combinaciones ya cargadas por la pantalla
 *   onCreada   (combinacion) => void — para que la pantalla la sume a su lista
 *   disabled
 */
function SelectorMarcaModelo({ value, onChange, opciones = [], onCreada, disabled = false }) {
  const toast = useToast();

  const [abierto, setAbierto] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [marcaTexto, setMarcaTexto] = useState("");
  const [modeloTexto, setModeloTexto] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Las listas se piden recién al abrir el panel: la mayoría de las veces el
  // usuario elige una combinación existente y nunca las necesita.
  const abrirPanel = async () => {
    setAbierto(true);
    if (marcas.length === 0 && modelos.length === 0) {
      try {
        const [ms, mos] = await Promise.all([getMarcasAction(), getModelosAction()]);
        setMarcas(Array.isArray(ms) ? ms : []);
        setModelos(Array.isArray(mos) ? mos : []);
      } catch {
        // Sin listas el panel sigue sirviendo: se escriben los nombres y el
        // backend reutiliza o crea igual. No vale la pena bloquear por esto.
      }
    }
  };

  const cerrarPanel = () => {
    setAbierto(false);
    setMarcaTexto("");
    setModeloTexto("");
  };

  const guardar = async () => {
    const marcaNombre = marcaTexto.trim();
    const modeloNombre = modeloTexto.trim();

    if (marcaNombre.length < 2 || modeloNombre.length < 2) {
      toast.error("Escribí una marca y un modelo de al menos 2 caracteres.");
      return;
    }

    // Coincidencia exacta (sin distinguir mayúsculas) => se manda el id.
    const marcaExistente = marcas.find(
      (m) => m.nombre?.trim().toLowerCase() === marcaNombre.toLowerCase()
    );
    const modeloExistente = modelos.find(
      (m) => m.nombre?.trim().toLowerCase() === modeloNombre.toLowerCase()
    );

    const dto = {};
    if (marcaExistente) dto.marcaId = marcaExistente.marcaId;
    else dto.marcaNombre = marcaNombre;
    if (modeloExistente) dto.modeloId = modeloExistente.modeloId;
    else dto.modeloNombre = modeloNombre;

    try {
      setGuardando(true);
      const mm = await resolverMarcaModeloAction(dto);

      // Se normaliza a la forma que usan los <option> de la pantalla.
      const combinacion = {
        marcaModeloId: mm.marcaModeloId,
        marca: mm.marca,
        modelo: mm.modelo,
      };
      onCreada?.(combinacion);
      onChange(mm.marcaModeloId);

      // Se mantienen las listas al día para el próximo alta sin recargar.
      if (mm.creado?.marca) setMarcas((prev) => [...prev, mm.marca]);
      if (mm.creado?.modelo) setModelos((prev) => [...prev, mm.modelo]);

      const etiqueta = `${mm.marca.nombre} / ${mm.modelo.nombre}`;
      toast.success(
        mm.creado?.combinacion
          ? `Se creó la combinación ${etiqueta} y quedó seleccionada.`
          : `${etiqueta} ya existía: quedó seleccionada.`
      );
      cerrarPanel();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No se pudo crear la marca-modelo."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mm-selector">
      <div className="mm-fila">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">Sin marca-modelo</option>
          {opciones.map((mm) => (
            <option key={mm.marcaModeloId} value={mm.marcaModeloId}>
              {mm.marca?.nombre} / {mm.modelo?.nombre}
            </option>
          ))}
        </select>

        {!abierto && (
          <button
            type="button"
            className="btn-secondary mm-nuevo"
            onClick={abrirPanel}
            disabled={disabled}
            title="Crear una marca-modelo sin salir de este formulario"
          >
            <FaPlus size={10} /> Nueva
          </button>
        )}
      </div>

      {abierto && (
        <div className="mm-panel">
          <p className="mm-panel-titulo">Nueva marca / modelo</p>
          <p className="mm-panel-ayuda">
            Escribí el nombre o elegí uno de la lista. Lo que ya exista se reutiliza.
          </p>

          <div className="mm-panel-campos">
            <div className="mm-campo">
              <label htmlFor="mm-marca">Marca</label>
              <input
                id="mm-marca"
                list="mm-lista-marcas"
                value={marcaTexto}
                onChange={(e) => setMarcaTexto(e.target.value)}
                placeholder="Ej: Victron Energy"
                autoComplete="off"
              />
              <datalist id="mm-lista-marcas">
                {marcas.map((m) => (
                  <option key={m.marcaId} value={m.nombre} />
                ))}
              </datalist>
            </div>

            <div className="mm-campo">
              <label htmlFor="mm-modelo">Modelo</label>
              <input
                id="mm-modelo"
                list="mm-lista-modelos"
                value={modeloTexto}
                onChange={(e) => setModeloTexto(e.target.value)}
                placeholder="Ej: SmartSolar MPPT 150/70"
                autoComplete="off"
              />
              <datalist id="mm-lista-modelos">
                {modelos.map((m) => (
                  <option key={m.modeloId} value={m.nombre} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="mm-panel-acciones">
            <button
              type="button"
              className="btn-secondary"
              onClick={cerrarPanel}
              disabled={guardando}
            >
              <FaTimes size={11} /> Cancelar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={guardar}
              disabled={guardando}
            >
              <FaSave size={11} /> {guardando ? "Guardando..." : "Crear y usar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectorMarcaModelo;

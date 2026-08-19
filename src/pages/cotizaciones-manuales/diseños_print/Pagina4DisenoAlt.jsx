import React from "react";
import {
  FaBolt,
  FaLayerGroup,
  FaCube,
  FaCompass,
  FaArrowsAltH,
  FaSun,
  FaChartBar,
  FaRulerCombined,
  FaCheckCircle,
  FaShieldAlt,
  FaLeaf,
  FaHeadset
} from "react-icons/fa";

function fmt(n, dec = 2) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtEntero(n) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { maximumFractionDigits: 0 });
}

export function Pagina4DisenoAlt({ cot }) {
  const imgs = cot?.imagenesProyecto ?? [];

  return (
    <section
      className="pagina pagina-diseno"
      style={{
        width: "210mm",
        height: "297mm",
        background: "#ffffff",
        margin: "0 auto 24px",
        padding: "10mm 12mm 8mm 12mm",
        position: "relative",
        boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "5mm",
          flex: "0 0 auto",
        }}
      >
        {/* LOGO CORPORATIVO ENERLOGIC */}
        <img
          src="/cotizacion/logo_1.jpeg"
          alt="Logo Enerlogic"
          style={{ height: "16mm", width: "auto", objectFit: "contain" }}
        />

        <div style={{ textAlign: "right" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "20pt",
              letterSpacing: "0.8px",
              color: "#0b2340",
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            DISEÑO DEL SISTEMA
          </h1>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "9pt",
              color: "#3a9d3a",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            Ingeniería desarrollada para este proyecto
          </p>
        </div>
      </div>

      {/* GALERIA PRINCIPAL */}
      <div
        style={{
          display: "flex",
          gap: "4mm",
          flex: 1.1,
          marginBottom: "4mm",
          minHeight: 0,
        }}
      >
        {/* Imagen Principal */}
        <div
          style={{
            flex: 2.2,
            border: "1.5px solid #d8dce1",
            borderRadius: "6px",
            background: "#fafbfc",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imgs[0] ? (
            <img
              src={imgs[0]}
              alt="Vista Superior / Aerea"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#8a95a3",
                padding: "8px",
                background:
                  "repeating-linear-gradient(45deg, #f4f5f7, #f4f5f7 10px, #fafbfc 10px, #fafbfc 20px)",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaLayerGroup style={{ fontSize: 28, marginBottom: 6, opacity: 0.6 }} />
              <span style={{ fontSize: "9pt", fontWeight: 700 }}>
                [ IMAGEN PRINCIPAL — VISTA AÉREA DEL TECHO ]
              </span>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div
          style={{
            flex: 1,
            background: "#0b2340",
            borderRadius: "6px",
            color: "#fff",
            padding: "5mm 4mm",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "8mm",
              height: "8mm",
              border: "1.5px dashed rgba(255,255,255,0.5)",
              borderRadius: "4px",
              marginBottom: "3mm",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3a9d3a",
              fontSize: 14,
            }}
          >
            <FaLayerGroup />
          </div>
          <h3
            style={{
              fontSize: "10.5pt",
              margin: 0,
              marginBottom: "2mm",
              letterSpacing: "0.5px",
              fontWeight: 800,
            }}
          >
            VISTA SUPERIOR
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "8pt",
              lineHeight: 1.4,
              color: "#cdd6e0",
            }}
          >
            {cot?.descripcionVistaSuperior ||
              "Distribución optimizada del campo fotovoltaico aprovechando la máxima radiación disponible y minimizando sombras."}
          </p>
        </div>
      </div>

      {/* GALERIA SECUNDARIA */}
      <div
        style={{
          display: "flex",
          gap: "4mm",
          flex: 1,
          marginBottom: "4mm",
          minHeight: 0,
        }}
      >
        {/* Columna 1 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #d8dce1",
            borderRadius: "6px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#fafbfc",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {imgs[1] ? (
              <img
                src={imgs[1]}
                alt="Vista 3D"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#8a95a3",
                  padding: "6px",
                  background:
                    "repeating-linear-gradient(45deg, #f4f5f7, #f4f5f7 10px, #fafbfc 10px, #fafbfc 20px)",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCube style={{ fontSize: 22, marginBottom: 4, opacity: 0.6 }} />
                <span style={{ fontSize: "7.5pt", fontWeight: 700 }}>[ IMAGEN — VISTA 3D ]</span>
              </div>
            )}
          </div>
          <div style={{ padding: "3mm 3.5mm", background: "#fff" }}>
            <div
              style={{
                width: "6mm",
                height: "6mm",
                border: "1.5px solid #3a9d3a",
                borderRadius: "3px",
                marginBottom: "1.5mm",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3a9d3a",
                fontSize: 10,
              }}
            >
              <FaCube />
            </div>
            <h4
              style={{
                margin: 0,
                marginBottom: "1mm",
                fontSize: "8.5pt",
                color: "#0b2340",
                fontWeight: 800,
                letterSpacing: "0.3px",
              }}
            >
              VISTA 3D
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "7.2pt",
                color: "#5a6675",
                lineHeight: 1.3,
              }}
            >
              Modelado tridimensional para verificación de estructuras e inclinación de paneles.
            </p>
          </div>
        </div>

        {/* Columna 2 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #d8dce1",
            borderRadius: "6px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#fafbfc",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {imgs[2] ? (
              <img
                src={imgs[2]}
                alt="Vista Inclinada"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#8a95a3",
                  padding: "6px",
                  background:
                    "repeating-linear-gradient(45deg, #f4f5f7, #f4f5f7 10px, #fafbfc 10px, #fafbfc 20px)",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCompass style={{ fontSize: 22, marginBottom: 4, opacity: 0.6 }} />
                <span style={{ fontSize: "7.5pt", fontWeight: 700 }}>
                  [ IMAGEN — VISTA INCLINADA ]
                </span>
              </div>
            )}
          </div>
          <div style={{ padding: "3mm 3.5mm", background: "#fff" }}>
            <div
              style={{
                width: "6mm",
                height: "6mm",
                border: "1.5px solid #3a9d3a",
                borderRadius: "3px",
                marginBottom: "1.5mm",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3a9d3a",
                fontSize: 10,
              }}
            >
              <FaCompass />
            </div>
            <h4
              style={{
                margin: 0,
                marginBottom: "1mm",
                fontSize: "8.5pt",
                color: "#0b2340",
                fontWeight: 800,
                letterSpacing: "0.3px",
              }}
            >
              VISTA INCLINADA
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "7.2pt",
                color: "#5a6675",
                lineHeight: 1.3,
              }}
            >
              Perspectiva angular del arreglo solar y su orientación respecto al azimut solar.
            </p>
          </div>
        </div>

        {/* Columna 3 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #d8dce1",
            borderRadius: "6px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#fafbfc",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {imgs[3] ? (
              <img
                src={imgs[3]}
                alt="Vista Lateral"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#8a95a3",
                  padding: "6px",
                  background:
                    "repeating-linear-gradient(45deg, #f4f5f7, #f4f5f7 10px, #fafbfc 10px, #fafbfc 20px)",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaArrowsAltH style={{ fontSize: 22, marginBottom: 4, opacity: 0.6 }} />
                <span style={{ fontSize: "7.5pt", fontWeight: 700 }}>
                  [ IMAGEN — VISTA LATERAL ]
                </span>
              </div>
            )}
          </div>
          <div style={{ padding: "3mm 3.5mm", background: "#fff" }}>
            <div
              style={{
                width: "6mm",
                height: "6mm",
                border: "1.5px solid #3a9d3a",
                borderRadius: "3px",
                marginBottom: "1.5mm",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3a9d3a",
                fontSize: 10,
              }}
            >
              <FaArrowsAltH />
            </div>
            <h4
              style={{
                margin: 0,
                marginBottom: "1mm",
                fontSize: "8.5pt",
                color: "#0b2340",
                fontWeight: 800,
                letterSpacing: "0.3px",
              }}
            >
              VISTA LATERAL
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "7.2pt",
                color: "#5a6675",
                lineHeight: 1.3,
              }}
            >
              Elevación y perfil de montaje garantizando resistencia aerodinámica y ventilación.
            </p>
          </div>
        </div>
      </div>

      {/* KPIS */}
      <div
        style={{
          display: "flex",
          border: "1px solid #d8dce1",
          borderRadius: "6px",
          overflow: "hidden",
          marginBottom: "4mm",
          flex: "0 0 auto",
          background: "#fff",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "2.5mm",
            padding: "4.5mm 3.5mm",
            borderRight: "1px solid #d8dce1",
          }}
        >
          <div
            style={{
              width: "9mm",
              height: "9mm",
              borderRadius: "50%",
              border: "1.5px solid #3a9d3a",
              color: "#3a9d3a",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              background: "#f4fdf4",
            }}
          >
            <FaBolt />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label
              style={{
                display: "block",
                fontSize: "6.5pt",
                fontWeight: 800,
                color: "#0b2340",
                letterSpacing: "0.2px",
                marginBottom: "1px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              POTENCIA INSTALADA
            </label>
            <div>
              <span
                style={{
                  fontSize: "13pt",
                  fontWeight: 800,
                  color: "#1c2b3a",
                  lineHeight: 1,
                }}
              >
                {fmt(cot?.potenciaInstalada)}
              </span>
              <span style={{ fontSize: "7pt", color: "#8a95a3", marginLeft: "2px", fontWeight: 700 }}>
                kWp
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "2.5mm",
            padding: "4.5mm 3.5mm",
            borderRight: "1px solid #d8dce1",
          }}
        >
          <div
            style={{
              width: "9mm",
              height: "9mm",
              borderRadius: "50%",
              border: "1.5px solid #3a9d3a",
              color: "#3a9d3a",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              background: "#f4fdf4",
            }}
          >
            <FaChartBar />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label
              style={{
                display: "block",
                fontSize: "6.5pt",
                fontWeight: 800,
                color: "#0b2340",
                letterSpacing: "0.2px",
                marginBottom: "1px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              CANTIDAD DE PANELES
            </label>
            <div>
              <span
                style={{
                  fontSize: "13pt",
                  fontWeight: 800,
                  color: "#1c2b3a",
                  lineHeight: 1,
                }}
              >
                {fmtEntero(cot?.cantidadPaneles)}
              </span>
              <span style={{ fontSize: "7pt", color: "#8a95a3", marginLeft: "2px", fontWeight: 700 }}>
                unds
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "2.5mm",
            padding: "4.5mm 3.5mm",
            borderRight: "1px solid #d8dce1",
          }}
        >
          <div
            style={{
              width: "9mm",
              height: "9mm",
              borderRadius: "50%",
              border: "1.5px solid #3a9d3a",
              color: "#3a9d3a",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              background: "#f4fdf4",
            }}
          >
            <FaRulerCombined />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label
              style={{
                display: "block",
                fontSize: "6.5pt",
                fontWeight: 800,
                color: "#0b2340",
                letterSpacing: "0.2px",
                marginBottom: "1px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              SUPERFICIE REQUERIDA
            </label>
            <div>
              <span
                style={{
                  fontSize: "13pt",
                  fontWeight: 800,
                  color: "#1c2b3a",
                  lineHeight: 1,
                }}
              >
                {fmt(cot?.superficieRequerida, 1)}
              </span>
              <span style={{ fontSize: "7pt", color: "#8a95a3", marginLeft: "2px", fontWeight: 700 }}>
                m²
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "2.5mm",
            padding: "4.5mm 3.5mm",
          }}
        >
          <div
            style={{
              width: "9mm",
              height: "9mm",
              borderRadius: "50%",
              border: "1.5px solid #3a9d3a",
              color: "#3a9d3a",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              background: "#f4fdf4",
            }}
          >
            <FaSun />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label
              style={{
                display: "block",
                fontSize: "6.5pt",
                fontWeight: 800,
                color: "#0b2340",
                letterSpacing: "0.2px",
                marginBottom: "1px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              PRODUCCIÓN ANUAL EST.
            </label>
            <div>
              <span
                style={{
                  fontSize: "13pt",
                  fontWeight: 800,
                  color: "#1c2b3a",
                  lineHeight: 1,
                }}
              >
                {fmtEntero(cot?.produccionAnualEstimada)}
              </span>
              <span style={{ fontSize: "7pt", color: "#8a95a3", marginLeft: "2px", fontWeight: 700 }}>
                kWh/año
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          background: "#0b2340",
          borderRadius: "6px",
          padding: "4.5mm 5mm",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "32mm",
            background:
              "linear-gradient(120deg, transparent 35%, #f5a623 35%, #f5a623 52%, #3a9d3a 52%)",
            opacity: 0.9,
            zIndex: 1,
          }}
        />

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "2.5mm", color: "#fff", zIndex: 2 }}>
          <div
            style={{
              width: "7mm",
              height: "7mm",
              border: "1.2px dashed rgba(255,255,255,0.7)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#3a9d3a",
            }}
          >
            <FaCheckCircle />
          </div>
          <span style={{ fontSize: "7.2pt", fontWeight: 700, letterSpacing: "0.2px", lineHeight: 1.25 }}>
            INGENIERÍA<br />ESPECIALIZADA
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "2.5mm", color: "#fff", zIndex: 2 }}>
          <div
            style={{
              width: "7mm",
              height: "7mm",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#f5a623",
            }}
          >
            <FaShieldAlt style={{ width: "6mm", height: "6mm" }} />
          </div>
          <span style={{ fontSize: "7.2pt", fontWeight: 700, letterSpacing: "0.2px", lineHeight: 1.25 }}>
            SOLUCIONES<br />CONFIABLES
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "2.5mm", color: "#fff", zIndex: 2 }}>
          <div
            style={{
              width: "7mm",
              height: "7mm",
              border: "1.2px dashed rgba(255,255,255,0.7)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#3a9d3a",
            }}
          >
            <FaLeaf />
          </div>
          <span style={{ fontSize: "7.2pt", fontWeight: 700, letterSpacing: "0.2px", lineHeight: 1.25 }}>
            ENERGÍA EFICIENTE<br />Y SOSTENIBLE
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "2.5mm", color: "#fff", zIndex: 2 }}>
          <div
            style={{
              width: "7mm",
              height: "7mm",
              border: "1.2px dashed rgba(255,255,255,0.7)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#f5a623",
            }}
          >
            <FaHeadset />
          </div>
          <span style={{ fontSize: "7.2pt", fontWeight: 700, letterSpacing: "0.2px", lineHeight: 1.25 }}>
            ACOMPAÑAMIENTO<br />POSVENTA
          </span>
        </div>
      </div>
    </section>
  );
}

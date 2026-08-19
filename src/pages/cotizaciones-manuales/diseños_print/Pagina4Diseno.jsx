import React from "react";

function fmt(n, dec = 2) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtEntero(n) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { maximumFractionDigits: 0 });
}

export function Pagina4Diseno({ cot }) {
  if (!cot) return null;
  const imgs = cot?.imagenesProyecto ?? [];

  return (
    <section
      className="pagina pagina-diseno"
      style={{
        position: "relative",
        width: "210mm",
        height: "297mm",
        background: "#ffffff",
        overflow: "hidden",
        margin: "0 auto 24px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
      }}
    >
      {/* ── 1. PLANTILLA BASE LIMPIA DE FONDO ── */}
      <img
        src="/cotizacion/cotizacion4_A4.png"
        alt="Plantilla Diseño del Sistema Enerlogic"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* ── 2. CAPA DE DATOS DINÁMICOS SOBREPUESTOS ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}
      >
        {/* A. IMAGEN PRINCIPAL (VISTA SUPERIOR) */}
        {imgs[0] && (
          <div
            style={{
              position: "absolute",
              top: "33.5mm",
              left: "7.0mm",
              width: "135.0mm",
              height: "79.0mm",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <img
              src={imgs[0]}
              alt="Vista Superior"
              style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }}
            />
          </div>
        )}

        {/* B. IMAGEN SECUNDARIA 1 (VISTA 3D) */}
        {imgs[1] && (
          <div
            style={{
              position: "absolute",
              top: "115.5mm",
              left: "7.5mm",
              width: "61.0mm",
              height: "51.5mm",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <img
              src={imgs[1]}
              alt="Vista 3D"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* C. IMAGEN SECUNDARIA 2 (VISTA INCLINADA) */}
        {imgs[2] && (
          <div
            style={{
              position: "absolute",
              top: "115.5mm",
              left: "74.5mm",
              width: "61.0mm",
              height: "51.5mm",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <img
              src={imgs[2]}
              alt="Vista Inclinada"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* D. IMAGEN SECUNDARIA 3 (VISTA LATERAL) */}
        {imgs[3] && (
          <div
            style={{
              position: "absolute",
              top: "115.5mm",
              left: "141.5mm",
              width: "61.0mm",
              height: "51.5mm",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <img
              src={imgs[3]}
              alt="Vista Lateral"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* E. KPI 1: POTENCIA INSTALADA */}
        <div
          style={{
            position: "absolute",
            top: "228.5mm",
            left: "28.5mm",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "14pt", fontWeight: 800, color: "#0b2340" }}>
            {fmt(cot?.potenciaInstalada)}
          </span>
          <span style={{ fontSize: "10.5pt", fontWeight: 700, color: "#5a6675", marginLeft: "3px" }}>
            kWp
          </span>
        </div>

        {/* F. KPI 2: CANTIDAD DE PANELES */}
        <div
          style={{
            position: "absolute",
            top: "228.5mm",
            left: "77.5mm",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "14pt", fontWeight: 800, color: "#0b2340" }}>
            {fmtEntero(cot?.cantidadPaneles)}
          </span>
          <span style={{ fontSize: "10.5pt", fontWeight: 700, color: "#5a6675", marginLeft: "3px" }}>
            und.
          </span>
        </div>

        {/* G. KPI 3: SUPERFICIE REQUERIDA */}
        <div
          style={{
            position: "absolute",
            top: "228.5mm",
            left: "127.5mm",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "14pt", fontWeight: 800, color: "#0b2340" }}>
            {fmt(cot?.superficieRequerida, 1)}
          </span>
          <span style={{ fontSize: "12.5pt", fontWeight: 700, color: "#5a6675", marginLeft: "3px" }}>
            m²
          </span>
        </div>

        {/* H. KPI 4: PRODUCCIÓN ANUAL ESTIMADA */}
        <div
          style={{
            position: "absolute",
            top: "228.5mm",
            left: "174.5mm",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "14pt", fontWeight: 800, color: "#0b2340" }}>
            {fmtEntero(cot?.produccionAnualEstimada)}
          </span>
          <span style={{ fontSize: "10.5pt", fontWeight: 700, color: "#5a6675", marginLeft: "3px" }}>
            kWh
          </span>
        </div>
      </div>
    </section>
  );
}

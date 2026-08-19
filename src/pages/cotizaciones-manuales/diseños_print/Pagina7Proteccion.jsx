import React from "react";

function fmtUsd(n) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function Pagina7Proteccion({ cot }) {
  if (!cot) return null;

  return (
    <section
      className="pagina pagina-proteccion"
      style={{
        position: "relative",
        width: "210mm",
        height: "297mm",
        background: "#ffffff",
        overflow: "hidden",
        margin: "0 auto 24px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* ── 1. FONDO DE PLANTILLA A4 PÁGINA 7 ── */}
      <img
        src="/cotizacion/cotizacion7_A4.png"
        alt="Protección de Inversión - Página 7"
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

      {/* ── 2. CAPA DE DATOS SOBREPUESTOS ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
          color: "#0f2a4a",
        }}
      >
        {/* Nro Propuesta Encabezado */}
        {/* <div
          style={{
            position: "absolute",
            top: "23mm",
            right: "12mm",
            fontSize: "11px",
            fontWeight: 800,
            color: "#ffffff",
          }}
        >
          {cot.nroPropuesta}
        </div> */}

        {/* ── DATOS EN LA PARTE INFERIOR ── */}

        {/* Inversión Anual ($us) */}
        <div
          style={{
            position: "absolute",
            top: "247mm",
            left: "90mm",
            width: "25mm",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 800,
            color: "#0f2a4a",

            padding: "6px 12px",



          }}
        >
          {cot.inversionAnualUsd ? `$us. ${fmtUsd(cot.inversionAnualUsd)}` : "—"}
        </div>

        {/* Contratación Total 5 años ($us) */}
        <div
          style={{
            position: "absolute",
            top: "247mm",
            left: "145mm",
            width: "25mm",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 800,
            color: "#0f2a4a",

            padding: "6px 12px",
          }}
        >
          {cot.valorContratacionTotalUsd ? `$us. ${fmtUsd(cot.valorContratacionTotalUsd)}` : "—"}
        </div>

      </div>
    </section>
  );
}

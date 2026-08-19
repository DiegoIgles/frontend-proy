import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

function fmtFechaCorta(d) {
  if (!d) return "—";
  const fecha = new Date(String(d).slice(0, 10) + "T00:00:00");
  const dia = fecha.getDate();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} ${mes} del ${anio}`;
}

export function Pagina1Portada({ cot }) {
  if (!cot) return null;

  return (
    <section className="pagina" style={{
      position: "relative",
      width: "210mm",
      height: "297mm",
      background: "#ffffff",
      overflow: "hidden",
      margin: "0 auto 24px"
    }}>

      {/* ── IMAGEN DE PLANTILLA LIMPIA AL FONDO ── */}
      <img
        src="/cotizacion/cotizacion1_A42.jpeg"
        alt="Plantilla Portada Enerlogic"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1
        }}
      />

      {/* ── CAPA DE DATOS DINÁMICOS SOBREPUESTOS ── */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
        fontFamily: "'Segoe UI', Arial, sans-serif"
      }}>

        {/* 1. N° DE PROPUESTA (Colocado exactamente entre las dos barras | | del banner verde) */}
        <div style={{
          position: "absolute",
          top: "19.5mm",
          right: "12mm",
          width: "36mm",
          textAlign: "center"
        }}>
          <span style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "1.5px"
          }}>
            {cot.nroPropuesta || "CT-316-2026"}
          </span>
        </div>

        {/* 2. SUBTÍTULO / DESCRIPCIÓN DE LA PROPUESTA */}
        <div style={{
          position: "absolute",
          top: "150mm",
          left: "9mm",
          maxWidth: "64mm"
        }}>
          <p style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f2a4a",
            lineHeight: 1.25,
            whiteSpace: "pre-line",
            wordBreak: "break-word"
          }}>
            {cot.subtituloPropuesta || "Propuesta de Sistema\nFotovoltaico On Grid"}
          </p>
        </div>

        {/* 3. NOMBRE DEL CLIENTE */}
        <div style={{
          position: "absolute",
          top: "188mm",
          left: "9mm",
          maxWidth: "92mm"
        }}>
          <p style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: 900,
            color: "#15803d",
            textTransform: "uppercase",
            lineHeight: 1.15,
            wordBreak: "break-word"
          }}>
            {cot.nombreCliente || "CLIENTE GENERAL"}
          </p>
        </div>

        {/* 4. UBICACIÓN Y FECHA (CON ÍCONOS CORPORATIVOS) */}
        <div style={{
          position: "absolute",
          top: "226mm",
          left: "9mm",
          display: "flex",
          alignItems: "center",
          gap: 16
        }}>
          {/* Ubicación */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", border: "2px solid #0f2a4a",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#0f2a4a"
            }}>
              <FaMapMarkerAlt style={{ fontSize: 15 }} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f2a4a" }}>
              {cot.ubicacion || cot.lugar || "Santa Cruz de la Sierra"}
            </span>
          </div>

          {/* Separador */}
          <div style={{ width: 1, height: 24, background: "#cbd5e1" }} />

          {/* Fecha */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", border: "2px solid #16a34a",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a"
            }}>
              <FaCalendarAlt style={{ fontSize: 15 }} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f2a4a" }}>
              {fmtFechaCorta(cot.fecha)}
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}

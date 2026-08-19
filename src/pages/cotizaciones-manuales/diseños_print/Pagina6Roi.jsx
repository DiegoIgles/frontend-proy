import React from "react";

function fmtBs(n) {
  if (n === null || n === undefined || n === "") return "0";
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function Pagina6Roi({ cot }) {
  if (!cot) return null;

  // Años estáticos: 5, 10, 15, 20, 25, 30 (de arriba a abajo)
  const ANIOS_ESTATICOS = [5, 10, 15, 20, 25, 30];

  // Mapeamos las 6 barras recibidas del backend/form
  const barrasRaw = cot?.roiBarras ?? [];
  const datosBarras = ANIOS_ESTATICOS.map((anio, idx) => {
    const encontrada = barrasRaw[idx] || barrasRaw.find((b) => String(b.etiqueta).includes(String(anio)));
    const valorNum = encontrada ? Number(encontrada.valor || 0) : 0;
    return {
      anio,
      etiqueta: `${anio} AÑOS`,
      valor: valorNum,
    };
  });

  const valores = datosBarras.map((d) => d.valor);
  const maxValor = Math.max(...valores, 1);

  return (
    <section
      className="pagina pagina-roi"
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
      {/* ── 1. FONDO DE PLANTILLA A4 PÁGINA 6 ── */}
      <img
        src="/cotizacion/cotizacion6_A4.png"
        alt="Retorno de Inversión - Página 6"
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
        {/*   <div
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
        </div>
 */}
        {/* ── A. TARJETAS / MÉTRICAS DE RESUMEN ROI (CABECERA SUPERIOR) ── */}
        {/* Ahorro Anual (Bs) */}
        <div
          style={{
            position: "absolute",
            top: "70.5mm",
            left: "17mm",
            width: "48mm",
            textAlign: "center",
            fontSize: "27px",
            fontWeight: 800,

            color: "rgba(3, 15, 67)",
          }}
        >
          {cot.ahorroAnualBs ? `Bs. ${fmtBs(cot.ahorroAnualBs)}` : "—"}
        </div>

        {/* Retorno de Inversión (Años) */}
        <div
          style={{
            position: "absolute",
            top: "70.5mm",
            left: "86mm",
            width: "48mm",
            textAlign: "center",
            fontSize: "30px",
            fontWeight: 800,
            color: "rgba(239, 106, 33)",
          }}
        >
          {cot.retornoInversionAnios ? `${cot.retornoInversionAnios} años` : "—"}
        </div>

        {/* Ahorro Total 30 Años (USD) */}
        <div
          style={{
            position: "absolute",
            top: "70.5mm",
            left: "153mm",
            width: "48mm",
            textAlign: "center",
            fontSize: "27px",
            fontWeight: 800,
            color: "rgba(3, 49, 2)",
          }}
        >
          {cot.ahorroTotal30AniosUsd ? `Bs. ${fmtBs(cot.ahorroTotal30AniosUsd)}` : "—"}
        </div>

        {/* ── B. GRÁFICO DE BARRAS HORIZONTALES (ALINEADO A CADA FILA DE AÑOS) ── */}
        <div
          style={{
            position: "absolute",
            top: "136.5mm",
            left: "30.5mm",
            width: "155mm",
            height: "54mm",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {datosBarras.map((d, idx) => {
            // Se reserva hasta un 72% del ancho para la barra dejando espacio a la etiqueta en Bs
            const pctAncho = maxValor > 0 ? Math.max((d.valor / maxValor) * 72, d.valor > 0 ? 3 : 0) : 0;

            return (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "9mm",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Barra horizontal angosta en degradado verde */}
                {d.valor > 0 && (
                  <div
                    style={{
                      width: `${pctAncho}%`,
                      height: "4.5mm",
                      background: "linear-gradient(90deg, #15803d 0%, #22c55e 100%)",
                      borderRadius: "0 3px 3px 0",
                      boxShadow: "1px 1px 3px rgba(34, 197, 94, 0.25)",
                    }}
                  />
                )}

                {/* Texto del monto en Bs a la derecha de la barra */}
                {d.valor > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      left: `calc(${pctAncho}% + 5px)`,
                      fontSize: "12.5px",
                      fontWeight: 800,
                      color: "#15803d",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Bs. {fmtBs(d.valor)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

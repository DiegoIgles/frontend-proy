import React from "react";

function fmt(n, dec = 2) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export function Pagina5Cotizacion({ cot }) {
  if (!cot) return null;

  const rawItems = cot?.items ?? [];

  // Si no hay ítems dinámicos cargados, mostramos 1 página con ítems vacíos
  const items = rawItems.length > 0 ? rawItems : [];

  // Dividimos en páginas de hasta 8 ítems por página
  const CHUNK_SIZE = 8;
  const pageChunks = [];

  if (items.length === 0) {
    pageChunks.push([]);
  } else {
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      pageChunks.push(items.slice(i, i + CHUNK_SIZE));
    }
  }

  const totalPages = pageChunks.length;

  return (
    <>
      {pageChunks.map((chunk, pageIdx) => {
        const isLastPage = pageIdx === totalPages - 1;

        return (
          <section
            key={pageIdx}
            className="pagina pagina-cotizacion-dinamica"
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
              src="/cotizacion/cotizacion5_A4.png"
              alt={`Cotización y Totales - Página ${pageIdx + 1}`}
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
                color: "#0f2a4a",
              }}
            >
              {/* A. CABECERA / DATOS GENERALES DE LA OFERTA (PÁGINA 5) */}

              {/* Nro Propuesta */}
              <div
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

              {/* 1. Lugar y Fecha (Tarjeta 1 - Izquierda) */}
              <div
                style={{
                  position: "absolute",
                  top: "48.5mm",
                  left: "18mm",
                  width: "48mm",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0f2a4a",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cot.ubicacion || cot.lugar || "Santa Cruz de la Sierra"}
              </div>

              {/* 2. Validez de la Oferta (Tarjeta 2 - Centro) */}
              <div
                style={{
                  position: "absolute",
                  top: "48.5mm",
                  left: "77mm",
                  width: "48mm",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0f2a4a",
                }}
              >
                {cot.validezOfertaDias ? `${cot.validezOfertaDias} días` : "30 días"}
              </div>

              {/* 3. Realizado por (Tarjeta 3 - Derecha) */}
              <div
                style={{
                  position: "absolute",
                  top: "48.5mm",
                  left: "153mm",
                  width: "48mm",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0f2a4a",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {/* console.log(cot.realizadoPor) */}
                {cot.usuario.name + ' ' + cot.usuario.lastName || "—"}
              </div>

              {/* B. TABLA DE PRODUCTOS Y SERVICIOS (HASTA 8 ÍTEMS POR PÁGINA) */}
              <div
                style={{
                  position: "absolute",
                  top: "72mm",
                  left: "10mm",
                  width: "190mm",
                  height: "125mm",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2mm",
                }}
              >
                {chunk.map((it, rowIdx) => {
                  const globalIndex = pageIdx * CHUNK_SIZE + rowIdx + 1;
                  const itemTotal = it.totalBs ?? (Number(it.cantidad || 0) * Number(it.precioUnitario || 0));

                  return (
                    <div
                      key={rowIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "13.5mm",
                        fontSize: "11px",

                        padding: "6px 2px",

                      }}
                    >
                      {/* Nro */}
                      {<div style={{ width: "10mm", fontWeight: 700, textAlign: "start" }}>
                        {it.nro || globalIndex}
                      </div>}

                      {/* Cantidad */}
                      <div style={{ width: "14mm", fontWeight: 700, textAlign: "start" }}>
                        {it.cantidad ?? "—"}
                      </div>

                      {/* Unidad */}
                      <div style={{ width: "20mm", textAlign: "start", color: "#475569" }}>
                        {it.unidad || "und"}
                      </div>

                      {/* Descripción */}
                      <div
                        style={{
                          flex: 1,
                          fontWeight: 600,
                          paddingLeft: "6px",
                          paddingRight: "6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {it.descripcion || "—"}
                      </div>

                      {/* Total Bs */}
                      <div style={{ width: "36mm", fontWeight: 800, textAlign: "right", paddingRight: "6px", color: "#0f2a4a" }}>
                        {itemTotal ? `Bs. ${fmt(itemTotal)}` : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* C. TARJETA DE TOTALES (SUBTOTAL, IVA, TOTAL) - SOLO EN LA ÚLTIMA PÁGINA */}
              {isLastPage && (
                <div
                  style={{
                    position: "absolute",
                    top: "236mm",
                    left: "128mm",
                    width: "72mm",
                    background: "#0f2a4a",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    boxShadow: "0 4px 12px rgba(15, 42, 74, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {/* Sub Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>Sub Total:</span>
                    <span style={{ fontWeight: 700 }}>Bs. {fmt(cot.precioSubTotal)}</span>
                  </div>

                  {/* IVA */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>IVA (13%):</span>
                    <span style={{ fontWeight: 700 }}>Bs. {fmt(cot.iva)}</span>
                  </div>

                  {/* Línea divisoria */}
                  <div style={{ borderTop: "1px solid #334155", margin: "2px 0" }} />

                  {/* Total General */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <span style={{ color: "#22c55e", fontWeight: 800 }}>TOTAL BS:</span>
                    <span style={{ color: "#22c55e", fontWeight: 900, fontSize: "14px" }}>
                      Bs. {fmt(cot.total)}
                    </span>
                  </div>
                </div>
              )}

              {/* D. TIEMPO DE MONTAJE Y NOTAS (ABAJO EN CONDICIONES) */}
              <div
                style={{
                  position: "absolute",
                  top: "218mm",
                  left: "29mm",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#0f2a4a",
                }}
              >
                <span style={{ fontWeight: 800 }}>{cot.tiempoMontaje || "15 a 20 días"}</span>
              </div>

              {cot.notas && (
                <div
                  style={{
                    position: "absolute",
                    top: "212.5mm",
                    left: "123.5mm",
                    maxWidth: "105mm",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#334155",
                    whiteSpace: "pre-line",
                  }}
                >

                  {cot.notas}
                </div>
              )}

              {/* Indicador de página (si son múltiples páginas) */}
              {totalPages > 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "6mm",
                    right: "12mm",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#64748b",
                  }}
                >
                  Página 5 ({pageIdx + 1} de {totalPages})
                </div>
              )}

            </div>
          </section>
        );
      })}
    </>
  );
}

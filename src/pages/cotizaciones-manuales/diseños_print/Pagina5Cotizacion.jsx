import React from "react";
import { Logo } from "./shared/Logo";
import { FranjaAtributos, IconoConfiables, IconoEficiencia, IconoPosventa } from "./shared/FranjaAtributos";
import { IconMedallaIngenieria } from "./shared/IconosDiseno";
import { CintaEsquina } from "./shared/CintaEsquina";
import { ICONOS_OFERTA, IconCondiciones, IconMontaje, IconNotas } from "./shared/IconosCotizacion";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 5 — "COTIZACIÓN"
// ---------------------------------------------------------------------------
// Reescribe el armado anterior, que era un PNG A4 vertical de fondo con los
// datos encima. Además de no ser carta apaisada, cortaba en seco a 8 ítems por
// hoja: los renglones del PNG tenían alto fijo, así que un ítem con seis viñetas
// se salía de su casilla y uno de una línea dejaba un hueco.
//
// Base de medición: el arte apaisado aprobado (1536×1024), con las mismas dos
// escalas de las páginas 2 a 4 —KX para medidas y cuerpos, KY para posiciones
// verticales— y la misma sustitución de la condensada del arte por Montserrat.
//
// LO QUE ESTA PÁGINA HACE DISTINTO: la tabla es de alto variable y se pagina
// sola. Ver PAGINACIÓN más abajo.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;

// Con line-height 1 la mayúscula de Montserrat queda ~0.22 em por debajo del
// tope de la caja de línea; los bloques se posicionan por el tope de mayúscula
// medido en el arte, así que se descuenta.
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

// --- Rejilla ----------------------------------------------------------------
const MARGEN = { x0: 36, x1: 1497 };
const ANCHO = MARGEN.x1 - MARGEN.x0;
const RADIO = 10;

const HEADER = {
  logo: { x: 36, y: 17, h: 77 },
  ejeTitulo: 776,      // el arte centra título, bajada y regla en este eje
  // OJO: 17 es el tope de la MAYÚSCULA, no lo primero que se ve. Arriba de eso,
  // entre y=2 y y=12, está la tilde de la "Ó". Midiendo la mancha entera daba 10
  // y con ese valor el título subía 7 px, la tilde se iba de la hoja y el
  // `overflow: hidden` de la página se la comía. La tilde vive en el aire que
  // queda por encima; no hay que reservarle sitio, hay que no robárselo.
  tituloCapTop: 17,
  bajadaCapTop: 81,
  regla: { y: 108, w: 122, h: 3 },
};

// Tarjeta de datos de la oferta: tres celdas separadas por hilos verticales.
// En el arte miden 475/487/496 px; se igualan, que la diferencia no se ve y así
// los tres grupos caen en la misma posición dentro de su celda.
const OFERTA = { y0: 118, y1: 206, iconoDx: 76, iconoW: 40, textoDx: 155, rotuloCap: 142, valorCap: 166, valorPitch: 21 };

// --- Tabla ------------------------------------------------------------------
// Las columnas salen del arte. La de descripción NO llega hasta el borde: se
// corta en 1020 px porque de 1030 para la derecha flota la tarjeta de totales,
// que en el arte se monta sobre la esquina inferior de la tabla. Cortar la
// columna es lo que garantiza que ninguna descripción larga pase por debajo.
const TABLA = {
  cabecera: { y0: 212, y1: 243 },
  cols: [36, 113, 220, 325, 1497],
  descX: 352,
  descX1: 1020,
  y0: 244,
  // Alto de renglón = padding + nº de líneas × paso. Ajustado sobre los ocho
  // renglones del arte: los de 2 líneas miden 45-50 px, los de 4 miden 79-81 y
  // el de 6 mide 113. De ahí salen paso 16.4 y padding 14.7.
  padding: 14.7,
  paso: 16.4,
};

// Hasta dónde puede llegar la tabla. En la última hoja se corta antes para
// dejar lugar a los totales y a las tarjetas del pie; en las de continuación
// aprovecha hasta donde arranca la franja.
const TABLA_Y1_ULTIMA = 780;
const TABLA_Y1_CONTINUA = 908;

const TOTALES = { x0: 1030, xMed: 1239, x1: 1497, y0: 686, y1: 777 };
const PIE = { izq: { x0: 36, x1: 864 }, der: { x0: 901, x1: 1496 }, y0: 788, y1: 908 };
const FRANJA_Y = 926;

// --- Cuerpos ----------------------------------------------------------------
// Calculados por ancho contra la columna del arte, igual que en las páginas 2
// a 4.
const CUERPO = {
  titulo: 10.2,        // "COTIZACIÓN" ≙ los 72 mm del arte
  bajada: 3.9,
  ofertaRotulo: 2.9,
  ofertaValor: 3.1,
  cabecera: 2.7,
  celda: 2.95,
  totalRotulo: 2.45,   // "IMPUESTOS ANTE LA LEY:" ≙ los 37.8 mm de la mitad navy
  totalValor: 3.4,
  pieTitulo: 4.2,
  pieRotulo: 3.1,
  pieValor: 3.4,
  nota: 2.85,
};

// --- Contenido --------------------------------------------------------------
export const CONTENIDO_COTIZACION = {
  titulo: "COTIZACIÓN",
  bajada: "Detalle del sistema a instalar",
  oferta: [
    { icono: "lugar", rotulo: "LUGAR Y FECHA" },
    { icono: "validez", rotulo: "VALIDEZ DE LA OFERTA" },
    { icono: "persona", rotulo: "REALIZADO POR" },
  ],
  cabecera: ["N°", "CANT.", "UD.", "DESCRIPCIÓN DEL PRODUCTO / SERVICIO"],
  totales: [
    { rotulo: "SUBTOTAL:", campo: "precioSubTotal" },
    { rotulo: "IMPUESTOS ANTE LA LEY:", campo: "iva" },
    { rotulo: "TOTAL:", campo: "total", fuerte: true },
  ],
  condiciones: ["CONDICIONES", "COMERCIALES"],
  rotuloMontaje: "TIEMPO DE MONTAJE:",
  rotuloNotas: "NOTAS:",
  moneda: "BS",
};

// La franja del pie de ESTA página no dice lo mismo que la de la portada: son
// otros cuatro mensajes y van a dos tintas, con la parte destacada en verde.
// Los iconos sí se reutilizan, incluida la medalla que estrenó la página 4.
const dos = (blanco, verde) => (
  <>
    {blanco}
    {"\n"}
    <span style={{ color: COLORS.verde }}>{verde}</span>
  </>
);

const ATRIBUTOS_COTIZACION = [
  { icono: <IconoConfiables />, texto: dos("EQUIPOS DE", "PRIMER NIVEL") },
  { icono: <IconMedallaIngenieria width="100%" height="100%" />, texto: "SOLUCIONES\nCONFIABLES" },
  { icono: <IconoEficiencia />, texto: <>MÁXIMA <span style={{ color: COLORS.verde }}>EFICIENCIA</span>{"\n"}Y RENDIMIENTO</> },
  { icono: <IconoPosventa />, texto: <>RESPALDO <span style={{ color: COLORS.verde }}>LOCAL</span>{"\n"}Y POSVENTA</> },
];

// --- Formato ----------------------------------------------------------------

function fmt(n, dec = 2) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function fmtFechaLarga(d) {
  if (!d) return "—";
  const f = new Date(String(d).slice(0, 10) + "T00:00:00");
  if (Number.isNaN(f.getTime())) return "—";
  return `${f.getDate()} de ${MESES[f.getMonth()]} del ${f.getFullYear()}`;
}

// --- Descripción rica -------------------------------------------------------
// El arte compone las descripciones a dos pesos: rótulos y títulos en negrita,
// viñetas y valores en redonda. Como el backend guarda `descripcion` como texto
// plano, el peso se deduce de la forma de cada línea, sin campos nuevos:
//
//   "• Perfil H para módulos."          viñeta          → todo en redonda
//   "Equipo: Panel Bifacial de 630W"    rótulo corto:   → el rótulo en negrita
//   "Tablero de protecciones en AC."    lo demás        → toda la línea en negrita
//
// El rótulo se reconoce por tener dos puntos dentro de los primeros 18
// caracteres y texto después; así "Estructura Solar para techo tipo teja:"
// —que termina en dos puntos— cae en el tercer caso y va entera en negrita,
// igual que en el arte.
const RE_ROTULO = /^([^:]{1,18}):\s+(.*)$/;

// Cuántos caracteres entran en un renglón de la columna de descripción. La
// columna mide 121.5 mm y el cuerpo es de 2.95 mm; con el avance medio de
// Montserrat en texto mixto (~0.55 em) entrarían ~75, pero los rótulos van en
// negrita y ensanchan, así que se toma 70 para quedar del lado seguro.
//
// Hace falta porque el alto de cada renglón se calcula ANTES de maquetar, para
// poder paginar: si se contaran solo los saltos de línea del texto, una
// descripción larga de una sola línea mediría lo mismo que una corta y su
// segunda línea se comería el separador de la fila siguiente.
const CARACTERES_POR_LINEA = 70;

const lineasQueOcupa = (linea) =>
  Math.max(1, Math.ceil(linea.partes.reduce((n, p) => n + p.t.length, 0) / CARACTERES_POR_LINEA));

function partirDescripcion(texto) {
  return String(texto ?? "")
    .split("\n")
    .map((cruda) => {
      const linea = cruda.trim();
      if (!linea) return null;
      if (/^[•·-]\s*/.test(linea)) {
        return { vineta: true, partes: [{ t: linea.replace(/^[•·-]\s*/, ""), fuerte: false }] };
      }
      const m = linea.match(RE_ROTULO);
      if (m) return { vineta: false, partes: [{ t: `${m[1]}: `, fuerte: true }, { t: m[2], fuerte: false }] };
      return { vineta: false, partes: [{ t: linea, fuerte: true }] };
    })
    .filter(Boolean);
}

// --- PAGINACIÓN -------------------------------------------------------------
// Se reparte por ALTO, no por cantidad de ítems: un ítem de seis viñetas ocupa
// dos veces y media lo que uno de dos líneas, así que cortar cada 8 llenaba
// unas hojas y desbordaba otras.
//
// Las hojas de continuación llegan hasta donde arranca la franja; la última se
// corta antes para dejar lugar a los totales y a las tarjetas del pie. Por eso
// se pregunta primero si TODO lo que queda entra en una hoja final: recién
// cuando no entra se cierra una de continuación y se sigue.
function paginar(filas) {
  if (filas.length === 0) return [[]];

  const capContinua = TABLA_Y1_CONTINUA - TABLA.y0;
  const capUltima = TABLA_Y1_ULTIMA - TABLA.y0;
  const suma = (arr) => arr.reduce((t, f) => t + f.alto, 0);

  const paginas = [];
  let restantes = filas;
  while (restantes.length) {
    if (suma(restantes) <= capUltima) {
      paginas.push(restantes);
      break;
    }
    let corte = 0;
    let acum = 0;
    while (corte < restantes.length && acum + restantes[corte].alto <= capContinua) {
      acum += restantes[corte].alto;
      corte += 1;
    }
    // Un ítem tan largo que no entra ni en una hoja entera igual tiene que
    // avanzar, o el bucle no termina nunca. Se lleva su hoja y se desborda.
    if (corte === 0) corte = 1;
    paginas.push(restantes.slice(0, corte));
    restantes = restantes.slice(corte);
  }
  return paginas;
}

// --- Piezas -----------------------------------------------------------------

function Encabezado({ c }) {
  return (
    <>
      <div style={{ position: "absolute", top: mmY(HEADER.logo.y), left: mmX(HEADER.logo.x) }}>
        <Logo heightMm={X(HEADER.logo.h)} />
      </div>

      <h1
        style={{
          position: "absolute",
          top: capTop(HEADER.tituloCapTop, CUERPO.titulo),
          left: 0,
          width: "100%",
          margin: 0,
          textAlign: "center",
          transform: `translateX(${(X(HEADER.ejeTitulo) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`,
          fontSize: `${CUERPO.titulo}mm`,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.1mm",
          // Explícito: index.css tiene un `h1 { color: … }` global que le gana a
          // la herencia. Misma nota que en las páginas 3 y 4.
          color: COLORS.navy,
        }}
      >
        {c.titulo}
      </h1>

      <p
        style={{
          position: "absolute",
          top: capTop(HEADER.bajadaCapTop, CUERPO.bajada),
          left: 0,
          width: "100%",
          margin: 0,
          textAlign: "center",
          transform: `translateX(${(X(HEADER.ejeTitulo) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`,
          fontSize: `${CUERPO.bajada}mm`,
          fontWeight: 500,
          lineHeight: 1,
          color: COLORS.tinta,
        }}
      >
        {c.bajada}
      </p>

      <div
        style={{
          position: "absolute",
          top: mmY(HEADER.regla.y),
          left: `${(X(HEADER.ejeTitulo) - X(HEADER.regla.w) / 2).toFixed(2)}mm`,
          width: mmX(HEADER.regla.w),
          height: mmX(HEADER.regla.h),
          background: COLORS.verde,
        }}
      />
    </>
  );
}

function TarjetaOferta({ c, cot }) {
  const valores = [
    [cot?.lugar || "Santa Cruz de la Sierra", fmtFechaLarga(cot?.fecha)],
    [`${cot?.validezOfertaDias ?? 30} días`],
    [cot?.realizadoPor || "—"],
  ];
  const celda = ANCHO / c.oferta.length;

  return (
    <div
      style={{
        position: "absolute",
        left: mmX(MARGEN.x0),
        top: mmY(OFERTA.y0),
        width: mmX(ANCHO),
        height: mmY(OFERTA.y1 - OFERTA.y0),
        background: COLORS.blanco,
        border: `0.25mm solid ${COLORS.regla}`,
        borderRadius: mmX(RADIO),
      }}
    >
      {c.oferta.map((o, i) => {
        const Icono = ICONOS_OFERTA[o.icono];
        const x = celda * i;
        // El grupo se centra vertical: la celda del lugar tiene dos renglones de
        // valor y las otras uno, y en el arte los tres quedan a la misma altura
        // óptica, no a la misma línea de base.
        const lineas = valores[i].length;
        const dy = ((OFERTA.y1 - OFERTA.y0) - (OFERTA.valorCap - OFERTA.rotuloCap + lineas * OFERTA.valorPitch)) / 2;
        const rotuloCap = OFERTA.y0 + dy + 8;

        return (
          <React.Fragment key={o.rotulo}>
            {i > 0 && (
              <div style={{ position: "absolute", left: mmX(x), top: mmY(14), width: "0.25mm", height: mmY(OFERTA.y1 - OFERTA.y0 - 28), background: COLORS.regla }} />
            )}
            <Icono
              style={{
                position: "absolute",
                left: mmX(x + OFERTA.iconoDx),
                top: `${(Y(OFERTA.y1 - OFERTA.y0) / 2 - X(OFERTA.iconoW) / 2).toFixed(2)}mm`,
                width: mmX(OFERTA.iconoW),
                height: mmX(OFERTA.iconoW),
              }}
            />
            <p
              style={{
                position: "absolute",
                left: mmX(x + OFERTA.textoDx),
                top: capTop(rotuloCap - OFERTA.y0, CUERPO.ofertaRotulo),
                margin: 0,
                fontSize: `${CUERPO.ofertaRotulo}mm`,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "0.05mm",
                color: COLORS.navy,
                whiteSpace: "nowrap",
              }}
            >
              {o.rotulo}
            </p>
            {valores[i].map((v, j) => (
              <p
                key={j}
                style={{
                  position: "absolute",
                  left: mmX(x + OFERTA.textoDx),
                  top: capTop(rotuloCap - OFERTA.y0 + (OFERTA.valorCap - OFERTA.rotuloCap) + j * OFERTA.valorPitch, CUERPO.ofertaValor),
                  margin: 0,
                  fontSize: `${CUERPO.ofertaValor}mm`,
                  fontWeight: 500,
                  lineHeight: 1,
                  color: COLORS.tinta,
                  whiteSpace: "nowrap",
                }}
              >
                {v}
              </p>
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Tabla({ c, filas, y1 }) {
  const [c0, c1, c2, c3, c4] = TABLA.cols;
  const centro = (a, b) => (a + b) / 2;

  return (
    <>
      {/* Cabecera */}
      <div
        style={{
          position: "absolute",
          left: mmX(c0),
          top: mmY(TABLA.cabecera.y0),
          width: mmX(c4 - c0),
          height: mmY(TABLA.cabecera.y1 - TABLA.cabecera.y0),
          background: COLORS.navy,
          borderRadius: `${mmX(RADIO)} ${mmX(RADIO)} 0 0`,
        }}
      />
      {[centro(c0, c1), centro(c1, c2), centro(c2, c3)].map((cx, i) => (
        <p
          key={i}
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            top: capTop(TABLA.cabecera.y0 + 10, CUERPO.cabecera),
            margin: 0,
            textAlign: "center",
            transform: `translateX(${(X(cx) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`,
            fontSize: `${CUERPO.cabecera}mm`,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.08mm",
            color: COLORS.blanco,
            whiteSpace: "nowrap",
          }}
        >
          {c.cabecera[i]}
        </p>
      ))}
      <p
        style={{
          position: "absolute",
          left: mmX(TABLA.descX),
          top: capTop(TABLA.cabecera.y0 + 10, CUERPO.cabecera),
          margin: 0,
          fontSize: `${CUERPO.cabecera}mm`,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "0.08mm",
          color: COLORS.blanco,
          whiteSpace: "nowrap",
        }}
      >
        {c.cabecera[3]}
      </p>

      {/* Caja de la tabla */}
      <div
        style={{
          position: "absolute",
          left: mmX(c0),
          top: mmY(TABLA.y0),
          width: mmX(c4 - c0),
          height: mmY(y1 - TABLA.y0),
          border: `0.25mm solid ${COLORS.regla}`,
          borderTop: "none",
          borderRadius: `0 0 ${mmX(RADIO)} ${mmX(RADIO)}`,
        }}
      />

      {/* Renglones */}
      {filas.map((f, i) => {
        const top = TABLA.y0 + filas.slice(0, i).reduce((t, x) => t + x.alto, 0);
        const centroFila = top + f.alto / 2;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ position: "absolute", left: mmX(c0), top: mmY(top), width: mmX(c4 - c0), height: "0.25mm", background: COLORS.regla }} />
            )}

            {[[c0, c1, f.nro], [c1, c2, f.cantidad], [c2, c3, f.unidad]].map(([a, b, v], j) => (
              <p
                key={j}
                style={{
                  position: "absolute",
                  left: 0,
                  width: "100%",
                  top: `${(Y(centroFila) - CUERPO.celda * 0.5).toFixed(2)}mm`,
                  margin: 0,
                  textAlign: "center",
                  transform: `translateX(${(X(centro(a, b)) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`,
                  fontSize: `${CUERPO.celda}mm`,
                  fontWeight: j === 2 ? 500 : 700,
                  lineHeight: 1,
                  color: j === 2 ? COLORS.tinta : COLORS.navy,
                  whiteSpace: "nowrap",
                }}
              >
                {v}
              </p>
            ))}

            <div
              style={{
                position: "absolute",
                left: mmX(TABLA.descX),
                top: mmY(top + TABLA.padding / 2),
                width: mmX(TABLA.descX1 - TABLA.descX),
              }}
            >
              {f.lineas.map((ln, k) => (
                <p
                  key={k}
                  style={{
                    margin: 0,
                    fontSize: `${CUERPO.celda}mm`,
                    lineHeight: (Y(TABLA.paso) / CUERPO.celda).toFixed(3),
                    color: COLORS.navy,
                    paddingLeft: ln.vineta ? mmX(14) : 0,
                    textIndent: ln.vineta ? mmX(-14) : 0,
                  }}
                >
                  {ln.vineta ? <span style={{ color: COLORS.verde }}>• </span> : null}
                  {ln.partes.map((p, q) => (
                    <span key={q} style={{ fontWeight: p.fuerte ? 700 : 500, color: p.fuerte ? COLORS.navy : COLORS.tinta }}>
                      {p.t}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}

function Totales({ c, cot }) {
  const alto = (TOTALES.y1 - TOTALES.y0) / c.totales.length;
  return (
    <div style={{ position: "absolute", left: mmX(TOTALES.x0), top: mmY(TOTALES.y0), width: mmX(TOTALES.x1 - TOTALES.x0), height: mmY(TOTALES.y1 - TOTALES.y0), borderRadius: mmX(4), overflow: "hidden" }}>
      {c.totales.map((t, i) => (
        <React.Fragment key={t.campo}>
          <div style={{ position: "absolute", left: 0, top: mmY(alto * i), width: mmX(TOTALES.xMed - TOTALES.x0), height: mmY(alto), background: COLORS.navy }} />
          <div style={{ position: "absolute", left: mmX(TOTALES.xMed - TOTALES.x0), top: mmY(alto * i), width: mmX(TOTALES.x1 - TOTALES.xMed), height: mmY(alto), background: COLORS.verde900 }} />
          <p
            style={{
              position: "absolute",
              left: 0,
              top: `${(Y(alto * i + alto / 2) - (t.fuerte ? CUERPO.totalValor : CUERPO.totalRotulo) * 0.5).toFixed(2)}mm`,
              width: mmX(TOTALES.xMed - TOTALES.x0),
              margin: 0,
              textAlign: "center",
              fontSize: `${t.fuerte ? CUERPO.totalValor : CUERPO.totalRotulo}mm`,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "0.05mm",
              color: COLORS.blanco,
              whiteSpace: "nowrap",
            }}
          >
            {t.rotulo}
          </p>
          <p
            style={{
              position: "absolute",
              left: mmX(TOTALES.xMed - TOTALES.x0),
              top: `${(Y(alto * i + alto / 2) - CUERPO.totalValor * 0.5).toFixed(2)}mm`,
              width: mmX(TOTALES.x1 - TOTALES.xMed),
              margin: 0,
              textAlign: "center",
              fontSize: `${CUERPO.totalValor}mm`,
              fontWeight: 700,
              lineHeight: 1,
              color: COLORS.blanco,
              whiteSpace: "nowrap",
            }}
          >
            {fmt(cot?.[t.campo])} {c.moneda}
          </p>
        </React.Fragment>
      ))}
    </div>
  );
}

function TarjetasPie({ c, cot }) {
  const alto = PIE.y1 - PIE.y0;
  const notas = String(cot?.notas ?? "")
    .split("\n")
    .map((n) => n.replace(/^[•·-]\s*/, "").trim())
    .filter(Boolean);

  const caja = {
    position: "absolute",
    top: mmY(PIE.y0),
    height: mmY(alto),
    background: COLORS.blanco,
    border: `0.25mm solid ${COLORS.regla}`,
    borderRadius: mmX(RADIO),
  };

  return (
    <>
      <div style={{ ...caja, left: mmX(PIE.izq.x0), width: mmX(PIE.izq.x1 - PIE.izq.x0) }}>
        <IconCondiciones style={{ position: "absolute", left: mmX(36), top: `${(Y(alto) / 2 - X(84) / 2).toFixed(2)}mm`, width: mmX(84), height: mmX(84) }} />
        <p style={{ position: "absolute", left: mmX(148), top: `${(Y(alto) / 2 - CUERPO.pieTitulo * 1.1).toFixed(2)}mm`, margin: 0, fontSize: `${CUERPO.pieTitulo}mm`, fontWeight: 800, lineHeight: 1.15, color: COLORS.verde900, whiteSpace: "pre-line" }}>
          {c.condiciones.join("\n")}
        </p>

        <IconMontaje style={{ position: "absolute", left: mmX(478), top: `${(Y(alto) / 2 - X(60) / 2).toFixed(2)}mm`, width: mmX(60), height: mmX(60) }} />
        <p style={{ position: "absolute", left: mmX(566), top: `${(Y(alto) / 2 - CUERPO.pieRotulo * 1.35).toFixed(2)}mm`, margin: 0, fontSize: `${CUERPO.pieRotulo}mm`, fontWeight: 700, lineHeight: 1, color: COLORS.navy, whiteSpace: "nowrap" }}>
          {c.rotuloMontaje}
        </p>
        <p style={{ position: "absolute", left: mmX(566), top: `${(Y(alto) / 2 + CUERPO.pieRotulo * 0.35).toFixed(2)}mm`, margin: 0, fontSize: `${CUERPO.pieValor}mm`, fontWeight: 800, lineHeight: 1, color: COLORS.verde900, whiteSpace: "nowrap" }}>
          {cot?.tiempoMontaje || "—"}
        </p>
      </div>

      {/* Sin notas no se dibuja la tarjeta: una caja vacía con el rótulo "NOTAS:"
          y nada debajo se lee como un olvido, no como una decisión. */}
      {notas.length > 0 && (
      <div style={{ ...caja, left: mmX(PIE.der.x0), width: mmX(PIE.der.x1 - PIE.der.x0) }}>
        <IconNotas style={{ position: "absolute", left: mmX(30), top: mmY(18), width: mmX(58), height: mmX(58) }} />
        <p style={{ position: "absolute", left: mmX(110), top: capTop(18, CUERPO.pieRotulo), margin: 0, fontSize: `${CUERPO.pieRotulo}mm`, fontWeight: 800, lineHeight: 1, color: COLORS.navy }}>
          {c.rotuloNotas}
        </p>
        <div style={{ position: "absolute", left: mmX(110), top: mmY(38), width: mmX(PIE.der.x1 - PIE.der.x0 - 130) }}>
          {notas.map((n, i) => (
            <p key={i} style={{ margin: 0, fontSize: `${CUERPO.nota}mm`, lineHeight: (Y(20) / CUERPO.nota).toFixed(3), color: COLORS.tinta, paddingLeft: mmX(14), textIndent: mmX(-14) }}>
              <span style={{ color: COLORS.verde }}>• </span>
              {n}
            </p>
          ))}
        </div>
      </div>
      )}
    </>
  );
}

// --- Página -----------------------------------------------------------------

export function Pagina5Cotizacion({ cot, contenido = CONTENIDO_COTIZACION }) {
  if (!cot) return null;
  const c = contenido;

  const filas = (cot.items ?? []).map((it, i) => {
    const lineas = partirDescripcion(it.descripcion);
    return {
      nro: it.nro ?? i + 1,
      cantidad: it.cantidad ?? "—",
      unidad: it.unidad || "Ud.",
      lineas,
      alto: TABLA.padding + Math.max(1, lineas.reduce((n, l) => n + lineasQueOcupa(l), 0)) * TABLA.paso,
    };
  });

  const paginas = paginar(filas);

  return (
    <>
      {paginas.map((pagina, i) => {
        const ultima = i === paginas.length - 1;
        return (
          <section
            key={i}
            className="pagina"
            style={{
              position: "relative",
              width: `${PAGE_WIDTH_MM}mm`,
              height: `${PAGE_HEIGHT_MM}mm`,
              background: COLORS.blanco,
              overflow: "hidden",
              margin: "0 auto 24px",
              fontFamily: FONT_FAMILY,
              color: COLORS.tinta,
            }}
          >
            <Encabezado c={c} />
            <TarjetaOferta c={c} cot={cot} />
            <Tabla c={c} filas={pagina} y1={ultima ? TABLA_Y1_ULTIMA : TABLA_Y1_CONTINUA} />

            {ultima && <Totales c={c} cot={cot} />}
            {ultima && <TarjetasPie c={c} cot={cot} />}

            {paginas.length > 1 && (
              <p style={{ position: "absolute", right: mmX(MARGEN.x1 - MARGEN.x0 - 1420), top: mmY(FRANJA_Y - 22), margin: 0, fontSize: "2.5mm", fontWeight: 600, color: COLORS.tinta }}>
                {i + 1} / {paginas.length}
              </p>
            )}

            <div
              style={{
                position: "absolute",
                left: 0,
                top: mmY(FRANJA_Y),
                width: "100%",
                height: `${(PAGE_HEIGHT_MM - Y(FRANJA_Y)).toFixed(2)}mm`,
                background: COLORS.navy,
                overflow: "hidden",
              }}
            >
              <FranjaAtributos escala="carta" mostrarBarra={false} atributos={ATRIBUTOS_COTIZACION} />
            </div>

            <CintaEsquina />
          </section>
        );
      })}
    </>
  );
}

export default Pagina5Cotizacion;

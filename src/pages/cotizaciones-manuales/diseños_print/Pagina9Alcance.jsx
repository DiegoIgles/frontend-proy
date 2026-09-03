import React from "react";
import { Logo } from "./shared/Logo";
import { FranjaAtributos, ATRIBUTOS } from "./shared/FranjaAtributos";
import { IconMedallaIngenieria } from "./shared/IconosDiseno";
import { CintaEsquina } from "./shared/CintaEsquina";
import { IconEscudo } from "./shared/IconosProteccion";
import { IconNotas } from "./shared/IconosCotizacion";
import { IconoPosventa } from "./shared/FranjaAtributos";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 9 — "ALCANCE DEL PROYECTO"
// ---------------------------------------------------------------------------
// Reemplaza al PNG estático /cotizacion/cotizacion9_A4.png, que era A4 vertical
// y entraba escalado en la hoja carta apaisada. Base de medición: el arte
// apaisado aprobado (1536×1024), con las mismas dos escalas de las páginas 2 a 8.
//
// Hoja enteramente estática: no hay ningún campo de la entidad en juego. Lo que
// tiene de particular es la fila de cinco pasos —cada uno con su número, su
// imagen y su lista— separados por flechas.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

// --- Rejilla ----------------------------------------------------------------
const MARGEN = { x0: 29, x1: 1500 };
const ANCHO = MARGEN.x1 - MARGEN.x0;
const RADIO = 10;

const CABEZA = {
  logo: { x: 36, y: 23, h: 73 },
  ejeX: 784,
  tituloCap: 36, subtituloCap: 100, parrafoCap: 136,
};

// Los cinco pasos. En el arte las columnas están corridas —los pasos arrancan en
// 29, 307, 627, 919 y 1246, con pasos de 278 a 327 px— así que se regularizan a
// cinco iguales. Las flechas caen solas en el hueco que queda entre columnas.
const PASOS = {
  gap: 26,
  circuloCy: 192, circuloD: 44,
  rotuloDx: 58, rotuloCap: 178, rotuloPaso: 24,
  imagen: { y0: 222, y1: 378 },
  listaCap: 392, listaPaso: 23,
  flechaW: 30,
};

const BANDA = { y0: 543, y1: 756, navy: { x0: 24, x1: 299 }, texto: { x0: 313, x1: 913 }, foto: { x0: 921, x1: 1510 } };
// El bloque de texto arranca en 796 y no en 826: medido sobre el arte, el
// rótulo cae en 792 y la primera línea de descripción en 835, con paso de 25.
// Con los valores anteriores las tres líneas del segundo y tercer beneficio
// terminaban pegadas al borde de la tarjeta y contra la franja del pie; así
// quedan los ~20 px de aire que deja el original.
const BENEFICIOS = { y0: 795, y1: 917, discoCx: 58, discoD: 52, textoDx: 114, rotuloCap: 796, descCap: 836, descPaso: 25 };
const PIE_Y = 921;

// --- Cuerpos ----------------------------------------------------------------
const CUERPO = {
  titulo: 8.6,        // "ALCANCE DEL PROYECTO" ≙ los 137 mm del arte
  subtitulo: 4.4,
  parrafo: 3.2,
  pasoNumero: 4.2,
  pasoRotulo: 3.2,
  // Los cuerpos de las listas y de los beneficios están por debajo de lo que
  // sugiere el arte a propósito: Montserrat es más ancha que su condensada y con
  // los valores "naturales" se cortaban el último ítem de los pasos 3 y 4, el
  // segundo párrafo de la banda y el rótulo del cuarto beneficio.
  pasoItem: 2.45,
  bandaTitulo: 4.4,
  bandaTexto: 2.75,
  benRotulo: 2.45,
  benDesc: 2.6,
};

// --- Contenido --------------------------------------------------------------
const B = (t) => ({ t, b: true });

export const CONTENIDO_ALCANCE = {
  titulo: "ALCANCE DEL PROYECTO",
  subtitulo: "SOLUCIÓN INTEGRAL LLAVE EN MANO",
  parrafo: "Nos encargamos de todo el proceso para que usted disfrute de los beneficios de la energía solar con total tranquilidad.",
  pasos: [
    {
      n: 1, rotulo: ["INGENIERÍA"], imagen: "paso1",
      items: ["Diseño eléctrico del sistema.", "Memorias de cálculo.", "Planos y documentación técnica.", "Configuración del proyecto."],
    },
    {
      n: 2, rotulo: ["SUMINISTRO"], imagen: "paso2",
      items: ["Paneles solares de alta eficiencia.", "Inversores certificados.", "Estructuras de montaje.", "Protecciones eléctricas.", "Cables y accesorios."],
    },
    {
      n: 3, rotulo: ["INSTALACIÓN"], imagen: "paso3",
      items: ["Montaje de estructuras y módulos.", "Conexionado AC/DC.", "Configuración de inversores.", "Puesta en marcha.", "Pruebas y verificación."],
    },
    {
      n: 4, rotulo: ["GENERACIÓN", "DISTRIBUIDA"], imagen: "paso4",
      items: ["Gestión del registro ante la AETN.", "Trámite y aprobación con la distribuidora (CRE).", "Instalación de medidor bidireccional.", "Habilitación para inyectar excedentes a la red."],
    },
    {
      n: 5, rotulo: ["ACOMPAÑAMIENTO"], imagen: "paso5",
      items: [
        [{ t: "Monitoreo remoto del sistema." }],
        [{ t: "Soporte técnico especializado." }],
        [{ t: "Programa " }, B("Protegemos tu Inversión.")],
        [{ t: "Atención postventa." }],
      ],
    },
  ],
  banda: {
    tituloA: "¿QUÉ ES LA ",
    tituloB: "GENERACIÓN DISTRIBUIDA?",
    parrafos: [
      [{ t: "La Generación Distribuida le permite producir su propia energía para autoconsumo y, además, inyectar los excedentes a la red eléctrica mediante un medidor bidireccional. Así, maximiza su ahorro y contribuye a un sistema energético más eficiente y sostenible." }],
      [B("Enerlogic realiza todo el proceso administrativo y técnico para su habilitación, usted solo "), { t: "disfruta del ahorro.", b: true, c: COLORS.verde }],
    ],
  },
  beneficios: [
    { icono: IconEscudo, rotulo: "PROYECTO LLAVE EN MANO", desc: ["Nos ocupamos de todo", "el proceso, de principio a fin."] },
    { icono: IconNotas, rotulo: "GESTIÓN DOCUMENTAL INCLUIDA", desc: ["Incluye todos los trámites", "y registros necesarios para", "su conexión y operación."] },
    { icono: IconMedallaIngenieria, rotulo: "CUMPLIMIENTO NORMATIVO", desc: ["Trabajamos bajo la normativa", "vigente y con los más altos", "estándares de calidad."] },
    { icono: IconoPosventa, rotulo: "SOPORTE TÉCNICO ESPECIALIZADO", desc: ["Acompañamiento continuo para", "asegurar el máximo rendimiento", "de su sistema."] },
  ],
};

const RUTA = "/cotizacion/assets/alcance";

// La franja del pie es la misma de las páginas 4, 5, 7 y 8.
const ATRIBUTOS_PAGINA9 = ATRIBUTOS.map((a, i) =>
  i === 0 ? { ...a, icono: <IconMedallaIngenieria width="100%" height="100%" /> } : a
);

function Rico({ partes }) {
  return (
    <>
      {partes.map((p, i) =>
        typeof p === "string" ? <span key={i}>{p}</span> : (
          <span key={i} style={{ fontWeight: p.b ? 700 : "inherit", color: p.c || (p.b ? COLORS.navy : "inherit") }}>{p.t}</span>
        )
      )}
    </>
  );
}

// Flecha que une un paso con el siguiente.
function Flecha({ cx, cy }) {
  const w = PASOS.flechaW;
  return (
    <svg
      viewBox="0 0 30 24"
      style={{ position: "absolute", left: mmX(cx - w / 2), top: `${(Y(cy) - X(w) * 0.8 / 2).toFixed(2)}mm`, width: mmX(w), height: mmX(w * 0.8) }}
    >
      <path d="M0 8h16V2l14 10-14 10v-6H0z" fill={COLORS.verde} />
    </svg>
  );
}

// --- Piezas -----------------------------------------------------------------

function Paso({ p, x0, ancho }) {
  // Los números alternan navy y verde, como en el arte: es lo que da ritmo a la
  // fila de cinco y evita que se lea como una lista plana.
  const color = p.n % 2 === 1 ? COLORS.navy : COLORS.verde900;

  return (
    <>
      <div style={{ position: "absolute", left: mmX(x0 + 4), top: `${(Y(PASOS.circuloCy) - X(PASOS.circuloD) / 2).toFixed(2)}mm`, width: mmX(PASOS.circuloD), height: mmX(PASOS.circuloD), borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: `${CUERPO.pasoNumero}mm`, fontWeight: 700, lineHeight: 1, color: COLORS.blanco }}>{p.n}</span>
      </div>

      {p.rotulo.map((l, i) => (
        <p key={l} style={{ position: "absolute", left: mmX(x0 + PASOS.rotuloDx), top: capTop(PASOS.rotuloCap + i * PASOS.rotuloPaso, CUERPO.pasoRotulo), margin: 0, fontSize: `${CUERPO.pasoRotulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.05mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
          {l}
        </p>
      ))}

      {/* La imagen se centra en su columna con `contain`: cada recorte del arte
          tiene su propia proporción y el ancho de columna es el mismo para los
          cinco, así que estirarlas las deformaría de forma distinta a cada una. */}
      <img
        src={`${RUTA}/${p.imagen}.jpg`}
        alt=""
        style={{ position: "absolute", left: mmX(x0), top: mmY(PASOS.imagen.y0), width: mmX(ancho), height: mmY(PASOS.imagen.y1 - PASOS.imagen.y0), objectFit: "contain" }}
      />

      <ul style={{ position: "absolute", left: mmX(x0), top: capTop(PASOS.listaCap, CUERPO.pasoItem), width: mmX(ancho), margin: 0, padding: 0, listStyle: "none" }}>
        {p.items.map((it, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: mmX(9), marginBottom: mmY(6) }}>
            <span style={{ flex: "0 0 auto", width: mmX(7), height: mmX(7), borderRadius: "50%", background: COLORS.navy, marginTop: mmY(6) }} />
            <p style={{ margin: 0, fontSize: `${CUERPO.pasoItem}mm`, fontWeight: 500, lineHeight: (Y(PASOS.listaPaso) / CUERPO.pasoItem).toFixed(3), color: COLORS.tinta }}>
              {typeof it === "string" ? it : <Rico partes={it} />}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Pagina9Alcance({ contenido = CONTENIDO_ALCANCE }) {
  const c = contenido;
  const anchoPaso = (ANCHO - PASOS.gap * 4) / 5;
  const anchoBen = (BANDA.foto.x1 - MARGEN.x0) / c.beneficios.length;

  const centrado = (cx) => ({
    position: "absolute", left: 0, width: "100%", margin: 0, textAlign: "center",
    transform: `translateX(${(X(cx) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`, whiteSpace: "nowrap",
  });

  return (
    <section
      className="pagina"
      style={{ position: "relative", width: `${PAGE_WIDTH_MM}mm`, height: `${PAGE_HEIGHT_MM}mm`, background: COLORS.blanco, overflow: "hidden", margin: "0 auto 24px", fontFamily: FONT_FAMILY, color: COLORS.tinta }}
    >
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: mmY(CABEZA.logo.y), left: mmX(CABEZA.logo.x) }}>
        <Logo heightMm={X(CABEZA.logo.h)} />
      </div>

      <h1 style={{ ...centrado(CABEZA.ejeX), top: capTop(CABEZA.tituloCap, CUERPO.titulo), fontSize: `${CUERPO.titulo}mm`, fontWeight: 800, lineHeight: 1, letterSpacing: "0.05mm", color: COLORS.navy }}>
        {c.titulo}
      </h1>
      <p style={{ ...centrado(CABEZA.ejeX), top: capTop(CABEZA.subtituloCap, CUERPO.subtitulo), fontSize: `${CUERPO.subtitulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.08mm", color: COLORS.verde900 }}>
        {c.subtitulo}
      </p>
      <p style={{ ...centrado(CABEZA.ejeX), top: capTop(CABEZA.parrafoCap, CUERPO.parrafo), fontSize: `${CUERPO.parrafo}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.tinta }}>
        {c.parrafo}
      </p>

      {/* ── Cinco pasos ────────────────────────────────────────────────── */}
      {c.pasos.map((p, i) => {
        const x0 = MARGEN.x0 + i * (anchoPaso + PASOS.gap);
        return (
          <React.Fragment key={p.n}>
            <Paso p={p} x0={x0} ancho={anchoPaso} />
            {i < c.pasos.length - 1 && (
              <Flecha cx={x0 + anchoPaso + PASOS.gap / 2} cy={(PASOS.imagen.y0 + PASOS.imagen.y1) / 2} />
            )}
          </React.Fragment>
        );
      })}

      {/* ── Banda: ilustración, explicación y foto ─────────────────────── */}
      <div style={{ position: "absolute", left: mmX(BANDA.navy.x0), top: mmY(BANDA.y0), width: mmX(BANDA.navy.x1 - BANDA.navy.x0), height: mmY(BANDA.y1 - BANDA.y0), background: COLORS.navy, borderRadius: mmX(RADIO), overflow: "hidden" }}>
        <img src={`${RUTA}/ilustracion.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div style={{ position: "absolute", left: mmX(BANDA.texto.x0 - 13), top: mmY(BANDA.y0), width: mmX(BANDA.texto.x1 - BANDA.texto.x0 + 13), height: mmY(BANDA.y1 - BANDA.y0), background: COLORS.hueso, borderRadius: mmX(RADIO), padding: `${mmY(24)} ${mmX(30)}`, boxSizing: "border-box" }}>
        <p style={{ margin: 0, fontSize: `${CUERPO.bandaTitulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.05mm", color: COLORS.navy }}>
          {c.banda.tituloA}
          <span style={{ color: COLORS.verde900 }}>{c.banda.tituloB}</span>
        </p>
        {c.banda.parrafos.map((p, i) => (
          <p key={i} style={{ margin: `${mmY(i === 0 ? 20 : 16)} 0 0`, fontSize: `${CUERPO.bandaTexto}mm`, fontWeight: 500, lineHeight: 1.6, color: COLORS.tinta }}>
            <Rico partes={p} />
          </p>
        ))}
      </div>

      <img src={`${RUTA}/atardecer.jpg`} alt="" style={{ position: "absolute", left: mmX(BANDA.foto.x0), top: mmY(BANDA.y0), width: mmX(BANDA.foto.x1 - BANDA.foto.x0), height: mmY(BANDA.y1 - BANDA.y0), objectFit: "cover", borderRadius: mmX(RADIO) }} />

      {/* ── Cuatro beneficios ──────────────────────────────────────────── */}
      {/* Van sueltos sobre el papel: NO hay tarjeta. Muestreado en el arte, de
          y=790 a 918 todo es blanco puro y recién en 919 empieza el navy del
          pie; lo que parecía el filete de una tarjeta era ruido de la imagen.
          Lo que sí hay son hilos verticales entre columnas. */}
      {c.beneficios.map((b, i) => {
        const Icono = b.icono;
        const x0 = MARGEN.x0 + i * anchoBen;
        const esMedalla = Icono === IconMedallaIngenieria;
        return (
          <React.Fragment key={b.rotulo}>
            {i > 0 && (
              <div style={{ position: "absolute", left: mmX(x0 - 6), top: mmY(BENEFICIOS.y0 + 6), width: "0.25mm", height: mmY(BENEFICIOS.y1 - BENEFICIOS.y0 - 12), background: COLORS.regla }} />
            )}
            <div style={{ position: "absolute", left: mmX(x0 + BENEFICIOS.discoCx - BENEFICIOS.discoD / 2), top: `${(Y((BENEFICIOS.y0 + BENEFICIOS.y1) / 2) - X(BENEFICIOS.discoD) / 2).toFixed(2)}mm`, width: mmX(BENEFICIOS.discoD), height: mmX(BENEFICIOS.discoD), borderRadius: "50%", background: COLORS.navy }}>
              {/* La medalla y el auricular ya vienen en verde y sin prop de color;
                  los demás toman blanco. Van igual sobre el disco navy porque el
                  verde de marca lee bien sobre él. */}
              <Icono {...(esMedalla ? {} : { color: COLORS.verde })} style={{ position: "absolute", left: "24%", top: "24%", width: "52%", height: "52%" }} />
            </div>
            <p style={{ position: "absolute", left: mmX(x0 + BENEFICIOS.textoDx), top: capTop(BENEFICIOS.rotuloCap, CUERPO.benRotulo), margin: 0, fontSize: `${CUERPO.benRotulo}mm`, fontWeight: 700, lineHeight: 1, letterSpacing: "0.04mm", color: COLORS.navy, whiteSpace: "nowrap" }}>
              {b.rotulo}
            </p>
            {b.desc.map((l, j) => (
              <p key={l} style={{ position: "absolute", left: mmX(x0 + BENEFICIOS.textoDx), top: capTop(BENEFICIOS.descCap + j * BENEFICIOS.descPaso, CUERPO.benDesc), margin: 0, fontSize: `${CUERPO.benDesc}mm`, fontWeight: 500, lineHeight: 1, color: COLORS.tinta, whiteSpace: "nowrap" }}>
                {l}
              </p>
            ))}
          </React.Fragment>
        );
      })}

      {/* ── Pie ────────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: 0, top: mmY(PIE_Y), width: "100%", height: `${(PAGE_HEIGHT_MM - Y(PIE_Y)).toFixed(2)}mm`, background: COLORS.navy, overflow: "hidden" }}>
        <FranjaAtributos escala="carta" mostrarBarra={false} atributos={ATRIBUTOS_PAGINA9} />
      </div>
      <CintaEsquina />
    </section>
  );
}

export default Pagina9Alcance;

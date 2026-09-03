import React from "react";
import { Logo } from "./shared/Logo";
import { FranjaAtributos, ATRIBUTOS } from "./shared/FranjaAtributos";
import { ICONOS_VISTA, ICONOS_KPI, IconMedallaIngenieria } from "./shared/IconosDiseno";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 4 — "DISEÑO DEL SISTEMA"
// ---------------------------------------------------------------------------
// Reemplaza el armado anterior, que era un PNG A4 vertical de fondo con los
// datos posicionados encima en milímetros. Además de no ser carta apaisada,
// ese enfoque obligaba a subir SIEMPRE las cuatro imágenes: los recuadros
// estaban pintados en el PNG, así que si faltaba una quedaba un hueco blanco
// con borde en medio de la hoja.
//
// Base de medición: el arte apaisado aprobado (PNG 1536×1024), con las mismas
// dos escalas de las páginas 2 y 3 —KX para medidas y cuerpos, KY para
// posiciones verticales— y la misma sustitución tipográfica (la condensada del
// arte por Montserrat, con los cuerpos calculados por ancho de columna).
//
// LO QUE ESTA PÁGINA HACE DISTINTO: es la única variable. El arte contempla
// cuatro imágenes, que es el máximo, pero el sistema acepta de una a cuatro y
// la banda central se rearma según cuántas haya. Ver DISTRIBUCIÓN más abajo.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;

// Con line-height 1 la mayúscula de Montserrat no arranca en el tope de la caja
// de línea: queda ~0.22 em más abajo. Los bloques se posicionan por el tope de
// mayúscula medido en el arte, así que se descuenta acá.
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

// --- Rejilla ----------------------------------------------------------------
// Las tres bandas (galería, KPIs y encabezado) comparten los mismos márgenes
// laterales. El arte los respeta al píxel; lo que NO respeta son los anchos de
// las tarjetas chicas ni los pasos de la franja de KPIs, que salieron
// irregulares (472/426/501 px las tarjetas, 352/350/422 px los KPIs). Acá se
// regularizan: mismo ancho para todas y mismo paso para los cuatro KPIs. La
// diferencia con el arte es de pocos píxeles en cada caso y a cambio la página
// aguanta cualquier cantidad de imágenes sin rehacer las medidas.
const MARGEN = { x0: 39, x1: 1487 };
const ANCHO = MARGEN.x1 - MARGEN.x0;

const HEADER = {
  logo: { x: 38, y: 24, h: 77 },
  tituloCapTop: 126,
  subtituloCapTop: 209,
  textoX: 41,
  regla: { y: 232, w: 59, h: 4 },
};

// La banda de la galería va de y=242 (debajo de la regla verde) a y=754 (arriba
// de la franja de KPIs). Todo lo que cambia entre variantes cambia acá adentro.
const BANDA = { y0: 242, y1: 754, filaHeroY1: 515, filaChicasY0: 523, gap: 16 };

// Los desplazamientos internos de la franja (32, 54, 106…) son RELATIVOS a la
// tarjeta, que ya está posicionada en y0. Sumarles y0 los manda fuera de la hoja.
const KPI = { y0: 766, y1: 896, radio: 14 };
const FRANJA_Y = 927;

// El arte de esta página cambia el primer icono de la franja por una medalla.
// Se reemplaza solo ese ítem y los otros tres quedan como están: la portada usa
// la lista original y no se entera.
const ATRIBUTOS_PAGINA4 = ATRIBUTOS.map((a, i) =>
  i === 0 ? { ...a, icono: <IconMedallaIngenieria width="100%" height="100%" /> } : a
);

// --- Tarjetas ---------------------------------------------------------------
// Dos tipos, los dos sacados del arte:
//
//   HERO   imagen grande + tarjeta navy al lado con icono, título, regla y
//          descripción. Es la que el arte usa para la vista superior.
//   CHICA  tarjeta blanca con la imagen a la izquierda, a sangre, y el texto
//          a la derecha. Es la que el arte usa para las otras tres.
//
// Las medidas internas son relativas a la caja de cada tarjeta, no absolutas:
// así la misma tarjeta sirve a cualquier alto, que es lo que necesitan las
// variantes de 1 y 2 imágenes.
// `altoRef` es el alto que la tarjeta navy tiene en el arte. Los dy de adentro
// se midieron contra ese alto; cuando la tarjeta crece (variantes de 1 y 2
// imágenes) el bloque se centra en vez de quedarse pegado arriba, que es lo que
// dejaba medio panel navy vacío.
const HERO = { tarjeta: 296, altoRef: 272, padIzq: 31, iconoW: 58, iconoDy: 45, textoDx: 104, tituloDy: 65, reglaDy: 100, reglaW: 38, descDy: 122, descPitch: 28 };

// `imagenMaxAspecto` frena el ancho de la imagen en las tarjetas chicas. Sin
// tope, con dos tarjetas la imagen sería de 430×231 px (1.9:1) y a una foto 5:4
// —la proporción que pide el formulario— se le comería la mitad de arriba y de
// abajo. Con el tope el recorte se parece al del arte en las tres variantes.
const CHICA = { imagenPct: 0.62, imagenMaxAspecto: 1.5, textoPad: 18, iconoDy: 39, iconoW: 36, tituloDy: 97, reglaDy: 124, reglaW: 36, descDy: 148 };
const RADIO = 14;

// --- Cuerpos ----------------------------------------------------------------
// Calculados por ancho contra la columna del arte, igual que en las páginas 2
// y 3. Al lado de cada uno, la medida del arte que respeta.
const CUERPO = {
  titulo: 11.4,       // "DISEÑO DEL SISTEMA" ≙ los 134 mm del arte
  subtitulo: 3.8,     // "Ingeniería desarrollada para este proyecto" ≙ 80.6 mm
  heroTitulo: 3.1,    // "VISTA SUPERIOR" ≙ los 27.8 mm del arte
  heroDesc: 3.15,
  chicaTitulo: 2.6,
  chicaDesc: 2.4,
  kpiLabel: 2.8,      // "PRODUCCIÓN ANUAL ESTIMADA" entra en su columna
  kpiValor: 9.5,
  kpiUnidad: 3.4,
};

// --- Contenido --------------------------------------------------------------
// Las cuatro vistas son RANURAS FIJAS: cada una tiene su icono, su rótulo y su
// descripción, y se queda con ellos aunque el usuario no llene las otras. Si
// solo carga la vista lateral, esa pasa a ser la imagen grande de la hoja pero
// sigue diciendo VISTA LATERAL. El maquetado se arma por CANTIDAD; el texto,
// por ranura. Lo contrario —rotular por posición— haría que una foto lateral
// apareciera como "vista superior" en cuanto sea la primera que se subió.
//
// El orden de este arreglo es el de `cot.imagenesProyecto`, y es también el
// orden de las ranuras del formulario. No reordenar sin tocar el formulario.
export const VISTAS = [
  { clave: "superior", icono: "vistaSuperior", titulo: "VISTA SUPERIOR", descripcion: "Distribución optimizada de los módulos solares sobre cubierta" },
  { clave: "tresD", icono: "vista3d", titulo: "VISTA 3D", descripcion: "Visualización del sistema e integración en el sitio" },
  { clave: "inclinada", icono: "vistaInclinada", titulo: "VISTA INCLINADA", descripcion: "Detalle de la distribución y orientación de los módulos solares" },
  { clave: "lateral", icono: "vistaLateral", titulo: "VISTA LATERAL", descripcion: "Integración arquitectónica del sistema" },
];

export const CONTENIDO_DISENO = {
  titulo: "DISEÑO DEL SISTEMA",
  subtitulo: "Ingeniería desarrollada para este proyecto",
  kpis: [
    { icono: "potencia", campo: "potenciaInstalada", label: "POTENCIA INSTALADA", unidad: "kWp", dec: 2 },
    { icono: "paneles", campo: "cantidadPaneles", label: "CANTIDAD DE PANELES", unidad: "unidades", dec: 0 },
    { icono: "superficie", campo: "superficieRequerida", label: "SUPERFICIE REQUERIDA", unidad: "m²", dec: 0 },
    { icono: "produccion", campo: "produccionAnualEstimada", label: "PRODUCCIÓN ANUAL ESTIMADA", unidad: "MWh/año", dec: 1 },
  ],
};

function fmt(n, dec = 2) {
  if (n === null || n === undefined || n === "") return "—";
  return Number(n).toLocaleString("es-BO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// --- DISTRIBUCIÓN -----------------------------------------------------------
// La regla, en una línea: la primera vista cargada es el hero; las que sobran
// van en una fila de tarjetas chicas iguales debajo.
//
//   1 imagen   un hero solo, ocupando la banda entera.
//   2 imágenes dos heroes apilados, media banda cada uno.
//   3 imágenes hero arriba + 2 tarjetas chicas abajo.
//   4 imágenes hero arriba + 3 tarjetas chicas abajo.  ← el arte
//
// El caso de 2 es el único que se sale del patrón, y es a propósito: si sobrara
// UNA sola tarjeta chica ocuparía el ancho completo de la hoja y su imagen
// quedaría en una franja de 9:1, que no es un recorte que exista. Promoverla a
// un segundo hero usa la misma pieza del arte a otro alto y llena la banda.
function distribucion(n) {
  const { y0, y1, filaHeroY1, filaChicasY0, gap } = BANDA;
  if (n <= 1) return { heroes: [[y0, y1]], chicas: null };
  if (n === 2) {
    const alto = (y1 - y0 - gap) / 2;
    return { heroes: [[y0, y0 + alto], [y0 + alto + gap, y1]], chicas: null };
  }
  return { heroes: [[y0, filaHeroY1]], chicas: [filaChicasY0, y1] };
}

// --- Piezas -----------------------------------------------------------------

function Imagen({ src, alt, radio }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: radio }}
    />
  );
}

function TarjetaHero({ vista, src, x0, x1, y0, y1 }) {
  const Icono = ICONOS_VISTA[vista.icono];
  const cardX = x1 - HERO.tarjeta;
  const imgW = cardX - BANDA.gap - x0;
  const dy = Math.max(0, (y1 - y0 - HERO.altoRef) / 2);

  return (
    <>
      <div style={{ position: "absolute", left: mmX(x0), top: mmY(y0), width: mmX(imgW), height: mmY(y1 - y0) }}>
        <Imagen src={src} alt={vista.titulo} radio={mmX(RADIO)} />
      </div>

      <div
        style={{
          position: "absolute",
          left: mmX(cardX),
          top: mmY(y0),
          width: mmX(HERO.tarjeta),
          height: mmY(y1 - y0),
          background: COLORS.navy,
          borderRadius: mmX(RADIO),
        }}
      >
        <Icono
          style={{
            position: "absolute",
            left: mmX(HERO.padIzq - 4),
            top: mmY(HERO.iconoDy + dy),
            width: mmX(HERO.iconoW),
            height: mmX(HERO.iconoW),
          }}
        />
        <p
          style={{
            position: "absolute",
            left: mmX(HERO.textoDx),
            top: capTop(HERO.tituloDy + dy, CUERPO.heroTitulo),
            margin: 0,
            fontSize: `${CUERPO.heroTitulo}mm`,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.08mm",
            color: COLORS.blanco,
            whiteSpace: "nowrap",
          }}
        >
          {vista.titulo}
        </p>
        <div
          style={{
            position: "absolute",
            left: mmX(HERO.textoDx),
            top: mmY(HERO.reglaDy + dy),
            width: mmX(HERO.reglaW),
            height: "0.55mm",
            background: COLORS.verde,
          }}
        />
        <p
          style={{
            position: "absolute",
            left: mmX(HERO.padIzq),
            top: capTop(HERO.descDy + dy, CUERPO.heroDesc),
            width: mmX(HERO.tarjeta - HERO.padIzq * 2),
            margin: 0,
            fontSize: `${CUERPO.heroDesc}mm`,
            fontWeight: 400,
            lineHeight: (Y(HERO.descPitch) / CUERPO.heroDesc).toFixed(3),
            color: COLORS.blanco,
          }}
        >
          {vista.descripcion}
        </p>
      </div>
    </>
  );
}

function TarjetaChica({ vista, src, x0, ancho, y0, y1 }) {
  const Icono = ICONOS_VISTA[vista.icono];
  const imgW = Math.round(Math.min(ancho * CHICA.imagenPct, (y1 - y0) * CHICA.imagenMaxAspecto));
  const textoX = imgW + CHICA.textoPad;

  return (
    <div
      style={{
        position: "absolute",
        left: mmX(x0),
        top: mmY(y0),
        width: mmX(ancho),
        height: mmY(y1 - y0),
        background: COLORS.blanco,
        border: `0.25mm solid ${COLORS.regla}`,
        borderRadius: mmX(RADIO),
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: mmX(imgW), height: "100%" }}>
        <Imagen src={src} alt={vista.titulo} radio={0} />
      </div>

      <Icono
        style={{
          position: "absolute",
          left: mmX(textoX),
          top: mmY(CHICA.iconoDy),
          width: mmX(CHICA.iconoW),
          height: mmX(CHICA.iconoW),
        }}
      />
      <p
        style={{
          position: "absolute",
          left: mmX(textoX),
          top: capTop(CHICA.tituloDy, CUERPO.chicaTitulo),
          margin: 0,
          fontSize: `${CUERPO.chicaTitulo}mm`,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "0.06mm",
          color: COLORS.navy,
          whiteSpace: "nowrap",
        }}
      >
        {vista.titulo}
      </p>
      <div
        style={{
          position: "absolute",
          left: mmX(textoX),
          top: mmY(CHICA.reglaDy),
          width: mmX(CHICA.reglaW),
          height: "0.5mm",
          background: COLORS.verde,
        }}
      />
      <p
        style={{
          position: "absolute",
          left: mmX(textoX),
          top: capTop(CHICA.descDy, CUERPO.chicaDesc),
          width: mmX(ancho - textoX - CHICA.textoPad),
          margin: 0,
          fontSize: `${CUERPO.chicaDesc}mm`,
          fontWeight: 400,
          lineHeight: 1.45,
          color: COLORS.tinta,
        }}
      >
        {vista.descripcion}
      </p>
    </div>
  );
}

// Las cuatro columnas NO son iguales: se reparten por contenido. Con columnas
// iguales "PRODUCCIÓN ANUAL ESTIMADA" —el rótulo más largo, 25 caracteres contra
// los 18 del más corto— se salía por el lado redondeado de la tarjeta. El arte
// resuelve lo mismo dándole a esa columna 422 px contra ~350 de las otras.
//
// Acá se hace con flex en vez de con anchos calculados a mano: cada columna pide
// lo que mide su contenido real y el sobrante se reparte parejo. Así también
// aguanta un valor largo —"7.200,0" ocupa más que "8"— y aguanta que mañana los
// rótulos vengan de NestJS, sin recalcular nada.
//
// Lo VERTICAL sigue siendo el arte, no el flujo: los tres renglones llevan el
// margen que hace caer su mayúscula en la altura medida (32, 54 y 106 px desde
// el borde de la tarjeta).
const KPI_INT = { padIzq: 24, disco: 70, gapDisco: 22, padDer: 24, discoCy: 62, labelCap: 32, valorCap: 54, unidadCap: 106, divisorY0: 27 };

// Tope de la mayúscula medido → margen superior de la caja de línea.
const cajaTop = (pxCapTop, cuerpoMm) => Y(pxCapTop) - 0.22 * cuerpoMm;

function FranjaKpis({ cot }) {
  const alto = KPI.y1 - KPI.y0;
  const topLabel = cajaTop(KPI_INT.labelCap, CUERPO.kpiLabel);
  const topValor = cajaTop(KPI_INT.valorCap, CUERPO.kpiValor);
  const topUnidad = cajaTop(KPI_INT.unidadCap, CUERPO.kpiUnidad);

  return (
    <div
      style={{
        position: "absolute",
        left: mmX(MARGEN.x0),
        top: mmY(KPI.y0),
        width: mmX(ANCHO),
        height: mmY(alto),
        background: COLORS.blanco,
        border: `0.25mm solid ${COLORS.regla}`,
        borderRadius: mmX(RADIO),
        display: "flex",
        alignItems: "stretch",
        // Red de seguridad: si algún día un rótulo o una cifra no entran ni
        // repartiendo, se recortan contra el borde en vez de desbordar la hoja.
        overflow: "hidden",
      }}
    >
      {CONTENIDO_DISENO.kpis.map((k, i) => {
        const Icono = ICONOS_KPI[k.icono];
        return (
          <div
            key={k.campo}
            style={{
              position: "relative",
              flex: "1 1 auto",
              display: "flex",
              alignItems: "flex-start",
              gap: mmX(KPI_INT.gapDisco),
              paddingLeft: mmX(KPI_INT.padIzq),
              paddingRight: mmX(KPI_INT.padDer),
            }}
          >
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: mmY(KPI_INT.divisorY0),
                  width: "0.3mm",
                  height: mmY(alto - KPI_INT.divisorY0 * 2),
                  background: COLORS.verde,
                  opacity: 0.5,
                }}
              />
            )}

            {/* El disco lo pinta el contenedor y no el SVG: es el mismo para los
                cuatro y así el glifo queda siempre centrado en él. */}
            <div
              style={{
                flex: "0 0 auto",
                marginTop: `${(Y(KPI_INT.discoCy) - X(KPI_INT.disco) / 2).toFixed(2)}mm`,
                width: mmX(KPI_INT.disco),
                height: mmX(KPI_INT.disco),
                borderRadius: "50%",
                background: COLORS.navy,
                position: "relative",
              }}
            >
              <Icono style={{ position: "absolute", left: "23%", top: "23%", width: "54%", height: "54%" }} />
            </div>

            <div style={{ flex: "0 1 auto", display: "flex", flexDirection: "column", minWidth: 0 }}>
              <p
                style={{
                  margin: `${topLabel.toFixed(2)}mm 0 0`,
                  fontSize: `${CUERPO.kpiLabel}mm`,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "0.05mm",
                  color: COLORS.navy,
                  whiteSpace: "nowrap",
                }}
              >
                {k.label}
              </p>
              <p
                style={{
                  margin: `${(topValor - topLabel - CUERPO.kpiLabel).toFixed(2)}mm 0 0`,
                  fontSize: `${CUERPO.kpiValor}mm`,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.1mm",
                  color: COLORS.verde,
                  whiteSpace: "nowrap",
                }}
              >
                {fmt(cot?.[k.campo], k.dec)}
              </p>
              <p
                style={{
                  margin: `${(topUnidad - topValor - CUERPO.kpiValor).toFixed(2)}mm 0 0`,
                  fontSize: `${CUERPO.kpiUnidad}mm`,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: COLORS.tinta,
                  whiteSpace: "nowrap",
                }}
              >
                {k.unidad}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// La cinta de la esquina inferior derecha. No es una familia de arcos
// concéntricos —con eso las cuatro bandas tendrían el mismo grosor en todo el
// recorrido— sino un barrido: nacen anchas en el borde inferior y se afinan
// hasta juntarse contra el borde derecho, donde la naranja y la azul ya se
// terminaron y solo quedan el blanco y el verde.
//
// Cada frontera de color se midió en el arte en cinco alturas (y = 1024, 1006,
// 980, 955 y el borde derecho) y se ajustó como una cuadrática de Bézier que va
// del borde inferior al derecho. Se pintan de afuera hacia adentro y cada una
// cierra por la esquina inferior derecha: lo que se ve de cada color es la
// franja que la siguiente no llegó a tapar, y el verde, que va último, se queda
// con la esquina.
const CINTA = [
  { x0: 1189, cx: 1337.5, cy: 925.0, y1: 926, color: COLORS.naranja },
  { x0: 1225, cx: 1279.5, cy: 948.5, y1: 927, color: COLORS.azul },
  { x0: 1353, cx: 1405.5, cy: 960.0, y1: 928, color: COLORS.blanco },
  { x0: 1385, cx: 1439.5, cy: 964.0, y1: 916, color: COLORS.verde },
];

function CintaEsquina() {
  return (
    <svg
      viewBox={`0 0 ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM}`}
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 4, pointerEvents: "none" }}
    >
      {CINTA.map((b) => (
        <path
          key={b.color}
          d={`M ${X(b.x0)} ${PAGE_HEIGHT_MM} Q ${X(b.cx)} ${Y(b.cy)} ${PAGE_WIDTH_MM} ${Y(b.y1)} L ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM} Z`}
          fill={b.color}
        />
      ))}
    </svg>
  );
}

export function Pagina4Diseno({ cot, contenido = CONTENIDO_DISENO }) {
  if (!cot) return null;

  // Ranura fija: cada URL se queda con la vista de SU posición. Las ranuras
  // vacías se descartan, así que las que quedan conservan su rótulo aunque el
  // usuario haya salteado alguna.
  const vistas = VISTAS.map((v, i) => ({ vista: v, src: (cot.imagenesProyecto ?? [])[i] })).filter((v) => !!v.src);

  const { heroes, chicas } = distribucion(vistas.length);
  const enChicas = chicas ? vistas.slice(heroes.length) : [];
  const anchoChica = enChicas.length ? (ANCHO - BANDA.gap * (enChicas.length - 1)) / enChicas.length : 0;

  return (
    <section
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
      {/* ── Encabezado ──────────────────────────────────────────────────── */}

      <div style={{ position: "absolute", top: mmY(HEADER.logo.y), left: mmX(HEADER.logo.x) }}>
        <Logo heightMm={X(HEADER.logo.h)} />
      </div>

      <h1
        style={{
          position: "absolute",
          top: capTop(HEADER.tituloCapTop, CUERPO.titulo),
          left: mmX(HEADER.textoX),
          margin: 0,
          fontSize: `${CUERPO.titulo}mm`,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.1mm",
          // Explícito y no heredado: index.css tiene un `h1 { color: … }` global
          // que le gana a la herencia. Ver la misma nota en la página 3.
          color: COLORS.navy,
          whiteSpace: "nowrap",
        }}
      >
        {contenido.titulo}
      </h1>

      <p
        style={{
          position: "absolute",
          top: capTop(HEADER.subtituloCapTop, CUERPO.subtitulo),
          left: mmX(HEADER.textoX + 2),
          margin: 0,
          fontSize: `${CUERPO.subtitulo}mm`,
          fontWeight: 500,
          lineHeight: 1,
          color: COLORS.tinta,
          whiteSpace: "nowrap",
        }}
      >
        {contenido.subtitulo}
      </p>

      <div
        style={{
          position: "absolute",
          top: mmY(HEADER.regla.y),
          left: mmX(HEADER.textoX),
          width: mmX(HEADER.regla.w),
          height: mmX(HEADER.regla.h),
          background: COLORS.verde,
        }}
      />

      {/* ── Galería: de una a cuatro vistas ─────────────────────────────── */}

      {heroes.map(([y0, y1], i) =>
        vistas[i] ? (
          <TarjetaHero
            key={vistas[i].vista.clave}
            vista={vistas[i].vista}
            src={vistas[i].src}
            x0={MARGEN.x0}
            x1={MARGEN.x1}
            y0={y0}
            y1={y1}
          />
        ) : null
      )}

      {enChicas.map((v, i) => (
        <TarjetaChica
          key={v.vista.clave}
          vista={v.vista}
          src={v.src}
          x0={MARGEN.x0 + i * (anchoChica + BANDA.gap)}
          ancho={anchoChica}
          y0={chicas[0]}
          y1={chicas[1]}
        />
      ))}

      {/* ── Franja de indicadores ───────────────────────────────────────── */}

      <FranjaKpis cot={cot} />

      {/* ── Pie ─────────────────────────────────────────────────────────── */}

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
        <FranjaAtributos escala="carta" mostrarBarra={false} atributos={ATRIBUTOS_PAGINA4} />
      </div>

      <CintaEsquina />
    </section>
  );
}

export default Pagina4Diseno;

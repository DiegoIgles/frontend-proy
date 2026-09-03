import React from "react";
import { Logo } from "./shared/Logo";
import { ICONOS_METRICA, ICONOS_VALOR } from "./shared/IconosExperiencia";
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, COLORS, FONT_FAMILY } from "./shared/constants";

// ---------------------------------------------------------------------------
// PÁGINA 3 — "LA CONFIANZA DE NUESTRA EXPERIENCIA"
// ---------------------------------------------------------------------------
// Reemplaza al PNG estático /cotizacion/cotizacion3_A4.png, que además de ser
// vertical (A4) entraba escalado dentro de una hoja carta apaisada y quedaba
// con dos bandas blancas a los lados.
//
// Base de medición: el arte apaisado aprobado por Enerlogic (PNG 1536×1024),
// medido pixel a pixel con el mismo método de las páginas 1 y 2. Se adoptan las
// DOS ESCALAS de la página 2 —misma maqueta de bandas horizontales, mismo
// problema de encaje entre un arte 3:2 y una hoja 1.294:1—:
//
//     KX = 279.4 / 1536 = 0.181901 mm/px   → medidas, cuerpos y todo lo que
//                                            deba conservar su proporción
//     KY = 215.9 / 1024 = 0.210840 mm/px   → posiciones verticales
//
// Cada banda cae así en su proporción original de la hoja (logo, título,
// métricas, tarjeta de organizaciones, franja de valores) y el 16% de
// diferencia entre escalas se reparte como aire entre bandas, que es donde no
// molesta. Los logotipos de las organizaciones y los iconos usan KX en ambos
// ejes: son marcas registradas y no se deforman jamás.
//
// Tipografía: el arte usa una grotesca condensada que no está licenciada. Se
// sustituye por Montserrat y los cuerpos se calculan POR ANCHO (que la línea
// ocupe la misma columna del arte), no por altura de mayúscula — mismo criterio
// que la página 2. Cada cuerpo lleva anotado el ancho del arte que respeta.

const KX = PAGE_WIDTH_MM / 1536;
const KY = PAGE_HEIGHT_MM / 1024;
const X = (px) => +(px * KX).toFixed(2);
const Y = (px) => +(px * KY).toFixed(2);
const mmX = (px) => `${X(px)}mm`;
const mmY = (px) => `${Y(px)}mm`;

// --- Foto y cuña ------------------------------------------------------------
// La foto ocupa la esquina superior derecha y la separa del navy una cuña en
// "<" con el vértice apuntando a la izquierda. Las dos rectas se ajustaron
// sobre el borde real de la mancha, fila por fila:
//
//     tramo superior  (699, 0)   → (590, 139)     pendiente -0.783 px/px
//     tramo inferior  (590, 139) → (918, 556)     pendiente +0.788 px/px
//
// El vértice no se midió: es la intersección de las dos rectas, porque en el
// arte el codo está redondeado y no hay un píxel que sea "el vértice". El tramo
// inferior se ajustó sobre el FILETE VERDE y no sobre el borde de la foto: los
// paneles se funden con el navy entre y≈500 y y≈556 y el borde de la mancha se
// corre hacia la izquierda a medida que baja. Ese degradado viene horneado en el
// recorte, así que la máscara puede terminar en 556 sin que se vea la costura.
const CUNA = { xTop: 699, vx: 590, vy: 139, yFin: 556, xFin: 918, codo: 18 };

// El recorte sale del arte aprobado (píxeles 580..1536 × 0..556, reescalado
// ×2). Arranca 10 px a la izquierda del vértice a propósito: si la caja empezara
// justo en 590 cualquier redondeo dejaría un pelo sin foto en la punta de la
// cuña. Es lo mejor disponible hoy — el cliente todavía no entregó la toma
// original. Cuando la mande, se reemplaza el archivo respetando la proporción
// 956:556 y esta caja no se toca.
// El recorte además viene RETOCADO: en el arte la franja de métricas está
// dibujada encima de la foto, así que el icono de CO₂ y la cifra "+1.060 t"
// cruzan la cuña y quedaban horneados en el bitmap — con la franja viva encima
// se veían dobles. Esa zona (y 340..492 del arte, hasta 95 px a la derecha de
// la cuña) se pintó de navy con rampas suaves; el arte ya era casi navy ahí, así
// que no se perdió foto. Si algún día cambian las métricas de sitio, hay que
// rehacer el retoque, no correr el texto.
const FOTO_SRC = "/cotizacion/assets/hero-experiencia.jpg";
const FOTO_BOX = { x0: 580, y0: 0, x1: 1536, y1: 556 };

function CunaFoto() {
  const p = (px, py) => `${X(px)},${Y(py)}`;
  // El contorno se recorre de arriba hacia abajo; el área lo cierra por la
  // derecha en sentido inverso, así el polígono no se cruza consigo mismo.
  // El codo del arte no es en punta: tiene ~18 px de radio. Se resuelve con un
  // arco entre los dos puntos de tangencia, a 18 px del vértice sobre cada rayo.
  const tang = (x, y) => {
    const dx = x - CUNA.vx, dy = y - CUNA.vy;
    const m = Math.hypot(dx, dy);
    return [CUNA.vx + (dx / m) * CUNA.codo, CUNA.vy + (dy / m) * CUNA.codo];
  };
  const [ax, ay] = tang(CUNA.xTop, 0);
  const [bx, by] = tang(CUNA.xFin, CUNA.yFin);
  const contorno =
    `M${p(CUNA.xTop, 0)} L${p(ax, ay)}` +
    ` A${X(CUNA.codo)} ${X(CUNA.codo)} 0 0 0 ${p(bx, by)}` +
    ` L${p(CUNA.xFin, CUNA.yFin)}`;
  // La máscara va 4 px DENTRO de la foto: el recorte arrastra el propio filo del
  // arte (halo del filete y un pelo de navy más claro) y con la máscara justo
  // sobre la línea ese pelo asomaba. Los 4 px que se ceden quedan tapados por el
  // filete, que mide 3 px y se dibuja sobre la línea medida.
  const i = 4;
  const area = `${p(CUNA.xTop + i, 0)} ${p(1536, 0)} ${p(1536, CUNA.yFin)} ${p(CUNA.xFin + i, CUNA.yFin)} ${p(CUNA.vx + i, CUNA.vy)}`;

  return (
    <svg
      viewBox={`0 0 ${PAGE_WIDTH_MM} ${PAGE_HEIGHT_MM}`}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
    >
      <defs>
        <mask id="p3Foto">
          <rect width={PAGE_WIDTH_MM} height={PAGE_HEIGHT_MM} fill="#000" />
          <polygon points={area} fill="#fff" />
        </mask>
        {/* El filete no llega abajo: en el arte se apaga contra la foto a la
            altura de las métricas y de ahí para abajo el corte lo hace el propio
            degradado de los paneles. */}
        <linearGradient id="p3Filete" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={Y(360)}>
          <stop offset="0" stopColor={COLORS.verde} />
          <stop offset="0.55" stopColor={COLORS.verde} />
          <stop offset="1" stopColor={COLORS.verde} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* preserveAspectRatio="none": la foto se estira con KY igual que el resto
          de la página. Es deliberado. Lo que hay que preservar acá NO es la
          proporción del bitmap sino la POSICIÓN de lo que trae dibujado adentro
          —el filo del campo de paneles y el degradado con que se funden en el
          navy son parte de la composición—, y encajarla por "slice" la agranda
          un 16% y corre esos accidentes 23 px a la izquierda. El estirón
          vertical sobre un skyline al 16% no se lee; el corrimiento sí. */}
      <g mask="url(#p3Foto)">
        <image
          href={FOTO_SRC}
          x={X(FOTO_BOX.x0)}
          y={Y(FOTO_BOX.y0)}
          width={X(FOTO_BOX.x1) - X(FOTO_BOX.x0)}
          height={Y(FOTO_BOX.y1)}
          preserveAspectRatio="none"
        />
      </g>

      {/* Filete verde sobre la cuña: 3 px del arte */}
      <path d={contorno} fill="none" stroke="url(#p3Filete)" strokeWidth={X(3)} strokeLinecap="round" />
    </svg>
  );
}

// --- Contenido --------------------------------------------------------------
// Todo el texto y el listado de organizaciones viven acá para que mañana los
// sirva NestJS sin tocar el maquetado. Las métricas son las que el cliente
// aprobó para 2026: se actualizan editando este objeto, no la maqueta.

export const CONTENIDO_EXPERIENCIA = {
  tituloL1: "LA CONFIANZA DE",
  tituloL2A: "NUESTRA ",
  tituloL2B: "EXPERIENCIA",
  metricas: [
    { icono: "proyectos", valor: "+100", unidad: "", etiqueta: ["PROYECTOS", "EJECUTADOS"], color: COLORS.azul },
    { icono: "potencia", valor: "+1.250", unidad: "kWp", etiqueta: ["POTENCIA FOTOVOLTAICA", "INSTALADA"], color: COLORS.verde },
    { icono: "co2", valor: "+1.060", unidad: "t", etiqueta: ["CO₂ MITIGADAS"], color: COLORS.verde },
  ],
  rotuloOrganizaciones: "ORGANIZACIONES QUE RESPALDAN NUESTRA TRAYECTORIA",
  valores: ["CALIDAD", "INGENIERÍA", "COMPROMISO", "SOSTENIBILIDAD"],
};

// --- Métricas ---------------------------------------------------------------
// Centros y divisores medidos sobre el arte. El paso entre centros es de ~245
// px, pero los dos divisores NO caen en el punto medio exacto (416 y 685 contra
// 423 y 668): el arte los corrió para dejar respirar a la columna del medio,
// que es la de rótulo más largo. Se respetan tal cual.
const METRICA = {
  centros: [299.5, 546, 790],
  divisores: [416, 685],
  divisorY: [356, 506],
  iconoCy: 380.5,
  iconoR: 36.5,
  numeroCapTop: 427,
  etiquetaCapTop: [466, 487],
  subrayadoY: 517,
  subrayadoW: 48,
};

// --- Tarjeta de organizaciones ----------------------------------------------
// Dos rectángulos redondeados concéntricos-por-fuera: el marco verde asoma ~7 px
// alrededor de la tarjeta hueso. El rótulo monta sobre el borde superior del
// marco y lo interrumpe —el fondo navy del rótulo es lo que corta el filete—,
// rematado por dos discos verdes, igual que en el arte.
const MARCO = { x0: 20.5, x1: 1516.5, y0: 559, y1: 902.5, r: 26 };
const TARJETA = { x0: 28, x1: 1510.5, y0: 568, y1: 896, r: 22 };
const ROTULO_DISCO = 17;      // diámetro de los discos verdes del rótulo
const FILA_DIVISOR_Y = 725;   // hilo horizontal entre las dos filas
const FILA_DIVISOR_X = [55, 1485];

// Cada logotipo con su caja medida en el arte (x0, x1 = extremos horizontales;
// y0, y1 = extremos verticales). Se posicionan por su propio centro vertical
// porque en el arte no comparten línea de base: una marca alta como el escudo
// de la UAGRM y un puro wordmark como URBANOVA se compensan ópticamente, no
// geométricamente.
//
// Los archivos son recortes del arte aprobado desmatados a alfa real y
// reescalados ×3 — sirven para armar y para pruebas de impresión, pero conviene
// reemplazarlos por los originales vectoriales de cada organización en cuanto
// lleguen: mismo nombre de archivo y la maqueta no cambia.
const RUTA_ORG = "/cotizacion/assets/organizaciones";
const PAD_ORG = 2; // margen que se dejó alrededor de cada recorte, en px del arte

const ORGANIZACIONES = [
  // Fila 1
  { src: "pil", alt: "PIL Andina", x0: 60, x1: 201, y0: 604, y1: 692 },
  { src: "kieffer", alt: "Kieffer & Asociados", x0: 262, x1: 430, y0: 610, y1: 695 },
  { src: "urbanova", alt: "Urbanova", x0: 483, x1: 622, y0: 644, y1: 669 },
  { src: "adventista", alt: "Iglesia Adventista del Séptimo Día", x0: 665, x1: 830, y0: 622, y1: 679 },
  { src: "totalenergies", alt: "TotalEnergies", x0: 876, x1: 974, y0: 616, y1: 691 },
  { src: "veracruz", alt: "Panadería Veracruz", x0: 1021, x1: 1139, y0: 620, y1: 678 },
  { src: "ypfb-andina", alt: "YPFB Andina", x0: 1188, x1: 1302, y0: 609, y1: 697 },
  { src: "ende", alt: "ENDE Guaracachi", x0: 1354, x1: 1475, y0: 613, y1: 687 },
  // Fila 2
  { src: "gad-cochabamba", alt: "Gobierno Autónomo Departamental de Cochabamba", x0: 56, x1: 251, y0: 746, y1: 851 },
  { src: "imcruz", alt: "Imcruz", x0: 304, x1: 424, y0: 778, y1: 819 },
  { src: "unicef", alt: "UNICEF", x0: 482, x1: 610, y0: 789, y1: 821 },
  { src: "cosmol", alt: "Cosmol", x0: 667, x1: 760, y0: 761, y1: 854 },
  { src: "protekon", alt: "Protekon", x0: 814, x1: 945, y0: 792, y1: 823 },
  { src: "parkerstore", alt: "ParkerStore", x0: 995, x1: 1123, y0: 789, y1: 824 },
  { src: "wise-wire", alt: "Wise Wire", x0: 1174, x1: 1296, y0: 792, y1: 819 },
  { src: "uagrm", alt: "Universidad Autónoma Gabriel René Moreno", x0: 1340, x1: 1486, y0: 742, y1: 860 },
];

// Hilos verticales entre logotipos. Van escalonados entre filas porque el arte
// los centra en el hueco real de cada par de marcas, y los huecos no coinciden.
const DIVISORES_ORG = [
  { fila: 0, xs: [230, 461, 644, 854, 999, 1163, 1326], y0: 608, y1: 725 },
  { fila: 1, xs: [274, 454, 637, 790, 971, 1149, 1321], y0: 725, y1: 860 },
];

// --- Franja de valores ------------------------------------------------------
// El icono se normaliza a una caja de 64 px (en el arte cada dibujo mide entre
// 50 y 81 px de ancho según su forma; lo que el arte mantiene constante es el
// centro óptico, no el bounding box).
const VALORES = {
  iconoCx: [212.5, 523.5, 833, 1156.5],
  iconoCy: 949,
  iconoCaja: 64,
  etiquetaX: [270, 580, 897, 1211],
  etiquetaCapTop: 938,
  subrayadoY: 968,
  subrayadoW: 42,
  divisores: [426, 740.5, 1074],
  divisorY: [919, 980],
  claves: ["calidad", "ingenieria", "compromiso", "sostenibilidad"],
};

// --- Cuerpos ----------------------------------------------------------------
// Todos calculados por ancho contra la columna del arte (ver cabecera).
const CUERPO = {
  titulo: 8.7,        // "NUESTRA EXPERIENCIA" ≙ los 108 mm del arte
  numero: 7.0,        // "+1.250 kWp" ≙ los 30.6 mm del arte
  unidad: 4.4,
  etiquetaMetrica: 2.75,
  rotulo: 3.7,        // los 118 mm libres entre los dos discos verdes
  valor: 3.5,         // "COMPROMISO" ≙ los 128 mm del arte, sin pisar su divisor
};

// Con line-height 1 la mayúscula de Montserrat no arranca en el tope de la caja
// de línea: queda ~0.22 em más abajo. Todos los bloques de texto se posicionan
// por el tope de mayúscula medido en el arte, así que se descuenta acá.
const capTop = (pxCapTop, cuerpoMm) => `${(Y(pxCapTop) - 0.22 * cuerpoMm).toFixed(2)}mm`;

function Metrica({ dato, cx }) {
  const Icono = ICONOS_METRICA[dato.icono];
  const d = X(METRICA.iconoR * 2);

  return (
    <>
      <Icono
        style={{
          position: "absolute",
          left: `${(X(cx) - d / 2).toFixed(2)}mm`,
          top: `${(Y(METRICA.iconoCy) - d / 2).toFixed(2)}mm`,
          width: `${d}mm`,
          height: `${d}mm`,
          zIndex: 3,
        }}
      />

      <p
        style={{
          position: "absolute",
          top: capTop(METRICA.numeroCapTop, CUERPO.numero),
          left: 0,
          width: "100%",
          margin: 0,
          textAlign: "center",
          transform: `translateX(${(X(cx) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`,
          fontSize: `${CUERPO.numero}mm`,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.05mm",
          color: dato.color,
          whiteSpace: "nowrap",
          zIndex: 3,
        }}
      >
        {dato.valor}
        {dato.unidad ? (
          <span style={{ fontSize: `${CUERPO.unidad}mm`, fontWeight: 700, marginLeft: "1.1mm" }}>{dato.unidad}</span>
        ) : null}
      </p>

      {dato.etiqueta.map((linea, i) => (
        <p
          key={linea}
          style={{
            position: "absolute",
            top: capTop(METRICA.etiquetaCapTop[i], CUERPO.etiquetaMetrica),
            left: 0,
            width: "100%",
            margin: 0,
            textAlign: "center",
            transform: `translateX(${(X(cx) - PAGE_WIDTH_MM / 2).toFixed(2)}mm)`,
            fontSize: `${CUERPO.etiquetaMetrica}mm`,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "0.06mm",
            color: COLORS.blanco,
            whiteSpace: "nowrap",
            zIndex: 3,
          }}
        >
          {linea}
        </p>
      ))}

      <div
        style={{
          position: "absolute",
          top: mmY(METRICA.subrayadoY),
          left: `${(X(cx) - X(METRICA.subrayadoW) / 2).toFixed(2)}mm`,
          width: mmX(METRICA.subrayadoW),
          height: "0.55mm",
          background: dato.color,
          zIndex: 3,
        }}
      />
    </>
  );
}

function Organizacion({ org }) {
  const w = org.x1 - org.x0 + 1 + PAD_ORG * 2;
  const h = org.y1 - org.y0 + 1 + PAD_ORG * 2;
  const cy = (org.y0 + org.y1) / 2;

  return (
    <img
      src={`${RUTA_ORG}/${org.src}.png`}
      alt={org.alt}
      style={{
        position: "absolute",
        left: mmX(org.x0 - PAD_ORG),
        top: `${(Y(cy) - X(h) / 2).toFixed(2)}mm`,
        width: mmX(w),
        height: mmX(h),
        objectFit: "contain",
        zIndex: 3,
      }}
    />
  );
}

export function Pagina3Experiencia({ contenido = CONTENIDO_EXPERIENCIA }) {
  const c = contenido;

  return (
    <section
      className="pagina"
      style={{
        position: "relative",
        width: `${PAGE_WIDTH_MM}mm`,
        height: `${PAGE_HEIGHT_MM}mm`,
        // Fondo PLANO. El arte no tiene degradado: medido en ocho zonas repartidas
        // por toda la hoja da el mismo color con ~2 niveles de variación. Cualquier
        // radial que se le ponga se nota impreso como una mancha en el papel.
        background: COLORS.navy900,
        overflow: "hidden",
        margin: "0 auto 24px",
        fontFamily: FONT_FAMILY,
        color: COLORS.blanco,
      }}
    >
      <CunaFoto />

      {/* ── Encabezado ──────────────────────────────────────────────────── */}

      <div style={{ position: "absolute", top: mmY(31), left: mmX(48), zIndex: 3 }}>
        <Logo heightMm={X(110)} variante="blanco" />
      </div>

      <h1
        style={{
          position: "absolute",
          top: capTop(188, CUERPO.titulo),
          left: mmX(49),
          margin: 0,
          fontSize: `${CUERPO.titulo}mm`,
          fontWeight: 800,
          // El color va explícito y no heredado del <section>: index.css tiene un
          // `h1, h2, h3, h4 { color: var(--text-strong) }` global que le gana a
          // la herencia y dejaba las dos primeras líneas en gris oscuro sobre el
          // navy. Se ve blanco en un render aislado y negro en la app.
          color: COLORS.blanco,
          // El arte separa las dos mayúsculas 66 px; con Montserrat eso es
          // interlínea 1.51, y el aire que sobra es el mismo que la página 2
          // manda al espacio entre líneas.
          lineHeight: (Y(66) / CUERPO.titulo).toFixed(3),
          letterSpacing: "-0.15mm",
          whiteSpace: "nowrap",
          zIndex: 3,
        }}
      >
        <span style={{ display: "block" }}>{c.tituloL1}</span>
        <span style={{ display: "block" }}>
          {c.tituloL2A}
          <span style={{ color: COLORS.verde }}>{c.tituloL2B}</span>
        </span>
      </h1>

      <div
        style={{
          position: "absolute",
          top: mmY(331),
          left: mmX(48),
          width: mmX(90),
          height: "1.3mm",
          background: COLORS.verde,
          zIndex: 3,
        }}
      />

      {/* ── Métricas ────────────────────────────────────────────────────── */}

      {METRICA.divisores.map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: mmX(x),
            top: mmY(METRICA.divisorY[0]),
            width: "0.3mm",
            height: mmY(METRICA.divisorY[1] - METRICA.divisorY[0]),
            background: "rgba(255,255,255,0.30)",
            zIndex: 3,
          }}
        />
      ))}

      {c.metricas.map((m, i) => (
        <Metrica key={m.icono} dato={m} cx={METRICA.centros[i]} />
      ))}

      {/* ── Tarjeta de organizaciones ───────────────────────────────────── */}

      <div
        style={{
          position: "absolute",
          left: mmX(MARCO.x0),
          top: mmY(MARCO.y0),
          width: mmX(MARCO.x1 - MARCO.x0),
          height: mmY(MARCO.y1 - MARCO.y0),
          border: `0.4mm solid ${COLORS.verde}`,
          borderRadius: mmX(MARCO.r),
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: mmX(TARJETA.x0),
          top: mmY(TARJETA.y0),
          width: mmX(TARJETA.x1 - TARJETA.x0),
          height: mmY(TARJETA.y1 - TARJETA.y0),
          background: COLORS.hueso,
          borderRadius: mmX(TARJETA.r),
          zIndex: 2,
        }}
      />

      {/* Rótulo montado sobre el filete superior del marco: el fondo navy es lo
          que lo interrumpe, y los dos discos verdes son sus remates. */}
      <div
        style={{
          position: "absolute",
          top: mmY(MARCO.y0),
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: mmX(22),
          padding: `0 ${mmX(6)}`,
          // Tiene que ser EXACTAMENTE el fondo de la hoja: este bloque es lo que
          // interrumpe el filete verde del marco, y con medio tono de diferencia
          // se ve el recuadro que lo corta en vez de un corte limpio.
          background: COLORS.navy900,
          zIndex: 4,
        }}
      >
        <span style={{ width: mmX(ROTULO_DISCO), height: mmX(ROTULO_DISCO), borderRadius: "50%", background: COLORS.verde, flexShrink: 0 }} />
        <span
          style={{
            fontSize: `${CUERPO.rotulo}mm`,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "0.08mm",
            color: COLORS.blanco,
            whiteSpace: "nowrap",
          }}
        >
          {c.rotuloOrganizaciones}
        </span>
        <span style={{ width: mmX(ROTULO_DISCO), height: mmX(ROTULO_DISCO), borderRadius: "50%", background: COLORS.verde, flexShrink: 0 }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: mmX(FILA_DIVISOR_X[0]),
          top: mmY(FILA_DIVISOR_Y),
          width: mmX(FILA_DIVISOR_X[1] - FILA_DIVISOR_X[0]),
          height: "0.25mm",
          background: COLORS.regla,
          zIndex: 3,
        }}
      />

      {DIVISORES_ORG.map((fila) =>
        fila.xs.map((x) => (
          <div
            key={`${fila.fila}-${x}`}
            style={{
              position: "absolute",
              left: mmX(x),
              top: mmY(fila.y0),
              width: "0.25mm",
              height: mmY(fila.y1 - fila.y0),
              background: COLORS.regla,
              zIndex: 3,
            }}
          />
        ))
      )}

      {ORGANIZACIONES.map((org) => (
        <Organizacion key={org.src} org={org} />
      ))}

      {/* ── Franja de valores ───────────────────────────────────────────── */}

      {VALORES.divisores.map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: mmX(x),
            top: mmY(VALORES.divisorY[0]),
            width: "0.3mm",
            height: mmY(VALORES.divisorY[1] - VALORES.divisorY[0]),
            background: "rgba(255,255,255,0.30)",
            zIndex: 3,
          }}
        />
      ))}

      {c.valores.map((texto, i) => {
        const Icono = ICONOS_VALOR[VALORES.claves[i]];
        const caja = X(VALORES.iconoCaja);
        return (
          <React.Fragment key={texto}>
            <Icono
              style={{
                position: "absolute",
                left: `${(X(VALORES.iconoCx[i]) - caja / 2).toFixed(2)}mm`,
                top: `${(Y(VALORES.iconoCy) - caja / 2).toFixed(2)}mm`,
                width: `${caja}mm`,
                height: `${caja}mm`,
                zIndex: 3,
              }}
            />
            <p
              style={{
                position: "absolute",
                left: mmX(VALORES.etiquetaX[i]),
                top: capTop(VALORES.etiquetaCapTop, CUERPO.valor),
                margin: 0,
                fontSize: `${CUERPO.valor}mm`,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "0.09mm",
                color: COLORS.blanco,
                whiteSpace: "nowrap",
                zIndex: 3,
              }}
            >
              {texto}
            </p>
            <div
              style={{
                position: "absolute",
                left: mmX(VALORES.etiquetaX[i]),
                top: mmY(VALORES.subrayadoY),
                width: mmX(VALORES.subrayadoW),
                height: "0.5mm",
                background: COLORS.verde,
                zIndex: 3,
              }}
            />
          </React.Fragment>
        );
      })}
    </section>
  );
}

export default Pagina3Experiencia;

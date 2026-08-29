# EnerLogic — Página "¿Quiénes somos?" · Spec + Prompt para agente

> Página 2 del **Estudio Energético**. Formato único de trabajo: **carta apaisada — 279.4 × 215.9 mm (11" × 8.5", ancho × alto)**.
> Debe compartir lienzo y `@page` con la página 1 (`CotizacionManualPrint.jsx`) para salir en un solo PDF sin cambios de regla de página.
> Stack destino: **React (frontend) + NestJS (backend)**.

---

## 1. Paleta extraída

Valores aproximados por muestreo del PNG. Ajustar contra el manual de marca si existe.

| Token | Hex | Uso en la página |
|---|---|---|
| `--navy-900` | `#0A1F45` | Franja/arco superior de la imagen, texto más oscuro |
| `--navy-700` | `#102A5C` | "¿QUIÉNES", "NUESTRAS SOLUCIONES", "TECNOLOGÍA DE FABRICANTES LÍDERES", "EnerLogic S.R.L.", logotipo |
| `--green-600` | `#1A7F3C` | "SOMOS?", "ENERGÍA INTELIGENTE", subrayado del título, "e Híbridos", "Media y Baja Tensión" |
| `--green-400` | `#3FA535` | Lóbulo verde del isotipo, iconos (rayo de batería, check del documento) |
| `--blue-600` | `#1668C4` | "energía en ahorro.", "On Grid", "Bombeo Solar", "CRE y AETN", "vehículos eléctricos", trazos de iconos |
| `--orange-500` | `#F3A21B` | Lóbulo naranja del isotipo, soles de los iconos |
| `--ink-800` | `#2C3440` | Texto de párrafos y primera línea de cada etiqueta de solución |
| `--paper` | `#F5F5F2` | Fondo general (blanco cálido, no blanco puro) |
| `--tint-blue` | `#E9F2FB` | Círculo de fondo de iconos "fríos" |
| `--tint-green` | `#E9F5EC` | Círculo de fondo de iconos "verdes" |
| `--rule` | `#DCE0E4` | Separadores de la grilla 2×3 y línea bajo el título |
| `--border` | `#C9D3DC` | Borde redondeado del bloque de logos de fabricantes |

Regla de color del texto de las tarjetas: **primera línea en `--ink-800`, segunda línea (el nombre de la solución) en `--blue-600` o `--green-600`**.

## 2. Inventario de iconos

Estilo: **line-art plano, trazo ~2px, esquinas redondeadas, dos colores por icono** (azul o verde como trazo principal + naranja para el sol), sobre círculo/óvalo de tinte claro detrás.

| # | Solución | Descripción del icono | Colores | Equivalente `lucide-react` |
|---|---|---|---|---|
| 1 | Sistemas Fotovoltaicos **On Grid** | Panel solar en perspectiva (grilla 3×2) con sol de rayos arriba a la izquierda | azul + naranja | `SunMedium` + panel SVG propio |
| 2 | Sistemas **Off Grid e Híbridos** | Batería vertical con borne superior y rayo dentro | verde | `BatteryCharging` / `Zap` |
| 3 | Sistemas de **Bombeo Solar** | Tanque/reservorio de agua con oleaje interior, caño lateral y sol arriba | azul + naranja | SVG propio (`Droplets` como fallback) |
| 4 | Infraestructura Eléctrica en **Media y Baja Tensión** | Dos torres de alta tensión con cables colgantes y transformador/gabinete al pie | navy/azul | `RadioTower` (duplicada) o SVG propio |
| 5 | Gestión y tramitación ante **CRE y AETN** | Hoja de documento con esquina doblada, 3 líneas de texto y check en círculo abajo a la derecha | azul + verde | `FileCheck2` |
| 6 | Soluciones de carga para **vehículos eléctricos** | Poste de carga con pantalla (silueta de auto), rayo debajo y conector con cable curvo | verde + azul | `PlugZap` + `Car` o SVG propio |

**Isotipo del logo:** tres lóbulos en espiral cerrada (azul arriba-izq., verde abajo, naranja der.) alrededor de un centro hueco → requiere SVG propio, no hay equivalente en librería.

**Logos de fabricantes (barra inferior, 6):** Schneider Electric, Huawei, Growatt, Victron Energy, Hoymiles, SolaX Power. Van como assets `.svg`/`.png` en `/public/brands/`, separados por líneas verticales finas.

---

## 3. PROMPT PARA EL AGENTE

Copiar desde aquí:

---

Necesito que construyas un componente React llamado `QuienesSomosPage` que replique con fidelidad una página institucional de EnerLogic S.R.L. Es una página de un documento comercial ("Estudio Energético"), por lo que el lienzo es **fijo, tamaño carta horizontal**, no responsive fluido.

### Lienzo y salida — NO IMPROVISAR, esto ya está fijado por la página 1
- La página 1 ya existe (`CotizacionManualPrint.jsx`) y declara `@page { size: letter landscape; margin: 0; }`. **No vuelvas a declarar `@page`**: la regla es a nivel de documento y ya está puesta. Solo consumila.
- Lienzo: **279.4 mm de ancho × 215.9 mm de alto**, `overflow: hidden`, sin scroll.
- **Unidad de trabajo: milímetros.** La página 1 usa `viewBox="0 0 279.4 215.9"` (1 unidad SVG = 1 mm). Replicá esa convención: todas las medidas en `mm` (o en unidades de viewBox si resolvés la página como SVG). **No uses `px`, `rem` ni `%` para geometría de página** — solo se permite `px` dentro del `viewBox` interno de cada icono, que es un sistema de coordenadas propio y aislado.
- Espejá la técnica de la página 1: si la página 1 es un SVG único a página completa, resolvé la página 2 igual; si es HTML/CSS, usá HTML/CSS con `mm`. No mezcles enfoques entre hojas.
- Margen interno: **10 mm** arriba/abajo, **12 mm** a los lados. El bloque de imagen del hero **sangra hasta el borde superior y derecho** (full bleed, sin margen).
- Envolvé la página en un contenedor `.page` con `break-after: page` (y `break-inside: avoid`) para que se encadene con la hoja anterior en un mismo PDF.
- Mantené `-webkit-print-color-adjust: exact` y `print-color-adjust: exact`.
- Para previsualización en pantalla, escalá con `transform: scale()` sobre un wrapper externo; nunca alteres las medidas internas.

**Tabla de conversión de referencia** (96 dpi, 1 mm = 3.7795 px) por si necesitás traducir algún valor:
`1 px = 0.2646 mm` · `10 mm ≈ 37.8 px` · hairline de tabla = `0.3 mm`.

### Tokens de diseño (usarlos siempre, nunca hex sueltos)
```css
--navy-900:#0A1F45; --navy-700:#102A5C; --green-600:#1A7F3C; --green-400:#3FA535;
--blue-600:#1668C4; --orange-500:#F3A21B; --ink-800:#2C3440; --paper:#F5F5F2;
--tint-blue:#E9F2FB; --tint-green:#E9F5EC; --rule:#DCE0E4; --border:#C9D3DC;
```
Fondo de página: `--paper`.

### Tipografía
- Display/títulos: sans geométrica pesada (Montserrat o Poppins), `font-weight: 800`, tracking ligeramente negativo.
- Cuerpo: la misma familia en 400/600, **párrafos justificados** (`text-align: justify`) con `line-height: 1.65`.
- Escala **en mm** (equivalente px @96dpi entre paréntesis, solo como referencia): título `13.8mm` (~52px), subtítulo `6.3mm/700` (~24px), párrafos `3.85mm` (~14.5px), títulos de sección `5mm/800` en mayúsculas (~19px), etiquetas de tarjeta `3.45mm` (~13px), pie `3.45mm`.
- Si la página 1 ya define una escala tipográfica o una familia cargada, **usá esas mismas**: prevalece la coherencia entre hojas sobre estos valores.

### Estructura (grilla)
```
┌──────────────────────────────────┬──────────────────────────────┐
│ [logo EnerLogic]                 │   IMAGEN HERO (full bleed,   │
│                                  │   máscara curva: arco cóncavo│
│ ¿QUIÉNES SOMOS?                  │   hacia la izq-abajo, borde  │
│ ▬▬ (subrayado verde 4px)         │   navy 8px sobre el arco)    │
│ Subtítulo                        ├──────────────────────────────┤
│                                  │  NUESTRAS SOLUCIONES         │
│ Párrafo 1                        │  ▬▬                          │
│ Párrafo 2                        │  ┌──────┬──────┬──────┐      │
│ Párrafo 3                        │  │ ic 1 │ ic 2 │ ic 3 │      │
│                                  │  ├──────┼──────┼──────┤      │
│                                  │  │ ic 4 │ ic 5 │ ic 6 │      │
│                                  │  └──────┴──────┴──────┘      │
├──────────────────────────────────┴──────────────────────────────┤
│           TECNOLOGÍA DE FABRICANTES LÍDERES                     │
│   ┌───────────────────────────────────────────────────────┐     │
│   │ logo │ logo │ logo │ logo │ logo │ logo               │     │
│   └───────────────────────────────────────────────────────┘     │
│        pie de página centrado                                   │
└─────────────────────────────────────────────────────────────────┘
```
- Columna izquierda ≈ 125 mm de ancho, columna derecha ≈ 154 mm (aprox. 45% / 55%).
- El hero es la **imagen de una planta fotovoltaica en azotea con skyline al atardecer**, recortada con una máscara curva orgánica (usar `clip-path` con `path()` o un `<svg><clipPath>`), y un arco de trazo `--navy-900` de ~2 mm siguiendo el borde izquierdo de la máscara.
- La grilla de soluciones es 3 columnas × 2 filas separadas por **líneas divisorias de 0.3 mm en `--rule`** (no tarjetas con sombra ni bordes cerrados). Cada celda: icono a la izquierda (~15 mm, sobre círculo de tinte), texto a la derecha en dos líneas.
- El bloque de fabricantes es un rectángulo con `border: 0.3mm solid var(--border)`, `border-radius: 3mm`, logos con altura uniforme (~9 mm) separados por divisores verticales `--rule`.
- Subrayado verde del título: 1 mm de alto × 17 mm de ancho.

### Iconos
Créalos como componentes SVG en `src/components/icons/`, todos con `viewBox="0 0 48 48"`, `stroke-width: 2`, `stroke-linecap/linejoin: round`, `fill: none` salvo detalles sólidos. No uses emojis ni imágenes rasterizadas.

1. `IconOnGrid` — panel solar en perspectiva con grilla 3×2 y sol de 8 rayos arriba a la izquierda. Trazo `--blue-600`, sol `--orange-500`. Fondo `--tint-blue`.
2. `IconOffGrid` — batería vertical con borne superior y rayo interior. Trazo `--green-600`, rayo `--green-400`. Fondo `--tint-green`.
3. `IconBombeoSolar` — tanque de agua con línea de oleaje interior y caño lateral, sol arriba a la izquierda. Trazo `--blue-600`, sol `--orange-500`. Fondo `--tint-blue`.
4. `IconMediaBajaTension` — dos torres de transmisión con cables colgantes y gabinete/transformador al pie. Trazo `--navy-700`. Fondo `--tint-blue`.
5. `IconTramitacion` — hoja de documento con esquina doblada, 3 líneas de texto y check dentro de un círculo en la esquina inferior derecha. Documento `--blue-600`, check `--green-600`. Fondo `--tint-blue`.
6. `IconCargaVehiculos` — poste de carga con pantalla (silueta de auto dentro), rayo bajo la pantalla y conector con cable curvo a la derecha. Trazo `--green-600`, detalles `--blue-600`. Fondo `--tint-green`.
7. `LogoEnerLogic` — isotipo de tres lóbulos en espiral cerrada alrededor de un centro hueco: lóbulo superior-izquierdo `--blue-600`, inferior `--green-400`, derecho `--orange-500`; al lado, wordmark "ENERLOGIC" en `--navy-700` weight 800 y bajada "ENERGÍA INTELIGENTE" en `--green-600` con tracking amplio.

### Contenido exacto (no reescribir ni resumir)

**Título:** `¿QUIÉNES` en `--navy-700` + `SOMOS?` en `--green-600`. Debajo, subrayado verde de 4px y ~64px de ancho.

**Subtítulo:** "Ingeniería que transforma la **energía en ahorro.**" — la parte final en `--blue-600`.

**Párrafo 1:** "EnerLogic S.R.L. es una empresa boliviana especializada en soluciones energéticas y servicios eléctricos, líderes EPC en proyectos Llave en Mano para sistemas On Grid, Off Grid, híbridos y sistemas de bombeo solar, incluyendo ingeniería, suministro, instalación y puesta en marcha. Ofrecemos soluciones completas, eficientes y adaptadas a cada cliente."
→ "EnerLogic S.R.L." en `--blue-600` bold; en negrita: "energéticas y servicios eléctricos", "EPC", "Llave en Mano", "ingeniería, suministro, instalación y puesta en marcha."

**Párrafo 2:** "Contamos con un área de Tendidos de Media y Baja Tensión, que incluye gestión y aprobación en la elaboración del proyecto, suministro de transformadores, provisión de materiales e instalación con pruebas finales."
→ negrita en "Tendidos de Media y Baja Tensión".

**Párrafo 3:** "Trabajamos con tecnología de fabricantes líderes a nivel mundial como Schneider Electric, Huawei, Growatt, Victron, entre otros, en el área de sistemas renovables y soluciones de carga vehiculares para todo el territorio boliviano."
→ negrita en "Schneider Electric, Huawei, Growatt, Victron".

**Sección:** "NUESTRAS SOLUCIONES" en `--navy-700`, con subrayado verde corto.

**Tarjetas** (línea 1 en `--ink-800`, línea 2 en el color indicado):
1. "Sistemas Fotovoltaicos" / "On Grid" — azul
2. "Sistemas" / "Off Grid e Híbridos" — azul
3. "Sistemas de" / "Bombeo Solar" — azul
4. "Infraestructura Eléctrica en" / "Media y Baja Tensión" — verde
5. "Gestión y tramitación" / "ante CRE y AETN" — azul
6. "Soluciones de carga para" / "vehículos eléctricos" — azul

**Franja inferior:** "TECNOLOGÍA DE FABRICANTES LÍDERES" en `--navy-700`, centrado, con línea divisoria a cada lado.
Logos en orden: Schneider Electric · Huawei · Growatt · Victron Energy · Hoymiles · SolaX Power (desde `/public/brands/*.svg`).
**Pie:** "Seleccionamos la tecnología más adecuada para cada proyecto, priorizando calidad, eficiencia y respaldo técnico." — centrado, `--ink-800`.

### Reglas de implementación
- React + TypeScript, un solo componente exportado por defecto, con subcomponentes locales `SolutionCard`, `BrandStrip`, `HeroArc`.
- Sin `localStorage`, sin librerías de UI pesadas. Tailwind está permitido si extiendes el theme con los tokens de arriba; si no, usa CSS Modules con variables.
- Todo el texto y los ítems de soluciones deben venir de un objeto `content` al inicio del archivo, para que luego pueda alimentarse desde la API de NestJS sin tocar el markup.
- Props: `{ content?: QuienesSomosContent; heroImageUrl?: string }` con valores por defecto.
- **No toques `CotizacionManualPrint.jsx` ni su bloque `@page`.** La página 2 es un componente nuevo que se monta después de la página 1 dentro del mismo documento imprimible.
- Si el documento se exporta a PDF desde NestJS con Puppeteer, la página debe renderizar idéntica con `printBackground: true`, `format: 'Letter'`, `landscape: true`.
- No agregues animaciones, sombras difusas ni degradados que no estén en el original.

### Criterio de aceptación
Al comparar el render contra el diseño de referencia: mismos colores, misma jerarquía tipográfica, misma grilla 3×2 con divisores, arco curvo en la imagen, franja de logos con borde redondeado, y **todo el contenido cabe en una sola carta apaisada sin desbordes**.
Además, al imprimir el documento completo: **página 1 y página 2 salen en el mismo PDF, ambas 279.4 × 215.9 mm, sin una hoja en blanco intermedia y sin cambio de orientación entre ellas**.

---

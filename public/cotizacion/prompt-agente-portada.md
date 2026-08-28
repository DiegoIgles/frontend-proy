# Prompt para el agente — portada Enerlogic (CARTA HORIZONTAL)

> Pegar tal cual. Formato único de trabajo: **carta apaisada, 279.4 × 215.9 mm (11 × 8.5 in)**. No generes vertical ni A4.
> Toda la geometría de abajo está medida sobre el arte aprobado y convertida a milímetros de esta hoja. Son valores, no sugerencias.

---

## 0. Formato

```css
@page{ size: letter landscape; margin: 0 }
```

El SVG de la portada usa `viewBox="0 0 279.4 215.9"`, es decir **1 unidad = 1 mm**. Todas las coordenadas de este documento están en ese sistema.

## 1. Paleta oficial de marca

Únicos colores permitidos. Están muestreados del arte aprobado: se usan tal cual, sin variantes ni degradados.

| Token | Hex | Uso |
|---|---|---|
| `--enl-navy` | `#001B3D` | banda inferior, títulos, media luna principal |
| `--enl-navy-800` | `#0A2A52` | navy un paso más claro, estados |
| `--enl-azul` | `#0062B7` | media luna inferior, logo, barra tricolor |
| `--enl-verde` | `#2C9826` | íconos de la banda y barra tricolor |
| `--enl-verde-900` | `#056125` | eyebrow, nombre del cliente, cuña de la esquina |
| `--enl-naranja` | `#EE9C02` | espiral del logo y barra tricolor |
| `--enl-hueso` | `#F1F1F1` | fondo de la hoja |
| `--enl-blanco` | `#FFFFFF` | texto sobre navy |

```css
:root{
  --enl-navy:#001B3D; --enl-navy-800:#0A2A52; --enl-azul:#0062B7;
  --enl-verde:#2C9826; --enl-verde-900:#056125; --enl-naranja:#EE9C02;
  --enl-hueso:#F1F1F1; --enl-blanco:#FFFFFF;
}
```

Título y subtítulo en `--enl-navy`. Eyebrow "PROPUESTA COMERCIAL", reglas cortas y nombre del cliente en `--enl-verde-900`. La barra tricolor es siempre verde → azul → naranja en partes iguales.

## 2. Lo que está mal hoy y por qué

El error de fondo no es de color ni de posición: es de **método de construcción**.

Las curvas del arte **no son arcos con `stroke-width`**. Son **medias lunas**: la región que queda entre dos círculos de distinto centro y distinto radio. Por eso en el original cada cinta es gruesa en el medio y se afina hasta terminar en punta, y por eso nunca se ve un extremo cortado. Un arco con `stroke` tiene grosor constante y termina en un tope visible; es lo que produce el efecto de cintas sueltas cruzando la hoja.

Además, en el arte hay **dos** medias lunas, no tres: una navy y una azul. No existe ninguna cinta verde ni naranja. El verde solo aparece en la cuña de la esquina, en los íconos y en la barra tricolor; el naranja solo en el logo y en la barra.

Otros defectos a corregir: el logo se está insertando con un rectángulo de fondo (usar el archivo con fondo transparente), y falta la banda navy inferior con los cuatro atributos.

## 3. Construcción de las medias lunas

Cada media luna se define con dos círculos: uno que la **contiene** y uno que la **recorta**. En SVG se resuelve con una máscara: el círculo que contiene va en blanco, el que recorta va en negro.

```html
<mask id="mNavy">
  <rect width="279.4" height="215.9" fill="#000"/>
  <circle cx="271.8" cy="99.7"  r="129.5" fill="#fff"/>   <!-- contiene -->
  <circle cx="256.4" cy="130.5" r="119.0" fill="#000"/>   <!-- recorta  -->
</mask>
```

No uses `stroke` para estas formas. No uses `stroke-linecap`. No hay arcos.

## 4. Geometría (mm, sistema del `viewBox`)

| Elemento | Círculo que contiene | Círculo que recorta |
|---|---|---|
| Media luna **navy** | cx 271.8 · cy 99.7 · r 129.5 | cx 256.4 · cy 130.5 · r 119.0 |
| Media luna **azul** | cx 208.4 · cy 141.3 · r 64.1 | cx 271.2 · cy 70.2 · r 137.7 |
| Cuña **verde** | cx 290.4 · cy 72.1 · r 86.2 | cx 257.3 · cy 133.9 · r 114.5 |

| Elemento | Valor |
|---|---|
| Foto circular | cx 246.0 · cy 103.1 · r 83.9 |
| Caja de la imagen | x 162.1 · y 19.2 · 167.8 × 167.8, `preserveAspectRatio="xMidYMid slice"` |
| Banda navy | x 0 · y 187.6 · 279.4 × 28.3 (a sangre) |
| Barra tricolor | x 10.5 → 68.1 · y 208.7 · alto 0.9 |

Consecuencias, todas verificadas sobre estos números:

- La foto va de x 162.1 a 329.9, o sea **sangra 50.5 mm por la derecha**, y de y 19.2 a 187.0: su borde inferior queda 0.6 mm por encima de la banda. Ese casi-contacto es parte del diseño.
- La foto queda **completamente dentro** del círculo que recorta la media luna navy (113.2 < 119.0). Por eso entre la foto y el navy siempre se ve el fondo hueso, con ancho variable. Ese respiro no se cierra.
- Espesor máximo de la media luna navy: 44.9 mm. De la azul: 21.3 mm. La navy es la forma gruesa; la azul es claramente más fina.
- La cuña verde arranca en x 204.2 y en y −14.1: sangra por arriba y por la derecha, y se apoya sobre la esquina superior derecha.
- El borde izquierdo del navy queda en x 142.3 y el del azul en x 144.3. El bloque de texto termina en x 136.8, o sea **5.5 mm de holgura**. Es poco: si agrandás el texto, invade la gráfica.

### Orden de pintado

Fondo hueso → media luna navy → media luna azul → cuña verde → foto → banda navy. La banda va última porque corta el pie de las dos medias lunas y de la foto.

### SVG de referencia

```html
<svg viewBox="0 0 279.4 215.9" width="279.4mm" height="215.9mm">
  <defs>
    <mask id="mNavy">
      <rect width="279.4" height="215.9" fill="#000"/>
      <circle cx="271.8" cy="99.7"  r="129.5" fill="#fff"/>
      <circle cx="256.4" cy="130.5" r="119.0" fill="#000"/>
    </mask>
    <mask id="mAzul">
      <rect width="279.4" height="215.9" fill="#000"/>
      <circle cx="208.4" cy="141.3" r="64.1"  fill="#fff"/>
      <circle cx="271.2" cy="70.2"  r="137.7" fill="#000"/>
    </mask>
    <mask id="mVerde">
      <rect width="279.4" height="215.9" fill="#000"/>
      <circle cx="290.4" cy="72.1"  r="86.2"  fill="#fff"/>
      <circle cx="257.3" cy="133.9" r="114.5" fill="#000"/>
    </mask>
    <clipPath id="cFoto"><circle cx="246" cy="103.1" r="83.9"/></clipPath>
    <clipPath id="cSobreBanda"><rect x="0" y="0" width="279.4" height="187.6"/></clipPath>
  </defs>

  <rect width="279.4" height="215.9" fill="var(--enl-hueso)"/>

  <g clip-path="url(#cSobreBanda)">
    <rect width="279.4" height="215.9" fill="var(--enl-navy)" mask="url(#mNavy)"/>
    <rect width="279.4" height="215.9" fill="var(--enl-azul)" mask="url(#mAzul)"/>

    <!-- hairlines: muy sutiles, concéntricas con el círculo que recorta el navy -->
    <g fill="none" stroke="var(--enl-navy)" stroke-opacity=".12" stroke-width=".25">
      <circle cx="256.4" cy="130.5" r="125"/>
      <circle cx="256.4" cy="130.5" r="135"/>
    </g>

    <rect width="279.4" height="215.9" fill="var(--enl-verde-900)" mask="url(#mVerde)"/>

    <image href="FOTO_PANELES" x="162.1" y="19.2" width="167.8" height="167.8"
           preserveAspectRatio="xMidYMid slice" clip-path="url(#cFoto)"/>
  </g>

  <rect x="0" y="187.6" width="279.4" height="28.3" fill="var(--enl-navy)"/>
</svg>
```

El N° de propuesta va sobre la cuña verde, alineado a la derecha, en `--enl-blanco`, con la etiqueta "N° DE PROPUESTA" arriba en cuerpo menor.

## 5. Bloque de texto (mm)

Columna izquierda, alineada a la izquierda en x ≈ 9. `y` es el borde superior de la mancha de tinta y "alto" es la altura real de la tinta, que es la medida a respetar: ajustá el cuerpo tipográfico hasta que dé esa altura.

| Elemento | x | y | alto | Notas |
|---|---|---|---|---|
| Logo | 6.8 → 83.2 | 7.7 | 20.1 | fondo transparente |
| Eyebrow "PROPUESTA COMERCIAL" | 9.0 | 46.4 | 3.8 | mayúsculas, `--enl-verde-900`, tracking amplio |
| Regla corta | 8.8 → 21.6 | 55.5 | 0.4 | `--enl-verde-900` |
| Título línea 1 "ESTUDIO" | 9.2 | 62.5 | 18.0 | mayúsculas, `--enl-navy`, peso 800 |
| Título línea 2 "ENERGÉTICO" | 9.2 | 80.7 | 17.8 | mismo cuerpo, interlineado ajustado |
| Subtítulo | 9.0 | 112.6 | 5.3 | caja alta y baja, `--enl-navy` |
| Nombre del cliente | 8.8 | 128.2 | 8.6 | mayúsculas, `--enl-verde-900`, peso 700 |
| Pie ciudad · fecha | 9.0 | 150.9 | 6.6 | íconos de ubicación y calendario a la izquierda de cada dato, separador vertical entre ambos |

Ninguna línea de texto puede pasar de **x = 136.8**. El título es lo que más se acerca: "ENERGÉTICO" llega justo a ese límite.

## 6. Banda de atributos

Usá el componente que ya te pasé. Cambio respecto de la versión anterior: **cada etiqueta va en una sola línea**, sin salto. "ENERGÍA EFICIENTE Y SOSTENIBLE" completa en un renglón.

- Banda: y 187.6, alto 28.3 mm, ancho completo, sin márgenes.
- Los cuatro ítems ocupan **la izquierda de la banda**, de x 10 a x 200 aproximadamente. El resto de la banda queda vacío, igual que en el arte.
- Fila de íconos y textos entre y 190 y y 206. Ícono de unos 13 mm, separador vertical fino entre ítems.
- Barra tricolor debajo, x 10.5 → 68.1, y 208.7, alto 0.9 mm.
- En React es la prop `escala="carta"`; en CSS la clase `.enl-franja--carta`, que ya limita la fila a 200 mm.

## 7. Reglas duras

- Ni un solo `stroke` en las formas curvas grandes: se construyen por máscara de dos círculos.
- Nunca `stroke-linecap: round` en elementos decorativos.
- Dos medias lunas, no tres. Si aparece una cinta verde o naranja, sobra.
- Entre la foto y la media luna navy siempre se ve fondo hueso, de ancho variable. No cerrar ese respiro ni convertirlo en un borde blanco de grosor constante.
- El texto nunca pasa de x 136.8. Si no entra, se reduce el cuerpo; la gráfica no se mueve.
- Si necesitás cambiar el tamaño o la posición de la foto, recalculá los seis círculos manteniendo las mismas distancias relativas entre centros. Mover un solo círculo rompe la forma de la media luna.

## 8. Criterios de aceptación

1. El PDF mide 11 × 8.5 in en horizontal.
2. Las dos cintas se afinan hasta terminar en punta. No hay ningún extremo con corte recto ni redondeado.
3. Hay exactamente dos medias lunas: navy gruesa y azul fina. Ninguna verde ni naranja.
4. Entre la foto y el navy se ve fondo hueso continuo, más ancho arriba a la izquierda que abajo.
5. La foto sangra por la derecha y su borde inferior casi toca la banda.
6. La cuña verde se apoya en la esquina superior derecha y contiene el N° de propuesta.
7. El texto se lee completo, sin nada encima, y "ENERGÉTICO" no se corta.
8. El logo no tiene caja de fondo.
9. La banda de atributos está presente, los cuatro ítems ocupan la mitad izquierda y cada etiqueta va en un solo renglón.
10. Ningún color fuera de la tabla de la sección 1.

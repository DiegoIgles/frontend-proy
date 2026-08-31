# Correcciones de la portada — comparación contra el arte del cliente

Medí el render actual contra el arte aprobado. Todas las medidas están en milímetros sobre la hoja carta horizontal (279.4 × 215.9), que es el mismo sistema del `viewBox`.

**Lo que ya está bien y no se toca:** la paleta, el peso del título (el asta da 21 % de la altura de mayúscula, correcto), las tres reglas verdes cortas (existen, solo están mal ubicadas), la posición del arco navy y el borde superior de la banda en y 187.6.

---

## 1. La banda inferior no va de borde a borde ← lo más visible

En el arte, la foto y el arco azul **se montan por encima de la banda** y bajan hasta el borde inferior de la hoja. La banda navy sólida solo ocupa la parte izquierda.

Cortes horizontales del arte, para que lo verifiques:

| Altura | Navy sólido | Después |
|---|---|---|
| y 190 mm | de x 0 a ~168 | arco azul, fondo claro, foto |
| y 208 mm | de x 0 a ~182 | arco azul hasta ~237, fondo claro hasta el borde |
| y 213 mm | de x 0 a ~187 | arco azul hasta ~254, fondo claro hasta el borde |

Hoy el render pinta navy sólido de x 0 a 279.4 en todas esas alturas.

**Corrección: cambiá el orden de pintado.** Primero la banda, y después el arco azul y la foto encima. Hoy están al revés.

## 2. La foto es chica y está alta

| | Ahora | Correcto |
|---|---|---|
| Radio | 67.6 mm | **77.8 mm** (+15 %) |
| Centro y | 107.3 mm | **113.2 mm** |
| Borde inferior | 175.0 mm | **191.0 mm** |

Al quedarse en 175 mm, la foto no llega a cruzar la banda y por eso aparece esa franja blanca vacía abajo a la derecha que en el arte no existe.

## 3. La barra tricolor está en el lugar equivocado

Hoy está a y 195.1 mm, es decir **dentro de la fila de íconos, pisando las etiquetas**, y mide 76.1 mm de largo.

Correcto: **y 209.6 mm**, de x 8.7 a 58.6 (**49.9 mm de largo**), debajo de los íconos y casi al pie de la hoja.

## 4. El bloque de texto está corrido hacia arriba

Las tres reglas verdes sirven de referencia porque están bien dibujadas, solo mal colocadas:

| Regla | Ahora | Correcto |
|---|---|---|
| Bajo el eyebrow | 54.6 mm | **62.6 mm** |
| Sobre el subtítulo | 105.8 mm | **119.4 mm** |
| Bajo el nombre | 142.9 mm | **161.0 mm** |

Todo el bloque baja con ellas. El pie de ciudad y fecha, que hoy termina antes de los 160 mm, debe ocupar **y 166 → 177 mm**.

## 5. Tamaños tipográficos

| Elemento | Ahora | Correcto |
|---|---|---|
| Título línea 1 "ESTUDIO" | mayúscula 14.4 mm | **17.1 mm** (y 70.8 → 87.9) |
| Título línea 2 "ENERGÉTICO" | mayúscula 13.7 mm | **16.4 mm** (y 94.4 → 110.7) |
| Subtítulo | mayúscula 3.0 mm | **4.1 mm** (y 127.6) |
| Logo | 72.8 × 19.7 mm, y 6.4 | **74.4 × 22.6 mm**, y **8.7** |

## 6. La tipografía del título es más ancha de lo que corresponde

En el arte, "ENERGÉTICO" mide **124 mm de ancho con 17.1 mm de altura de mayúscula**: relación ancho ÷ altura = **7.3**. En el render la relación da 8.3, o sea las letras son 14 % más anchas de lo que deberían.

Por eso, si simplemente agrandás el cuerpo al valor del punto 5, la línea se va a ir a ~142 mm y va a chocar con el arco navy. Al agrandar, verificá el ancho: si "ENERGÉTICO" pasa de 135 mm, la familia cargada no es la correcta o le falta ajuste. Aplicá `letter-spacing` negativo leve o cargá Montserrat de verdad.

## 7. La cuña verde quedó chica

| | Ahora | Correcto |
|---|---|---|
| Empieza en x | 220.3 mm | **212.1 mm** |
| Baja hasta y | 21.8 mm | **26.7 mm** |

## Cómo verificar

1. A la altura de 208 mm, el navy sólido termina cerca de x 182 y a la derecha se ve arco azul y fondo claro, no navy.
2. La foto cruza por encima de la banda y su borde inferior llega a 191 mm.
3. La barra tricolor está debajo de los íconos, no encima de las etiquetas.
4. Las reglas verdes caen en 62.6, 119.4 y 161.0 mm.
5. "ENERGÉTICO" mide 124 mm de ancho y 16.4 mm de alto de mayúscula.

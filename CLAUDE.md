# English & Chill — Project Notes

## Arquitectura
- `assets/css/style.css` — **fuente de verdad de estilos**. Todos los estilos de componentes van aquí, nunca en `<style>` dentro de las páginas HTML.
- `assets/js/` — **fuente de verdad de lógica**. Cada componente tiene su JS centralizado:
  - `puzzle-builder.js` — lógica y estilos base de puzzles
  - `charts.js` — genera tablas gramaticales (`.grammar-table`) desde datos JS (`ChartBuilder.init({targetId, caption, subheaders, rows})`), alternativa a escribir la tabla a mano en el HTML
  - `fill-gaps.js` — lógica de fill-in-the-gaps
  - `flashcards.js` — vocab cards con flip (lee `.flashcards-grid[data-words]`, formato `"term:traducción,..."`)
  - `tracker.js` — progress tracker
  - `nav.js` — navegación y botón back
  - `scroll-top.js` — botón ↑ flotante + animación drops
  - `components.js` — header, footer y scrollbar custom
  - `cursor.js` — no referenciado por ninguna página actual; código muerto (revisar antes de reutilizar)
- `assets/fonts/` — Aboreto, Caveat Brush, Manrope (woff2).
- `assets/images/` — `E&C Logo.svg` (logo sitio), `Separator-2.svg`, favicon PNG (`ChatGPT-Image-4-may-2025-11_07_11.png`). El resto de assets en esta carpeta (Dotted-Lines, EC-Logo, Quill, quill-cursor) son restos del sitio WordPress anterior, sin uso — no referenciarlos en páginas nuevas.
- `index.html` — home (Choose your level).
- `1st/2nd/3rd/4th-eso.html` — páginas de nivel, cada una con `.button-grid` listando sus LC pages. 2nd, 3rd y 4th ya tienen contenido; 1st sigue "Coming soon" (no hay contenido migrable en el XML de WordPress para 1st ESO).
- `2nd-eso/`: `lc0`, `lc1`, `lc2`, `lc4`, `final-review`, y `lc1/extra-practice.html` (cuelga de la URL de `lc1` para que el botón back estructural funcione sin caso especial — ver Navegación). No tiene LC3: en el WordPress original esa página solo remitía a un libro de lectura explicado en clase, sin gramática ni ejercicios migrables.
- `3rd-eso/`: `lc1`, `lc2`, `lc4`, `lc5`. `lc5.html` es la referencia de estructura más completa (puzzles + tablas + tracker). No tiene LC3 por el mismo motivo que 2nd ESO (solo libro de lectura).
- `4th-eso/`: `lc5` (único LC con contenido migrable en el XML de WordPress para este nivel).
- `puzzle-builder-demo.html`, `sentence-builder-demo.html` — páginas sueltas de demo/prueba de componentes, no forman parte de la navegación del sitio.
- `context/` — export del WordPress antiguo (contenido de referencia para migrar, no código vivo).
- `Claude outputs/` — capturas y páginas de prueba generadas durante el trabajo con Claude (no código vivo del sitio).

## Principio de centralización
**Las páginas HTML solo contienen datos y estructura, nunca lógica ni estilos de componentes.**
- Para añadir o modificar un componente (puzzle, vocab cards, fill-gaps…): editar el JS y/o CSS central.
- Las páginas pasan configuración/datos al componente vía JS (ej: `PuzzleBuilder.init({...})`).
- Así, un cambio en el archivo central se propaga automáticamente a todas las páginas.

## Header (`components.js`)
- Generado por JS: solo el logo SVG `E&C Logo.svg`, `height: clamp(100px, 14vw, 190px)`.
- En LC pages el logo NO tiene link (la página ya tiene botón back).
- Sin texto "English & Chill", sin Dotted-Lines SVGs — todo eso quedó obsoleto.

## Footer (`components.js`)
- Generado por JS: solo `©año` en `.footer-copy` (Aboreto, 1.1rem). Sin logo, sin links.

## Navegación (`nav.js`)
- `NAV_CATALOG` define las claves válidas para `LC_NAV`: `vocabulary(Exs)`, `grammar(Exs)`, `irregularVerbsExs`, `extraPractice`, `reading(Exs)`, `listening(Exs)`, `writing(Exs)`, `project(Exs)`. Para añadir una sección nueva (ej. otro bloque de ejercicios temático), extender este catálogo en vez de usar una clave no registrada.
- Botones base+Exs consecutivos (ej. `grammar`+`grammarExs`) se agrupan automáticamente en un `.nav-group` (misma fila, pegados).
- `SOLO_KEYS` (`extraPractice`, `writing`, `project`) fuerza que ese botón ocupe su propia fila completa (`.nav-solo`, `flex-basis: 100%`), nunca agrupado ni compartiendo fila con otro.
- `extraPractice` es un botón especial (`link: true`): no apunta a un ancla `#...` sino a una URL fija (por defecto `lc1/extra-practice.html`, o `LC_EXTRA_PRACTICE_HREF` si la página la define). Úsalo para enlazar una página aparte de refuerzo/práctica extra desde dentro de una LC.
- **Botón back — estructural, no historial.** Por defecto (sin `LC_BACK` definido), `nav.js` calcula la URL del back subiendo un nivel de carpeta y añadiendo `.html` (ej. `2nd-eso/lc1.html` → `../2nd-eso.html`; `2nd-eso/lc1/extra-practice.html` → `../lc1.html`). No usa `history.back()`: así el back siempre lleva al mismo sitio pase lo que pase por el historial del navegador. Una página solo necesita declarar `LC_BACK` a mano si su URL no sigue esa convención (carpeta padre = nombre del nivel/LC).

## Botones (`style.css` + `nav.js`)
- Clase base `.fancy-button`: fondo negro (`--button-outline: #000`), `.button_top` elevado con `translateY(-0.35em)`, sube a `-0.5em` en hover, baja a `0` en active. Color de relleno: `--button-color: var(--color-accent-1)` (azul-gris `#99aebb`).
- Botón back (←): generado por `nav.js`, misma clase `.fancy-button`, `--button-color: var(--color-accent-1)`.
- Nav buttons (Grammar, Reading…): generados por `nav.js` según `LC_NAV`. Mismo estilo base.
- Nav EXS (Grammar Exam…): clase adicional `.btn-exs`, mismos colores, añade `★` antes y después via CSS `::before`/`::after`.
- Check/Reload: `<button type="button" class="fancy-button btn-check/btn-reload">`. El color del outline y la sombra del formulario cambian al score color tras check. Texto: "Check Answers" → "Try Again" (el JS lo gestiona en el mismo botón).
- Botón ↑: generado por `components.js` + animado por `scroll-top.js`. Aparece cuando el header sale de la pantalla (IntersectionObserver), fade+slide in/out suave. En desktop: bottom 4rem, right 4rem. En móvil: centrado horizontalmente.
- **Todos los botones son `<button type="button">` o `<a>` según si navegan o no.** Los de check/reload son `<button>`.

## Scroll behavior
- `scroll-behavior: smooth` en `html` (en `style.css`).
- `@media (prefers-reduced-motion: reduce)` lo desactiva.

## Sistema de colores semántico
Consistente entre puzzles, tablas y reminders — el alumno aprende el código una vez:
- `#ddeeff` azul → **Subject** (`.c-subj`)
- `#fef4dc` amarillo → **Auxiliary**, siempre, también en interrogativas (`.c-aux`)
- `#dff2e1` verde pastel → **verbo principal** (participio, infinitivo, -ing, forma base…) — es el ÚNICO verde válido (`.c-pp`)
- `#ffb3b3` salmón → **negativo** (auxiliar/verbo negado: *isn't, don't, can't, wasn't*…), en afirmativa o interrogativa (`.c-neg`)
- `#ecdcf7` morado pastel → **Keywords** (for/since/when/while/too/enough/if…) (`.c-keyword`) — mismo tono que el icono `?` del puzzle (`#d4b8f0`, ver más abajo), para que el alumno asocie keyword ↔ interrogativo visualmente.
- `#f9d0d8` rosa oscuro → variante "auxiliar + not" fusionados en una sola pieza de puzzle (ver más abajo)
- `#b2dfb2` / `#d4b8f0` (`.c-aff` / `.c-int`) → **solo** para el icono +/−/? del modo del puzzle o casos sin auxiliar propio (p.ej. iconos de estructura). **Nunca** usarlos como color de una palabra/verbo suelto en un reminder — para eso siempre `.c-pp` (verde) o `.c-neg` (rojo) según corresponda. Si ves `.c-aff` pintando una palabra en un reminder, es un bug: dos verdes distintos conviviendo en la misma página confunde al alumno.

**Reminders con negativo/interrogativo**: cuando un reminder combina afirmativo+negativo+interrogativo en un solo bloque de forma poco clara, se separa en dos `.puzzle-reminder`: uno con afirmativo+negativo, y otro aparte solo con el interrogativo (aux en amarillo + sujeto + verbo en verde, sin la palabra literal "subject" — se listan los pronombres reales: *I, we, you, they* / *he, she, it*). Excepción: si la estructura es igual para todos los sujetos (ej. Past Simple con action verbs: *didn't + infinitive*), usar "Subject" literal es correcto, no hace falta listar pronombres.

**Excepción — tabla "Examples" de futuros (`3rd-eso/lc2.html`)**: en esa tabla concreta, el objetivo pedagógico es diferenciar los distintos tiempos de futuro entre sí (Will / Going to / Present Continuous / Present Simple), no distinguir auxiliar de verbo principal. Por eso ahí el bloque aux+verbo completo ("will rise", "'m going to visit"…) se pinta entero en `.c-keyword` (morado pastel) en vez de separar aux (amarillo) y verbo (verde). No es un bug del sistema de colores — es una excepción documentada, válida solo en esa tabla.

## Puzzles (`puzzle-builder.js` + `style.css`)
- Cada instancia: `PuzzleBuilder.init(cfg)` con `sectionId`, `stageId`, `pieces`, `example` (opcional), `arrowBelow` (índice de pieza con flecha ↑ bajo ella), `swapArrows` ([idxA, idxB] para flechas curvas de intercambio).
- `exampleId` y `exTextId` son opcionales — si no hay elementos con esos IDs en el DOM, se ignoran sin error.
- Cada pieza: `{ word, label, fill, lt, rt }`. `lt`/`rt`: `'none'|'in'|'out'` (encaje puzzle).
- El `fill` del label badge usa el sistema de colores semántico. Si `label` contiene "auxiliary + not", el fill se normaliza automáticamente a `#f9d0d8`.
- El ancho del badge del label se calcula midiendo el texto SVG real (`getBBox`, función `measureTextWidth`), no estimando por nº de caracteres. El label nunca puede sobrepasar el ancho interior seguro de la pieza: si un label largo (ej. "Present Participle") no cabe en una línea, se parte en 2 líneas probando cada corte posible y midiendo de verdad cuál dejar más equilibrado; si ni así cabe, se encoge la fuente del label (mínimo 6px) hasta que quepa. Esto evita que el badge sobresalga o cruce el contorno de la pieza, en los 3 modos (+/−/?).
- El fondo de la pieza (el SVG) toma el color de fondo del `body` via `getComputedStyle` — se integra con la página.
- Texto de la palabra: Caveat Brush. Label (badge inferior): Manrope bold uppercase.
- Escala automáticamente al viewport. Animación: vuela desde la izquierda al entrar en la franja central del viewport (`rootMargin: '-30% 0px -30% 0px'`), con squash/bounce al impactar y shake del vecino.
- **Icono +-?:** se genera automáticamente via `mode: 'aff'|'neg'|'int'` en el `PuzzleBuilder.init`. NO usar divs manuales (`structure-circle`, etc.) en el HTML — eso es patrón obsoleto. El icono es un círculo Caveat Brush generado por JS con colores: aff `#dff2e1`, neg `#f9d0d8`, int `#d4b8f0`.
- **Puntuación en piezas:** la última pieza de cada puzzle lleva el signo de puntuación dentro del `word`: `.` en afirmativas y negativas, `?` en interrogativas.

## Tablas (`style.css` + `charts.js`)
- Clase `.grammar-table` dentro de `.grammar-table-wrap`.
- Borde 2px negro, `border-radius: 16px`, `box-shadow: 0 8px 0 #000`.
- Fila de título (`.caption-row`): fondo `#ffe0b2` (naranja pastel), bold, 1.2rem.
- Fila de subheaders (`.subheader`): fondo `#c8f0d8` (verde pastel), bold, 1.15rem.
- Celdas: fondo transparente, 1.15rem, separadores grises `#ccc`.
- Highlights semánticos en celdas: `.c-subj`, `.c-aux`, `.c-pp`, `.c-keyword` (ver sistema de colores).
- Se puede escribir el `<table class="grammar-table">` a mano en el HTML, o generarlo con `ChartBuilder.init({targetId, caption, subheaders, rows})` (`charts.js`) apuntando a un `<div id="...">` vacío — útil cuando la tabla se repite entre páginas o se prefiere mantener el HTML de la página solo con datos.

## Estructura de una LC page
- `<html lang="en">`, favicon `ChatGPT-Image-4-may-2025-11_07_11.png`.
- Preload de Manrope woff2.
- `<body id="top">` — necesario para el botón ↑.
- `<header class="site-header"></header>` — lo rellena `components.js`.
- `<main class="site-content">`:
  - `.back-row` — `nav.js` inyecta el botón ←.
  - `.page-label` — ej: "3rd ESO – LC5" (Aboreto, `clamp(1.8rem, 4.5vw, 2.8rem)`).
  - `.nav-buttons` — `nav.js` inyecta los botones de navegación según `LC_NAV`.
  - Secciones de contenido (grammar, vocabulary…) con `.section-label.grammar/.vocabulary/…`
  - `Separator-2.svg` entre sección de contenido y sus ejercicios: `display:block; margin:2.5rem auto; max-width:600px; width:100%; height:auto; alt=""`.
  - `.section-label.exs` para la sección de ejercicios — Georgia serif, negro, con `★` antes y después via CSS.
  - Ejercicios: `.ex-heading` + `.fill_gaps-wrapper > .fill_gaps` (ver Fill-gaps).
- `<footer class="site-footer"></footer>` — lo rellena `components.js`.
- Scripts al final del body, en este orden: `components.js`, variables `LC_BACK`/`LC_NAV`, `nav.js`, `fill-gaps.js`, `tracker.js`, `puzzle-builder.js` + init inline.

## Section labels
- `.section-label` — Georgia serif, `clamp(1.8rem, 5vw, 2.8rem)`, bold, centrado.
- `.section-label.grammar` — color negro (`--color-contrast`).
- `.section-label.exs` — negro, con `★` antes y después via CSS `::before`/`::after`.

## Exercise headings (`.ex-heading`)
- Georgia serif, negro `#000`, `clamp(1.4rem, 3.5vw, 1.9rem)`, bold, centrado.
- Formato obligatorio: `"a. Texto del ejercicio"` — el tracker extrae la letra del prefijo.
- `fill-gaps.js` mueve el `.ex-heading` dentro del `.fill_gaps` como barra superior (`.ex-heading--bar`): fondo negro `#000`, texto `#99aebb` (azul-gris), padding `.65em 1.2em`.

## Fill-gaps (`fill-gaps.js` + `style.css`)
- Estructura HTML mínima por ejercicio:
  ```html
  <h2 class="ex-heading">a. Título del ejercicio</h2>
  <div class="fill_gaps-wrapper"><div class="fill_gaps">
    <div class="fill_gaps-list">
      <div class="fill_gaps-item">Frase <input type="text" data-answers='["respuesta"]'> resto.</div>
    </div>
    <div class="fill_gaps-buttons">
      <button type="button" class="fancy-button btn-check">
        <span class="button_top"><span class="button-text">Check Answers</span></span>
      </button>
      <button type="button" class="fancy-button btn-reload" style="display:none;">
        <span class="button_top"><span class="button-text">Reload</span></span>
      </button>
    </div>
    <div class="feedback"></div>
  </div></div>
  ```
- NO poner `placeholder` en el HTML — `fill-gaps.js` lo inyecta como `"..."`.
- `fill-gaps.js` añade `aria-label="Gap N of M"` a cada input automáticamente.
- `data-answers` acepta array JSON con variantes válidas (ej: `'["haven&apos;t seen","have not seen"]'`).
- Borde y sombra del formulario: 2px negro, `box-shadow: 0 10px 0 #000`. Al hacer check, cambian al color del score.
- Inputs se autoajustan en ancho al contenido + 32px.
- `line-height: 2.6` en `.fill_gaps-item` para evitar solapamiento al hacer wrap.
- Tras check: botón cambia a "Try Again", borde/sombra del form cambia al color score, `.feedback` muestra "X / Y".
- Score color: 0=rojo → 0.25=naranja → 0.5=amarillo → 0.75=amarillo-verde → 1=verde.

## Progress tracker (`tracker.js`)
- Se incluye en todas las LC pages tras `fill-gaps.js`.
- Aparece cuando una sección `.section-label.exs` entra en el viewport (`rootMargin: '-25% 0px -25% 0px'`).
- PC (≥769px): vertical, fijo a la izquierda del contenido (`left: calc(50% - 400px - 64px)`), centrado verticalmente.
- Móvil (<768px): horizontal, fijo en la parte superior (`top: clamp(60px, 12vw, 90px)`), centrado.
- Círculos Caveat Brush con la letra del ejercicio (extraída del `.ex-heading`, formato `"a. ..."`).
- Fondo base del círculo: `#99aebb`. Al completar: fondo pastel del score color (mezcla 55% color + 45% blanco), borde y texto vuelven a `#191919`. Animación pop al completar.
- El círculo activo (en viewport) escala a `1.28`. El completado a `1.08`. Ambos: `1.28`.
- Clickable: al hacer click en un círculo, hace scroll hasta ese ejercicio.
- Styles inyectados en `<head>` por el propio JS.

## Reglas de edición
- **No reescribir archivos enteros.** Editar solo la parte mínima necesaria. Edit tool para cambios puntuales, nunca Write para sobrescribir un existente salvo que sea imprescindible.
- Verificar tras editar HTML largo: `tail -3` debe terminar en `</html>`.

## Reglas de exploración (ahorro de contexto/tokens)
- **No listar ni leer `.git/` ni `context/tema/` salvo que se pida explícitamente** (historial de commits y tema WordPress de referencia, respectivamente — no son código vivo del sitio).
- Evitar listados recursivos de toda la raíz del proyecto para tareas puntuales. Ir directo a los archivos relevantes según la sección "Arquitectura" de arriba (normalmente `assets/css/style.css`, el JS del componente en cuestión, y la página HTML concreta).
- Si hace falta explorar, preferir un listado no recursivo o acotado a la subcarpeta relevante (`assets/`, la carpeta del nivel ESO en cuestión) en vez de recursivo desde la raíz.

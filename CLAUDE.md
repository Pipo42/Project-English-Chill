# English & Chill — Project Notes

## Arquitectura
- `assets/css/style.css` — **fuente de verdad de estilos**. Todos los estilos de componentes van aquí, nunca en `<style>` dentro de las páginas HTML.
- `assets/js/` — **fuente de verdad de lógica**. Cada componente tiene su JS centralizado:
  - `puzzle-builder.js` — lógica y estilos base de puzzles
  - `fill-gaps.js` — lógica de fill-in-the-gaps
  - `tracker.js` — progress tracker
  - `nav.js` — navegación y botón back
  - `scroll-top.js` — botón ↑ flotante + animación drops
  - `components.js` — header, footer y scrollbar custom
- `assets/images/` — `E&C Logo.svg` (logo sitio), `Separator-2.svg`, favicon PNG
- `index.html` — home (Choose your level).
- `1st/2nd/3rd/4th-eso.html` — páginas de nivel.
- `3rd-eso/lc5.html` — referencia de LC page.

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
Consistente entre puzzles, tablas y highlights — el alumno aprende el código una vez:
- `#ddeeff` azul → **Subject**
- `#fef4dc` amarillo → **Auxiliary**
- `#dff2e1` verde → **Past Participle** (u otro verbo principal)
- `#fce8e8` rosa → **Keywords** (for/since/ever/never…)
- `#f9d0d8` rosa oscuro → **Auxiliary + not** (variante negativa del auxiliar)

En tablas, estos colores se aplican con las clases: `.c-subj`, `.c-aux`, `.c-pp`, `.c-keyword` (display inline-block, border-radius 999px, padding 0 8px, font-weight 700).

## Puzzles (`puzzle-builder.js` + `style.css`)
- Cada instancia: `PuzzleBuilder.init(cfg)` con `sectionId`, `stageId`, `pieces`, `example` (opcional), `arrowBelow` (índice de pieza con flecha ↑ bajo ella), `swapArrows` ([idxA, idxB] para flechas curvas de intercambio).
- `exampleId` y `exTextId` son opcionales — si no hay elementos con esos IDs en el DOM, se ignoran sin error.
- Cada pieza: `{ word, label, fill, lt, rt }`. `lt`/`rt`: `'none'|'in'|'out'` (encaje puzzle).
- El `fill` del label badge usa el sistema de colores semántico. Si `label` contiene "auxiliary + not", el fill se normaliza automáticamente a `#f9d0d8`.
- El fondo de la pieza (el SVG) toma el color de fondo del `body` via `getComputedStyle` — se integra con la página.
- Texto de la palabra: Caveat Brush. Label (badge inferior): Manrope bold uppercase.
- Escala automáticamente al viewport. Animación: vuela desde la izquierda al entrar en la franja central del viewport (`rootMargin: '-30% 0px -30% 0px'`), con squash/bounce al impactar y shake del vecino.
- **Icono +-?:** se genera automáticamente via `mode: 'aff'|'neg'|'int'` en el `PuzzleBuilder.init`. NO usar divs manuales (`structure-circle`, etc.) en el HTML — eso es patrón obsoleto. El icono es un círculo Caveat Brush generado por JS con colores: aff `#dff2e1`, neg `#f9d0d8`, int `#d4b8f0`.
- **Puntuación en piezas:** la última pieza de cada puzzle lleva el signo de puntuación dentro del `word`: `.` en afirmativas y negativas, `?` en interrogativas.

## Tablas (`style.css`)
- Clase `.grammar-table` dentro de `.grammar-table-wrap`.
- Borde 2px negro, `border-radius: 16px`, `box-shadow: 0 8px 0 #000`.
- Fila de título (`.caption-row`): fondo `#ffe0b2` (naranja pastel), bold, 1.2rem.
- Fila de subheaders (`.subheader`): fondo `#c8f0d8` (verde pastel), bold, 1.15rem.
- Celdas: fondo transparente, 1.15rem, separadores grises `#ccc`.
- Highlights semánticos en celdas: `.c-subj`, `.c-aux`, `.c-pp`, `.c-keyword` (ver sistema de colores).

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

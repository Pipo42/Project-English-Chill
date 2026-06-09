# English & Chill — Project Notes

## Arquitectura
- `assets/css/style.css` — **fuente de verdad de estilos**. Todos los estilos de componentes van aquí, nunca en `<style>` dentro de las páginas HTML.
- `assets/js/` — **fuente de verdad de lógica**. Cada componente tiene su JS centralizado:
  - `puzzle-builder.js` — lógica y estilos base de puzzles
  - `fill-gaps.js` — lógica de fill-in-the-gaps
  - `tracker.js` — progress tracker
  - `nav.js` — navegación
  - `scroll-top.js` — botón ↑ flotante
  - `components.js` — header/footer
- `assets/images/` — EC-Logo.svg, Separator-2.svg, Dotted-Lines-left.svg, Dotted-Lines-right-1.svg, favicon PNG
- `index.html` — home (Choose your level). Header NO tiene link. Footer logo enlaza a `about.html`.
- `1st/2nd/3rd/4th-eso.html` — páginas de nivel. Header enlaza a `index.html`. Footer logo enlaza a `index.html`.
- `3rd-eso/lc5.html` — primera LC page. Es una instancia, no la plantilla de referencia.

## Principio de centralización
**Las páginas HTML solo contienen datos y estructura, nunca lógica ni estilos de componentes.**
- Para añadir o modificar un componente (puzzle, vocab cards, fill-gaps…): editar el JS y/o CSS central.
- Las páginas pasan configuración/datos al componente vía JS (ej: `PuzzleBuilder.init({...})`).
- Así, un cambio en el archivo central se propaga automáticamente a todas las páginas.

## Componentes

### Puzzles (`puzzle-builder.js` + `style.css`)
- Cada instancia se inicializa con `PuzzleBuilder.init(cfg)`.
- `cfg` puede incluir: `pieces`, `example`, `arrowBelow` (índice de pieza con flecha vertical), `swapArrows` ([idxA, idxB]).
- El solapamiento entre piezas escala automáticamente con el viewport via `--puzzle-overlap`.
- La animación se dispara cuando el puzzle entra en la franja central del viewport (`rootMargin: '-30% 0px -30% 0px'`).

### Fill-gaps (`fill-gaps.js` + `style.css`)
- fondo #fff0f0, borde/sombra escarlata; inputs se autoajustan con margen 32px
- NO poner `placeholder` en el HTML — `fill-gaps.js` lo inyecta como `"..."`
- Botón check: "Check Answers" → "Try Again" (gestionado por el JS)
- line-height: 2.6 en .fill_gaps-item para evitar solapamiento en wrap

### Progress tracker (`tracker.js`)
- Se incluye en todas las LC pages tras `fill-gaps.js`
- Aparece automáticamente al entrar en cualquier sección EXS (IntersectionObserver 50% viewport)
- PC: vertical, fijo a la izquierda del contenido. Móvil: horizontal, parte superior
- Círculos con letra del ejercicio (extraída del `.ex-heading` — formato obligatorio `"a. Texto..."`)
- Al completar un ejercicio se rellena con color pastel del score; borde y texto vuelven a negro

## Estructura de una LC page
- Header: Dotted-Lines-left.svg + título "English & Chill" (link a `../index.html`) + Dotted-Lines-right-1.svg
- Favicon: ChatGPT-Image-4-may-2025-11_07_11.png
- Nav buttons: Vocabulary → Grammar → Reading → Listening → Writing (solo los que existen)
- Cada categoría y su EXS van juntos en un `.nav-group` (EXS a la derecha, escarlata)
- CSS var correcta: `--button-outline` (con guion, no underscore)
- Secciones separadas por `Separator-2.svg` (centrado, max-width 600px)
- Section labels: Caveat Brush, negro para EXS
- Tablas: font-size 1.15rem (headers 1.2rem), fondo #f8f8f8
- Exercise headings (.ex-heading): Caveat Brush, escarlata
- Botón back (←): `fancy-button` estándar
- Footer: solo EC-Logo.svg clickable (`display:inline-block`), enlaza a `../index.html`
- Botón ↑ flotante: aparece al salir el header de pantalla, fade in/out suave

## Reglas de edición
- **No reescribir archivos enteros.** Editar solo la parte mínima necesaria. Edit tool para cambios puntuales, nunca Write para sobrescribir un existente salvo que sea imprescindible.
- Los archivos JS largos (ej: lc5.html inline scripts): usar `python3` para parchear.
- Verificar tras editar HTML largo: `tail -3` debe terminar en `</html>`.

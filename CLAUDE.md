# English & Chill — Project Notes

## Arquitectura
- `assets/css/style.css` — estilos globales compartidos por todas las páginas
- `assets/images/` — EC-Logo.svg, Separator-2.svg, Dotted-Lines-left.svg, Dotted-Lines-right-1.svg, favicon PNG
- `index.html` — home (Choose your level). Header NO tiene link. Footer logo enlaza a `about.html`.
- `1st/2nd/3rd/4th-eso.html` — páginas de nivel. Header enlaza a `index.html`. Footer logo enlaza a `index.html`.
- `3rd-eso/lc5.html` — única LC page creada. Es la plantilla de referencia para todas las demás.

## Plantilla LC page — estado actual (lc5.html)

### Header
- Dotted-Lines-left.svg + título "English & Chill" (link a `../index.html`) + Dotted-Lines-right-1.svg
- Favicon: ChatGPT-Image-4-may-2025-11_07_11.png

### Nav buttons
- Orden fijo: Vocabulary → Grammar → Reading → Listening → Writing
- Solo se muestran las secciones que existen en esa página
- Cada categoría y su EXS van juntos en un `.nav-group` (EXS a la derecha, escarlata)
- CSS var correcta: `--button-outline` (con guion, no underscore)

### Secciones
- Separadas por `Separator-2.svg` (centrado, max-width 600px)
- Section labels: Caveat Brush, escarlata para EXS
- Tablas: font-size 1.15rem (headers 1.2rem), fondo #f8f8f8
- Exercise headings (.ex-heading): Caveat Brush, escarlata
- fill_gaps: fondo #fff0f0, borde/sombra escarlata; inputs se autoajustan con margen 32px
- fill_gaps inputs: NO llevar `placeholder` en el HTML — `fill-gaps.js` lo inyecta automáticamente como `"..."`
- Botón check: texto "Check Answers", escarlata. Tras check: texto "Try Again" (lo gestiona fill-gaps.js)
- line-height: 2.6 en .fill_gaps-item para evitar solapamiento en wrap

### Progress tracker
- `assets/js/tracker.js` — se incluye en todas las LC pages tras `fill-gaps.js`
- Aparece automáticamente al entrar en cualquier sección EXS (IntersectionObserver 50% viewport)
- PC: vertical, fijo a la izquierda del contenido. Móvil: horizontal, parte superior
- Círculos con letra del ejercicio (extraída del `.ex-heading` — formato obligatorio `"a. Texto..."`)
- Al completar un ejercicio se rellena con color pastel del score; borde y texto vuelven a negro

### Botón back (←)
- `fancy-button` estándar (no `fancy-back-button`), mismo alto que los demás
- Aplicado también en 1st/2nd/3rd/4th-eso.html

### Footer
- Solo el logo (EC-Logo.svg) es clickable (`display:inline-block` en el `<a>`)
- Enlaza a `../index.html`

### Botón ↑ flotante
- Aparece cuando el header sale de pantalla — fade in/out suave (igual en PC y móvil)
- Sin partículas ni canvas — lógica en `scroll-top.js`

## Reglas de edición
- `lc5.html` tiene JS largo al final. Usar `python3` para parchear, no el Edit tool.
- Verificar tras editar: `tail -3 "3rd-eso/lc5.html"` debe terminar en `</html>`
- Al añadir nuevas secciones/features a la plantilla, respetar todo lo anterior listado aquí.
- **No reescribir archivos enteros.** Siempre editar solo la parte mínima necesaria. Usar Edit tool para cambios puntuales, nunca Write para sobrescribir un archivo existente salvo que sea imprescindible.

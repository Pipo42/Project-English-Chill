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
- Check Answers / Reload: escarlata (`--button-outline` + `background: var(--color-accent-3)`)

### Botón back (←)
- `fancy-button` estándar (no `fancy-back-button`), mismo alto que los demás
- Aplicado también en 1st/2nd/3rd/4th-eso.html

### Footer
- Solo el logo (EC-Logo.svg) es clickable (`display:inline-block` en el `<a>`)
- Enlaza a `../index.html`

### Botón ↑ flotante
- Aparece (bottom-right fijo) cuando el header sale de pantalla — animación emerge del suelo
- Al aparecer: gotas de agua negras desde el contorno del botón, parábola, descanso, alpha 0
- Al desaparecer: blob negro crece sobre el botón → explota en chunks de agua → alpha 0
- Loop RAF unificado (drops + shatter + fragments en un solo tick)

## Reglas de edición
- `lc5.html` tiene JS largo al final. Usar `python3` para parchear, no el Edit tool.
- Verificar tras editar: `tail -3 "3rd-eso/lc5.html"` debe terminar en `</html>`
- Al añadir nuevas secciones/features a la plantilla, respetar todo lo anterior listado aquí.

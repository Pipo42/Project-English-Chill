/* ─────────────────────────────────────────────
   charts.js  —  English & Chill
   Genera tablas gramaticales (.grammar-table) desde datos JS.
   Reutilizable: una instancia por llamada a ChartBuilder.init()
   ───────────────────────────────────────────── */

var ChartBuilder = (function () {

  /* ── API pública ──
     ChartBuilder.init({
       targetId : 'chart-past-continuous-reminder',  ← contenedor donde se inserta la tabla
       caption  : 'Reminder',                         ← texto de la fila naranja superior (colspan automático)
       subheaders: ['Keyword', 'Used for', 'Examples'],  ← opcional: fila verde de subcabeceras
       rows     : [
         ['I / He / She / It', 'was'],
         ['We / You / They', 'were']
       ]
       // Cada celda admite HTML (para <strong>, <span class="c-aux">…</span>, etc.)
     });

     Para cabeceras de fila (th.subheader) sueltas antes de un grupo de filas
     (patrón "Structure examples" de lc1.html: <tr><th>Greetings</th></tr> seguido
     de una fila de datos), usa una fila con { header: 'Greetings' } como único elemento.
  ──────────────────────────────────────────── */
  function init(cfg) {
    var target = document.getElementById(cfg.targetId);
    if (!target) { console.warn('ChartBuilder: targetId "' + cfg.targetId + '" not found'); return; }

    var wrap = document.createElement('div');
    wrap.className = 'grammar-table-wrap';

    var table = document.createElement('table');
    table.className = 'grammar-table';

    var maxCols = cfg.subheaders ? cfg.subheaders.length : (cfg.rows[0] ? cfg.rows[0].length : 1);
    cfg.rows.forEach(function (row) {
      if (Array.isArray(row)) maxCols = Math.max(maxCols, row.length);
    });

    if (cfg.caption) {
      var captionRow = document.createElement('tr');
      var captionTh = document.createElement('th');
      captionTh.className = 'caption-row';
      captionTh.colSpan = maxCols;
      captionTh.innerHTML = cfg.caption;
      captionRow.appendChild(captionTh);
      table.appendChild(captionRow);
    }

    if (cfg.subheaders) {
      var subRow = document.createElement('tr');
      cfg.subheaders.forEach(function (sh) {
        var th = document.createElement('th');
        th.className = 'subheader';
        th.innerHTML = sh;
        subRow.appendChild(th);
      });
      table.appendChild(subRow);
    }

    cfg.rows.forEach(function (row) {
      var tr = document.createElement('tr');
      /* Fila de sub-cabecera suelta: { header: '...' } o { header: '...', colspan: n } */
      if (!Array.isArray(row) && row && row.header !== undefined) {
        var hTh = document.createElement('th');
        hTh.className = 'subheader';
        if (row.colspan) hTh.colSpan = row.colspan;
        hTh.innerHTML = row.header;
        tr.appendChild(hTh);
        table.appendChild(tr);
        return;
      }
      row.forEach(function (cell) {
        var td = document.createElement('td');
        td.innerHTML = cell;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    wrap.appendChild(table);
    target.replaceWith(wrap);
  }

  return { init: init };

})();

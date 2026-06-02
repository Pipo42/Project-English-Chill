<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
	/**
	 * Adds theme support for post formats.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_post_format_setup() {
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_editor_style() {
		add_editor_style( get_parent_theme_file_uri( 'assets/css/editor-style.css' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues style.css on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
	/**
	 * Enqueues style.css on the front.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_styles() {
		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri( 'style.css' ),
			array(),
			wp_get_theme()->get( 'Version' )
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
	/**
	 * Registers custom block styles.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_block_styles() {
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
	/**
	 * Registers pattern categories.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_pattern_categories() {

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => __( 'Pages', 'twentytwentyfive' ),
				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => __( 'Post formats', 'twentytwentyfive' ),
				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
	/**
	 * Registers the post format block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_block_bindings() {
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
	/**
	 * Callback function for the post format name block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return string|void Post format name, or nothing if the format is 'standard'.
	 */
	function twentytwentyfive_format_binding() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;


//PERMISO PARA SUBIR SVG
add_filter( 'wp_check_filetype_and_ext', function($data, $file, $filename, $mimes) {

  global $wp_version;
  if ( $wp_version !== '4.7.1' ) {
     return $data;
  }

  $filetype = wp_check_filetype( $filename, $mimes );

  return [
      'ext'             => $filetype['ext'],
      'type'            => $filetype['type'],
      'proper_filename' => $data['proper_filename']
  ];

}, 10, 4 );

function cc_mime_types( $mimes ){
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter( 'upload_mimes', 'cc_mime_types' );

function fix_svg() {
  echo '<style type="text/css">
        .attachment-266x266, .thumbnail img {
             width: 100% !important;
             height: auto !important;
        }
        </style>';
}
add_action( 'admin_head', 'fix_svg' );

//SISTEMA DE FLASHCARDS
function flashcards_shortcode($atts) {
    $atts = shortcode_atts([
        'words' => ''
    ], $atts);

    $words = explode(',', $atts['words']);

    ob_start();
    ?>
    <style>
@import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap');

.flashcards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
}

.flashcard {
    width: 8rem;
    height: 10rem;
    perspective: 100rem;
    cursor: pointer;
    font-family: 'Caveat Brush', cursive;
}

.flashcard-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.4s, border-color 0.4s ease; /* Solo animamos la rotación y el borde */
    transform-style: preserve-3d;
    border: 0.1rem solid transparent; /* Borde transparente por defecto */
    border-radius: 0.6rem;
    background: transparent;
}

.flashcard.flipped .flashcard-inner {
    transform: rotateY(180deg);
    border-color: white; /* Cambiar el borde a blanco cuando se voltea */
}

.flashcard-front, .flashcard-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden; /* Asegurarse de que no se vea la cara opuesta */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    background: transparent;
    color: black;
    text-align: center;
    border-style: solid;
    border-width: 0.1rem;
    transition: border-color 0.4s ease; /* Transición suave solo en el borde */
}

/* Parte delantera: borde negro */
.flashcard-front {
    border-color: black;
    box-shadow: 0.15rem 0.15rem 0 black; /* Sombra negra */
}

/* Parte trasera: borde blanco */
.flashcard-back {
    color: white;
    border-radius: 0.5rem;
    border-color: white; /* Borde blanco en la parte trasera */
    box-shadow: 0.15rem 0.15rem 0 white; /* Sombra blanca */
    transform: rotateY(180deg); /* Voltear la parte trasera */
}

/* Cuando la tarjeta está volcada, ocultamos la parte delantera */
.flashcard.flipped .flashcard-front {
    border-color: transparent; /* Hacer el borde transparente cuando está volteada */
}

/* Cuando la tarjeta está en su cara original, el borde vuelve a negro */
.flashcard:not(.flipped) .flashcard-front {
    border-color: black;
}




    </style>

    <div class="flashcards-container">
        <?php foreach ($words as $pair):
            $parts = explode(':', $pair);
            $front = trim($parts[0]);
            $back = isset($parts[1]) ? trim($parts[1]) : '';
        ?>
            <div class="flashcard" onclick="this.classList.toggle('flipped')">
                <div class="flashcard-inner">
                    <div class="flashcard-front"><?php echo esc_html($front); ?></div>
                    <div class="flashcard-back"><?php echo esc_html($back); ?></div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('flashcards', 'flashcards_shortcode');



// =====================================================
// Fill the Gaps + Fancy Button (TODO EN FUNCTIONS.PHP)
// =====================================================

function fill_gaps_exercise_shortcode($atts, $content = null) {

    // Fuente del ejercicio
    wp_enqueue_style(
        'caveat-brush-font',
        'https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap',
        [],
        null
    );

    ob_start();
    ?>
    <style>
    /* ================= Fancy Button ================= */

    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');

    .fancy-button {
        --button-radius: 0.75em;
        --button-outline: var(--button_outline, #000);
        --button-color: #99aebb;

        font-family: 'Manrope', system-ui, sans-serif;
        font-size: 1.5rem;
        font-weight: 400;
        text-decoration: none;
        cursor: pointer;
        display: inline-block;
        background: var(--button-outline);
        border-radius: var(--button-radius);
        padding: 0;
    }

    .fancy-button .button_top {
        border: 1px solid var(--button-outline);
        background: var(--button-color);
        color: var(--button-outline);
        padding: 0.75em 1.5em;
        border-radius: var(--button-radius);
        transform: translateY(-0.35em);
        transition: transform 0.12s ease;
        text-align: center;
    }

    .fancy-button:hover .button_top {
        transform: translateY(-0.5em);
    }

    .fancy-button:active .button_top {
        transform: translateY(0);
    }

    .fancy-button .button-text {
        font-weight: 300;
        line-height: 1.2;
    }

    /* ================= Fill the Gaps ================= */

    .fill_gaps-wrapper {
        display: flex;
        justify-content: center;
        padding: 1rem;
    }

    .fill_gaps {
        font-family: 'Caveat Brush', cursive;
        font-size: 1.5rem;
        color: #560319;
        max-width: 50rem;
        width: 100%;
		border: 1px solid #560319
; /* mismo color que el botón */
        border-radius: 20px;
        padding: 20px;
		box-shadow: 0 10px 0 #560319
;
    }

    .fill_gaps-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .fill_gaps-item {
        display: block;
		padding: 10px 0;
        border-bottom: 1px solid #560319;
    }
		
	.fill_gaps-item:last-child {
        border-bottom: none;
    }

    .fill_gaps input[type="text"] {
        font-family: inherit;
        font-size: inherit;
        text-align: center;
        padding: 6px 10px;
        border: 1px solid #560319;
        border-radius: 1.25rem;
        background: none;
        color: #560319;
        min-width: 80px;
		width: auto;
		transition: width 0.25s ease, padding 0.25s ease;

    }

    .fill_gaps input.correct { color: green; }
    .fill_gaps input.incorrect { color: red; }

    .fill_gaps input.checked {
        border: none;
    }

    .correct-answer {
        color: yellow;
        margin-left: 0.5rem;
    }

    .fill_gaps-buttons {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .feedback {
        margin-top: 1rem;
        font-size: 2rem;
        color: blue;
        text-align: center;
    }
    </style>

    <div class="fill_gaps-wrapper">
        <div class="fill_gaps">

            <div class="fill_gaps-list">
                <?php
                $lines = explode("\n", trim($content));
                foreach ($lines as $line) {

                    $sentence = preg_replace_callback('/\[(.*?)\]/', function ($matches) {
                        $raw = html_entity_decode(trim($matches[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                        $answers = array_map('trim', explode(';', $raw));
                        $json = esc_attr(json_encode($answers, JSON_UNESCAPED_UNICODE));
                        return "<input type='text' data-answers='{$json}' placeholder='?'>";
                    }, $line);

                    echo "<div class='fill_gaps-item'>{$sentence}</div>";
                }
                ?>
            </div>

            <div class="fill_gaps-buttons">
                <a href="#" class="fancy-button btn-check" style="--button_outline:#560319;">
                    <span class="button_top">
                        <span class="button-text">Check Answers</span>
                    </span>
                </a>

                <a href="#" class="fancy-button btn-reload" style="--button_outline:#560319; display:none;">
                    <span class="button_top">
                        <span class="button-text">Reload</span>
                    </span>
                </a>
            </div>

            <div class="feedback"></div>
        </div>
    </div>

    <script>
    (function () {

        function normalizeString(str) {
            const t = document.createElement("textarea");
            t.innerHTML = str;
            str = t.value;

            return str.trim().toLowerCase()
                .replace(/[’‘‛‹›]/g, "'")
                .replace(/[.,!?;:]$/, "");
        }

        function adjustInputWidth(input) {
            const span = document.createElement("span");
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.whiteSpace = "pre";
            span.style.font = window.getComputedStyle(input).font;
            span.textContent = input.value || input.placeholder || "?";
            document.body.appendChild(span);
            input.style.width = (span.offsetWidth + 10) + "px";
            document.body.removeChild(span);
        }

function check(button) {
    const container = button.closest('.fill_gaps');
    const inputs = container.querySelectorAll('input[type="text"]');

    inputs.forEach(input => {
        if (input.classList.contains('checked')) return;

        const user = normalizeString(input.value);
        const valid = JSON.parse(input.dataset.answers).map(normalizeString);

        input.disabled = true;

        if (valid.includes(user)) {
            input.classList.add('correct');
        } else {
            input.classList.add('incorrect');
            const span = document.createElement('span');
            span.className = 'correct-answer';
            span.textContent = `(${valid[0]})`;
            input.parentNode.appendChild(span);
        }

        input.classList.add('checked');
    });

    const correct = container.querySelectorAll('input.correct').length;

    container.querySelector('.feedback').textContent =
        `${correct} / ${inputs.length}`;

    container.querySelector('.btn-check').style.display = 'none';
    container.querySelector('.btn-reload').style.display = 'inline-block';
}


        function reload(button) {
            const container = button.closest('.fill_gaps');
            const inputs = container.querySelectorAll('input[type="text"]');

            inputs.forEach(input => {
                input.value = '';
                input.disabled = false;
                input.classList.remove('correct','incorrect','checked');
                adjustInputWidth(input);

                const span = input.parentNode.querySelector('.correct-answer');
                if (span) span.remove();
            });

            container.querySelector('.feedback').textContent = '';
            container.querySelector('.btn-reload').style.display = 'none';
            container.querySelector('.btn-check').style.display = 'inline-block';
        }

        document.addEventListener('click', function (e) {
            const checkBtn = e.target.closest('.btn-check');
            if (checkBtn) { e.preventDefault(); check(checkBtn); }

            const reloadBtn = e.target.closest('.btn-reload');
            if (reloadBtn) { e.preventDefault(); reload(reloadBtn); }
        });

        document.addEventListener('input', function (e) {
            if (e.target.matches('.fill_gaps input[type="text"]')) {
                adjustInputWidth(e.target);
            }
        });
		
		document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const input = e.target;

        // Solo si estamos dentro de un fill_gaps
        if (input.matches('.fill_gaps input[type="text"]')) {
            e.preventDefault();

            const container = input.closest('.fill_gaps');
            const checkBtn = container.querySelector('.btn-check');

            // Solo si el botón existe y está visible
            if (checkBtn && checkBtn.style.display !== 'none') {
                checkBtn.click();
            }
        }
    }
});


        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.fill_gaps input[type="text"]')
                .forEach(adjustInputWidth);
        });

    })();
    </script>
    <?php

    return ob_get_clean();
}

add_shortcode('fill_gaps', 'fill_gaps_exercise_shortcode');





//TABLAS
function tabla_shortcode_avanzada($atts, $content = null) {
    if (!$content) return '';

    $lines = array_filter(array_map('trim', explode("\n", trim($content))));
    if (empty($lines)) return '';

    $atts = shortcode_atts([
        'header_color'    => '#d1f6ff',  // color por defecto para <h>
        'subheader_color' => '#aaf0c9',  // color por defecto para <sh>
    ], $atts, 'tabla');

    ob_start();
    ?>
    <div style="width:100%; text-align:center; margin:20px 0;">
      <table style="
          border-collapse:collapse;
          border:1px solid #000;
          background-color:#f8f8f8;
          color:#000;
          text-align:center;
          margin: 0 auto;
          display:table;
          word-wrap: break-word;
          white-space: normal;
      ">
    <?php

    foreach ($lines as $line) {

        // HEADER GENERAL: <h> o <h color="#xxxxxx">
        if (preg_match('/^<h(?:\s+color=["\']?(#[0-9a-fA-F]{3,6})["\']?)?\>(.*)$/i', $line, $m)) {
            $h_color = !empty($m[1]) ? $m[1] : $atts['header_color'];
            $h_text_raw = trim($m[2]);
            $h_html = tabla_parse_markup_simplificada($h_text_raw);

            echo '<tr><th colspan="100" style="
                background-color:' . esc_attr($h_color) . ';
                padding:8px 16px;
                border:1px solid black;
                font-weight:bold;
                text-align:center;
                word-wrap: break-word;
                white-space: normal;
            ">' . $h_html . '</th></tr>';
            continue;
        }

        // SUBHEADER: <sh> o <sh color="#xxxxxx">
        if (preg_match('/^<sh(?:\s+color=["\']?(#[0-9a-fA-F]{3,6})["\']?)?\>(.*)$/i', $line, $m)) {
            $sh_color = !empty($m[1]) ? $m[1] : $atts['subheader_color'];
            $sh_text_raw = trim($m[2]);

            // ¿Tiene columnas?
            if (strpos($sh_text_raw, '|') !== false) {
                $columns = array_map('trim', explode('|', $sh_text_raw));
                echo '<tr>';
                foreach ($columns as $col) {
                    $col_html = tabla_parse_markup_simplificada($col);
                    echo '<th style="
                        background-color:' . esc_attr($sh_color) . ';
                        padding:8px 12px;
                        border:1px solid black;
                        font-weight:bold;
                        text-align:center;
                        word-wrap: break-word;
                        white-space: normal;
                    ">' . $col_html . '</th>';
                }
                echo '</tr>';
            } else {
                // Si no hay | → ocupa toda la tabla
                $sh_html = tabla_parse_markup_simplificada($sh_text_raw);
                echo '<tr><th colspan="100" style="
                    background-color:' . esc_attr($sh_color) . ';
                    padding:8px 16px;
                    border:1px solid black;
                    font-weight:bold;
                    text-align:center;
                    word-wrap: break-word;
                    white-space: normal;
                ">' . $sh_html . '</th></tr>';
            }
            continue;
        }

        // FILAS NORMALES
        $columns = array_map('trim', explode('|', $line));
        if (count($columns) === 0) continue;

        echo '<tr>';
        foreach ($columns as $col) {
            $cell_html = tabla_parse_markup_simplificada($col);
            echo '<td style="
                padding:6px 12px;
                border:1px solid black;
                text-align:center;
                vertical-align:middle;
                word-wrap: break-word;
                white-space: normal;
            ">' . $cell_html . '</td>';
        }
        echo '</tr>';
    }
    ?>
      </table>
    </div>
    <?php

    return ob_get_clean();
}
add_shortcode('tabla', 'tabla_shortcode_avanzada');



// Parser de etiquetas (.b, .i, .A, .R, .V, .P, .L)
function tabla_parse_markup_simplificada($text) {
    $text = trim($text);

    // Permitir explícitamente <br> antes de escapado
    $text = str_replace(['<br>', '<br/>', '<br />'], '[[BR]]', $text);

    // Escapar el resto para evitar HTML no deseado
    $text = esc_html($text);

    // Restaurar los saltos de línea como <br>
    $text = str_replace('[[BR]]', '<br>', $text);

    // Aplicar marcado personalizado (.b, .i, .A, etc.)
    $patterns = [
        '/\.b(.*?)\/b/s'   => '<strong>$1</strong>',
        '/\.i(.*?)\/i/s'   => '<em>$1</em>',
        '/\.A(.*?)\/A/s'   => '<span style="color:blue;">$1</span>',
        '/\.V(.*?)\/V/s'   => '<span style="color:green;">$1</span>',
        '/\.R(.*?)\/R/s'   => '<span style="color:red;">$1</span>',
        '/\.P(.*?)\/P/s' => '<span style="color:#ff69b4;">$1</span>',
        '/\.L(.*?)\/L/s'   => '<span style="color:purple;">$1</span>',
		'/\.N(.*?)\/N/s'   => '<span style="color:#f4b87a;">$1</span>',
		'/\.Y(.*?)\/Y/s'   => '<span style="color:#ffd166;">$1</span>',
    ];

    foreach ($patterns as $regex => $replace) {
        $text = preg_replace($regex, $replace, $text);
    }

    // Solo permitimos etiquetas seguras
    $allowed_tags = [
        'strong' => [],
        'em'     => [],
        'span'   => ['style' => true],
        'br'     => [],
    ];

    return wp_kses($text, $allowed_tags);
}

// === Smooth scroll global para anclas ===
function fancy_add_smooth_scroll_script() {
    ?>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function(e) {
                const targetId = this.getAttribute("href").substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: "smooth"
                    });
                }
            });
        });
    });
    </script>
    <?php
}
add_action('wp_footer', 'fancy_add_smooth_scroll_script');

//MÉTRICAS UMAMI
function umami_analytics() {
 ?>
	<script defer src="https://analytics.iescalvia.com/script.js" data-website-id="b8a4d265-f8d4-4f97-8cd1-aab26da9343d"></script>
 <?php
}
add_action('wp_head', 'umami_analytics');

// ==== Fancy Button con color de texto y borde personalizable ====
function fancy_button_shortcode_block($atts = [], $content = null) {
    if (is_null($content)) {
        return '';
    }

    // Divide el contenido tipo "clave = valor"
    $lines = explode("\n", trim($content));
    $params = [];

    foreach ($lines as $line) {
        if (strpos($line, '=') !== false) {
            list($key, $value) = array_map('trim', explode('=', $line, 2));
            $params[strtolower($key)] = $value;
        }
    }

    // Valores por defecto
    $text   = isset($params['text']) ? wp_kses_post($params['text']) : 'Mi botón';
    $link   = isset($params['link']) ? esc_url($params['link']) : '#';
    $target = isset($params['target']) ? esc_attr($params['target']) : '_self';
    $class  = isset($params['class']) ? esc_attr($params['class']) : '';
    $image  = isset($params['image']) ? esc_url($params['image']) : '';
    $color  = isset($params['color']) ? strtolower(trim($params['color'])) : '#000000'; // negro por defecto

    // Añade rel por seguridad si se abre en nueva pestaña
    $rel = ($target === '_blank') ? ' rel="noopener noreferrer"' : '';

    // Imagen (opcional)
    $img_html = '';
    if ($image) {
        $img_html = '<img src="' . $image . '" alt="" class="button-icon" loading="lazy" />';
    }

    // Aplica el color al borde y texto mediante CSS variable
    $custom_style = 'style="--button_outline:' . esc_attr($color) . ';"';

    // HTML final
    $html  = '<a href="' . $link . '" target="' . $target . '"' . $rel . ' class="fancy-button ' . $class . '" ' . $custom_style . '>';
    $html .= '<span class="button_top">' . $img_html . '<span class="button-text">' . $text . '</span></span>';
    $html .= '</a>';

    return $html;
}
add_shortcode('fancy-button', 'fancy_button_shortcode_block');


// ==== FANCY BACK BUTTON ====
function fancy_back_button_shortcode() {
  return '
  <a href="javascript:void(0)" 
     onclick="const path = window.location.pathname.replace(/\/[^/]+\/?$/, \'/\'); window.location.href = path;"
     class="fancy-button fancy-blue fancy-back-button">
    <span class="button_top">
      <span class="button-text">←</span>
    </span>
  </a>';
}
add_shortcode("fancy-back-button", "fancy_back_button_shortcode");


add_shortcode('whiteboard', function() {
    // Esto solo imprime un contenedor vacío y un botón
    return '
        <div id="whiteboard-container" style="border:2px solid #333; padding:20px; width:100%; min-height:150px; font-family:monospace; white-space:pre-line; background:#fafafa;"></div>
        <button id="whiteboard-btn" style="margin-top:10px; padding:8px 15px; cursor:pointer;">
            Mostrar siguiente línea
        </button>
    ';
});
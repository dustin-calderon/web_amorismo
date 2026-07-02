# -*- coding: utf-8 -*-
import re

file_path = r'd:\Code Projects\web_amorismo\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old section to replace
old_start = '<!-- ===== 1b. MÚSICA'
old_end_marker = '<hr class="am-divider">'

start_idx = content.index(old_start)
# Find the first <hr class="am-divider"> AFTER the start
end_idx = content.index(old_end_marker, start_idx)
end_idx += len(old_end_marker)

replacement = '''<!-- ===== 1b. STATEMENT: Concepto + Descripción + Quotes ===== -->
\t<section class="am-statement" id="concepto">
\t\t<div class="am-statement__grid">
\t\t\t<div class="am-statement__headline">
\t\t\t\t<h2>
\t\t\t\t\t<em>Amorismo</em> es una historia de <span class="am-hl am-hl--amor">amor</span>
\t\t\t\t\tsobre las personas con las que <span class="am-hl am-hl--no">no</span> acabas.
\t\t\t\t</h2>
\t\t\t</div>
\t\t\t<div class="am-statement__body">
\t\t\t\t<p>Escrito y compuesto por Dustin Calderón, compositor peruano-español de teatro musical, Amorismo es un micromusical contemporáneo e íntimo que explora el amor, la soledad, la vulnerabilidad y esas pequeñas decisiones que pueden cambiar por completo el rumbo de una relación.</p>
\t\t\t\t<p>Contado a través de tres volúmenes independientes conectados por un mismo universo emocional, Amorismo sigue distintas versiones de Él y Ella mientras atraviesan el deseo, la incertidumbre, el apego, la ruptura y la frágil esperanza de que el amor todavía sea posible. Con una partitura poética de teatro musical contemporáneo y un lenguaje escénico interactivo, la obra plantea una pregunta tan sencilla como peligrosa: cuando el amor deja de seguir el guion que habíamos imaginado, ¿seguimos adelante, nos marchamos o dejamos que el público ayude a decidir?</p>
\t\t\t\t<p>Desarrollado originalmente como una experiencia de teatro musical en formato breve, Amorismo ha sido representado en España y Perú, forma parte del catálogo musical de Dustin Calderón y ha llegado a la escena de Microteatro Madrid como parte de una nueva generación de teatro musical original en español.</p>
\t\t\t</div>
\t\t</div>

\t\t<!-- Testimonials — verified from audience & industry (Instagram stories) -->
\t\t<div class="am-statement__quotes">
\t\t\t<blockquote class="am-statement__quote am-statement__quote--featured">
\t\t\t\t<p>\u201cCuando las cosas se hacen con gusto, cuidado y honestidad salen pequeñas obras de arte. Ojalá los productores confiaran en el producto autóctono. Hay mucho talento en este país.\u201d</p>
\t\t\t\t<cite>Xenia Garcias</cite>
\t\t\t</blockquote>
\t\t\t<blockquote class="am-statement__quote">
\t\t\t\t<p>\u201cCreo que es uno de los musicales más difíciles que he visto, pero gracias a esa dificultad crea un resultado mágico.\u201d</p>
\t\t\t\t<cite>Nacho Rodríguez</cite>
\t\t\t</blockquote>
\t\t\t<blockquote class="am-statement__quote">
\t\t\t\t<p>\u201cNo creo que un producto nacional esté tan cargado de sensibilidad como este.\u201d</p>
\t\t\t\t<cite>María Jaraíz</cite>
\t\t\t</blockquote>
\t\t\t<blockquote class="am-statement__quote">
\t\t\t\t<p>\u201cAyer me hiciste recordar porqué me quiero dedicar al teatro musical. Es precioso lo que habéis creado.\u201d</p>
\t\t\t\t<cite>Maribel Sicilia</cite>
\t\t\t</blockquote>
\t\t</div>
\t</section>

\t<hr class="am-divider">'''

new_content = content[:start_idx] + replacement + content[end_idx:]

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(new_content)

print(f"Patched successfully. Old section: {end_idx - start_idx} chars. New section: {len(replacement)} chars.")
print(f"Total file size: {len(new_content)} chars.")

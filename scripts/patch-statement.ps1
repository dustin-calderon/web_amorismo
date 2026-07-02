$file = 'd:\Code Projects\web_amorismo\index.html'
$content = Get-Content $file -Raw

# Markers
$startMarker = '<!-- ===== 1b.'
$endMarker = '<hr class="am-divider">'

$startIdx = $content.IndexOf($startMarker)
$endIdx = $content.IndexOf($endMarker, $startIdx)
$endIdx = $endIdx + $endMarker.Length

Write-Host "Start index: $startIdx"
Write-Host "End index: $endIdx"
Write-Host "Fragment length: $($endIdx - $startIdx)"

$replacement = @'
<!-- ===== 1b. STATEMENT: Concepto + Descripción + Quotes ===== -->
	<section class="am-statement" id="concepto">
		<div class="am-statement__grid">
			<div class="am-statement__headline">
				<h2>
					<em>Amorismo</em> es una historia de <span class="am-hl am-hl--amor">amor</span>
					sobre las personas con las que <span class="am-hl am-hl--no">no</span> acabas.
				</h2>
			</div>
			<div class="am-statement__body">
				<p>Escrito y compuesto por Dustin Calderón, compositor peruano-español de teatro musical, Amorismo es un micromusical contemporáneo e íntimo que explora el amor, la soledad, la vulnerabilidad y esas pequeñas decisiones que pueden cambiar por completo el rumbo de una relación.</p>
				<p>Contado a través de tres volúmenes independientes conectados por un mismo universo emocional, Amorismo sigue distintas versiones de Él y Ella mientras atraviesan el deseo, la incertidumbre, el apego, la ruptura y la frágil esperanza de que el amor todavía sea posible. Con una partitura poética de teatro musical contemporáneo y un lenguaje escénico interactivo, la obra plantea una pregunta tan sencilla como peligrosa: cuando el amor deja de seguir el guion que habíamos imaginado, ¿seguimos adelante, nos marchamos o dejamos que el público ayude a decidir?</p>
				<p>Desarrollado originalmente como una experiencia de teatro musical en formato breve, Amorismo ha sido representado en España y Perú, forma parte del catálogo musical de Dustin Calderón y ha llegado a la escena de Microteatro Madrid como parte de una nueva generación de teatro musical original en español.</p>
			</div>
		</div>

		<!-- Testimonials — verified from audience & industry (Instagram stories) -->
		<div class="am-statement__quotes">
			<blockquote class="am-statement__quote am-statement__quote--featured">
				<p>"Cuando las cosas se hacen con gusto, cuidado y honestidad salen pequeñas obras de arte. Ojalá los productores confiaran en el producto autóctono. Hay mucho talento en este país."</p>
				<cite>Xenia Garcias</cite>
			</blockquote>
			<blockquote class="am-statement__quote">
				<p>"Creo que es uno de los musicales más difíciles que he visto, pero gracias a esa dificultad crea un resultado mágico."</p>
				<cite>Nacho Rodríguez</cite>
			</blockquote>
			<blockquote class="am-statement__quote">
				<p>"No creo que un producto nacional esté tan cargado de sensibilidad como este."</p>
				<cite>María Jaraíz</cite>
			</blockquote>
			<blockquote class="am-statement__quote">
				<p>"Ayer me hiciste recordar porqué me quiero dedicar al teatro musical. Es precioso lo que habéis creado."</p>
				<cite>Maribel Sicilia</cite>
			</blockquote>
		</div>
	</section>

	<hr class="am-divider">
'@

$newContent = $content.Substring(0, $startIdx) + $replacement + $content.Substring($endIdx)
Set-Content $file -Value $newContent -NoNewline -Encoding UTF8
Write-Host "Done. File patched successfully."

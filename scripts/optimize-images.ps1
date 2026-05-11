# optimize-images.ps1
# Convierte y comprime todas las imágenes del proyecto a WebP usando ffmpeg.
# Los originales se conservan intactos. Los WebP se escriben en assets/images/.
#
# Uso: .\scripts\optimize-images.ps1

$ErrorActionPreference = 'Stop'
$root   = Split-Path $PSScriptRoot -Parent
$imgDir = Join-Path $root 'assets\images'

# ── Configuración por tipo ──────────────────────────────────────────────────
# Logo: escala a 400px de ancho máximo (display real: 160-180px; 400 = buen 2x)
# Fotos galería: reescala a 1400px ancho máx (container max 1180px, display 2x)
# Thumbnails galería: mismos archivos, el CSS los muestra pequeño — mismo WebP sirve
# Fotos elenco/equipo: reescala a 600px ancho máx (cards 3:4, ~280px display)
# Cartel: reescala a 1000px ancho máx (display max 500px, 2x)

$rules = @(
    @{ Pattern = 'amorismo-logo.png';   MaxW = 400;  Quality = 85 },
    @{ Pattern = 'amorismo-cartel.*';   MaxW = 1000; Quality = 82 },
    @{ Pattern = 'IMG_*.jpeg';          MaxW = 1400; Quality = 80 },
    @{ Pattern = 'IMG_*.jpg';           MaxW = 1400; Quality = 80 },
    @{ Pattern = '*_fondo-verde.png';   MaxW = 600;  Quality = 82 }
)

# ── Función de conversión ───────────────────────────────────────────────────
function Convert-ToWebP {
    param(
        [string]$InputFile,
        [int]$MaxW,
        [int]$Quality
    )

    $baseName  = [System.IO.Path]::GetFileNameWithoutExtension($InputFile)
    $outputFile = Join-Path $imgDir "$baseName.webp"

    # vf: scale=min(MaxW,iw):-1  → solo escala si la imagen es más ancha que MaxW
    # flags=lanczos → resampling de alta calidad
    $vf = "scale='if(gt(iw,$MaxW),$MaxW,iw)':-1:flags=lanczos"

    $args = @(
        '-y',                       # sobreescribir sin preguntar
        '-i', $InputFile,
        '-vf', $vf,
        '-quality', $Quality,       # ffmpeg webp quality 0-100
        '-compression_level', '6',  # 0=rápido, 6=máxima compresión
        $outputFile
    )

    Write-Host "  → $([System.IO.Path]::GetFileName($InputFile)) ($([math]::Round((Get-Item $InputFile).Length/1KB))KB)" -NoNewline
    ffmpeg @args 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host " [ERROR]" -ForegroundColor Red
        return
    }
    $sizeBefore = [math]::Round((Get-Item $InputFile).Length / 1KB)
    $sizeAfter  = [math]::Round((Get-Item $outputFile).Length / 1KB)
    $saving     = [math]::Round((1 - $sizeAfter / $sizeBefore) * 100)
    Write-Host " → $sizeAfter KB  (-$saving%)" -ForegroundColor Green
}

# ── Main ────────────────────────────────────────────────────────────────────
Write-Host "`n[Amorismo] Image Optimizer  ffmpeg + WebP`n" -ForegroundColor Cyan

$totalBefore = 0
$totalAfter  = 0

foreach ($rule in $rules) {
    $files = Get-ChildItem -Path $imgDir -Filter $rule.Pattern
    foreach ($file in $files) {
        $totalBefore += $file.Length
        Convert-ToWebP -InputFile $file.FullName -MaxW $rule.MaxW -Quality $rule.Quality
        $webpName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) + '.webp'
        $webpPath = Join-Path $imgDir $webpName
        if (Test-Path $webpPath) {
            $totalAfter += (Get-Item $webpPath).Length
        }
    }
}

$savedKB   = [math]::Round(($totalBefore - $totalAfter) / 1KB)
$savedPct  = [math]::Round((1 - $totalAfter / $totalBefore) * 100)

Write-Host "`n[OK] Total antes : $([math]::Round($totalBefore/1KB)) KB"  -ForegroundColor White
Write-Host "[OK] Total despues: $([math]::Round($totalAfter/1KB)) KB"   -ForegroundColor White
Write-Host "[>>] Ahorro       : $savedKB KB  (-$savedPct%)`n"           -ForegroundColor Yellow
Write-Host "[i]  Los originales se conservan. Actualiza los src en HTML cuando verifiques el resultado." -ForegroundColor Gray

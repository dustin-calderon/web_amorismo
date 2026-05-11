# optimize-images.ps1
# Convierte y comprime todas las imagenes del proyecto a WebP usando ffmpeg.
# Los originales se conservan intactos.
#
# Uso: .\scripts\optimize-images.ps1

$root   = Split-Path $PSScriptRoot -Parent
$imgDir = Join-Path $root 'assets\images'

# Configuracion por tipo de imagen
$rules = @(
    [pscustomobject]@{ Pattern = 'amorismo-logo.png';  MaxW = 400;  Qual = 85 }
    [pscustomobject]@{ Pattern = 'amorismo-cartel.*';  MaxW = 1000; Qual = 82 }
    [pscustomobject]@{ Pattern = 'IMG_*.jpeg';         MaxW = 1400; Qual = 80 }
    [pscustomobject]@{ Pattern = 'IMG_*.jpg';          MaxW = 1400; Qual = 80 }
    [pscustomobject]@{ Pattern = '*_fondo-verde.png';  MaxW = 600;  Qual = 82 }
)

function Convert-ToWebP {
    param(
        [string]$InputFile,
        [int]$MaxW,
        [int]$Qual
    )

    $baseName   = [System.IO.Path]::GetFileNameWithoutExtension($InputFile)
    $outputFile = Join-Path $imgDir "$baseName.webp"
    $sizeBefore = [math]::Round((Get-Item $InputFile).Length / 1KB)

    # scale: reduce solo si iw > MaxW; -1 mantiene aspect ratio
    $vf = "scale='if(gt(iw,$MaxW),$MaxW,iw)':-1:flags=lanczos"

    $ffArgs = @(
        '-y'
        '-i', $InputFile
        '-vf', $vf
        '-quality', "$Qual"
        '-compression_level', '6'
        $outputFile
    )

    Write-Host "  $([System.IO.Path]::GetFileName($InputFile)) ($sizeBefore KB)" -NoNewline

    # Redirigir stderr a archivo temporal para evitar NativeCommandError en PowerShell.
    # ffmpeg siempre escribe su cabecera de version en stderr aunque tenga exito.
    $tmpErr = [System.IO.Path]::GetTempFileName()
    & ffmpeg @ffArgs 2>$tmpErr | Out-Null
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        Write-Host " [ERROR - exit $exitCode]" -ForegroundColor Red
        Get-Content $tmpErr -ErrorAction SilentlyContinue | Select-Object -Last 5 |
            ForEach-Object { Write-Host "    $_" -ForegroundColor DarkRed }
        Remove-Item $tmpErr -ErrorAction SilentlyContinue
        return 0
    }

    Remove-Item $tmpErr -ErrorAction SilentlyContinue

    $sizeAfter = [math]::Round((Get-Item $outputFile).Length / 1KB)
    $saving    = if ($sizeBefore -gt 0) { [math]::Round((1 - $sizeAfter / $sizeBefore) * 100) } else { 0 }
    Write-Host " --> $sizeAfter KB  (-$saving%)" -ForegroundColor Green
    return $sizeAfter
}

# ── Main ─────────────────────────────────────────────────────────────────────
Write-Host "`n[Amorismo] Image Optimizer  ffmpeg + WebP`n" -ForegroundColor Cyan

$totalBefore = 0
$totalAfter  = 0

foreach ($rule in $rules) {
    $files = Get-ChildItem -Path $imgDir -Filter $rule.Pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $totalBefore += [math]::Round($file.Length / 1KB)
        $afterKB      = Convert-ToWebP -InputFile $file.FullName -MaxW $rule.MaxW -Qual $rule.Qual
        $totalAfter  += $afterKB
    }
}

$savedKB  = $totalBefore - $totalAfter
$savedPct = if ($totalBefore -gt 0) { [math]::Round($savedKB / $totalBefore * 100) } else { 0 }

Write-Host "`n[OK] Total antes : $totalBefore KB" -ForegroundColor White
Write-Host "[OK] Total despues: $totalAfter KB"   -ForegroundColor White
Write-Host "[>>] Ahorro       : $savedKB KB  (-$savedPct%)`n" -ForegroundColor Yellow
Write-Host "[i]  Originales conservados. Actualiza los src en HTML cuando verifiques el resultado." -ForegroundColor Gray

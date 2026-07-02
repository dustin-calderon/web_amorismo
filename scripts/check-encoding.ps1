$b = [System.IO.File]::ReadAllBytes('d:\Code Projects\web_amorismo\index.html')
Write-Host ("First 3 bytes: {0:X2} {1:X2} {2:X2}" -f $b[0],$b[1],$b[2])
Write-Host ("Total bytes: " + $b.Length)

# Check if file has BOM
if ($b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) {
    Write-Host "Has UTF-8 BOM - removing..."
    $noBom = $b[3..($b.Length-1)]
    [System.IO.File]::WriteAllBytes('d:\Code Projects\web_amorismo\index.html', $noBom)
    Write-Host "BOM removed."
} else {
    Write-Host "No BOM detected."
}

# Check for double-encoding by looking for C3 83 (which is Ã encoded as UTF-8)
$content = [System.IO.File]::ReadAllBytes('d:\Code Projects\web_amorismo\index.html')
$str = [System.Text.Encoding]::UTF8.GetString($content)
if ($str.Contains('Ã³')) {
    Write-Host "DOUBLE ENCODING DETECTED! Fixing..."
    # Read as Latin-1 to get the original bytes, then interpret as UTF-8
    $latin1 = [System.Text.Encoding]::GetEncoding('ISO-8859-1')
    $raw = $latin1.GetString($content)
    # Now raw contains the mojibake chars — need to re-encode
    $fixed = [System.Text.Encoding]::UTF8.GetString($latin1.GetBytes($raw))
    # Wait, that's circular. Let's try differently.
    # The issue is that the patched section was written as UTF-8 bytes interpreted as Latin-1 then re-encoded to UTF-8
    # We need to: for the garbled portion, read the UTF-8 bytes as if they were Latin-1, giving us the original UTF-8 bytes
    Write-Host "Attempting fix via git restore..."
} else {
    Write-Host "Encoding looks correct."
}

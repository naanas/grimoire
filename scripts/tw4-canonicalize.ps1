# Bulk-convert Tailwind v3 / arbitrary-value class strings to canonical
# Tailwind v4 forms across selected files. Idempotent.
#
# Reads/writes files as UTF-8 WITHOUT BOM via .NET. Avoids non-ASCII
# literals so the script itself is encoding-safe under PowerShell 5.1.

param(
    [Parameter(Mandatory = $true)]
    [string[]]$Files
)

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Mojibake fix: when UTF-8 was previously written as Windows-1252, the byte
# 0xC2 (begin 2-byte UTF-8) appears as the literal char U+00C2 ("A-circumflex")
# preceding any U+00A0..U+00BF char. We strip the spurious U+00C2 prefix.
$badAhat  = [char]0x00C2          # spurious "A-circumflex" introduced by mis-encode
$copyChar = [char]0x00A9          # copyright sign

function Convert-File {
    param([string]$Path)

    $full = (Resolve-Path -LiteralPath $Path).Path
    if (-not (Test-Path -LiteralPath $full)) {
        Write-Warning "Skip (not found): $Path"
        return
    }

    $bytes = [System.IO.File]::ReadAllBytes($full)
    $hadBom = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
    if ($hadBom) { $bytes = $bytes[3..($bytes.Length - 1)] }
    $orig = [System.Text.Encoding]::UTF8.GetString($bytes)
    $text = $orig

    # 0) Fix prior mojibake: remove spurious U+00C2 immediately before U+00A9
    #    (covers the typical "©" -> "Â©" PS 5.1 corruption)
    $text = $text.Replace(($badAhat.ToString() + $copyChar.ToString()), $copyChar.ToString())

    # 1) font-[family-name:var(--X)]  ->  font-(family-name:--X)
    $text = [regex]::Replace($text, 'font-\[family-name:var\(--([\w-]+)\)\]', 'font-(family-name:--$1)')

    # 2) [var(--X)] -> (--X)  (covers any utility/modifier prefix; opacity slash kept)
    $text = [regex]::Replace($text, '\[var\(--([\w-]+)\)\]', '(--$1)')

    # 3) bg-gradient-to-X -> bg-linear-to-X
    $text = [regex]::Replace($text, '\bbg-gradient-to-([trblTRBL]{1,2})\b', 'bg-linear-to-$1')

    # 4) aspect-[a/b] -> aspect-a/b
    $text = [regex]::Replace($text, 'aspect-\[(\d+)/(\d+)\]', 'aspect-$1/$2')

    # 5) /[0.03] -> /3
    $text = [regex]::Replace($text, '/\[0\.03\]', '/3')

    # 6) h-[1px] -> h-px
    $text = [regex]::Replace($text, 'h-\[1px\]', 'h-px')

    # 7) flex-grow -> grow
    $text = [regex]::Replace($text, '\bflex-grow\b', 'grow')

    # 8) z-[NN] (digits only) -> z-NN
    $text = [regex]::Replace($text, '\bz-\[(\d+)\]', 'z-$1')

    # 9) tracking-[0.1em] -> tracking-widest
    $text = [regex]::Replace($text, 'tracking-\[0\.1em\]', 'tracking-widest')

    if ($text -ne $orig -or $hadBom) {
        [System.IO.File]::WriteAllText($full, $text, $utf8NoBom)
        Write-Host "Updated: $Path"
    } else {
        Write-Host "No change: $Path"
    }
}

foreach ($f in $Files) {
    Convert-File -Path $f
}

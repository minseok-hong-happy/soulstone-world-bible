param([int]$From = 1, [int]$To = 60, [switch]$Boards)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$repo = Split-Path $PSScriptRoot -Parent
$rawDirectory = Join-Path $repo '.review/webtoon-v2/raw'
$outputDirectory = Join-Path $repo 'site/assets/webtoon-v2'
$reviewDirectory = Join-Path $repo '.review/webtoon-v2/boards'
$codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$encoder = [Drawing.Imaging.EncoderParameters]::new(1)
$encoder.Param[0] = [Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality, [long]92)
$dimensions = @()
for ($e=$From; $e -le $To; $e++) {
  for ($p=1; $p -le 3; $p++) {
    $source = Join-Path $rawDirectory ('ep-{0:d2}-page-{1}.png' -f $e,$p)
    if (!(Test-Path -LiteralPath $source)) { continue }
    $folder = Join-Path $outputDirectory ('ep-{0:d2}' -f $e)
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    $target = Join-Path $folder ('page-{0}.jpg' -f $p)
    $sourceInfo = Get-Item -LiteralPath $source
    $img = [Drawing.Bitmap]::FromFile($source)
    if (!(Test-Path -LiteralPath $target) -or (Get-Item -LiteralPath $target).LastWriteTimeUtc -lt $sourceInfo.LastWriteTimeUtc) {
      $img.Save($target, $codec, $encoder)
    }
    $dimensions += [PSCustomObject]@{ Episode=$e; Page=$p; Width=$img.Width; Height=$img.Height; Ratio=[Math]::Round($img.Height/$img.Width,3) }
    $img.Dispose()
  }
}
$encoder.Dispose()
if ($Boards) {
  New-Item -ItemType Directory -Force -Path $reviewDirectory | Out-Null
  for ($first=$From; $first -le $To; $first+=4) {
    $last=[Math]::Min($first+3,$To)
    $canvas=[Drawing.Bitmap]::new(960,($last-$first+1)*990)
    $g=[Drawing.Graphics]::FromImage($canvas)
    $g.Clear([Drawing.Color]::FromArgb(225,229,232))
    $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $font=[Drawing.Font]::new('Arial',17)
    for($e=$first;$e -le $last;$e++) {
      for($p=1;$p -le 3;$p++) {
        $source=Join-Path $rawDirectory ('ep-{0:d2}-page-{1}.png' -f $e,$p)
        $x=($p-1)*320; $y=($e-$first)*990
        if(Test-Path -LiteralPath $source) {
          $img=[Drawing.Image]::FromFile($source)
          $scale=[Math]::Min(320/$img.Width,960/$img.Height)
          $w=[int]($img.Width*$scale);$h=[int]($img.Height*$scale)
          $g.DrawImage($img,[int]($x+(320-$w)/2),[int]$y,$w,$h)
          $img.Dispose()
        }
        $g.DrawString(('EP {0:d2} - PAGE {1}' -f $e,$p),$font,[Drawing.Brushes]::Black,[single]($x+4),[single]($y+962))
      }
    }
    $canvas.Save((Join-Path $reviewDirectory ('ep-{0:d2}-{1:d2}.jpg' -f $first,$last)),[Drawing.Imaging.ImageFormat]::Jpeg)
    $font.Dispose();$g.Dispose();$canvas.Dispose()
  }
}
& (Join-Path $PSScriptRoot 'webtoon-panel-frames.ps1') | Out-Null
$dimensions | ConvertTo-Json -Compress

param([string]$OutputDirectory = '.review/webtoon')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
function Save-Board($Items, $Name, $Columns, $ThumbWidth, $ThumbHeight) {
  $rows = [int][Math]::Ceiling($Items.Count / $Columns)
  $canvas = [Drawing.Bitmap]::new($Columns * $ThumbWidth, $rows * ($ThumbHeight + 30))
  $g = [Drawing.Graphics]::FromImage($canvas)
  $g.Clear([Drawing.Color]::FromArgb(225,229,232))
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $font = [Drawing.Font]::new('Arial', 13)
  for ($i=0; $i -lt $Items.Count; $i++) {
    $img = [Drawing.Image]::FromFile((Resolve-Path -LiteralPath $Items[$i].Path))
    $ratio = [Math]::Min($ThumbWidth / $img.Width, $ThumbHeight / $img.Height)
    $w = [int]($img.Width * $ratio); $h = [int]($img.Height * $ratio)
    $x = ($i % $Columns) * $ThumbWidth; $y = [Math]::Floor($i / $Columns) * ($ThumbHeight + 30)
    $g.DrawImage($img, [int]($x + ($ThumbWidth-$w)/2), [int]$y, $w, $h)
    $g.DrawString($Items[$i].Label, $font, [Drawing.Brushes]::Black, [single]($x+4), [single]($y+$ThumbHeight+3))
    $img.Dispose()
  }
  $canvas.Save((Join-Path $OutputDirectory $Name), [Drawing.Imaging.ImageFormat]::Jpeg)
  $font.Dispose(); $g.Dispose(); $canvas.Dispose()
}
$refs = @(Get-ChildItem site/assets/characters/anime-v4/*.jpg; Get-ChildItem site/assets/characters/important/*.jpg)
for($start=0; $start -lt $refs.Count; $start+=8) {
  $items=@($refs | Select-Object -Skip $start -First 8 | ForEach-Object { @{Path=$_.FullName;Label=$_.BaseName.Substring(0,[Math]::Min(27,$_.BaseName.Length))} })
  Save-Board $items ('canon-'+([int]($start/8)+1)+'.jpg') 4 260 380
}
for($ep=1; $ep -le 60; $ep+=5) {
  $items=@()
  for($n=$ep; $n -lt $ep+5; $n++) {
    $files=@(Get-ChildItem ('site/assets/webtoon/ep-{0:d2}/*.jpg' -f $n) | Sort-Object Name | Select-Object -First 6)
    foreach($f in $files){$items+=@{Path=$f.FullName;Label=('{0:d2}: {1}' -f $n,$f.BaseName.Substring(0,[Math]::Min(20,$f.BaseName.Length)))}}
  }
  Save-Board $items ('episodes-{0:d2}-{1:d2}.jpg' -f $ep,($ep+4)) 6 180 380
}

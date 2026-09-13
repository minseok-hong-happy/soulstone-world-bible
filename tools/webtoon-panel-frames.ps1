$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$repo=Split-Path $PSScriptRoot -Parent
$frameMap=[ordered]@{}
$audit=@()
$overrides=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'webtoon-frame-overrides.json') -Raw | ConvertFrom-Json
Get-ChildItem -LiteralPath (Join-Path $repo 'site/assets/webtoon-v2') -Directory | Sort-Object Name | ForEach-Object {
  $episodeFolder=$_
  Get-ChildItem -LiteralPath $episodeFolder.FullName -Filter '*.jpg' | Sort-Object Name | ForEach-Object {
    $asset=$_
    $bitmap=[Drawing.Bitmap]::FromFile($asset.FullName)
    $w=$bitmap.Width; $h=$bitmap.Height
    $runs=@();$start=-1
    for($y=4;$y -lt $h-4;$y++){
      $white=0;$count=0
      for($x=4;$x -lt $w-4;$x+=8){
        $pixel=$bitmap.GetPixel($x,$y);$count++
        if($pixel.R -ge 175 -and $pixel.G -ge 175 -and $pixel.B -ge 175){$white++}
      }
      $isLine=($white/$count) -ge .94
      if($isLine -and $start -lt 0){$start=$y}
      if(!$isLine -and $start -ge 0){
        if($y-$start -le 15){$runs+=@{start=$start;end=$y;center=($start+$y)/2}}
        $start=-1
      }
    }
    $bitmap.Dispose()
    $candidates=@($runs | Where-Object { $_.center -gt $h*.075 -and $_.center -lt $h*.95 })
    $key='assets/webtoon-v2/'+$episodeFolder.Name+'/'+$asset.Name
    $method='detected'
    $manual=$overrides.PSObject.Properties[$key]
    if($manual -and (Get-FileHash -LiteralPath $asset.FullName -Algorithm SHA256).Hash -eq $manual.Value.sha256){
      $candidates=@($manual.Value.gutters | ForEach-Object { @{start=[int]$_[0];end=[int]$_[1]} })
      $method='visually-verified'
    }
    if($candidates.Count -eq 5){
      $frames=@();$from=0
      foreach($line in $candidates){$frames+=@{y=$from;height=$line.start-$from};$from=$line.end}
      $frames+=@{y=$from;height=$h-$from}
      $frameMap[$key]=@{width=$w;height=$h;frames=$frames}
      $audit+=@{image=$key;status=$method;heights=@($frames | ForEach-Object height)}
    }else{
      $audit+=@{image=$key;status='review';candidates=@($candidates | ForEach-Object center)}
    }
  }
}
$payload=$frameMap | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText((Join-Path $repo 'site/data/panel-frames.js'),('/* Measured horizontal gutters; images remain unmodified. */'+[Environment]::NewLine+'var SOULSTONE_PANEL_FRAMES = '+$payload+';'),[Text.UTF8Encoding]::new($false))
$audit | ConvertTo-Json -Depth 6 -Compress

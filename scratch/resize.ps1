Add-Type -AssemblyName System.Drawing
$inputPath = "c:\_dev\mdt\public\MDT LOGO ORANGE.png"
$outputPath = "c:\_dev\mdt\public\og-logo.jpg"

$img = [System.Drawing.Image]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap(600, 600)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, 0, 0, 600, 600)

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Output "Successfully generated og-logo.jpg"

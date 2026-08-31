Add-Type -AssemblyName System.Drawing
$inputPath = "c:\_dev\mdt\public\mdt-banner.jpg"
$outputPath = "c:\_dev\mdt\public\og-banner.jpg"

$img = [System.Drawing.Image]::FromFile($inputPath)

# Dimensions standard Open Graph (1.91:1 ratio)
$targetWidth = 1200
$targetHeight = 630

$bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Remplir le fond avec du noir/bordeaux si besoin
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 18, 18))
$g.FillRectangle($brush, 0, 0, $targetWidth, $targetHeight)

# Dessiner la bannière centrée
$srcWidth = $img.Width
$srcHeight = $img.Height

# Calcul du ratio pour ajuster l'image au mieux sans déformation
$scale = [Math]::Max($targetWidth / $srcWidth, $targetHeight / $srcHeight)
$newW = [int]($srcWidth * $scale)
$newH = [int]($srcHeight * $scale)
$posX = [int](($targetWidth - $newW) / 2)
$posY = [int](($targetHeight - $newH) / 2)

$g.DrawImage($img, $posX, $posY, $newW, $newH)

# Enregistrer en JPEG 85% de qualité
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85L)

$bmp.Save($outputPath, $jpegCodec, $encoderParams)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Output "Successfully generated og-banner.jpg"

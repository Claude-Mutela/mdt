Add-Type -AssemblyName System.Drawing

$inputPath = "c:\_dev\mdt\public\MDT LOGO ORANGE.png"
if (-not (Test-Path $inputPath)) {
    $inputPath = "c:\_dev\mdt\public\log-phila-mdt.png"
}

$srcImg = [System.Drawing.Image]::FromFile((Get-Item $inputPath).FullName)

function Resize-Image {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height,
        [string]$OutputPath,
        [string]$Format = "PNG"
    )
    $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $g.DrawImage($Image, 0, 0, $Width, $Height)

    if ($Format -eq "PNG") {
        $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } elseif ($Format -eq "ICO") {
        # Export transparent PNG as ico
        $icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
        $fileStream = New-Object System.IO.FileStream($OutputPath, [System.IO.FileMode]::Create)
        $icon.Save($fileStream)
        $fileStream.Close()
        $icon.Dispose()
    } elseif ($Format -eq "JPEG") {
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)
        $bmp.Save($OutputPath, $jpegCodec, $encoderParams)
    }

    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated $OutputPath ($($Width)x$($Height))"
}

Resize-Image -Image $srcImg -Width 48 -Height 48 -OutputPath "c:\_dev\mdt\public\favicon.ico" -Format "ICO"
Resize-Image -Image $srcImg -Width 32 -Height 32 -OutputPath "c:\_dev\mdt\public\favicon-32x32.png" -Format "PNG"
Resize-Image -Image $srcImg -Width 48 -Height 48 -OutputPath "c:\_dev\mdt\public\favicon-48x48.png" -Format "PNG"
Resize-Image -Image $srcImg -Width 180 -Height 180 -OutputPath "c:\_dev\mdt\public\apple-touch-icon.png" -Format "PNG"
Resize-Image -Image $srcImg -Width 192 -Height 192 -OutputPath "c:\_dev\mdt\public\favicon-192x192.png" -Format "PNG"
Resize-Image -Image $srcImg -Width 512 -Height 512 -OutputPath "c:\_dev\mdt\public\logo.png" -Format "PNG"
Resize-Image -Image $srcImg -Width 512 -Height 512 -OutputPath "c:\_dev\mdt\public\logo.jpg" -Format "JPEG"

$srcImg.Dispose()
Write-Output "Favicons generated successfully!"

<#
.SYNOPSIS
  Regenerates tight, high-DPI square crops (720x720) for team portraits with bicubic filtering.
#>
Add-Type -AssemblyName System.Drawing

function Crop-Image {
    param (
        [string]$SourcePath,
        [string]$DestPath,
        [int]$CropX,
        [int]$CropY,
        [int]$CropWidth,
        [int]$CropHeight,
        [int]$TargetSize = 720,
        [long]$Quality = 96
    )

    $src = [System.Drawing.Image]::FromFile($SourcePath)
    $bmp = New-Object System.Drawing.Bitmap($TargetSize, $TargetSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle($CropX, $CropY, $CropWidth, $CropHeight)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $TargetSize, $TargetSize)

    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
    $jpegCodec = $codecs | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

    $bmp.Save($DestPath, $jpegCodec, $encoderParams)

    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
}

$origDir = "C:\Users\Suraj\explore-pune\public\images\team\originals"
if (Test-Path "$origDir\suraj-dhok-orig.jpg") {
    Crop-Image -SourcePath "$origDir\suraj-dhok-orig.jpg" -DestPath "C:\Users\Suraj\explore-pune\public\images\team\suraj-dhok.jpg" -CropX 103 -CropY 70 -CropWidth 680 -CropHeight 680 -TargetSize 720
    Copy-Item "C:\Users\Suraj\explore-pune\public\images\team\suraj-dhok.jpg" "C:\Users\Suraj\explore-pune\public\images\suraj-dhok.jpg" -Force
}
if (Test-Path "$origDir\ishan-kakade-orig.jpg") {
    Crop-Image -SourcePath "$origDir\ishan-kakade-orig.jpg" -DestPath "C:\Users\Suraj\explore-pune\public\images\team\ishan-kakade.jpg" -CropX 132 -CropY 60 -CropWidth 720 -CropHeight 720 -TargetSize 720
    Copy-Item "C:\Users\Suraj\explore-pune\public\images\team\ishan-kakade.jpg" "C:\Users\Suraj\explore-pune\public\images\ishan-kakade.jpg" -Force
}
if (Test-Path "$origDir\sahil-jadhav-orig.jpg") {
    Crop-Image -SourcePath "$origDir\sahil-jadhav-orig.jpg" -DestPath "C:\Users\Suraj\explore-pune\public\images\team\sahil-jadhav.jpg" -CropX 130 -CropY 20 -CropWidth 820 -CropHeight 820 -TargetSize 720
    Copy-Item "C:\Users\Suraj\explore-pune\public\images\team\sahil-jadhav.jpg" "C:\Users\Suraj\explore-pune\public\images\sahil-jadhav.jpg" -Force
}
Write-Output "Team avatars generated successfully."

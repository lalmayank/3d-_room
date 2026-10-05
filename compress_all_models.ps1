Write-Host "Starting gltfpack compression on all 3D models..." -ForegroundColor Cyan

$gltfpack = ".\bin\gltfpack.exe"
$backupDir = "public\models_backup"
$publicDir = "public"

# 1. Standard models
$models = @(
    "table.glb",
    "wooden_chair.glb",
    "bucket_bench_19th_century.glb",
    "file_cabinet.glb",
    "document_file_folder.glb",
    "psx_-_corkevidence_board_2.glb",
    "psx_style_wooden_bookshelf_low_poly.glb"
)

foreach ($model in $models) {
    $inputPath = Join-Path $backupDir $model
    $outputPath = Join-Path $publicDir $model
    Write-Host "Compressing $model with gltfpack (-cc -kn -km -tw)..." -ForegroundColor Yellow
    & $gltfpack -i $inputPath -o $outputPath -cc -kn -km -tw
}

# 2. Draco model (damaged_concrete_tiles__tile_texture.glb)
$tilesModel = "damaged_concrete_tiles__tile_texture.glb"
$tilesInput = Join-Path $backupDir $tilesModel
$tilesDecomp = "public\temp_decomp_tiles.glb"
$tilesOutput = Join-Path $publicDir $tilesModel

Write-Host "Decompressing Draco in $tilesModel..." -ForegroundColor Yellow
& npx @gltf-transform/cli copy $tilesInput $tilesDecomp

Write-Host "Compressing $tilesModel with gltfpack (-cc -kn -km -tw -si 0.05)..." -ForegroundColor Yellow
& $gltfpack -i $tilesDecomp -o $tilesOutput -cc -kn -km -tw -si 0.05

if (Test-Path $tilesDecomp) {
    Remove-Item $tilesDecomp -Force
}

Write-Host "`nAll models compressed successfully! Generating compression report:`n" -ForegroundColor Green

$results = @()
$allModels = $models + @($tilesModel)
$totalBefore = 0
$totalAfter = 0

foreach ($model in $allModels) {
    $beforePath = Join-Path $backupDir $model
    $afterPath = Join-Path $publicDir $model
    $sizeBefore = (Get-Item $beforePath).Length
    $sizeAfter = (Get-Item $afterPath).Length
    $totalBefore += $sizeBefore
    $totalAfter += $sizeAfter
    $pct = [math]::Round((1.0 - ($sizeAfter / $sizeBefore)) * 100, 1)

    $results += [PSCustomObject]@{
        Model = $model
        "Before (MB)" = [math]::Round($sizeBefore / 1MB, 2)
        "After (MB)" = [math]::Round($sizeAfter / 1MB, 2)
        "Reduction (%)" = "$pct%"
    }
}

$results | Format-Table -AutoSize
$totalPct = [math]::Round((1.0 - ($totalAfter / $totalBefore)) * 100, 1)
Write-Host "Total Size Before: $([math]::Round($totalBefore / 1MB, 2)) MB" -ForegroundColor White
Write-Host "Total Size After:  $([math]::Round($totalAfter / 1MB, 2)) MB" -ForegroundColor Green
Write-Host "Total Reduction:   $totalPct%" -ForegroundColor Cyan

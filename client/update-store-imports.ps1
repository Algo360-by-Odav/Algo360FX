$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "from ['`"].*\/stores\/store['`"]") {
        $newContent = $content -replace "from ['`"](.*)\/stores\/store['`"]", "from '$1/stores/StoreProvider'"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.FullName)"
    }
}

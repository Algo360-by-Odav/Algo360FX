$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix imports from context/StoreContext
    if ($content -match "from ['`"](@/|\.\.?/)*context/StoreContext['`"]") {
        $relativePath = $file.FullName -replace "^.*\\src\\", ""
        $depth = ($relativePath -split "\\").Length - 1
        $prefix = "../" * $depth
        
        $newContent = $content -replace "from ['`"](@/|\.\.?/)*context/StoreContext['`"]", "from '$($prefix)stores/StoreProvider'"
        $newContent = $newContent -replace "useStore", "useStores"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated store import in $($file.FullName)"
    }
    
    # Fix imports from hooks/useStores
    if ($content -match "from ['`"](@/|\.\.?/)*hooks/useStores['`"]") {
        $relativePath = $file.FullName -replace "^.*\\src\\", ""
        $depth = ($relativePath -split "\\").Length - 1
        $prefix = "../" * $depth
        
        $newContent = $content -replace "from ['`"](@/|\.\.?/)*hooks/useStores['`"]", "from '$($prefix)stores/StoreProvider'"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated useStores import in $($file.FullName)"
    }
}

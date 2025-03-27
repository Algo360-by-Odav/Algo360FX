$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix absolute imports from /stores/StoreProvider
    if ($content -match "from ['`"]/stores/StoreProvider['`"]") {
        $relativePath = [System.IO.Path]::GetRelativePath(
            [System.IO.Path]::GetDirectoryName($file.FullName),
            "C:\Users\FVMY\Desktop\Algo360FX\client\src\stores"
        ).Replace("\", "/")
        
        $newContent = $content -replace "from ['`"]/stores/StoreProvider['`"]", "from '$relativePath/StoreProvider'"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated store import in $($file.FullName)"
    }
    
    # Fix store imports from store.ts to StoreProvider
    if ($content -match "from ['`"].*\/stores\/store['`"]") {
        $newContent = $content -replace "from ['`"](.*)\/stores\/store['`"]", "from '`$1/stores/StoreProvider'"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated legacy store import in $($file.FullName)"
    }
}

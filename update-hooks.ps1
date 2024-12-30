$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "useRootStoreContext") {
        $newContent = $content -replace "useRootStoreContext", "useRootStore"
        $newContent = $newContent -replace "import \{ useRootStore \} from '@/stores/RootStoreContext';", "import { useRootStore } from '@/stores/RootStoreContext';"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.FullName)"
    }
}

$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "from '@/stores/RootStoreContext'") {
        $newContent = $content -replace "import \{ useRootStore \} from '@/stores/RootStoreContext';", "import { useRootStore } from '@/hooks/useRootStore';"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.FullName)"
    }
}

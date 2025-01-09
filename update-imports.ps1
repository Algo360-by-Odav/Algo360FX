# Update Imports Script for Algo360FX
# This script provides a user-friendly interface for managing imports

# Ensure we're in the right directory
Set-Location $PSScriptRoot

# Configuration
$config = @{
    SrcDirectory = "src"
    Extensions = @(".ts", ".tsx", ".js", ".jsx")
    ExcludeDirs = @("node_modules", "dist", "build", "coverage")
    BackupDir = ".import-backups"
    DryRun = $false
}

# Color configuration for output
$colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "Cyan"
}

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = $colors.Info
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to create backup
function Backup-SourceFiles {
    param(
        [string]$BackupName = (Get-Date -Format "yyyy-MM-dd_HH-mm-ss")
    )
    
    $backupPath = Join-Path $config.BackupDir $BackupName
    
    if (-not (Test-Path $config.BackupDir)) {
        New-Item -ItemType Directory -Path $config.BackupDir | Out-Null
    }
    
    Write-ColorOutput "Creating backup in $backupPath..." $colors.Info
    
    try {
        if (Test-Path $config.SrcDirectory) {
            Copy-Item -Path $config.SrcDirectory -Destination $backupPath -Recurse -Force
            Write-ColorOutput "✓ Backup created successfully" $colors.Success
            return $true
        } else {
            Write-ColorOutput "✗ Source directory not found!" $colors.Error
            return $false
        }
    } catch {
        Write-ColorOutput "✗ Failed to create backup: $_" $colors.Error
        return $false
    }
}

# Function to restore from backup
function Restore-FromBackup {
    param(
        [string]$BackupName
    )
    
    $backupPath = Join-Path $config.BackupDir $BackupName
    
    if (-not (Test-Path $backupPath)) {
        Write-ColorOutput "✗ Backup not found: $BackupName" $colors.Error
        return $false
    }
    
    try {
        Write-ColorOutput "Restoring from backup $BackupName..." $colors.Info
        Remove-Item -Path $config.SrcDirectory -Recurse -Force
        Copy-Item -Path (Join-Path $backupPath "*") -Destination $config.SrcDirectory -Recurse -Force
        Write-ColorOutput "✓ Restore completed successfully" $colors.Success
        return $true
    } catch {
        Write-ColorOutput "✗ Failed to restore: $_" $colors.Error
        return $false
    }
}

# Function to verify npm dependencies
function Test-Dependencies {
    $required = @(
        "@babel/parser",
        "@babel/traverse",
        "@babel/generator",
        "@babel/types",
        "glob"
    )
    
    $missing = @()
    
    Write-ColorOutput "Checking dependencies..." $colors.Info
    
    foreach ($dep in $required) {
        $modulePath = Join-Path "node_modules" $dep
        if (-not (Test-Path $modulePath)) {
            $missing += $dep
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-ColorOutput "Missing dependencies: $($missing -join ', ')" $colors.Warning
        $install = Read-Host "Would you like to install missing dependencies? (y/n)"
        if ($install -eq 'y') {
            npm install $missing --save-dev
            return $true
        }
        return $false
    }
    
    Write-ColorOutput "✓ All dependencies are installed" $colors.Success
    return $true
}

# Function to run the import updater
function Update-Imports {
    param(
        [switch]$DryRun
    )
    
    if (-not (Test-Dependencies)) {
        Write-ColorOutput "✗ Cannot proceed without required dependencies" $colors.Error
        return
    }
    
    if (-not $DryRun) {
        $backup = Backup-SourceFiles
        if (-not $backup) {
            $proceed = Read-Host "Failed to create backup. Proceed anyway? (y/n)"
            if ($proceed -ne 'y') {
                return
            }
        }
    }
    
    Write-ColorOutput "Running import updater..." $colors.Info
    
    try {
        if ($DryRun) {
            Write-ColorOutput "DRY RUN - No changes will be made" $colors.Warning
            node update-imports.js --dry-run
        } else {
            node update-imports.js
        }
        
        Write-ColorOutput "✓ Import update completed successfully" $colors.Success
    } catch {
        Write-ColorOutput "✗ Error updating imports: $_" $colors.Error
        
        if (-not $DryRun) {
            $restore = Read-Host "Would you like to restore from the last backup? (y/n)"
            if ($restore -eq 'y') {
                $lastBackup = Get-ChildItem $config.BackupDir | Sort-Object LastWriteTime -Descending | Select-Object -First 1
                if ($lastBackup) {
                    Restore-FromBackup $lastBackup.Name
                }
            }
        }
    }
}

# Function to list available backups
function Get-ImportBackups {
    if (-not (Test-Path $config.BackupDir)) {
        Write-ColorOutput "No backups found" $colors.Warning
        return
    }
    
    $backups = Get-ChildItem $config.BackupDir | Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-ColorOutput "No backups found" $colors.Warning
        return
    }
    
    Write-ColorOutput "`nAvailable backups:" $colors.Info
    $backups | ForEach-Object {
        Write-Host "- $($_.Name) ($(Get-Date $_.LastWriteTime -Format 'yyyy-MM-dd HH:mm:ss'))"
    }
}

# Main menu
function Show-Menu {
    while ($true) {
        Write-Host "`n=== Algo360FX Import Manager ===" -ForegroundColor Cyan
        Write-Host "1. Update imports"
        Write-Host "2. Dry run (preview changes)"
        Write-Host "3. List backups"
        Write-Host "4. Restore from backup"
        Write-Host "5. Create backup"
        Write-Host "6. Check dependencies"
        Write-Host "7. Exit"
        
        $choice = Read-Host "`nSelect an option (1-7)"
        
        switch ($choice) {
            "1" { Update-Imports }
            "2" { Update-Imports -DryRun }
            "3" { Get-ImportBackups }
            "4" {
                Get-ImportBackups
                $backupName = Read-Host "Enter backup name to restore"
                if ($backupName) {
                    Restore-FromBackup $backupName
                }
            }
            "5" {
                $backupName = Read-Host "Enter backup name (or press Enter for timestamp)"
                Backup-SourceFiles $backupName
            }
            "6" { Test-Dependencies }
            "7" { return }
            default { Write-ColorOutput "Invalid option. Please try again." $colors.Warning }
        }
        
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Start the script
Show-Menu

$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "from '@/stores/RootStoreContext'") {
        $newContent = $content -replace "import \{ useRootStore \} from '@/stores/RootStoreContext';", "import { useRootStore } from '@/hooks/useRootStore';"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.FullName)"
    }
}

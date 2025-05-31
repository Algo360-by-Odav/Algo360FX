# Complete Rebuild Script for Algo360FX
Write-Host "Starting complete rebuild process for Algo360FX..." -ForegroundColor Cyan
$ErrorActionPreference = "Stop" # Stop on first error

try {
    # Stop any running instances of the development server
    Write-Host "Stopping any running development servers..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*vite*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Delete node_modules and rebuild to ensure clean dependencies
    Write-Host "Removing node_modules directory..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force
    }
    
    # Clear Vite cache
    Write-Host "Clearing Vite cache..." -ForegroundColor Yellow
    if (Test-Path ".vite") {
        Remove-Item -Path ".vite" -Recurse -Force
    }
    
    # Clear dist directory
    if (Test-Path "dist") {
        Remove-Item -Path "dist" -Recurse -Force
    }
    
    # Install dependencies
    Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
    npm install
    
    # Build the project
    Write-Host "Building the project..." -ForegroundColor Yellow
    npm run build
    
    # Start the development server
    Write-Host "Starting development server..." -ForegroundColor Green
    npm run dev
    
    Write-Host "Rebuild process completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "An error occurred during the rebuild process: $_" -ForegroundColor Red
    exit 1
}

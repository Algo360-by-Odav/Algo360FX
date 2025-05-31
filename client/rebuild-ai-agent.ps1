# Comprehensive rebuild script for AI Agent implementation
Write-Host "Starting comprehensive rebuild process for AI Agent..." -ForegroundColor Cyan

# Stop any running instances of the development server (this assumes no other important processes with 'node' are running)
Write-Host "Stopping any running development servers..." -ForegroundColor Yellow
Stop-Process -Name "node" -ErrorAction SilentlyContinue

# Clear node modules cache
Write-Host "Clearing node modules cache..." -ForegroundColor Yellow
npm cache clean --force

# Clear any build artifacts
Write-Host "Removing build artifacts..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force
}
if (Test-Path ".vite") {
    Remove-Item ".vite" -Recurse -Force
}

# Install dependencies (this will ensure any new dependencies we added are installed)
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Rebuild the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Start development server
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev

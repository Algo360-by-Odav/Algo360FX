# Download PostgreSQL installer
$url = "https://get.enterprisedb.com/postgresql/postgresql-15.5-1-windows-x64.exe"
$output = "$PSScriptRoot\postgresql_installer.exe"

Write-Host "Downloading PostgreSQL installer..."
Invoke-WebRequest -Uri $url -OutFile $output

# Install PostgreSQL
Write-Host "Installing PostgreSQL..."
Start-Process -FilePath $output -ArgumentList "--mode unattended --superpassword postgres --servicename postgresql-x64-15 --servicepassword postgres --serverport 5432" -Wait

# Clean up
Remove-Item $output

Write-Host "PostgreSQL installation completed!"

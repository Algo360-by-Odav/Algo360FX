# Update Git Hooks for Algo360FX
# This script sets up and updates Git hooks for code quality and security

# Ensure we're running with elevated privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    exit 1
}

# Configuration
$hooksDir = ".git/hooks"
$customHooksDir = ".githooks"
$nodeModulesDir = "node_modules"

# Create directories if they don't exist
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir
}
if (-not (Test-Path $customHooksDir)) {
    New-Item -ItemType Directory -Path $customHooksDir
}

# Function to create or update a hook
function Set-GitHook {
    param (
        [string]$hookName,
        [string]$content
    )
    
    $hookPath = Join-Path $hooksDir $hookName
    $content | Out-File -FilePath $hookPath -Encoding UTF8
    
    # Make the hook executable
    $acl = Get-Acl $hookPath
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
        "FullControl",
        "Allow"
    )
    $acl.SetAccessRule($rule)
    Set-Acl $hookPath $acl
}

# Pre-commit hook
$preCommitContent = @'
#!/usr/bin/env pwsh

# Get staged files
$stagedFiles = git diff --cached --name-only --diff-filter=ACMR

# Skip if no files are staged
if (-not $stagedFiles) {
    exit 0
}

# Initialize error flag
$hasErrors = $false

# Run TypeScript type checking
Write-Host "Running TypeScript type check..." -ForegroundColor Cyan
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript type check failed!" -ForegroundColor Red
    $hasErrors = $true
}

# Run ESLint on staged files
Write-Host "Running ESLint..." -ForegroundColor Cyan
$tsFiles = $stagedFiles | Where-Object { $_ -match '\.(ts|tsx|js|jsx)$' }
if ($tsFiles) {
    npx eslint $tsFiles --fix
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ESLint found issues!" -ForegroundColor Red
        $hasErrors = $true
    }
}

# Run Prettier on staged files
Write-Host "Running Prettier..." -ForegroundColor Cyan
npx prettier --write $stagedFiles
if ($LASTEXITCODE -ne 0) {
    Write-Host "Prettier formatting failed!" -ForegroundColor Red
    $hasErrors = $true
}

# Run tests related to staged files
Write-Host "Running related tests..." -ForegroundColor Cyan
npm run test -- --findRelatedTests $stagedFiles
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed!" -ForegroundColor Red
    $hasErrors = $true
}

# Check for sensitive data
Write-Host "Checking for sensitive data..." -ForegroundColor Cyan
$sensitivePatterns = @(
    'password\s*=',
    'api[_-]?key',
    'secret[_-]?key',
    'aws[_-]?key',
    'private[_-]?key',
    'token'
)

foreach ($file in $stagedFiles) {
    $content = Get-Content $file -ErrorAction SilentlyContinue
    foreach ($pattern in $sensitivePatterns) {
        if ($content -match $pattern) {
            Write-Host "Warning: Possible sensitive data in $file" -ForegroundColor Yellow
            Write-Host "Pattern matched: $pattern" -ForegroundColor Yellow
        }
    }
}

# Re-add files that may have been modified by formatters
git add $stagedFiles

if ($hasErrors) {
    Write-Host "Pre-commit checks failed! Please fix the issues and try again." -ForegroundColor Red
    exit 1
}

Write-Host "All pre-commit checks passed!" -ForegroundColor Green
exit 0
'@

# Pre-push hook
$prePushContent = @'
#!/usr/bin/env pwsh

# Run full test suite
Write-Host "Running full test suite..." -ForegroundColor Cyan
npm run test
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed! Push aborted." -ForegroundColor Red
    exit 1
}

# Run build to ensure it succeeds
Write-Host "Running build check..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Push aborted." -ForegroundColor Red
    exit 1
}

Write-Host "All pre-push checks passed!" -ForegroundColor Green
exit 0
'@

# Commit-msg hook
$commitMsgContent = @'
#!/usr/bin/env pwsh

$commitMsgFile = $args[0]
$commitMsg = Get-Content $commitMsgFile

# Conventional Commits pattern
$pattern = '^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z -]+\))?: .{1,}$'

if (-not ($commitMsg -match $pattern)) {
    Write-Host "Error: Commit message does not follow Conventional Commits format!" -ForegroundColor Red
    Write-Host "Format: <type>[optional scope]: <description>"
    Write-Host "Example: feat(auth): add login functionality"
    Write-Host "Types: build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test"
    exit 1
}

Write-Host "Commit message format is valid!" -ForegroundColor Green
exit 0
'@

# Install hooks
Write-Host "Installing Git hooks..." -ForegroundColor Cyan

Set-GitHook -hookName "pre-commit" -content $preCommitContent
Set-GitHook -hookName "pre-push" -content $prePushContent
Set-GitHook -hookName "commit-msg" -content $commitMsgContent

# Update Git config to use custom hooks directory
git config core.hooksPath $hooksDir

Write-Host "Git hooks have been successfully installed!" -ForegroundColor Green
Write-Host @"

Installed hooks:
1. pre-commit: Runs type checking, linting, formatting, and tests
2. pre-push: Runs full test suite and build check
3. commit-msg: Enforces Conventional Commits format

To skip hooks temporarily, use:
- git commit --no-verify
- git push --no-verify

"@ -ForegroundColor Yellow

# Verify installation
Write-Host "Verifying hooks installation..." -ForegroundColor Cyan
$hooks = @("pre-commit", "pre-push", "commit-msg")
$allValid = $true

foreach ($hook in $hooks) {
    $hookPath = Join-Path $hooksDir $hook
    if (Test-Path $hookPath) {
        Write-Host "✓ $hook hook installed" -ForegroundColor Green
    } else {
        Write-Host "✗ $hook hook missing" -ForegroundColor Red
        $allValid = $false
    }
}

if ($allValid) {
    Write-Host "All hooks are properly installed!" -ForegroundColor Green
} else {
    Write-Host "Some hooks are missing. Please run the script again." -ForegroundColor Red
}

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

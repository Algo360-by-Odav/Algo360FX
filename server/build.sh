#!/usr/bin/env bash

# Strict error handling
set -euo pipefail
IFS=$'\n\t'

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "\n${BLUE}[STEP]${NC} $1"
}

# Error handler
handle_error() {
    local line_no=$1
    local error_code=$2
    log_error "Error occurred in build script at line ${line_no}, exit code: ${error_code}"
    exit ${error_code}
}

# Set error handler
trap 'handle_error ${LINENO} $?' ERR

# Function to check command existence
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 is required but not installed."
        exit 1
    fi
}

# Check required commands
log_step "Checking required commands..."
check_command "node"
check_command "npm"
check_command "npx"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
REQUIRED_NODE_VERSION="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then
    log_error "Node.js version >= $REQUIRED_NODE_VERSION is required (current: $NODE_VERSION)"
    exit 1
fi

# Clean previous build
log_step "Cleaning previous build..."
if [ -d "dist" ]; then
    rm -rf dist
    log_info "Previous build cleaned"
fi

# Create necessary directories
log_step "Creating build directories..."
mkdir -p dist

# Check and load environment variables
log_step "Checking environment..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        log_warn "No .env file found, copying from .env.example"
        cp .env.example .env
    else
        log_error "No .env or .env.example file found"
        exit 1
    fi
fi

# Install dependencies
log_step "Installing dependencies..."
if [ ! -f "package-lock.json" ]; then
    log_warn "No package-lock.json found, this may cause inconsistent builds"
fi

npm ci || {
    log_warn "npm ci failed, falling back to npm install"
    npm install
}

# Ensure TypeScript is available
log_step "Installing TypeScript..."
npm install typescript@5.3.3

# Type checking
log_step "Running type check..."
npm run type-check || {
    log_error "Type check failed"
    exit 1
}

# Linting
log_step "Running linter..."
if npm run lint; then
    log_info "Linting passed"
else
    log_warn "Linting failed, continuing build..."
fi

# Run tests
log_step "Running tests..."
if [ "${SKIP_TESTS:-}" != "true" ]; then
    if npm run test; then
        log_info "Tests passed"
    else
        log_error "Tests failed"
        exit 1
    fi
else
    log_warn "Skipping tests (SKIP_TESTS=true)"
fi

# Build Prisma schema
log_step "Building Prisma schema..."
if [ -f "build-schema.sh" ]; then
    ./build-schema.sh || {
        log_error "Prisma schema build failed"
        exit 1
    }
fi

# Build the project
log_step "Building project..."
npm run build || {
    log_error "Build failed"
    exit 1
}

# Copy necessary files
log_step "Copying additional files..."
cp package.json dist/
cp package-lock.json dist/ 2>/dev/null || :
cp .env dist/ 2>/dev/null || :
cp README.md dist/ 2>/dev/null || :

# Clean up dev dependencies in dist
log_step "Cleaning up dependencies..."
cd dist
npm ci --only=production || {
    log_warn "Production dependencies installation failed, falling back to npm install"
    npm install --only=production
}
cd ..

# Verify build
log_step "Verifying build..."
if [ ! -f "dist/index.js" ]; then
    log_error "Build verification failed: dist/index.js not found"
    exit 1
fi

# Build success
log_info "Build completed successfully!"

# Display build info
echo -e "\n${GREEN}Build Information:${NC}"
echo -e "Node version: $(node -v)"
echo -e "NPM version: $(npm -v)"
echo -e "TypeScript version: $(npx tsc --version)"
echo -e "Build directory size: $(du -sh dist | cut -f1)"

# Optional: Display next steps
cat << EOF

${BLUE}Next steps:${NC}
1. Review the build in the 'dist' directory
2. Deploy the contents of 'dist' to your production environment
3. Set up your production environment variables
4. Start the server with 'npm start' in the dist directory

For deployment instructions, see the README.md file.
EOF

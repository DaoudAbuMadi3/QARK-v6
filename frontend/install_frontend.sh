#!/bin/bash
set -euo pipefail

# run_frontend.sh
# Usage: ./run_frontend.sh
# Assumes project structure: ./frontend exists
# Installs yarn (if missing) using corepack or npm fallback, installs packages and starts frontend on port 3000
# Logs written to frontend.log

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
LOGFILE="$PROJECT_ROOT/frontend.log"

echo "==> Frontend starter (project root: $PROJECT_ROOT)"

# ensure frontend folder exists
if [ ! -d "$FRONTEND_DIR" ]; then
  echo "ERROR: frontend folder not found at $FRONTEND_DIR"
  exit 1
fi

cd "$FRONTEND_DIR"

# ensure Node.js installed
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Installing Node 20.x (requires sudo)..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# ensure yarn installed (prefer corepack, fallback to npm)
if ! command -v yarn >/dev/null 2>&1; then
  echo "yarn not found — trying corepack..."
  if command -v corepack >/dev/null 2>&1; then
    corepack enable
    corepack prepare yarn@stable --activate
  else
    echo "corepack not available — installing yarn via npm (may require sudo)..."
    sudo npm install -g yarn
  fi
fi

echo "yarn version: $(yarn --version)"

# install frontend packages if node_modules missing or package.json changed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies (yarn install)..."
  yarn install
else
  echo "node_modules exists — skipping yarn install."
fi

# create .env if missing
if [ ! -f ".env" ]; then
  echo "Creating .env for frontend..."
  cat > .env <<'EOF'
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Port configuration
PORT=3000
HOST=0.0.0.0
EOF
else
  echo ".env already exists — keeping it."
fi

# stop any existing frontend started by yarn start (best effort)
if pgrep -f "react-scripts|vite|webpack-dev-server|next" >/dev/null 2>&1; then
  echo "Warning: Found running dev server processes. They might conflict with this run."
fi

# start frontend in background (nohup)
echo "Starting frontend (logs -> $LOGFILE) ..."
# prefer using PORT env if the project respects it
nohup bash -lc "PORT=3000 HOST=0.0.0.0 yarn start" > "$LOGFILE" 2>&1 &

echo "Frontend started (PID: $!). Check $LOGFILE for logs."


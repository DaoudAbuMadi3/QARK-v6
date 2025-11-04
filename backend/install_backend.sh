#!/bin/bash
set -euo pipefail

# run_backend.sh
# Usage: ./run_backend.sh
# Assumes project structure: ./backend exists
# Starts FastAPI backend on port 8001 (uvicorn)

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
VENV_DIR="$PROJECT_ROOT/env1"
LOGFILE="$PROJECT_ROOT/backend.log"

echo "==> Backend starter (project root: $PROJECT_ROOT)"

# ensure backend folder exists
if [ ! -d "$BACKEND_DIR" ]; then
  echo "ERROR: backend folder not found at $BACKEND_DIR"
  exit 1
fi

cd "$BACKEND_DIR"

# create venv if not exists
if [ ! -d "$VENV_DIR" ]; then
  echo "Creating Python venv at $VENV_DIR ..."
  python3 -m venv "$VENV_DIR"
fi

# activate venv
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

# upgrade pip and install requirements
if [ -f "requirements.txt" ]; then
  echo "Installing Python dependencies..."
  pip install --upgrade pip
  pip install -r requirements.txt
else
  echo "Warning: requirements.txt not found in $BACKEND_DIR"
fi

# create .env if missing (keeps existing .env)
if [ ! -f ".env" ]; then
  echo "Creating .env for backend..."
  cat > .env <<'EOF'
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=qark_db

# CORS Settings (adjust as needed)
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
EOF
else
  echo ".env already exists — keeping it."
fi

# kill any previous uvicorn on same port (optional)
if pgrep -f "uvicorn.*8001" >/dev/null 2>&1; then
  echo "Stopping existing uvicorn processes on port 8001..."
  pkill -f "uvicorn.*8001" || true
  sleep 1
fi

# start backend with nohup so it runs in background and logs to file
echo "Starting backend with uvicorn (logs -> $LOGFILE) ..."
nohup python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload > "$LOGFILE" 2>&1 &

echo "Backend started (PID: $!). Check $LOGFILE for logs."


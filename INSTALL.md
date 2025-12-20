# QARK v6 - Installation Instructions

This guide will help you install and run QARK v6 from scratch after downloading from GitHub.

## System Requirements

- **Operating System**: Linux, macOS, or Windows
- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **MongoDB**: Latest stable version
- **Java**: JDK 8 or higher (for decompilation tools)
- **Yarn**: Package manager for Node.js
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 2GB free space

## Installation Steps

### Step 1: Install Prerequisites

#### On Ubuntu/Debian:
```bash
# Update package list
sudo apt-get update

# Install Python 3
sudo apt-get install -y python3 python3-pip python3-venv

# Install Node.js and Yarn
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn

# Install MongoDB
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Install Java
sudo apt-get install -y openjdk-11-jdk
```

#### On macOS:
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python 3
brew install python@3.11

# Install Node.js and Yarn
brew install node
npm install -g yarn

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Install Java
brew install openjdk@11
```

#### On Windows:
1. Download and install Python 3.8+ from https://www.python.org/downloads/
2. Download and install Node.js from https://nodejs.org/
3. Install Yarn: `npm install -g yarn`
4. Download and install MongoDB from https://www.mongodb.com/try/download/community
5. Download and install Java JDK 11+ from https://adoptium.net/

### Step 2: Clone Repository

```bash
git clone https://github.com/YOUR_REPO_URL/qark-v6.git
cd qark-v6
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env configuration file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=qark_db
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
EOF

# On Windows, create .env file manually with above content
```

### Step 4: Verify Decompilation Tools

All tools are included in the repository. Verify they exist:

```bash
# Check if tools are present
ls -la qark/lib/

# You should see:
# - apktool/apktool.jar
# - jadx-1.5.0/bin/jadx
# - dex2jar/
# - cfr.jar
# - procyon.jar

# Make JADX executable (Linux/Mac only)
chmod +x qark/lib/jadx-1.5.0/bin/jadx
chmod +x qark/lib/dex2jar/*.sh
```

### Step 5: Start Backend

```bash
# Still in backend directory
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

Keep this terminal open.

### Step 6: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd qark-v6/frontend

# Install dependencies
yarn install

# Create .env file
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
PORT=3000
HOST=0.0.0.0
EOF

# On Windows, create .env file manually with above content
```

### Step 7: Start Frontend

```bash
# Still in frontend directory
yarn start
```

You should see:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

### Step 8: Access Application

Open your web browser and navigate to:
```
http://localhost:3000
```

You should see the QARK v6 home page with the upload interface.

## Verification Tests

### Test 1: Backend Health Check

```bash
curl http://localhost:8001/api/
```

Expected response:
```json
{"message":"Hello World"}
```

### Test 2: Frontend Access

Open http://localhost:3000 in your browser. You should see:
- QARK v6 logo and header
- File upload area
- Feature cards

### Test 3: Full Scan Test

1. Download a test APK (e.g., from https://github.com/linkedin/qark/tree/master/tests/goatdroid.apk)
2. Drag and drop it on the upload area
3. Click "Start Scan"
4. Wait for scan to complete (usually 30-120 seconds)
5. View results and download reports

## Common Issues and Solutions

### Issue 1: "Python not found"

**Solution:**
```bash
# Verify Python installation
python3 --version

# If not installed, install Python 3.8+
# See Step 1 above
```

### Issue 2: "MongoDB connection failed"

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb  # Linux
brew services list | grep mongo  # macOS

# Start MongoDB if stopped
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS

# Verify MongoDB is listening
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```

### Issue 3: "Port already in use"

**Solution:**
```bash
# Find process using port 8001 (backend)
lsof -i :8001
# Or on Windows: netstat -ano | findstr :8001

# Kill the process
kill -9 <PID>  # Linux/Mac
# Or on Windows: taskkill /PID <PID> /F

# Same for port 3000 (frontend)
lsof -i :3000
```

### Issue 4: "Module not found" errors

**Solution:**
```bash
# Backend - reinstall dependencies
cd backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Frontend - reinstall dependencies
cd frontend
rm -rf node_modules
yarn install
```

### Issue 5: "JADX not found"

**Solution:**
```bash
# Verify JADX exists
ls -la backend/qark/lib/jadx-1.5.0/

# If missing, download JADX:
cd backend/qark/lib
wget https://github.com/skylot/jadx/releases/download/v1.5.0/jadx-1.5.0.zip
unzip jadx-1.5.0.zip -d jadx-1.5.0
chmod +x jadx-1.5.0/bin/jadx
```

### Issue 6: "Java not found"

**Solution:**
```bash
# Check Java installation
java -version

# If not installed:
# Ubuntu/Debian:
sudo apt-get install openjdk-11-jdk

# macOS:
brew install openjdk@11

# Windows: Download from https://adoptium.net/
```

### Issue 7: Frontend shows "Cannot connect to backend"

**Solution:**
```bash
# 1. Verify backend is running
curl http://localhost:8001/api/

# 2. Check .env file in frontend
cat frontend/.env
# Should show: REACT_APP_BACKEND_URL=http://localhost:8001

# 3. Restart frontend
cd frontend
yarn start
```

## Production Deployment

### Using Supervisor (Linux)

```bash
# Install supervisor
sudo apt-get install supervisor

# Create config file
sudo nano /etc/supervisor/conf.d/qark.conf
```

Add this content:
```ini
[program:qark-backend]
command=/path/to/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=/path/to/qark-v6/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/qark-backend.err.log
stdout_logfile=/var/log/supervisor/qark-backend.out.log

[program:qark-frontend]
command=/usr/local/bin/yarn start
directory=/path/to/qark-v6/frontend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/qark-frontend.err.log
stdout_logfile=/var/log/supervisor/qark-frontend.out.log
```

Then:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start qark-backend qark-frontend
```

### Using Docker (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Next Steps

1. ✅ Installation complete
2. 📚 Read the [USER_GUIDE.md](USER_GUIDE.md) for usage instructions
3. 🔧 Check [PLUGINS_ENHANCEMENT.md](PLUGINS_ENHANCEMENT.md) for customization
4. 📖 Review [README_QARK.md](README_QARK.md) for technical details

## Getting Help

If you encounter issues:

1. Check this installation guide
2. Review error messages in terminal
3. Check application logs
4. Search GitHub issues
5. Open a new issue with:
   - Your operating system
   - Error messages
   - Steps to reproduce

## Quick Reference

### Start Services

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # If using venv
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend
cd frontend
yarn start
```

### Stop Services

- Press `Ctrl+C` in each terminal

### Check Status

```bash
# Backend
curl http://localhost:8001/api/

# Frontend
curl http://localhost:3000
```

### View Logs

```bash
# Backend logs (in terminal running backend)
# Or if using supervisor:
tail -f /var/log/supervisor/qark-backend.err.log

# Frontend logs (in terminal running frontend)
# Or check browser console (F12)
```

---

**Installation Complete!** 🎉

You're now ready to scan Android applications for security vulnerabilities.

For questions or support, please visit our GitHub repository or contact the development team.

---

Developed by: Jineen Abu Amr • Daoud Abu Madi • 3asem Alselwady • R7mah Alqur3an

# QARK v6 - Complete Setup Guide

This guide walks through setting up QARK v6 from scratch, just like downloading it from GitHub.

## 📋 Prerequisites

Before starting, ensure you have:

- **Python 3.8+** installed
- **Node.js 16+** and **Yarn** installed
- **MongoDB** running (locally or remote)
- **Java 8+** (required for decompilation tools)
- **Git** installed

## 🔧 Step 1: Clone or Download Repository

```bash
# If from GitHub
git clone <repository-url>
cd qark-v6

# Or if you already have the files
cd /app
```

## 📦 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Create Virtual Environment (Optional but Recommended)

```bash
python -m venv venv

# Activate on Linux/Mac
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

### 2.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Required packages include:**
- fastapi
- uvicorn
- motor (MongoDB async driver)
- python-multipart (for file uploads)
- requests
- pluginbase
- jinja2
- javalang
- click
- cryptography
- xmltodict
- lxml

### 2.4 Setup Environment Variables

Create `.env` file in `backend/` directory:

```bash
# backend/.env

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=qark_db

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Optional: Custom paths
# QARK_LIB_PATH=/custom/path/to/qark/lib
```

### 2.5 Download and Setup JADX

**IMPORTANT:** JADX is required for APK decompilation.

1. Download JADX from: https://github.com/skylot/jadx/releases
2. Extract the downloaded file
3. Place it in: `backend/qark/lib/jadx/`

Your directory structure should look like:
```
backend/
  qark/
    lib/
      jadx/
        bin/
          jadx           # or jadx.bat on Windows
          jadx-gui       # or jadx-gui.bat
        lib/
          *.jar files
```

### 2.6 Verify QARK Tools

Check that all decompilation tools are present:

```bash
ls -la backend/qark/lib/

# You should see:
# - apktool/
# - dex2jar/
# - jadx/
# - cfr.jar
# - procyon.jar
```

### 2.7 Test Backend

```bash
# Start backend server
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

Test API:
```bash
curl http://localhost:8001/api/
# Expected: {"message":"Hello World"}
```

## 🎨 Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

```bash
cd ../frontend  # or cd frontend from root
```

### 3.2 Install Node Dependencies

```bash
yarn install

# This will install:
# - react
# - react-router-dom
# - axios
# - tailwindcss
# - radix-ui components
# - lucide-react icons
# - and more...
```

### 3.3 Setup Environment Variables

Create `.env` file in `frontend/` directory:

```bash
# frontend/.env

# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Port (optional)
PORT=3000
HOST=0.0.0.0
```

### 3.4 Test Frontend

```bash
yarn start
```

You should see:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

## 🗄️ Step 4: MongoDB Setup

### 4.1 Install MongoDB

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows:**
Download installer from: https://www.mongodb.com/try/download/community

### 4.2 Verify MongoDB is Running

```bash
# Check if MongoDB is running
sudo systemctl status mongodb  # Linux
brew services list | grep mongo  # macOS

# Test connection
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```

### 4.3 Create Database (Automatic)

The database and collections will be created automatically when you first use the application.

## ✅ Step 5: Verification

### 5.1 Check All Services

Open 3 terminal windows:

**Terminal 1 - MongoDB:**
```bash
sudo systemctl status mongodb
# Should show: Active: active (running)
```

**Terminal 2 - Backend:**
```bash
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
# Should show: Uvicorn running on http://0.0.0.0:8001
```

**Terminal 3 - Frontend:**
```bash
cd frontend
yarn start
# Should show: webpack compiled successfully
```

### 5.2 Test Complete Flow

1. **Open Browser:**
   ```
   http://localhost:3000
   ```

2. **Upload Test File:**
   - Download a test APK (e.g., goatdroid.apk from QARK repo)
   - Drag and drop it on the upload area
   - Click "Start Scan"

3. **Monitor Progress:**
   - Watch the progress bar
   - Check backend logs for decompilation/scanning messages

4. **View Results:**
   - Wait for scan to complete
   - Review vulnerabilities
   - Download reports

### 5.3 Check Logs

**Backend logs:**
```bash
# If running with uvicorn
# Logs appear in terminal

# If using supervisor
tail -f /var/log/supervisor/backend.err.log
```

**Frontend logs:**
```bash
# Browser Console (F12)
# Or terminal where yarn start is running
```

## 🐛 Troubleshooting

### Issue 1: "Module not found" errors

**Solution:**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules
yarn install
```

### Issue 2: MongoDB connection failed

**Solution:**
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check .env file
cat backend/.env  # Verify MONGO_URL is correct
```

### Issue 3: JADX not found

**Solution:**
```bash
# Check JADX location
ls -la backend/qark/lib/jadx/bin/jadx

# If missing, download and extract JADX
# Place in correct location
```

### Issue 4: Port already in use

**Solution:**
```bash
# Find process using port
lsof -i :8001  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>

# Or use different port
# Backend: --port 8002
# Frontend: PORT=3001 yarn start
```

### Issue 5: CORS errors

**Solution:**
```bash
# Check backend .env
cat backend/.env

# Ensure CORS_ORIGINS includes frontend URL
CORS_ORIGINS=http://localhost:3000

# Restart backend
```

### Issue 6: File upload fails

**Solution:**
```bash
# Check file size (max 500MB)
# Check file type (.apk, .java, .jar)
# Check backend logs for specific error
# Ensure /tmp has write permissions
chmod 777 /tmp
```

## 🚀 Production Deployment

### Using Supervisor (Recommended)

1. **Install Supervisor:**
```bash
sudo apt-get install supervisor
```

2. **Create configuration:**
```bash
sudo nano /etc/supervisor/conf.d/qark.conf
```

```ini
[program:qark-backend]
command=/path/to/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/backend.err.log
stdout_logfile=/var/log/supervisor/backend.out.log

[program:qark-frontend]
command=yarn start
directory=/app/frontend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/frontend.err.log
stdout_logfile=/var/log/supervisor/frontend.out.log
```

3. **Start services:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start qark-backend
sudo supervisorctl start qark-frontend
```

### Using Docker (Alternative)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=qark_db
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001
    depends_on:
      - backend

volumes:
  mongo-data:
```

Run:
```bash
docker-compose up -d
```

## 📚 Additional Resources

- **QARK Documentation:** Check README_QARK.md
- **User Guide:** See USER_GUIDE.md
- **Plugin Development:** See PLUGINS_ENHANCEMENT.md
- **OWASP Mobile Security:** https://owasp.org/www-project-mobile-security/
- **Android Security:** https://developer.android.com/security

## 🎯 Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ and Yarn installed
- [ ] MongoDB running
- [ ] Java 8+ installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`yarn install`)
- [ ] JADX downloaded and placed in `backend/qark/lib/jadx/`
- [ ] Backend `.env` file created
- [ ] Frontend `.env` file created
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] Test scan completed successfully

## 💡 Tips

1. **Use virtual environment** for Python to avoid conflicts
2. **Check logs** when something doesn't work
3. **Ensure JADX is properly installed** - it's critical for APK decompilation
4. **MongoDB must be running** before starting backend
5. **Use Chrome/Firefox** for best compatibility
6. **Don't interrupt scans** - let them complete
7. **Keep test APKs handy** for testing (e.g., goatdroid.apk)

## 📞 Support

If you encounter issues:

1. Check this setup guide thoroughly
2. Review troubleshooting section
3. Check application logs
4. Search GitHub issues
5. Contact the development team

---

**Setup complete! 🎉 Now you're ready to scan Android applications for security vulnerabilities.**

Developed by: Jineen Abu Amr • Daoud Abu Madi • 3asem Alselwady • R7mah Alqur3an

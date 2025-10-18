# QARK v6 - Quick Android Review Kit

<div align="center">
  <img src="https://img.shields.io/badge/Version-5.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/Platform-Android-green" alt="Platform">
  <img src="https://img.shields.io/badge/Language-Python-yellow" alt="Language">
  <img src="https://img.shields.io/badge/Web-React-cyan" alt="Web">
</div>

## 📋 Overview

QARK v6 is an advanced tool for scanning security vulnerabilities in Android applications. The tool features a modern and attractive web interface that facilitates the scanning process and provides detailed and accurate results.

### ✨ Key Features

- 🔍 **Comprehensive Scanning**: Detection of more than 40 types of security vulnerabilities
- 🎨 **Beautiful Web Interface**: Modern and easy-to-use design
- 📊 **Detailed Reports**: Reports in multiple formats (HTML, JSON, XML, CSV)
- 🚀 **High Performance**: Fast and accurate file processing
- 🔄 **Live Tracking**: Real-time scan progress monitoring
- 📁 **Scan Management**: Save and manage all previous scan operations

### 🎯 Types of Detected Vulnerabilities

#### Certificate & SSL
- Certificate Validation Methods Overridden
- Hostname Verifier Issues
- SSL/TLS Configuration Problems

#### Cryptography
- ECB Cipher Usage
- RSA Cipher Issues
- Packaged Private Keys
- Secure Random Seed Issues

#### File Handling
- External Storage Access
- File Permissions Issues
- Android Logging Vulnerabilities
- API Keys Exposure
- Phone Identifier Leaks
- Insecure Functions Usage
- Hardcoded HTTP URLs

#### Intent & Broadcast
- Implicit Intent to Pending Intent
- Dynamic Broadcast Receiver Issues
- Broadcast Receiver Permission Problems

#### Manifest Issues
- Debuggable Flag
- Exported Components
- Allow Backup Configuration
- Minimum SDK Issues
- Custom Permissions
- Task Reparenting
- Single Task Launch Mode

#### WebView Vulnerabilities
- JavaScript Interface Issues
- JavaScript Enabled
- Remote WebView Debugging
- DOM Storage Issues
- File Access Configuration
- Universal Access from File URLs
- Load Data with Base URL

#### Generic Issues
- Permissions Check
- Task Affinity Issues

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Fast and modern Python framework
- **Python 3.x**: Primary programming language
- **MongoDB**: Database for storage
- **QARK Engine**: Core scanning engine

### Frontend
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: CSS framework for design
- **Radix UI**: Advanced UI components
- **Axios**: For Backend API communication

### Decompilation Tools
- **JADX**: Primary APK decompilation tool
- **apktool**: For extracting resources and AndroidManifest
- **dex2jar**: Converting DEX files to JAR
- **CFR & Procyon**: Fallback decompilation tools

## 📦 Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB
- Java 8+ (for running decompilation tools)

### Installation Steps

#### 1. Backend Setup

```bash
cd backend

# Install required libraries
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit the .env file according to your settings

# Run the server
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### 2. Frontend Setup

```bash
cd frontend

# Install libraries
yarn install

# Run the application
yarn start
```

#### 3. JADX Setup

Download JADX from: https://github.com/skylot/jadx/releases

Then place JADX files in the directory:
```
backend/qark/lib/jadx/
```

## 🚀 Usage

### 1. Main Interface

- Open browser at `http://localhost:3000`
- Upload an APK or Java file
- Wait for the scan to complete

### 2. Scan Monitoring

- You will be automatically redirected to the scan monitoring page
- Monitor progress in real-time
- View results immediately upon completion

### 3. Results and Reports

- View vulnerabilities classified by severity
- Download reports in different formats
- Browse details of each vulnerability

### 4. Scan History

- View all previous scan operations
- Reopen any previous scan
- Delete old scans

## 📊 API Endpoints

### Scan Management

```
POST   /api/qark/scan                    # Upload file and start scan
GET    /api/qark/scan/{scan_id}/status   # Get scan status
GET    /api/qark/scan/{scan_id}/result   # Get scan results
GET    /api/qark/scans                   # View all scans
DELETE /api/qark/scan/{scan_id}          # Delete scan
GET    /api/qark/scan/{scan_id}/report/{type}  # Download report
```

## 🎨 Screenshots

### Home Page
Attractive interface for uploading files with Drag & Drop

### Scan Page
Live progress tracking with detailed results display

### Reports
Enhanced HTML reports with professional design

## 🔒 Security

- All uploaded files are stored temporarily
- No data is shared with external parties
- All data can be deleted after scanning

## 📝 Development

### Project Structure

```
.
├── backend/
│   ├── qark/                 # QARK engine
│   │   ├── decompiler/      # Decompilation tools
│   │   ├── scanner/         # Scan engine
│   │   ├── plugins/         # Vulnerability detection components
│   │   ├── templates/       # Report templates
│   │   └── lib/            # External libraries
│   ├── server.py           # FastAPI server
│   └── qark_api.py         # QARK API wrapper
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Application pages
│   │   ├── components/     # React components
│   │   └── App.js          # Main application
│   └── package.json
│
└── README.md
```

### Contributing

We welcome all contributions! Please:

1. Fork the project
2. Create a branch for the new feature
3. Commit changes
4. Push to Branch
5. Open Pull Request


## QARK v6 was developed by:

- **Daoud Abu Madi**


## 📄 License

This project is open source and available under the MIT license.

## 🤝 Support

For support or to report issues:
- Open an Issue on GitHub
- Contact the team

## 🔄 Upcoming Updates

- [ ] Support for more file types
- [ ] Scan performance improvements
- [ ] Adding more vulnerability types
- [ ] Multi-language support
- [ ] Advanced PDF reports
- [ ] Developer API

---

<div align="center">
  <p>Made with ❤️ by Daoud Abu Madi</p>
  <p>QARK v6 - Quick Android Review Kit</p>
</div>

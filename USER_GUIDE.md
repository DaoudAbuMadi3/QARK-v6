# QARK v6 - Comprehensive User Guide

## 🎯 Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Interface Guide](#interface-guide)
4. [API Documentation](#api-documentation)
5. [Applied Enhancements](#applied-enhancements)
6. [Troubleshooting](#troubleshooting)

---

## 📖 Introduction

QARK v6 is an advanced tool for scanning security vulnerabilities in Android applications. It has been developed with a modern and attractive web interface that makes the scanning process easy and effective.

### What's New in v6?

✨ **Complete Web Interface**: Modern design with intuitive UX
🚀 **Enhanced Performance**: Faster and more efficient processing  
📊 **Improved Reports**: Completely new HTML design  
🔍 **Higher Accuracy**: Improvements in vulnerability detection  
💾 **Better Management**: Save and manage all scans  

---

## 🚀 Quick Start

### 1. Access the Application

Open your browser to:
```
http://localhost:3000
```

### 2. Upload APK File

- Drag and drop the file in the upload area
- Or click "Choose File" to browse files
- Supported files: `.apk`, `.java`, `.jar`

### 3. Start Scanning

- Click the "Start Scan" button
- You will be automatically redirected to the monitoring page

### 4. Monitor Progress

- Watch the progress bar
- Read status messages
- Wait until the scan completes

### 5. View Results

After scan completion:
- View vulnerability summary
- Browse complete details
- Download reports

---

## 🎨 Interface Guide

### Home Page

#### Features:
- **File Upload**: Drag & Drop or browse
- **Tool Information**: Overview of capabilities
- **Navigation**: Access to scan history

#### Main Elements:
1. **QARK Logo**: At the top with version number
2. **History Button**: Access to previous scans
3. **Title Area**: Explanation of tool functionality
4. **Feature Cards**: 3 cards explaining capabilities
5. **Upload Area**: File upload interface
6. **Developer Information**: At the bottom

### Scan Page

#### Sections:
1. **Status Card**:
   - Scan ID
   - Current status
   - Progress bar
   - Status messages

2. **Results Summary** (after completion):
   - Total vulnerabilities
   - Number of warnings
   - Number of information items

3. **Reports**:
   - Download HTML
   - Download JSON

4. **Vulnerability List**:
   - Tabs by type
   - Details for each vulnerability
   - File location and line number

### History Page

#### Capabilities:
- Display all scans
- Information for each scan:
  - File name
  - Status
  - Progress percentage
  - Date
  - Scan ID
- Delete old scans
- Reopen any scan

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8001/api
```

### Endpoints

#### 1. Start New Scan

**Request:**
```http
POST /qark/scan
Content-Type: multipart/form-data

file: [APK/Java/Jar file]
```

**Response:**
```json
{
  "scan_id": "uuid",
  "input_type": "apk",
  "filename": "app.apk",
  "report_type": "json",
  "timestamp": "2024-01-01T00:00:00"
}
```

#### 2. Get Scan Status

**Request:**
```http
GET /qark/scan/{scan_id}/status
```

**Response:**
```json
{
  "scan_id": "uuid",
  "status": "scanning",
  "progress": 75,
  "message": "Scanning for vulnerabilities...",
  "timestamp": "2024-01-01T00:00:00"
}
```

**Status States:**
- `pending`: Waiting
- `decompiling`: Decompiling in progress
- `scanning`: Scanning in progress
- `reporting`: Generating report
- `completed`: Completed
- `failed`: Failed

#### 3. Get Scan Results

**Request:**
```http
GET /qark/scan/{scan_id}/result
```

**Response:**
```json
{
  "scan_id": "uuid",
  "filename": "app.apk",
  "status": "completed",
  "total_vulnerabilities": 15,
  "vulnerabilities_by_severity": {
    "VULNERABILITY": 5,
    "WARNING": 7,
    "INFO": 3
  },
  "vulnerabilities_by_category": {
    "CERTIFICATE": 2,
    "CRYPTO": 3,
    "WEBVIEW": 5,
    ...
  },
  "vulnerabilities": [...],
  "report_paths": {
    "json": "/path/to/report.json",
    "html": "/path/to/report.html"
  },
  "decompiled_path": "/path/to/decompiled",
  "timestamp": "2024-01-01T00:00:00"
}
```

#### 4. List All Scans

**Request:**
```http
GET /qark/scans
```

**Response:**
```json
[
  {
    "scan_id": "uuid",
    "filename": "app.apk",
    "status": "completed",
    "progress": 100,
    "timestamp": "2024-01-01T00:00:00"
  },
  ...
]
```

#### 5. Delete Scan

**Request:**
```http
DELETE /qark/scan/{scan_id}
```

**Response:**
```json
{
  "message": "Scan deleted successfully",
  "scan_id": "uuid"
}
```

#### 6. Download Report

**Request:**
```http
GET /qark/scan/{scan_id}/report/{report_type}
```

**Parameters:**
- `report_type`: html | json | xml | csv

**Response:**
- File download

---

## 🎯 Applied Enhancements

### 1. Frontend

#### Design:
✅ Complete web interface
✅ Attractive Dark Mode design
✅ Gradient backgrounds
✅ Animations and transitions
✅ Responsive design

#### Functions:
✅ Drag & Drop for files
✅ Real-time progress tracking
✅ Filter vulnerabilities by type
✅ Download multiple reports
✅ History management

### 2. Backend

#### Architecture:
✅ FastAPI framework
✅ Async/await support
✅ Background tasks
✅ Enhanced error handling

#### File Processing:
✅ Secure file saving
✅ Validation for uploaded files
✅ Automatic cleanup

### 3. Scan Engine

#### Decompiler:
✅ JADX support (primary)
✅ Fallback to dex2jar + CFR/Procyon
✅ Advanced error handling

#### Scanner:
✅ 40+ detection plugins
✅ Parallel processing
✅ Sorting by severity

### 4. Reports

#### HTML Report:
✅ Enhanced design
✅ Organization by severity
✅ Detailed information
✅ Print-friendly

#### JSON Report:
✅ Organized structure
✅ Easy to parse
✅ API-friendly  

---

## 🔧 Troubleshooting

### Issue: Server Not Working

**Solution:**
```bash
# Check server status
sudo supervisorctl status

# Restart Backend
sudo supervisorctl restart backend

# Restart Frontend
sudo supervisorctl restart frontend

# View logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

### Issue: File Upload Failed

**Possible Causes:**
1. File too large (more than 500 MB)
2. Unsupported file type
3. Network issue

**Solution:**
- Check file size
- Ensure correct extension (.apk, .java, .jar)
- Try again

### Issue: Scan Failed

**Possible Causes:**
1. Corrupted APK file
2. JADX not found
3. Memory shortage

**Solution:**
```bash
# Check JADX exists
ls -la /app/backend/qark/lib/jadx/

# Check logs
tail -100 /var/log/supervisor/backend.err.log

# Restart Backend
sudo supervisorctl restart backend
```

### Issue: Report Not Showing

**Solution:**
- Check scan completion (progress = 100%)
- Wait a few seconds and reload the page
- Check logs for errors

---

## 📚 Additional Resources

### Important Files:
- `/app/README_QARK.md` - Comprehensive guide
- `/app/PLUGINS_ENHANCEMENT.md` - Plugin documentation
- `/app/backend/qark/` - QARK code
- `/app/frontend/src/pages/` - Interface pages

### Useful Links:
- [QARK Original Project](https://github.com/linkedin/qark)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Android Security](https://developer.android.com/security)

---

## 💡 Tips and Best Practices

### For Best Results:

1. **Use Clean APK Files**: Avoid modified files
2. **Wait for Scan Completion**: Don't interrupt the process
3. **Review All Vulnerabilities**: Even INFO items are important
4. **Use HTML Reports**: Easiest to read
5. **Save Results**: For review and comparison

### For Better Performance:

1. **Small Files**: Faster scanning for smaller files
2. **Close Heavy Programs**: To save resources
3. **Stable Connection**: For upload and download
4. **Modern Browser**: Chrome or Firefox

---

## 🎓 Frequently Asked Questions

### Q: How long does the scan take?
**A:** Usually 30-120 seconds depending on file size.

### Q: Is the data secure?
**A:** Yes, all files are local and not sent anywhere.

### Q: Can I scan multiple files?
**A:** Yes, you can upload a new file at any time.

### Q: What's the difference between vulnerabilities and warnings?
**A:**
- **VULNERABILITY**: Serious issues requiring immediate fix
- **WARNING**: Medium issues that should be addressed
- **INFO**: Information for improvement

### Q: How do I delete old scans?
**A:** From the history page, click the delete icon on any scan.

---

## 📞 Support

For assistance:

1. Review this guide first
2. Check the logs
3. Search GitHub Issues
4. Contact Me

---

<div align="center">

**QARK v6 - Quick Android Review Kit**

Developed with love and precision 💙

Jineen Abu Amr · Daoud Abu Madi · 3asem Alselwady · R7mah Alqur3an

</div>

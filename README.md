# QARK v6 - Quick Android Review Kit 🛡️🐱‍💻 
[![Quick Android Review Kit 🛡️](https://capsule-render.vercel.app/api?text=Quick%20Android%20Review%20Kit&animation=fadeIn&type=waving&color=gradient&height=100)](https://github.com/DaoudAbuMadi3/Qark5)

[![QARK6 Architecture](./docs/System_Arch_v6.png)](https://github.com/YOUR_USERNAME/qark-v6) 

---

## Overview 🌟

**QARK v6** (Quick Android Review Kit) is a modern **Android security vulnerability scanner** that analyzes both APKs and source code. It helps developers and security testers **detect 40+ types of vulnerabilities**, generate reports, and even produce PoC exploits when applicable.  

**Now fully Dockerized!** No local Python, Node.js, or MongoDB setup required—just Docker and Docker Compose.  

**Founded by:** LinkedIn team (original QARK project)  
**Updated & Maintained by:** Daoud Abu Madi  

---

## Features 🔥

- 🔍 Comprehensive Android security scanning (40+ vulnerability types)  
- 🎨 Modern web interface with **dark mode**  
- 📊 Detailed reports (HTML, JSON, XML, CSV)  
- 🚀 Fast scanning with **real-time progress tracking**  
- 💾 Scan history management  
- 🛠️ Multiple decompilation tools included: **JADX, APKTool, CFR, Procyon**  
- 🐳 Fully Dockerized for **easy deployment**  

---

## Prerequisites ⚙️

- **Docker 24+**  
- **Docker Compose 2+**  

> All other dependencies (Python, Node.js, MongoDB, Java) are included in the Docker containers.

---

## Quick Start - Docker Way 🐳

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/qark-v6.git
cd qark-v6
```

2️⃣ Build and Start Containers
```
sudo docker compose up -d --build
```
This starts both backend and frontend automatically.

3️⃣ Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

4️⃣ Stop Containers
```
sudo docker compose down
```


---

## Using QARK v6 🚀

### 1️⃣ Access the Application

Open your browser and go to:

```
http://localhost:3000
```

### 2️⃣ Upload and Scan

1. Upload a test `.apk` file.
2. Click **Start Scan**.
3. Monitor progress and view detailed results.

---

## Decompilation Tools Included 🛠️

All decompilation tools are included—**no additional downloads required**:

* **APKTool** - `backend/qark/lib/apktool/apktool.jar`
* **CFR** - `backend/qark/lib/cfr.jar`
* **Procyon** - `backend/qark/lib/procyon.jar`
* **JADX** - `backend/qark/lib/jadx-1.5.0/`
* **Dex2jar** - `backend/qark/lib/dex2jar/`

---

## Supported File Types 📂

* `.apk` - Android Application Package
* `.java` - Java source files
* `.jar` - Java Archive files

---

## Detected Vulnerabilities 🛡️

QARK v6 detects **40+ types of vulnerabilities**, including:

* Certificate & SSL issues
* Cryptography weaknesses
* File handling vulnerabilities
* Intent & broadcast issues
* Manifest misconfigurations
* WebView security issues
* Generic security problems

> For the full list, see [README_QARK.md](README_QARK.md)

---

## Project Structure 📁

```
qark-v6/
├── backend/
├── frontend/
├── docs/
│   └── System_Arch_v6.png
├── README.md
├── SETUP.md
├── USER_GUIDE.md
└── PLUGINS_ENHANCEMENT.md
```

---

## Team 👨‍💻

* **LinkedIn Team** - Original QARK project
* **Daoud Abu Madi** - Updated & Maintained QARK v6

---

## License 📜

MIT License - Open Source

---

## Support & Contributing 🤝

* Open a GitHub issue
* Fork & create a feature branch
* Submit Pull Requests

---

**QARK v6 - Making Android Security Testing Accessible**
Made with ❤️ by **Daoud Abu Madi**

---



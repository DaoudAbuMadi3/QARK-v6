

# QARK v6 - Quick Android Review Kit 🛡️🐱‍💻 
[![Quick Android Review Kit 🛡️](https://capsule-render.vercel.app/api?text=Quick%20Android%20Review%20Kit&animation=fadeIn&type=waving&color=gradient&height=100)](https://github.com/DaoudAbuMadi3/QARK-v6)

[![QARK6 Architecture](./docs/Screenshot%20from%202025-10-17%2017-50-05.png)](https://github.com/DaoudAbuMadi3/QARK-v6)



## Overview 🌟

**QARK v6** (Quick Android Review Kit) is a modern **Android security vulnerability scanner** that analyzes both APKs and source code. It helps developers and security testers **detect 40+ types of vulnerabilities**, generate reports, and even produce PoC exploits when applicable.  

**Now fully Dockerized!** No local Python, Node.js, or MongoDB setup required—just Docker and Docker Compose.  

**Founded by:** LinkedIn team (original QARK project)  
**Updated & Maintained by:** Daoud Abu Madi  

---

## Features 🔥

- 🔍 Comprehensive Android security scanning (40+ vulnerability types)  
- 🎨 Modern web interface with **dark mode**  
- 📊 Detailed reports (HTML , JSON)  
- 🚀 Fast scanning with **real-time progress tracking**  
- 💾 Scan history management  
- 🛠️ Multiple decompilation tools included: **APKTool, CFR, Procyon, Dex2Jar**  
- 🐳 Fully Dockerized for **easy deployment**  

---





## Quick Start - Docker Way 🐳

> **After** you complete the JADX step above, continue with Docker:

### 1️⃣ Clone Repository
```bash
git clone https://github.com/DaoudAbuMadi3/QARK-v6.git
cd QARK-v6
```


### 🌟 IMPORTANT — JADX (Required for Reverse Engineering) 🛠️

> **This step is essential and must be completed BEFORE starting Docker.**  
> JADX is required for reliable decompilation and reverse engineering results. Place JADX in the repository path shown below so the Docker container can use it at runtime.

```bash
cd QARK-v6/backend/qark/lib
```
### 🌟 Download jadx v1.5.1
```bash
wget https://github.com/skylot/jadx/releases/download/v1.5.1/jadx-1.5.1.zip
```
### 🌟 Prepare jadx folder
```bash
mkdir jadx-1.5.1
mv jadx-1.5.1.zip jadx-1.5.1
cd jadx-1.5.1
unzip jadx-1.5.1.zip
```
### 🌟 Ensure executable bits (Linux/mac)
```bash
chmod -R +x ../jadx-1.5.1/bin
````




### 2️⃣ Build and Start Containers
```bash
cd ../../../..
sudo docker compose up -d --build
```

This starts both **backend** and **frontend** automatically.

### 3️⃣ Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

### 4️⃣ Stop Containers

```c
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

1. Upload a test `.apk` file
2. Click **Start Scan**
3. Monitor progress and view detailed results

---

## Decompilation Tools Included 🧰

All tools used by QARK are bundled or expected in `backend/qark/lib`. Make sure JADX (see above) is present before Docker start.

| Tool    | Path                                                                    |
| ------- | ----------------------------------------------------------------------- |
| APKTool | `backend/qark/lib/apktool/apktool.jar`                                  |
| CFR     | `backend/qark/lib/cfr.jar`                                              |
| Procyon | `backend/qark/lib/procyon.jar`                                          |
| JADX    | `backend/qark/lib/jadx-1.5.1/` (download manually — see IMPORTANT note) |
| Dex2Jar | `backend/qark/lib/dex2jar/`                                             |

> No other downloads are required once jadx is placed.

---

## Supported File Types 📂

* `.apk` — Android Application Package
* `.java` — Java source files
* `.jar` — Java Archive files

---

## Detected Vulnerabilities 🛡️

QARK v6 detects **40+ vulnerability types**, including:

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
│   └── qark/
│       └── lib/
│           ├── apktool/
│           ├── cfr.jar
│           ├── procyon.jar
│           ├── jadx-1.5.1/    <- place JADX here BEFORE docker up
│           └── dex2jar/
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

* **LinkedIn Team** — Original QARK project
* **Daoud Abu Madi** — Updated & Maintained QARK v6

---

## License 📜

MIT License — Open Source

---

## Support & Contributing 🤝

* Open a GitHub issue
* Fork & create a feature branch
* Submit Pull Requests

---

**QARK v6 — Making Android Security Testing Accessible**
Made with ❤️ by **Daoud Abu Madi**

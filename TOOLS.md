# QARK v6 - Decompilation Tools Documentation

## Overview

QARK v6 uses multiple decompilation tools to convert Android APK files into readable Java source code for security analysis. These tools work in a fallback chain to ensure maximum compatibility.

## Included Tools

All decompilation tools are included in the repository at `backend/qark/lib/`. No additional downloads are required.

### 1. JADX (Primary Decompiler)

**Location:** `backend/qark/lib/jadx-1.5.0/`

**Description:** JADX is the primary decompilation tool used by QARK v6. It directly decompiles DEX bytecode to Java source code with high accuracy and readability.

**Features:**
- Direct DEX to Java decompilation
- Modern Java syntax support
- Excellent handling of complex code structures
- Fast processing speed

**Usage in QARK:**
- First choice for APK decompilation
- Handles most Android applications successfully
- Provides clean, readable code

**Command Example:**
```bash
jadx --no-res -d output_dir input.apk
```

**Binary Locations:**
- Linux/Mac: `lib/jadx-1.5.0/bin/jadx`
- Windows: `lib/jadx-1.5.0/bin/jadx.bat`

**Official Repository:** https://github.com/skylot/jadx

---

### 2. APKTool

**Location:** `backend/qark/lib/apktool/apktool.jar`

**Description:** APKTool is used to extract resources and the AndroidManifest.xml file from APK files. It provides access to app metadata and configuration.

**Features:**
- Extracts AndroidManifest.xml
- Decodes resources (layouts, strings, etc.)
- Preserves original structure
- Essential for manifest analysis

**Usage in QARK:**
- Always runs first to extract AndroidManifest.xml
- Provides resource files for analysis
- Enables permission and component scanning

**Command Example:**
```bash
java -jar apktool.jar d input.apk --no-src --force -o output_dir
```

**Official Repository:** https://ibotpeaches.github.io/Apktool/

---

### 3. Dex2jar

**Location:** `backend/qark/lib/dex2jar/`

**Description:** Dex2jar converts Android DEX files to JAR files, which can then be decompiled by Java decompilers. Used as a fallback when JADX fails.

**Features:**
- Converts DEX to JAR format
- Handles obfuscated code
- Works with multiple DEX files
- Compatible with standard Java decompilers

**Usage in QARK:**
- Fallback when JADX fails
- Converts DEX to JAR for CFR/Procyon
- Part of the fallback pipeline

**Command Example:**
```bash
sh d2j-dex2jar.sh -o output.jar input.apk
```

**Binary Locations:**
- Linux/Mac: `lib/dex2jar/d2j-dex2jar.sh`
- Windows: `lib/dex2jar/d2j-dex2jar.bat`

**Official Repository:** https://github.com/pxb1988/dex2jar

---

### 4. CFR (Class File Reader)

**Location:** `backend/qark/lib/cfr.jar`

**Description:** CFR is a Java decompiler that converts JAR files to Java source code. Used as the primary fallback decompiler after dex2jar conversion.

**Features:**
- Modern Java syntax support (including Java 14+)
- Excellent lambda expression handling
- High accuracy rate
- Clean output code

**Usage in QARK:**
- Second fallback option (after JADX fails)
- Decompiles JAR files created by dex2jar
- Provides alternative code view

**Command Example:**
```bash
java -jar cfr.jar input.jar --outputdir output_dir
```

**Official Website:** http://www.benf.org/other/cfr/

---

### 5. Procyon

**Location:** `backend/qark/lib/procyon.jar`

**Description:** Procyon is a Java decompiler suite that includes a Java decompiler. Used as the final fallback option when both JADX and CFR fail.

**Features:**
- Handles complex code structures
- Good with generics and lambdas
- Alternative decompilation approach
- Last-resort fallback

**Usage in QARK:**
- Final fallback option
- Used when both JADX and CFR fail
- Ensures maximum compatibility

**Command Example:**
```bash
java -jar procyon.jar -jar input.jar -o output_dir
```

**Official Repository:** https://github.com/mstrobel/procyon

---

## Decompilation Flow

QARK v6 uses a smart fallback system:

```
1. Run APKTool (always)
   └─> Extract AndroidManifest.xml and resources
   
2. Try JADX (primary)
   ├─> Success? Use JADX output
   └─> Failed? Continue to step 3
   
3. Fallback Pipeline:
   a. Extract APK contents (unzip)
   b. Find DEX files (classes.dex, classes2.dex, etc.)
   c. Convert DEX to JAR using dex2jar
   d. Try CFR decompiler
      ├─> Success? Use CFR output
      └─> Failed? Continue to step e
   e. Try Procyon decompiler
      ├─> Success? Use Procyon output
      └─> Failed? Report error
```

## Tool Versions

| Tool | Version | Location |
|------|---------|----------|
| JADX | 1.5.0 | `lib/jadx-1.5.0/` |
| APKTool | Latest | `lib/apktool/apktool.jar` |
| Dex2jar | 2.x | `lib/dex2jar/` |
| CFR | Latest | `lib/cfr.jar` |
| Procyon | Latest | `lib/procyon.jar` |

## Prerequisites

### Java Runtime

All decompilation tools require Java 8 or higher:

```bash
# Check Java version
java -version

# Should show: openjdk version "11.0.x" or higher
```

### File Permissions

On Linux/Mac, ensure executables have proper permissions:

```bash
# Make JADX executable
chmod +x backend/qark/lib/jadx-1.5.0/bin/jadx

# Make dex2jar scripts executable
chmod +x backend/qark/lib/dex2jar/*.sh
```

## Troubleshooting

### JADX Fails to Decompile

**Symptom:** Error messages like "JADX decompilation failed"

**Solution:**
- QARK automatically falls back to dex2jar + CFR/Procyon
- No user action needed
- Check logs for specific errors

### Java Heap Space Errors

**Symptom:** `OutOfMemoryError: Java heap space`

**Solution:**
```bash
# Increase Java heap size (Linux/Mac)
export JAVA_OPTS="-Xmx2048m"

# Or edit decompiler.py to add memory flags
```

### Permission Denied Errors

**Symptom:** `Permission denied` when executing tools

**Solution:**
```bash
# Make executables accessible (Linux/Mac)
chmod +x backend/qark/lib/jadx-1.5.0/bin/jadx
chmod +x backend/qark/lib/dex2jar/*.sh
```

### APKTool Fails

**Symptom:** Cannot extract AndroidManifest.xml

**Solution:**
- Ensure APK file is not corrupted
- Check Java version (need 8+)
- Try re-downloading APK

## Performance Considerations

### Tool Speed Comparison

| Tool | Speed | Accuracy | Readability |
|------|-------|----------|-------------|
| JADX | Fast | Excellent | Excellent |
| CFR | Medium | Very Good | Very Good |
| Procyon | Slow | Good | Good |

### Optimization Tips

1. **Use JADX when possible:** It's the fastest and most accurate
2. **Clean up old decompiled files:** Saves disk space
3. **Monitor memory usage:** Large APKs may need more RAM
4. **Use SSD storage:** Faster I/O for temporary files

## Advanced Configuration

### Custom Tool Paths

You can customize tool paths using environment variables:

```bash
# Set custom library path
export QARK_LIB_PATH=/path/to/custom/lib

# Or edit backend/qark/decompiler/decompiler.py
```

### Decompiler Selection

To force a specific decompiler, modify `decompiler.py`:

```python
# Skip JADX, go straight to dex2jar + CFR
def run(self):
    self.manifest_path = self.run_apktool()
    self.run_dex2jar_pipeline()  # Skip JADX
```

## Tool Updates

### Updating JADX

```bash
cd backend/qark/lib

# Download latest version
wget https://github.com/skylot/jadx/releases/download/vX.X.X/jadx-X.X.X.zip

# Extract
unzip jadx-X.X.X.zip -d jadx-X.X.X

# Update path in decompiler.py if needed
```

### Updating CFR

```bash
cd backend/qark/lib

# Download latest CFR
wget http://www.benf.org/other/cfr/cfr-X_XXX.jar -O cfr.jar
```

### Updating Procyon

```bash
cd backend/qark/lib

# Download latest Procyon
wget https://github.com/mstrobel/procyon/releases/download/vX.X.X/procyon-decompiler-X.X.X.jar -O procyon.jar
```

## Validation

### Test Tool Installation

```bash
# Test JADX
backend/qark/lib/jadx-1.5.0/bin/jadx --version

# Test APKTool
java -jar backend/qark/lib/apktool/apktool.jar --version

# Test Dex2jar
bash backend/qark/lib/dex2jar/d2j-dex2jar.sh --help

# Test CFR
java -jar backend/qark/lib/cfr.jar --version

# Test Procyon
java -jar backend/qark/lib/procyon.jar --version
```

### Verify Tool Paths

```bash
# Check all tools are present
ls -la backend/qark/lib/

# Should show:
# apktool/
# jadx-1.5.0/
# dex2jar/
# cfr.jar
# procyon.jar
```

## Best Practices

1. **Keep tools updated:** Newer versions handle more APKs
2. **Monitor logs:** Check which decompiler was used
3. **Clean temporary files:** Remove old decompiled directories
4. **Test with sample APKs:** Verify tools work before production use
5. **Document custom configurations:** If you modify tool paths

## Support and Resources

### Official Tool Documentation

- **JADX:** https://github.com/skylot/jadx
- **APKTool:** https://ibotpeaches.github.io/Apktool/
- **Dex2jar:** https://github.com/pxb1988/dex2jar
- **CFR:** http://www.benf.org/other/cfr/
- **Procyon:** https://github.com/mstrobel/procyon

### QARK Resources

- **Main Repository:** See README.md
- **Setup Guide:** See SETUP.md
- **User Guide:** See USER_GUIDE.md

---

**All tools are pre-configured and ready to use!**

No additional downloads or configuration required for standard usage.

---

Developed by: Jineen Abu Amr • Daoud Abu Madi • 3asem Alselwady • R7mah Alqur3an

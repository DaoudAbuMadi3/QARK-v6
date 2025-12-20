"""
QARK API Module - Handles APK scanning and vulnerability detection
"""
import os
import logging
import tempfile
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import uuid

from fastapi import UploadFile, HTTPException
from pydantic import BaseModel, Field

# Import QARK modules
from qark.decompiler.decompiler import Decompiler
from qark.scanner.scanner import Scanner
from qark.report import Report
from qark.issue import Issue

logger = logging.getLogger(__name__)

# Data Models
class ScanRequest(BaseModel):
    scan_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    input_type: str = Field(description="Type of input: 'apk' or 'java'")
    filename: str
    report_type: str = Field(default="json", description="Report type: html, xml, json, csv")
    timestamp: datetime = Field(default_factory=datetime.now)

class ScanStatus(BaseModel):
    scan_id: str
    status: str  # pending, decompiling, scanning, completed, failed
    progress: int  # 0-100
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)

class VulnerabilityItem(BaseModel):
    category: str
    severity: str
    name: str
    description: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    code_snippet: Optional[str] = None

class ScanResult(BaseModel):
    scan_id: str
    filename: str
    status: str
    total_vulnerabilities: int
    vulnerabilities_by_severity: Dict[str, int]
    vulnerabilities_by_category: Dict[str, int]
    vulnerabilities: List[VulnerabilityItem]
    report_paths: Dict[str, str]  # report_type -> file_path
    decompiled_path: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class QarkScanner:
    """
    QARK Scanner wrapper for web interface
    """
    
    def __init__(self, base_upload_dir: str = "/tmp/qark_uploads", base_output_dir: str = "/tmp/qark_output"):
        self.base_upload_dir = Path(base_upload_dir)
        self.base_output_dir = Path(base_output_dir)
        self.base_upload_dir.mkdir(parents=True, exist_ok=True)
        self.base_output_dir.mkdir(parents=True, exist_ok=True)
        
        # In-memory storage for scan results (in production, use database)
        self.scans: Dict[str, Dict[str, Any]] = {}
    
    async def save_uploaded_file(self, file: UploadFile, scan_id: str) -> Path:
        """Save uploaded file to disk"""
        scan_dir = self.base_upload_dir / scan_id
        scan_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = scan_dir / file.filename
        
        # Save file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        logger.info(f"Saved uploaded file to: {file_path}")
        return file_path
    
    def detect_input_type(self, filename: str) -> str:
        """Detect if input is APK or Java source"""
        ext = Path(filename).suffix.lower()
        if ext == ".apk":
            return "apk"
        elif ext in [".java", ".jar"]:
            return "java"
        else:
            raise ValueError(f"Unsupported file type: {ext}. Only APK or Java files are supported.")
    
    async def start_scan(self, file: UploadFile) -> ScanRequest:
        """Start a new scan job"""
        scan_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_path = await self.save_uploaded_file(file, scan_id)
        
        # Detect input type
        input_type = self.detect_input_type(file.filename)
        
        # Create scan request
        scan_request = ScanRequest(
            scan_id=scan_id,
            input_type=input_type,
            filename=file.filename
        )
        
        # Initialize scan status
        self.scans[scan_id] = {
            "request": scan_request.model_dump(),
            "status": ScanStatus(
                scan_id=scan_id,
                status="pending",
                progress=0,
                message="Scan initialized"
            ).model_dump(),
            "file_path": str(file_path),
            "result": None
        }
        
        return scan_request
    
    def update_scan_status(self, scan_id: str, status: str, progress: int, message: str):
        """Update scan status"""
        if scan_id not in self.scans:
            raise ValueError(f"Scan ID not found: {scan_id}")
        
        self.scans[scan_id]["status"] = ScanStatus(
            scan_id=scan_id,
            status=status,
            progress=progress,
            message=message
        ).model_dump()
        
        logger.info(f"Scan {scan_id}: {status} - {progress}% - {message}")
    
    def issue_to_vulnerability(self, issue: Issue) -> VulnerabilityItem:
        """Convert QARK Issue to VulnerabilityItem"""
        # Extract line number - handle Position object from QARK
        line_num = None
        if hasattr(issue, 'line_number'):
            line_obj = issue.line_number
            # Check if it's a Position object with 'line' attribute
            if hasattr(line_obj, 'line'):
                line_num = line_obj.line
            # Otherwise try to convert to int directly
            elif isinstance(line_obj, int):
                line_num = line_obj
            # Try to cast as int
            else:
                try:
                    line_num = int(line_obj)
                except (ValueError, TypeError):
                    line_num = None
        
        return VulnerabilityItem(
            category=issue.category if hasattr(issue, 'category') else 'Unknown',
            severity=issue.severity.name if hasattr(issue, 'severity') else 'INFO',
            name=issue.name if hasattr(issue, 'name') else 'Unknown Issue',
            description=issue.description if hasattr(issue, 'description') else '',
            file_path=str(issue.file_object) if hasattr(issue, 'file_object') and issue.file_object else None,
            line_number=line_num,
            code_snippet=None  # Can be enhanced later
        )
    
    async def run_scan(self, scan_id: str) -> ScanResult:
        """Run the actual QARK scan"""
        if scan_id not in self.scans:
            raise ValueError(f"Scan ID not found: {scan_id}")
        
        scan_data = self.scans[scan_id]
        file_path = scan_data["file_path"]
        filename = scan_data["request"]["filename"]
        
        try:
            # Update status: Starting decompilation
            self.update_scan_status(scan_id, "decompiling", 10, "Starting decompilation...")
            
            # Create build directory
            build_dir = self.base_output_dir / scan_id / "build"
            build_dir.mkdir(parents=True, exist_ok=True)
            
            # Decompile
            logger.info(f"Decompiling {file_path} to {build_dir}")
            decompiler = Decompiler(path_to_source=file_path, build_directory=str(build_dir))
            decompiler.run()
            
            self.update_scan_status(scan_id, "decompiling", 30, "Decompilation completed")
            
            # Update status: Starting scan
            self.update_scan_status(scan_id, "scanning", 40, "Starting vulnerability scan...")
            
            # Determine source path
            path_to_source = (
                decompiler.path_to_source
                if decompiler.source_code else
                decompiler.decompiled_java_path
            )
            
            # Run scanner
            logger.info(f"Scanning {path_to_source}")
            scanner = Scanner(
                manifest_path=decompiler.manifest_path,
                path_to_source=path_to_source
            )
            scanner.run()
            
            self.update_scan_status(scan_id, "scanning", 70, f"Found {len(scanner.issues)} issues")
            
            # Generate report
            self.update_scan_status(scan_id, "reporting", 80, "Generating reports...")
            
            report_dir = self.base_output_dir / scan_id / "reports"
            report_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate JSON report (always)
            report = Report(issues=set(scanner.issues), report_path=str(report_dir))
            json_report_path = report.generate(file_type="json")
            
            # Generate HTML report
            html_report_path = report.generate(file_type="html")
            
            # Convert issues to vulnerabilities
            vulnerabilities = [self.issue_to_vulnerability(issue) for issue in scanner.issues]
            
            # Calculate statistics
            vuln_by_severity = {}
            vuln_by_category = {}
            
            for vuln in vulnerabilities:
                # Count by severity
                vuln_by_severity[vuln.severity] = vuln_by_severity.get(vuln.severity, 0) + 1
                # Count by category
                vuln_by_category[vuln.category] = vuln_by_category.get(vuln.category, 0) + 1
            
            # Create scan result
            scan_result = ScanResult(
                scan_id=scan_id,
                filename=filename,
                status="completed",
                total_vulnerabilities=len(vulnerabilities),
                vulnerabilities_by_severity=vuln_by_severity,
                vulnerabilities_by_category=vuln_by_category,
                vulnerabilities=vulnerabilities,
                report_paths={
                    "json": json_report_path,
                    "html": html_report_path
                },
                decompiled_path=str(decompiler.decompiled_java_path) if decompiler.decompiled_java_path else None
            )
            
            # Save result
            self.scans[scan_id]["result"] = scan_result.model_dump()
            
            # Update final status
            self.update_scan_status(scan_id, "completed", 100, f"Scan completed. Found {len(vulnerabilities)} vulnerabilities")
            
            return scan_result
            
        except Exception as e:
            logger.error(f"Scan failed for {scan_id}: {str(e)}", exc_info=True)
            self.update_scan_status(scan_id, "failed", 0, f"Scan failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
    
    def get_scan_status(self, scan_id: str) -> ScanStatus:
        """Get current scan status"""
        if scan_id not in self.scans:
            raise ValueError(f"Scan ID not found: {scan_id}")
        
        status_data = self.scans[scan_id]["status"]
        return ScanStatus(**status_data)
    
    def get_scan_result(self, scan_id: str) -> Optional[ScanResult]:
        """Get scan result if available"""
        if scan_id not in self.scans:
            raise ValueError(f"Scan ID not found: {scan_id}")
        
        result_data = self.scans[scan_id].get("result")
        if result_data:
            return ScanResult(**result_data)
        return None
    
    def list_scans(self) -> List[Dict[str, Any]]:
        """List all scans"""
        scans_list = []
        for scan_id, scan_data in self.scans.items():
            scans_list.append({
                "scan_id": scan_id,
                "filename": scan_data["request"]["filename"],
                "status": scan_data["status"]["status"],
                "progress": scan_data["status"]["progress"],
                "timestamp": scan_data["request"]["timestamp"]
            })
        return scans_list
    
    def delete_scan(self, scan_id: str):
        """Delete a scan and its files"""
        if scan_id not in self.scans:
            raise ValueError(f"Scan ID not found: {scan_id}")
        
        # Delete files
        scan_upload_dir = self.base_upload_dir / scan_id
        scan_output_dir = self.base_output_dir / scan_id
        
        if scan_upload_dir.exists():
            shutil.rmtree(scan_upload_dir)
        
        if scan_output_dir.exists():
            shutil.rmtree(scan_output_dir)
        
        # Remove from memory
        del self.scans[scan_id]
        
        logger.info(f"Deleted scan: {scan_id}")


# Global scanner instance
qark_scanner = QarkScanner()

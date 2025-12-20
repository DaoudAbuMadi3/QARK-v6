from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio

# Import QARK API
from qark_api import qark_scanner, ScanRequest, ScanStatus, ScanResult


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ==================== QARK API Endpoints ====================

@api_router.post("/qark/scan", response_model=ScanRequest)
async def upload_and_scan(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Upload APK/Java file and start vulnerability scan
    """
    # Validate file type
    if not file.filename.endswith(('.apk', '.java', '.jar')):
        raise HTTPException(status_code=400, detail="Only APK, Java, or JAR files are supported")
    
    # Start scan (save file and create scan job)
    scan_request = await qark_scanner.start_scan(file)
    
    # Run scan in background
    background_tasks.add_task(qark_scanner.run_scan, scan_request.scan_id)
    
    return scan_request


@api_router.get("/qark/scan/{scan_id}/status", response_model=ScanStatus)
async def get_scan_status(scan_id: str):
    """
    Get current status of a scan
    """
    try:
        return qark_scanner.get_scan_status(scan_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@api_router.get("/qark/scan/{scan_id}/result", response_model=ScanResult)
async def get_scan_result(scan_id: str):
    """
    Get scan results (only available after scan completes)
    """
    try:
        result = qark_scanner.get_scan_result(scan_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Scan result not available yet")
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@api_router.get("/qark/scans")
async def list_scans():
    """
    List all scans
    """
    return qark_scanner.list_scans()


@api_router.delete("/qark/scan/{scan_id}")
async def delete_scan(scan_id: str):
    """
    Delete a scan and its files
    """
    try:
        qark_scanner.delete_scan(scan_id)
        return {"message": "Scan deleted successfully", "scan_id": scan_id}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@api_router.get("/qark/scan/{scan_id}/report/{report_type}")
async def download_report(scan_id: str, report_type: str):
    """
    Download report file (html, json, xml, csv)
    """
    try:
        result = qark_scanner.get_scan_result(scan_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Scan result not available yet")
        
        if report_type not in result.report_paths:
            raise HTTPException(status_code=404, detail=f"Report type '{report_type}' not available")
        
        report_path = result.report_paths[report_type]
        
        if not os.path.exists(report_path):
            raise HTTPException(status_code=404, detail="Report file not found")
        
        # Determine media type
        media_types = {
            "html": "text/html",
            "json": "application/json",
            "xml": "application/xml",
            "csv": "text/csv"
        }
        
        return FileResponse(
            report_path,
            media_type=media_types.get(report_type, "application/octet-stream"),
            filename=f"qark_report_{scan_id}.{report_type}"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
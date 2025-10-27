from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
import os

from app.core.config import get_settings
from app.models.database import init_db
from app.api.routes import router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for water management system on Solana blockchain"
)

# CORS middleware for frontend integration
# DEV: allow_origins=["*"]
# PROD: allow_origins from environment variable or specific domains
allowed_origins = os.getenv("CORS_ORIGINS", "*").split(",") if os.getenv("CORS_ORIGINS") != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api", tags=["api"])

# Mount static files for token assets
static_path = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path), name="static")


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    logger.info("Starting SuCount Water Management API")
    logger.info(f"Solana Network: {settings.solana_network}")
    init_db()
    logger.info("Database initialized")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SuCount Water Management API",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

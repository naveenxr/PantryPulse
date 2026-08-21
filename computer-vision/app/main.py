import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.detection import router as detection_router
from app.config.settings import settings
from app.models.model_loader import get_model

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("cv_service")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(detection_router)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} (v{settings.VERSION})...")
    try:
        get_model()
    except Exception as e:
        logger.warning(f"Model pre-warm note: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.detection_schema import HealthResponse, DetectionResponse
from app.services.detection_service import process_image_detection

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy", service="computer-vision")

@router.post("/api/v1/detect", response_model=DetectionResponse)
async def detect_food(image: UploadFile = File(...)):
    # Validate content type
    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided is not a valid image format."
        )

    try:
        content = await image.read()
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded image file is empty."
            )
        
        # Max file size 10MB check
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file size exceeds 10MB limit."
            )

        return process_image_detection(content)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process food detection request."
        )

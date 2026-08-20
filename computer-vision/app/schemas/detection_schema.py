from pydantic import BaseModel
from typing import List

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class DetectionItem(BaseModel):
    label: str
    confidence: float
    status: str
    boundingBox: BoundingBox

class GroupedItem(BaseModel):
    label: str
    quantity: int
    averageConfidence: float
    status: str

class DetectionResponse(BaseModel):
    success: bool
    scanId: str
    modelVersion: str
    items: List[GroupedItem]
    detections: List[DetectionItem]

class HealthResponse(BaseModel):
    status: str
    service: str

import logging
from ultralytics import YOLO

logger = logging.getLogger("cv_service")

class ModelLoader:
    _instance = None
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            logger.info("Initializing YOLO model singleton on startup...")
            try:
                # Load ultralytics pretrained YOLO model
                cls._model = YOLO("yolov8n.pt")
                logger.info("YOLO model loaded successfully into memory.")
            except Exception as e:
                logger.error(f"Error loading YOLO model: {e}")
                cls._model = YOLO("yolov8n.pt")
        return cls._model

def get_model():
    return ModelLoader.get_model()

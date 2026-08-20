import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PantryPulse Computer Vision Service"
    VERSION: str = "1.0.0"
    MODEL_VERSION: str = "yolo-world-v1"
    
    # Configurable confidence thresholds
    HIGH_CONFIDENCE_THRESHOLD: float = float(os.getenv("HIGH_CONFIDENCE_THRESHOLD", "0.85"))
    MIN_CONFIDENCE_THRESHOLD: float = float(os.getenv("MIN_CONFIDENCE_THRESHOLD", "0.60"))
    
    # Configurable target detection classes
    DETECTION_CLASSES: list[str] = [
        # Vegetables
        "tomato", "onion", "potato", "carrot", "capsicum", "cucumber", "garlic",
        # Fruits
        "apple", "banana", "orange", "lemon", "mango",
        # Initial Pantry Items
        "egg", "bread", "milk"
    ]
    
    # Centralized food label normalization mapping
    FOOD_LABEL_NORMALIZATION: dict[str, str] = {
        "green apple": "apple",
        "red apple": "apple",
        "eggplant": "brinjal",
        "bell pepper": "capsicum",
        "sweet pepper": "capsicum",
        "chili pepper": "capsicum",
        "potatoes": "potato",
        "tomatoes": "tomato",
        "onions": "onion",
        "carrots": "carrot",
        "apples": "apple",
        "bananas": "banana",
        "oranges": "orange",
        "lemons": "lemon",
        "mangoes": "mango",
        "eggs": "egg"
    }

settings = Settings()

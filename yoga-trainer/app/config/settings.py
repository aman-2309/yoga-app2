from pathlib import Path


class Settings:
    """Application settings and configuration"""
    
    # Application
    app_name: str = "Yoga Pose Accuracy API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # API
    api_v1_prefix: str = "/api/v1"
    
    # CORS - Allow all localhost ports for development
    cors_origins: list = ["*"]  # Allow all origins in development
    
    # Paths
    base_dir: Path = Path(__file__).resolve().parent.parent.parent
    data_dir: Path = base_dir / "data"
    reference_poses_dir: Path = data_dir / "reference_poses"
    reference_images_dir: Path = reference_poses_dir / "images"
    reference_keypoints_dir: Path = reference_poses_dir / "keypoints"
    uploads_dir: Path = data_dir / "uploads"
    
    # MediaPipe Configuration
    mediapipe_model_complexity: int = 1  # 0, 1, or 2 (higher = more accurate, slower)
    mediapipe_min_detection_confidence: float = 0.5
    mediapipe_min_tracking_confidence: float = 0.5
    
    # Accuracy Calculation
    angle_weight: float = 0.6
    distance_weight: float = 0.4
    angle_penalty_factor: float = 0.5  # Penalty per degree difference


settings = Settings()

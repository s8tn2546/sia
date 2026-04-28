import logging
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env", override=True)

logger = logging.getLogger(__name__)


class Settings:
    env: str = os.getenv("ENV", "development")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    llm_provider: str = os.getenv("LLM_PROVIDER", "openai")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    google_maps_api_key: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    openweather_api_key: str = os.getenv("OPENWEATHER_API_KEY", "")

    demand_model_path: str = os.getenv("DEMAND_MODEL_PATH", "ml/demand/model.pkl")
    delay_model_path: str = os.getenv("DELAY_MODEL_PATH", "ml/delay/model.pkl")


settings = Settings()

# Validate and log configuration on startup
if settings.env == "production":
    if not settings.openai_api_key and not settings.gemini_api_key:
        logger.warning("Missing LLM API key (OPENAI_API_KEY or GEMINI_API_KEY). LLM features disabled.")
    if not settings.google_maps_api_key:
        logger.warning("GOOGLE_MAPS_API_KEY not set. Using fallback routes.")
    if not settings.openweather_api_key:
        logger.warning("OPENWEATHER_API_KEY not set. Using fallback weather data.")

logger.info(f"Environment: {settings.env}, Host: {settings.host}, Port: {settings.port}")

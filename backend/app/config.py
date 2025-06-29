import os
from pydantic import BaseSettings
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

def get_database_url():
    """Construct MySQL DATABASE_URL from environment variables"""
    server = os.getenv("SERVER_NAME")
    port = os.getenv("DB_PORT", "3306")
    database = os.getenv("DATABASE_NAME")
    username = os.getenv("USER_NAME")
    password = os.getenv("PASSWORD")
    
    if all([server, database, username, password]):
        return f"mysql+pymysql://{username}:{password}@{server}:{port}/{database}?charset=utf8mb4"
    else:
        # Fallback to SQLite for development if MySQL credentials are not available
        return os.getenv("DATABASE_URL", "sqlite:///./smartkoop.db")

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "SmartKoop System"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database settings
    DATABASE_URL: str = get_database_url()
    
    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt-please-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    #BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000", "https://api.smartkoop.com", "https://smartkoop.com"]
    
    # File storage
    UPLOAD_DIRECTORY: str = os.getenv("UPLOAD_DIRECTORY", "./uploads")
    
    # Currency settings
    DEFAULT_CURRENCY: str = "IDR"
    CURRENCY_SYMBOL: str = "Rp"
    CURRENCY_LOCALE: str = "id-ID"
    USE_DECIMALS: bool = False
    USD_TO_IDR_RATE: float = 15500.0
    
    class Config:
        case_sensitive = True

settings = Settings()

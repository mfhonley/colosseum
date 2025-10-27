from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""

    # API Settings
    app_name: str = "SuCount Water Management API"
    app_version: str = "0.1.0"
    debug: bool = True

    # Database
    database_url: str = "sqlite:///./water_management.db"

    # Solana Settings
    solana_network: str = "devnet"
    solana_rpc_url: str = "https://api.devnet.solana.com"

    # Water Management Settings
    default_water_limit_liters: int = 100000  # Default monthly limit
    water_credit_rate: float = 1.0  # 1 liter = 1 token

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

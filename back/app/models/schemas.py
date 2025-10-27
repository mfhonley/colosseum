from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class WaterUsageData(BaseModel):
    """Water usage data from oracle"""
    farm_id: int = Field(..., description="Farm identifier (1-10)")
    timestamp: datetime = Field(default_factory=datetime.now)
    water_liters: float = Field(..., gt=0, description="Water consumption in liters")
    rainfall_mm: Optional[float] = Field(None, ge=0, description="Rainfall in millimeters")
    temperature_c: Optional[float] = Field(None, description="Temperature in Celsius")
    humidity_percent: Optional[float] = Field(None, ge=0, le=100, description="Humidity percentage")

    class Config:
        json_schema_extra = {
            "example": {
                "farm_id": 1,
                "timestamp": "2025-10-27T12:00:00",
                "water_liters": 150.5,
                "rainfall_mm": 5.2,
                "temperature_c": 25.3,
                "humidity_percent": 65.0
            }
        }


class WaterUsageResponse(BaseModel):
    """Response after recording water usage"""
    success: bool
    message: str
    farm_id: int
    water_liters: float
    tokens_consumed: float
    solana_tx_id: Optional[str] = None
    timestamp: datetime


class FarmStatistics(BaseModel):
    """Statistics for a single farm"""
    farm_id: int
    total_water_used: float
    water_limit: float
    tokens_consumed: float
    status: str  # "economy" or "overspend"
    percentage_used: float


class DashboardResponse(BaseModel):
    """Dashboard data response"""
    farms: List[FarmStatistics]
    total_water_used: float
    total_limit: float
    overall_status: str
    last_updated: datetime
    water_usage_history: List[dict]  # Last 30 days


class NFTMintResponse(BaseModel):
    """Mock NFT mint response"""
    nft_address: str
    metadata: dict
    mint_tx_id: str
    message: str = "NFT minted successfully (MOCK)"


class TokenBalance(BaseModel):
    """Water credits token balance"""
    farm_id: int
    balance: float
    total_consumed: float
    total_minted: float

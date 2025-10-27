from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict
import logging
from app.models.database import WaterUsageRecord, FarmProfile
from app.models.schemas import WaterUsageData, FarmStatistics
from app.services.solana_service import solana_service
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class WaterManagementService:
    """Service for water management business logic"""

    @staticmethod
    def calculate_tokens(water_liters: float) -> float:
        """Calculate tokens consumed based on water usage"""
        return water_liters * settings.water_credit_rate

    @staticmethod
    async def record_usage(
        db: Session,
        usage_data: WaterUsageData
    ) -> Dict:
        """Record water usage and update farm profile"""
        try:
            # Calculate tokens consumed
            tokens = WaterManagementService.calculate_tokens(usage_data.water_liters)

            # Get or create farm profile
            farm = db.query(FarmProfile).filter(
                FarmProfile.farm_id == usage_data.farm_id
            ).first()

            if not farm:
                farm = FarmProfile(
                    farm_id=usage_data.farm_id,
                    water_limit=settings.default_water_limit_liters
                )
                db.add(farm)

            # Update farm totals
            farm.total_water_used += usage_data.water_liters
            farm.total_tokens_consumed += tokens
            farm.last_updated = datetime.now()

            # Determine status
            percentage = (farm.total_water_used / farm.water_limit) * 100
            farm.status = "economy" if percentage <= 100 else "overspend"

            # Record transaction on Solana
            tx_id = await solana_service.record_water_usage(
                farm_id=usage_data.farm_id,
                water_liters=usage_data.water_liters,
                tokens_consumed=tokens
            )

            # Save water usage record
            record = WaterUsageRecord(
                farm_id=usage_data.farm_id,
                timestamp=usage_data.timestamp,
                water_liters=usage_data.water_liters,
                rainfall_mm=usage_data.rainfall_mm,
                temperature_c=usage_data.temperature_c,
                humidity_percent=usage_data.humidity_percent,
                tokens_consumed=tokens,
                solana_tx_id=tx_id
            )
            db.add(record)
            db.commit()
            db.refresh(record)

            logger.info(f"Recorded usage for farm {usage_data.farm_id}: {usage_data.water_liters}L")

            return {
                "success": True,
                "message": "Water usage recorded successfully",
                "farm_id": usage_data.farm_id,
                "water_liters": usage_data.water_liters,
                "tokens_consumed": tokens,
                "solana_tx_id": tx_id,
                "timestamp": usage_data.timestamp
            }

        except Exception as e:
            db.rollback()
            logger.error(f"Error recording usage: {e}")
            raise

    @staticmethod
    def get_farm_statistics(db: Session, farm_id: int) -> FarmStatistics:
        """Get statistics for a specific farm"""
        farm = db.query(FarmProfile).filter(FarmProfile.farm_id == farm_id).first()

        if not farm:
            return FarmStatistics(
                farm_id=farm_id,
                total_water_used=0.0,
                water_limit=settings.default_water_limit_liters,
                tokens_consumed=0.0,
                status="economy",
                percentage_used=0.0
            )

        percentage = (farm.total_water_used / farm.water_limit) * 100

        return FarmStatistics(
            farm_id=farm.farm_id,
            total_water_used=farm.total_water_used,
            water_limit=farm.water_limit,
            tokens_consumed=farm.total_tokens_consumed,
            status=farm.status,
            percentage_used=round(percentage, 2)
        )

    @staticmethod
    def get_all_statistics(db: Session) -> List[FarmStatistics]:
        """Get statistics for all farms"""
        farms = db.query(FarmProfile).all()
        return [
            WaterManagementService.get_farm_statistics(db, farm.farm_id)
            for farm in farms
        ]

    @staticmethod
    def get_usage_history(db: Session, days: int = 30) -> List[Dict]:
        """Get water usage history for the last N days"""
        start_date = datetime.now() - timedelta(days=days)

        records = db.query(WaterUsageRecord).filter(
            WaterUsageRecord.timestamp >= start_date
        ).order_by(WaterUsageRecord.timestamp.desc()).all()

        return [
            {
                "farm_id": record.farm_id,
                "timestamp": record.timestamp.isoformat(),
                "water_liters": record.water_liters,
                "tokens_consumed": record.tokens_consumed,
                "rainfall_mm": record.rainfall_mm,
                "temperature_c": record.temperature_c,
                "humidity_percent": record.humidity_percent
            }
            for record in records
        ]

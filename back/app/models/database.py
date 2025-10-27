from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from app.core.config import get_settings

settings = get_settings()

# Create database engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class WaterUsageRecord(Base):
    """Database model for water usage records"""
    __tablename__ = "water_usage_records"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.now, nullable=False)
    water_liters = Column(Float, nullable=False)
    rainfall_mm = Column(Float, nullable=True)
    temperature_c = Column(Float, nullable=True)
    humidity_percent = Column(Float, nullable=True)
    tokens_consumed = Column(Float, nullable=False)
    solana_tx_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)


class FarmProfile(Base):
    """Database model for farm profiles"""
    __tablename__ = "farm_profiles"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, unique=True, nullable=False, index=True)
    water_limit = Column(Float, default=100000.0)  # Monthly limit in liters
    total_water_used = Column(Float, default=0.0)
    total_tokens_consumed = Column(Float, default=0.0)
    status = Column(String, default="economy")  # economy or overspend
    last_updated = Column(DateTime, default=datetime.now)


class NFTCertificate(Base):
    """Database model for minted NFT certificates"""
    __tablename__ = "nft_certificates"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, nullable=False, index=True)
    mint_address = Column(String, unique=True, nullable=False, index=True)
    token_account = Column(String, nullable=False)
    transaction_signature = Column(String, nullable=False)
    water_consumed = Column(Float, nullable=False)
    efficiency_score = Column(Float, nullable=False)
    metadata_json = Column(Text, nullable=False)  # JSON string
    image_path = Column(String, nullable=False)
    minted_at = Column(DateTime, default=datetime.now, nullable=False)
    network = Column(String, default="devnet")


def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

    # Create default farm profiles
    db = SessionLocal()
    try:
        for farm_id in range(1, 11):  # 10 farms
            existing = db.query(FarmProfile).filter(FarmProfile.farm_id == farm_id).first()
            if not existing:
                farm = FarmProfile(
                    farm_id=farm_id,
                    water_limit=100000.0,
                    total_water_used=0.0,
                    total_tokens_consumed=0.0,
                    status="economy"
                )
                db.add(farm)
        db.commit()
    finally:
        db.close()

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

from app.models.database import get_db, FarmProfile, NFTCertificate
from app.models.schemas import (
    WaterUsageData,
    WaterUsageResponse,
    DashboardResponse,
    FarmStatistics,
    NFTMintResponse,
    TokenBalance
)
from app.services.water_service import WaterManagementService
from app.services.solana_service import solana_service
from app.services.real_nft_service import production_nft_service
from app.services.watercredits_service import watercredits_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/water-usage", response_model=WaterUsageResponse)
async def record_water_usage(
    usage_data: WaterUsageData,
    db: Session = Depends(get_db)
):
    """
    Record water usage from ML oracle

    This endpoint receives water consumption data from the oracle,
    calculates tokens consumed, and records the transaction on Solana devnet.
    """
    try:
        result = await WaterManagementService.record_usage(db, usage_data)
        return WaterUsageResponse(**result)
    except Exception as e:
        logger.error(f"Error in record_water_usage: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record water usage: {str(e)}"
        )


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(db: Session = Depends(get_db)):
    """
    Get dashboard data for frontend

    Returns aggregated water usage data, farm statistics,
    and 30-day usage history for visualization.
    """
    try:
        # Get all farm statistics
        farms = WaterManagementService.get_all_statistics(db)

        # Calculate totals
        total_water_used = sum(farm.total_water_used for farm in farms)
        total_limit = sum(farm.water_limit for farm in farms)

        # Determine overall status
        overall_percentage = (total_water_used / total_limit * 100) if total_limit > 0 else 0
        overall_status = "economy" if overall_percentage <= 100 else "overspend"

        # Get usage history
        history = WaterManagementService.get_usage_history(db, days=30)

        return DashboardResponse(
            farms=farms,
            total_water_used=total_water_used,
            total_limit=total_limit,
            overall_status=overall_status,
            last_updated=datetime.now(),
            water_usage_history=history
        )
    except Exception as e:
        logger.error(f"Error in get_dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard data: {str(e)}"
        )


@router.get("/farms/{farm_id}/statistics", response_model=FarmStatistics)
async def get_farm_statistics(farm_id: int, db: Session = Depends(get_db)):
    """Get statistics for a specific farm"""
    if farm_id < 1 or farm_id > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farm ID must be between 1 and 10"
        )

    try:
        stats = WaterManagementService.get_farm_statistics(db, farm_id)
        return stats
    except Exception as e:
        logger.error(f"Error getting farm statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get farm statistics: {str(e)}"
        )


@router.post("/nft/mint", response_model=NFTMintResponse)
async def mint_nft_certificate(
    farm_id: int,
    water_consumed: float,
    efficiency_score: float = 0.95,
    db: Session = Depends(get_db)
):
    """
    Mint REAL NFT certificate on Solana Devnet

    Creates a real SPL Token NFT with:
    - Supply = 1 (non-fungible)
    - Decimals = 0 (indivisible)
    - Generated certificate image
    - On-chain transaction
    - Stored in database
    """
    try:
        metadata = {
            "farm_id": farm_id,
            "water_consumed_liters": water_consumed,
            "efficiency_score": efficiency_score,
            "timestamp": datetime.now().isoformat(),
            "certificate_type": "water_efficiency"
        }

        # Mint real NFT on Solana
        result = await production_nft_service.mint_nft_certificate(
            farm_id=farm_id,
            water_consumed=water_consumed,
            efficiency_score=efficiency_score,
            metadata=metadata
        )

        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to mint NFT")
            )

        # Save to database
        import json
        nft_record = NFTCertificate(
            farm_id=farm_id,
            mint_address=result["nft_address"],
            token_account=result["token_account"],
            transaction_signature=result["mint_tx_id"],
            water_consumed=water_consumed,
            efficiency_score=efficiency_score,
            metadata_json=json.dumps(result["metadata"]),
            image_path=result["image_path"],
            network=result["network"]
        )
        db.add(nft_record)
        db.commit()
        db.refresh(nft_record)

        logger.info(f"✅ NFT saved to database: {result['nft_address']}")

        return NFTMintResponse(
            nft_address=result["nft_address"],
            metadata=result["metadata"],
            mint_tx_id=result["mint_tx_id"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error minting NFT: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mint NFT: {str(e)}"
        )


@router.get("/farms/{farm_id}/nfts")
async def get_farm_nfts(farm_id: int, db: Session = Depends(get_db)):
    """Get all NFT certificates for a farm"""
    if farm_id < 1 or farm_id > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farm ID must be between 1 and 10"
        )

    try:
        nfts = db.query(NFTCertificate).filter(
            NFTCertificate.farm_id == farm_id
        ).order_by(NFTCertificate.minted_at.desc()).all()

        import json
        return [
            {
                "nft_address": nft.mint_address,
                "token_account": nft.token_account,
                "mint_tx_id": nft.transaction_signature,
                "metadata": json.loads(nft.metadata_json),
                "image_path": nft.image_path,
                "minted_at": nft.minted_at.isoformat(),
                "explorer_url": f"https://explorer.solana.com/address/{nft.mint_address}?cluster={nft.network}"
            }
            for nft in nfts
        ]
    except Exception as e:
        logger.error(f"Error getting NFTs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get NFTs: {str(e)}"
        )


@router.get("/farms/{farm_id}/balance", response_model=TokenBalance)
async def get_token_balance(farm_id: int, db: Session = Depends(get_db)):
    """Get water credits token balance for a farm"""
    if farm_id < 1 or farm_id > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farm ID must be between 1 and 10"
        )

    try:
        farm = db.query(FarmProfile).filter(FarmProfile.farm_id == farm_id).first()

        if not farm:
            return TokenBalance(
                farm_id=farm_id,
                balance=0.0,
                total_consumed=0.0,
                total_minted=0.0
            )

        # Mock calculation: balance = limit - consumed
        balance = max(0, farm.water_limit - farm.total_water_used)

        return TokenBalance(
            farm_id=farm.farm_id,
            balance=balance,
            total_consumed=farm.total_tokens_consumed,
            total_minted=farm.water_limit
        )
    except Exception as e:
        logger.error(f"Error getting token balance: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get token balance: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "solana_network": "devnet"
    }


# ============================================================================
# WaterCredits Token Management Endpoints
# ============================================================================

@router.post("/watercredits/create-token")
async def create_watercredits_token():
    """
    Create WaterCredits SPL Token (run once)

    This creates a real SPL Token on Solana for WaterCredits.
    Should be called once during initial setup.
    """
    try:
        result = await watercredits_service.create_watercredits_token()

        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to create token")
            )

        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating WaterCredits token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create token: {str(e)}"
        )


@router.post("/watercredits/mint-quota")
async def mint_quota_to_farmer(farm_id: int, amount: float = 100000.0):
    """
    Mint WaterCredits quota to farmer

    Args:
        farm_id: Farm ID (1-10)
        amount: Amount in WC (default 100,000)
    """
    if farm_id < 1 or farm_id > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farm ID must be between 1 and 10"
        )

    try:
        result = await watercredits_service.mint_quota_to_farmer(farm_id, amount)

        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to mint quota")
            )

        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error minting quota: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mint quota: {str(e)}"
        )


@router.post("/watercredits/burn")
async def burn_watercredits(farm_id: int, water_liters: float):
    """
    Burn WaterCredits when water is used

    Args:
        farm_id: Farm ID
        water_liters: Amount of water used (in liters)
    """
    if farm_id < 1 or farm_id > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farm ID must be between 1 and 10"
        )

    try:
        result = await watercredits_service.burn_on_water_usage(farm_id, water_liters)

        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to burn tokens")
            )

        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error burning tokens: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to burn tokens: {str(e)}"
        )


@router.get("/watercredits/balance/{farm_id}")
async def get_watercredits_balance(farm_id: int):
    """
    Get real on-chain WaterCredits balance

    Args:
        farm_id: Farm ID (1-10)
    """
    if farm_id < 1 or farm_id > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farm ID must be between 1 and 10"
        )

    try:
        result = await watercredits_service.get_balance(farm_id)
        return result
    except Exception as e:
        logger.error(f"Error getting balance: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get balance: {str(e)}"
        )

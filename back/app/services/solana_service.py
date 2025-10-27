from solana.rpc.api import Client
from solders.keypair import Keypair
from solders.system_program import TransferParams, transfer
from solders.transaction import Transaction
from typing import Optional
import logging
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class SolanaService:
    """Service for interacting with Solana blockchain"""

    def __init__(self):
        self.client = Client(settings.solana_rpc_url)
        # For MVP, we'll use a generated keypair. In production, load from secure storage
        self.keypair = Keypair()
        logger.info(f"Solana service initialized on {settings.solana_network}")
        logger.info(f"Public key: {self.keypair.pubkey()}")

    async def record_water_usage(
        self,
        farm_id: int,
        water_liters: float,
        tokens_consumed: float
    ) -> Optional[str]:
        """
        Record water usage on Solana devnet

        In MVP, this logs the transaction. In production, this would:
        - Call smart contract to mint/burn water credits
        - Record usage data on-chain
        """
        try:
            # For MVP: Just log transaction details
            tx_signature = f"mock_tx_{farm_id}_{int(water_liters)}_{int(tokens_consumed)}"

            logger.info(f"[SOLANA] Recording water usage:")
            logger.info(f"  Farm ID: {farm_id}")
            logger.info(f"  Water: {water_liters} liters")
            logger.info(f"  Tokens consumed: {tokens_consumed}")
            logger.info(f"  TX Signature (mock): {tx_signature}")

            # TODO: Implement actual smart contract call
            # tx = self._create_record_usage_transaction(farm_id, water_liters, tokens_consumed)
            # response = self.client.send_transaction(tx, self.keypair)
            # return str(response.value)

            return tx_signature

        except Exception as e:
            logger.error(f"Error recording on Solana: {e}")
            return None

    async def mint_nft_certificate(
        self,
        farm_id: int,
        water_consumed: float,
        efficiency_score: float,
        metadata: dict
    ) -> dict:
        """
        Mock NFT minting for water consumption certificate

        In production, this would use Metaplex or similar to mint actual NFTs
        """
        try:
            mock_nft_address = f"NFT{farm_id}x{int(water_consumed)}"
            mock_tx_id = f"nft_mint_tx_{farm_id}_{int(water_consumed)}"

            logger.info(f"[SOLANA] Minting NFT certificate:")
            logger.info(f"  NFT Address (mock): {mock_nft_address}")
            logger.info(f"  Metadata: {metadata}")

            return {
                "nft_address": mock_nft_address,
                "mint_tx_id": mock_tx_id,
                "metadata": metadata,
                "success": True
            }

        except Exception as e:
            logger.error(f"Error minting NFT: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def get_wallet_balance(self) -> float:
        """Get wallet balance in SOL"""
        try:
            balance = self.client.get_balance(self.keypair.pubkey())
            return balance.value / 1e9  # Convert lamports to SOL
        except Exception as e:
            logger.error(f"Error getting balance: {e}")
            return 0.0


# Singleton instance
solana_service = SolanaService()

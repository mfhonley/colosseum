"""
WaterCredits SPL Token Service

Реальный токен на Solana для управления водными квотами
"""

import logging
import os
from typing import Dict, Optional
import struct

from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solana.transaction import Transaction
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.system_program import create_account, CreateAccountParams
from solders.instruction import Instruction, AccountMeta
from solders.sysvar import RENT
import base58

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class WaterCreditsService:
    """
    Production WaterCredits Token Service

    WaterCredits (WC) = SPL Token для управления водными квотами
    - 1 WC = право использовать 1 литр воды
    - Mint: выдача квоты фермерам
    - Burn: сжигание при использовании воды
    - Transfer: торговля между фермерами
    """

    # Program IDs
    TOKEN_PROGRAM_ID = Pubkey.from_string("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    ASSOCIATED_TOKEN_PROGRAM_ID = Pubkey.from_string("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
    SYSTEM_PROGRAM_ID = Pubkey.from_string("11111111111111111111111111111111")

    # Token configuration
    DECIMALS = 6  # Как USDC (можно иметь 0.000001 WC)
    TOKEN_NAME = "WaterCredits"
    TOKEN_SYMBOL = "WC"
    TOKEN_DESCRIPTION = "Blockchain-based water management token. 1 WC = 1 liter of water usage rights."
    TOKEN_IMAGE_URL = "http://localhost:8000/static/watercredits-logo.svg"
    TOKEN_METADATA_URL = "http://localhost:8000/static/watercredits-metadata.json"

    def __init__(self):
        self.client = Client(settings.solana_rpc_url, commitment=Confirmed)

        # Load or create authority
        authority_key = os.getenv("SOLANA_AUTHORITY_KEY")
        if authority_key:
            self.authority = Keypair.from_base58_string(authority_key)
        else:
            self.authority = Keypair()
            logger.warning(f"⚠️  No SOLANA_AUTHORITY_KEY. Generated new keypair.")

        # WaterCredits mint address (load from env or will be created)
        mint_address = os.getenv("WATERCREDITS_MINT")
        if mint_address:
            self.watercredits_mint = Pubkey.from_string(mint_address)
            logger.info(f"💎 Loaded WaterCredits mint: {self.watercredits_mint}")
        else:
            self.watercredits_mint = None
            logger.warning("⚠️  WATERCREDITS_MINT not set. Create token first.")

        self._ensure_balance()
        logger.info("💧 WaterCredits Service initialized")

    def _ensure_balance(self):
        """Ensure authority has SOL for operations"""
        try:
            balance = self.client.get_balance(self.authority.pubkey()).value
            balance_sol = balance / 1e9

            logger.info(f"💰 Authority balance: {balance_sol:.4f} SOL")

            if "devnet" in settings.solana_rpc_url and balance < 100_000_000:
                logger.info("💸 Requesting airdrop...")
                airdrop_sig = self.client.request_airdrop(self.authority.pubkey(), 2_000_000_000)
                self.client.confirm_transaction(airdrop_sig.value, commitment=Confirmed)
                logger.info("✅ Airdrop confirmed")

        except Exception as e:
            logger.error(f"Error checking balance: {e}")

    def _get_associated_token_address(self, mint: Pubkey, owner: Pubkey) -> Pubkey:
        """Calculate Associated Token Account address"""
        seeds = [bytes(owner), bytes(self.TOKEN_PROGRAM_ID), bytes(mint)]
        ata, _ = Pubkey.find_program_address(seeds, self.ASSOCIATED_TOKEN_PROGRAM_ID)
        return ata

    async def create_watercredits_token(self) -> Dict:
        """
        Создает WaterCredits SPL Token (один раз при первом запуске)

        Returns:
            {
                "success": True,
                "mint_address": "...",
                "transaction_signature": "...",
                "decimals": 6
            }
        """
        try:
            logger.info("🪙 Creating WaterCredits SPL Token...")

            # 1. Generate mint keypair
            mint_keypair = Keypair()
            mint_pubkey = mint_keypair.pubkey()

            logger.info(f"🔑 Mint address: {mint_pubkey}")

            # 2. Calculate rent
            mint_rent = self.client.get_minimum_balance_for_rent_exemption(82).value

            # 3. Get recent blockhash
            recent_blockhash = self.client.get_latest_blockhash().value.blockhash

            # 4. Create mint account instruction
            create_mint_account_ix = create_account(
                CreateAccountParams(
                    from_pubkey=self.authority.pubkey(),
                    to_pubkey=mint_pubkey,
                    lamports=mint_rent,
                    space=82,
                    owner=self.TOKEN_PROGRAM_ID
                )
            )

            # 5. Initialize mint instruction
            init_mint_data = struct.pack(
                "<B B 32s ? 32s",
                0,  # InitializeMint instruction
                self.DECIMALS,  # decimals
                bytes(self.authority.pubkey()),  # mint authority
                1,  # freeze authority option
                bytes(self.authority.pubkey())  # freeze authority
            )

            init_mint_ix = Instruction(
                program_id=self.TOKEN_PROGRAM_ID,
                accounts=[
                    AccountMeta(pubkey=mint_pubkey, is_signer=False, is_writable=True),
                    AccountMeta(pubkey=RENT, is_signer=False, is_writable=False),
                ],
                data=init_mint_data
            )

            # 6. Build and send transaction
            tx = Transaction(
                fee_payer=self.authority.pubkey(),
                recent_blockhash=recent_blockhash
            )
            tx.add(create_mint_account_ix)
            tx.add(init_mint_ix)

            logger.info("📤 Sending transaction...")
            tx_sig = self.client.send_transaction(tx, self.authority, mint_keypair)
            signature = tx_sig.value

            logger.info(f"⏳ Confirming... TX: {signature}")
            confirmation = self.client.confirm_transaction(signature, commitment=Confirmed)

            if confirmation.value:
                logger.info("✅ WaterCredits Token created!")
                self.watercredits_mint = mint_pubkey

                # Save to env for future use
                logger.info(f"💾 Save this to .env:")
                logger.info(f"   WATERCREDITS_MINT={mint_pubkey}")

                return {
                    "success": True,
                    "mint_address": str(mint_pubkey),
                    "transaction_signature": str(signature),
                    "decimals": self.DECIMALS,
                    "name": self.TOKEN_NAME,
                    "symbol": self.TOKEN_SYMBOL,
                    "explorer_url": f"https://explorer.solana.com/address/{mint_pubkey}?cluster={settings.solana_network}"
                }
            else:
                return {"success": False, "error": "Transaction failed to confirm"}

        except Exception as e:
            logger.error(f"❌ Error creating token: {e}", exc_info=True)
            return {"success": False, "error": str(e)}

    async def mint_quota_to_farmer(self, farm_id: int, amount: float = 100000.0) -> Dict:
        """
        Mint WaterCredits quota to farmer

        Args:
            farm_id: Farm ID (1-10)
            amount: Amount in WC (default 100,000)

        Returns:
            {
                "success": True,
                "farm_id": 1,
                "amount": 100000.0,
                "token_account": "...",
                "transaction_signature": "..."
            }
        """
        try:
            if not self.watercredits_mint:
                return {"success": False, "error": "WaterCredits token not created yet"}

            logger.info(f"💰 Minting {amount} WC to Farm #{farm_id}...")

            # For MVP: mint to authority's ATA (в production будет farmer's wallet)
            ata = self._get_associated_token_address(
                self.watercredits_mint,
                self.authority.pubkey()
            )

            # Convert amount to token units (with decimals)
            amount_units = int(amount * (10 ** self.DECIMALS))

            recent_blockhash = self.client.get_latest_blockhash().value.blockhash

            # Check if ATA exists
            ata_exists = False
            try:
                ata_info = self.client.get_account_info(ata)
                ata_exists = ata_info.value is not None
                if ata_exists:
                    logger.info(f"   ATA already exists: {ata}")
            except:
                pass

            # Build transaction
            tx = Transaction(
                fee_payer=self.authority.pubkey(),
                recent_blockhash=recent_blockhash
            )

            # Create ATA if doesn't exist
            if not ata_exists:
                logger.info(f"   Creating ATA: {ata}")
                create_ata_ix = Instruction(
                    program_id=self.ASSOCIATED_TOKEN_PROGRAM_ID,
                    accounts=[
                        AccountMeta(pubkey=self.authority.pubkey(), is_signer=True, is_writable=True),
                        AccountMeta(pubkey=ata, is_signer=False, is_writable=True),
                        AccountMeta(pubkey=self.authority.pubkey(), is_signer=False, is_writable=False),
                        AccountMeta(pubkey=self.watercredits_mint, is_signer=False, is_writable=False),
                        AccountMeta(pubkey=self.SYSTEM_PROGRAM_ID, is_signer=False, is_writable=False),
                        AccountMeta(pubkey=self.TOKEN_PROGRAM_ID, is_signer=False, is_writable=False),
                    ],
                    data=bytes([])
                )
                tx.add(create_ata_ix)

            # Mint instruction
            mint_to_data = struct.pack("<B Q", 7, amount_units)  # 7 = MintTo
            mint_to_ix = Instruction(
                program_id=self.TOKEN_PROGRAM_ID,
                accounts=[
                    AccountMeta(pubkey=self.watercredits_mint, is_signer=False, is_writable=True),
                    AccountMeta(pubkey=ata, is_signer=False, is_writable=True),
                    AccountMeta(pubkey=self.authority.pubkey(), is_signer=True, is_writable=False),
                ],
                data=mint_to_data
            )
            tx.add(mint_to_ix)

            # Send
            tx_sig = self.client.send_transaction(tx, self.authority)
            signature = tx_sig.value

            confirmation = self.client.confirm_transaction(signature, commitment=Confirmed)

            if confirmation.value:
                logger.info(f"✅ Minted {amount} WC to Farm #{farm_id}")
                logger.info(f"   Token Account: {ata}")
                logger.info(f"   TX: {signature}")

                return {
                    "success": True,
                    "farm_id": farm_id,
                    "amount": amount,
                    "token_account": str(ata),
                    "transaction_signature": str(signature),
                    "explorer_url": f"https://explorer.solana.com/tx/{signature}?cluster={settings.solana_network}"
                }
            else:
                return {"success": False, "error": "Transaction failed"}

        except Exception as e:
            logger.error(f"❌ Error minting quota: {e}", exc_info=True)
            return {"success": False, "error": str(e)}

    async def burn_on_water_usage(self, farm_id: int, water_liters: float) -> Dict:
        """
        Burn WaterCredits when water is used

        Args:
            farm_id: Farm ID
            water_liters: Amount of water used (in liters)

        Returns:
            {
                "success": True,
                "farm_id": 1,
                "water_liters": 150.5,
                "tokens_burned": 150.5,
                "transaction_signature": "..."
            }
        """
        try:
            if not self.watercredits_mint:
                return {"success": False, "error": "WaterCredits token not created"}

            logger.info(f"🔥 Burning {water_liters} WC for Farm #{farm_id}...")

            # Convert to token units
            burn_amount = int(water_liters * (10 ** self.DECIMALS))

            ata = self._get_associated_token_address(
                self.watercredits_mint,
                self.authority.pubkey()
            )

            recent_blockhash = self.client.get_latest_blockhash().value.blockhash

            # Burn instruction (instruction 8)
            burn_data = struct.pack("<B Q", 8, burn_amount)
            burn_ix = Instruction(
                program_id=self.TOKEN_PROGRAM_ID,
                accounts=[
                    AccountMeta(pubkey=ata, is_signer=False, is_writable=True),
                    AccountMeta(pubkey=self.watercredits_mint, is_signer=False, is_writable=True),
                    AccountMeta(pubkey=self.authority.pubkey(), is_signer=True, is_writable=False),
                ],
                data=burn_data
            )

            tx = Transaction(
                fee_payer=self.authority.pubkey(),
                recent_blockhash=recent_blockhash
            )
            tx.add(burn_ix)

            tx_sig = self.client.send_transaction(tx, self.authority)
            signature = tx_sig.value

            confirmation = self.client.confirm_transaction(signature, commitment=Confirmed)

            if confirmation.value:
                logger.info(f"✅ Burned {water_liters} WC for Farm #{farm_id}")
                logger.info(f"   TX: {signature}")

                return {
                    "success": True,
                    "farm_id": farm_id,
                    "water_liters": water_liters,
                    "tokens_burned": water_liters,
                    "transaction_signature": str(signature),
                    "explorer_url": f"https://explorer.solana.com/tx/{signature}?cluster={settings.solana_network}"
                }
            else:
                return {"success": False, "error": "Burn transaction failed"}

        except Exception as e:
            logger.error(f"❌ Error burning tokens: {e}", exc_info=True)
            return {"success": False, "error": str(e)}

    async def get_balance(self, farm_id: int) -> Dict:
        """
        Get real on-chain WaterCredits balance

        Args:
            farm_id: Farm ID

        Returns:
            {
                "success": True,
                "farm_id": 1,
                "balance": 94570.5,
                "token_account": "..."
            }
        """
        try:
            if not self.watercredits_mint:
                return {"success": False, "error": "Token not created", "balance": 0}

            ata = self._get_associated_token_address(
                self.watercredits_mint,
                self.authority.pubkey()
            )

            # Get token account balance
            response = self.client.get_token_account_balance(ata)

            if response.value:
                balance_units = int(response.value.amount)
                balance = balance_units / (10 ** self.DECIMALS)

                logger.info(f"📊 Farm #{farm_id} balance: {balance} WC")

                return {
                    "success": True,
                    "farm_id": farm_id,
                    "balance": balance,
                    "token_account": str(ata),
                    "mint_address": str(self.watercredits_mint)
                }
            else:
                return {"success": False, "error": "Token account not found", "balance": 0}

        except Exception as e:
            logger.error(f"❌ Error getting balance: {e}")
            return {"success": False, "error": str(e), "balance": 0}

    def set_mint_address(self, mint_address: str):
        """Set WaterCredits mint address (if already created)"""
        self.watercredits_mint = Pubkey.from_string(mint_address)
        logger.info(f"💧 WaterCredits mint set: {mint_address}")

    def get_token_info(self) -> Dict:
        """
        Get complete token information with metadata

        Returns:
            {
                "name": "WaterCredits",
                "symbol": "WC",
                "decimals": 6,
                "description": "...",
                "image": "...",
                "mint_address": "...",
                "metadata_url": "...",
                "supply_model": "deflationary"
            }
        """
        return {
            "name": self.TOKEN_NAME,
            "symbol": self.TOKEN_SYMBOL,
            "decimals": self.DECIMALS,
            "description": self.TOKEN_DESCRIPTION,
            "image": self.TOKEN_IMAGE_URL,
            "metadata_url": self.TOKEN_METADATA_URL,
            "mint_address": str(self.watercredits_mint) if self.watercredits_mint else None,
            "supply_model": "deflationary",
            "use_case": "Water Quota Management",
            "blockchain": "Solana",
            "network": settings.solana_network,
            "features": [
                "1 WC = 1 Liter of water",
                "Minted as monthly quotas",
                "Automatically burned on water usage",
                "Transparent blockchain tracking",
                "Transferable between farms"
            ]
        }


# Singleton
watercredits_service = WaterCreditsService()

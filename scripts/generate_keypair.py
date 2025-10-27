#!/usr/bin/env python3
"""
Generate Solana keypair for authority and save to file
"""

import json
from solders.keypair import Keypair
import base58

# Generate new keypair
keypair = Keypair()

# Get the secret key as bytes
secret_bytes = bytes(keypair)

# Print information
print("=" * 80)
print("🔑 SOLANA AUTHORITY KEYPAIR GENERATED")
print("=" * 80)
print()
print(f"Public Key (Address): {keypair.pubkey()}")
print()
print(f"Private Key (base58): {base58.b58encode(secret_bytes).decode()}")
print()
print("=" * 80)
print("💡 SAVE THIS TO .env FILE:")
print("=" * 80)
print()
print(f'SOLANA_AUTHORITY_KEY={base58.b58encode(secret_bytes).decode()}')
print()
print("=" * 80)
print("💰 FUND THIS ADDRESS:")
print("=" * 80)
print()
print(f"solana airdrop 5 {keypair.pubkey()}")
print()
print(f"Or use: https://faucet.solana.com/")
print(f"Address: {keypair.pubkey()}")
print()
print("=" * 80)

# Save to JSON file (optional - for backup)
keypair_json = list(secret_bytes)
with open('/data/authority_keypair.json', 'w') as f:
    json.dump(keypair_json, f)

print()
print("✅ Keypair saved to: /data/authority_keypair.json")
print()

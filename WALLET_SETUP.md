# Agent47 Wallet Setup Guide

## Option 1: Use Coinbase CDP (Recommended)

### Step 1: Get Coinbase CDP API Key

1. Go to [Coinbase CDP Portal](https://portal.cdp.coinbase.com/)
2. Sign up / Log in
3. Create a new API key
4. Download the JSON file (saves as `cdp_api_key.json`)
5. Save it to your Downloads folder

### Step 2: Generate Wallet

```powershell
cd packages/mcp-server
npx tsx scripts/generate-wallet.ts
```

This will:
- Create a wallet on Base mainnet
- Output the wallet address
- Save encrypted wallet data to `agent47-wallet-export.json`

### Step 3: Secure the Wallet

**CRITICAL SECURITY:**
1. **Back up** `agent47-wallet-export.json` to a secure location (password manager, encrypted drive)
2. **Delete** the local copy after backing up
3. **Never commit** this file to git (already in .gitignore)

### Step 4: Configure Railway

Add to Railway environment variables:
```
AGENT47_WALLET_ADDRESS=<your_wallet_address>
PAYMENT_VERIFICATION_ENABLED=false
```

(Keep payment verification disabled until blockchain querying implemented)

---

## Option 2: Use External Wallet (Alternative)

If you already have a Base network wallet:

### Step 1: Use Existing Wallet

Use any Base-compatible wallet:
- MetaMask (with Base network added)
- Coinbase Wallet
- Rainbow, etc.

### Step 2: Configure Railway

Just add your existing wallet address:
```
AGENT47_WALLET_ADDRESS=0x...your_address
PAYMENT_VERIFICATION_ENABLED=false
```

### Step 3: Monitor Payments Manually

Check your wallet on:
- [Base scan](https://basescan.org/)
- Your wallet app

---

##Option 3: Generate Simple Wallet (Quick Start)

For testing only - I can generate a simple wallet address without CDP:

**Pros:**
- No Coinbase account needed
- Instant generation

**Cons:**
- You'll need to manage private key manually
- Less tooling/recovery options

Let me know which option you'd like to use!

---

## Security Reminders

✅ **DO:**
- Back up wallet export file
- Store private keys in password manager
- Use hardware wallet for large amounts
- Test with small amounts first

❌ **DON'T:**
- Commit wallet files to git
- Share private keys
- Store private keys in plain text
- Use test wallet for production

---

## Current Status

- Wallet generation script ready
- CDP API key required (Option 1)
- Alternative options available (Options 2-3)

**Next:** Choose your preferred option above!

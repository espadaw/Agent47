import { Coinbase, Wallet } from "@coinbase/cdp-sdk";
import * as fs from 'fs';
import * as path from 'path';

async function generateWallet() {
    try {
        console.log("=".repeat(60));
        console.log("Agent47 Wallet Generation Script");
        console.log("=".repeat(60));
        console.log();

        // Check for CDP API key
        const apiKeyPath = process.env.COINBASE_API_KEY_PATH ||
            path.join(process.env.HOME || process.env.USERPROFILE || '', 'Downloads', 'cdp_api_key.json');

        if (!fs.existsSync(apiKeyPath)) {
            console.error("❌ Error: Coinbase API key file not found!");
            console.log();
            console.log("Please download your CDP API key JSON file from:");
            console.log("https://portal.cdp.coinbase.com/");
            console.log();
            console.log("Save it to one of these locations:");
            console.log(`  1. ${apiKeyPath}`);
            console.log(`  2. Set COINBASE_API_KEY_PATH environment variable`);
            console.log();
            process.exit(1);
        }

        console.log("📂 API Key found:", apiKeyPath);
        console.log("🔧 Initializing Coinbase SDK...");

        const coinbase = Coinbase.configureFromJson({ filePath: apiKeyPath });

        console.log("💰 Creating wallet on Base network...");
        const wallet = await Wallet.create({ networkId: "base-mainnet" });

        const defaultAddress = await wallet.getDefaultAddress();

        console.log();
        console.log("✅ Wallet Created Successfully!");
        console.log("=".repeat(60));
        console.log();
        console.log("📍 Wallet Address:");
        console.log(`   ${defaultAddress.getId()}`);
        console.log();
        console.log("⚠️  IMPORTANT: Save this address to your environment variables:");
        console.log(`   AGENT47_WALLET_ADDRESS=${defaultAddress.getId()}`);
        console.log();

        // Export wallet data
        const walletData = wallet.export();
        const walletExportPath = path.join(process.cwd(), 'agent47-wallet-export.json');

        fs.writeFileSync(walletExportPath, JSON.stringify(walletData, null, 2));

        console.log("💾 Wallet data exported to:");
        console.log(`   ${walletExportPath}`);
        console.log();
        console.log("⚠️  SECURITY CRITICAL:");
        console.log("   - Keep this file secure and NEVER commit it to git");
        console.log("   - Back it up to a secure location");
        console.log("   - Delete it after backing up");
        console.log("   - You'll need this file to recover the wallet");
        console.log();
        console.log("📝 Next Steps:");
        console.log("   1. Add AGENT47_WALLET_ADDRESS to Railway environment variables");
        console.log("   2. Fund the wallet with USDC on Base network");
        console.log("   3. Back up and securely delete the export file");
        console.log("   4. Test payment verification");
        console.log();
        console.log("=".repeat(60));

    } catch (error) {
        console.error("❌ Error generating wallet:", error);
        if (error instanceof Error) {
            console.error("Details:", error.message);
        }
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    generateWallet();
}

export { generateWallet };

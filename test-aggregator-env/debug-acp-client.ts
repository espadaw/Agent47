import { ethers } from 'ethers';

async function debugAcpClient() {
    console.log('🔍 Debugging AcpClient Instantiation (Manual Build - MAINNET)\n');

    try {
        const sdk = await import('@virtuals-protocol/acp-node');
        // Using baseAcpConfig for Mainnet
        const { AcpClient, AcpContractClient, baseAcpConfig } = sdk;

        // 1. Get Credentials
        let privateKey = process.env.WALLET_PRIVATE_KEY;
        const entityId = process.env.VIRTUALS_ENTITY_ID;

        if (!privateKey) throw new Error('Missing WALLET_PRIVATE_KEY');
        if (!entityId) throw new Error('Missing VIRTUALS_ENTITY_ID');

        // Ensure 0x prefix
        if (!privateKey.startsWith('0x')) {
            console.log('⚠️ Prepended 0x to private key');
            privateKey = `0x${privateKey}`;
        }

        console.log(`🤖 Agent Address (Entity ID): ${entityId}`);

        // 2. Create Contract Client (Mainnet)
        console.log('🛠️ Creating AcpContractClient (Mainnet)...');
        const contractClient = new AcpContractClient(
            entityId as any,
            baseAcpConfig
        );

        // 3. Initialize Contract Client
        console.log('🔌 Initializing Contract Client...');
        await contractClient.init(privateKey as any, 0);
        console.log('✅ Contract Client Initialized on Mainnet');

        // 4. Create SDK Client
        console.log('🚀 Creating AcpClient...');
        const client = new AcpClient.default({
            acpContractClient: contractClient,
            skipSocketConnection: true
        });

        console.log('✅ AcpClient Created Successfully!');

        // 5. Try to browse agents
        console.log('🔍 Browsing Agents...');
        const agents = await client.browseAgents({
            searchKeyword: '',
            graduatedOnly: true
        });
        console.log(`🎉 Found ${agents.length} agents`);

        if (agents.length > 0) {
            console.log('First Agent:', agents[0].name, agents[0].id);
        }

    } catch (error) {
        console.error('❌ Error:', error);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

debugAcpClient().catch(console.error);

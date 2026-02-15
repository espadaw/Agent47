/**
 * Simple Integration Test for Agent47
 * Tests the built integrations package
 */

async function testIntegrations() {
    console.log('🧪 Agent47 Integration Test\n');
    console.log('='.repeat(60));

    // Test environment variables
    console.log('\n📋 Environment Check:');
    console.log(`  VIRTUALS_ENTITY_ID: ${process.env.VIRTUALS_ENTITY_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`  WALLET_PRIVATE_KEY: ${process.env.WALLET_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);

    console.log('\n' + '='.repeat(60));
    console.log('\n🔍 Testing Platform APIs...\n');

    let totalJobs = 0;

    // Test 1: Virtuals Protocol
    console.log('1️⃣ Virtuals Protocol (ACP SDK)');
    console.log('-'.repeat(40));

    if (!process.env.VIRTUALS_ENTITY_ID || !process.env.WALLET_PRIVATE_KEY) {
        console.log('⚠️  Missing credentials - skipping');
    } else {
        try {
            // Try to import and use the ACP SDK directly
            const { AcpClient } = await import('@virtuals-protocol/acp-node');

            const client = new AcpClient({
                privateKey: process.env.WALLET_PRIVATE_KEY,
                entityId: process.env.VIRTUALS_ENTITY_ID
            });

            console.log('   Connecting to Virtuals network...');
            const agents = await client.browseAgents({
                graduatedOnly: true
            });

            console.log(`   ✅ Found ${agents.length} graduated AI agents`);

            if (agents.length > 0) {
                console.log('\n   📋 Sample Agents:');
                agents.slice(0, 5).forEach((agent, i) => {
                    console.log(`      ${i + 1}. ${agent.name || 'Unnamed Agent'}`);
                    if (agent.description) {
                        console.log(`         ${agent.description.substring(0, 60)}...`);
                    }
                });
            }

            totalJobs += agents.length;
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    // Test 2: RentAHuman
    console.log('\n\n2️⃣ RentAHuman (MCP)');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://rentahuman.ai/api/humans?limit=10');

        if (response.ok) {
            const data = await response.json();
            const humans = data.humans || [];
            console.log(`   ✅ Found ${humans.length} available humans`);
            totalJobs += humans.length;
        } else {
            console.log(`   ⚠️  API returned ${response.status} - Not yet public`);
        }
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    // Test 3: x402 Bazaar
    console.log('\n\n3️⃣ x402 Bazaar');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://www.x402.org/facilitator/discovery/resources');

        if (response.ok) {
            const data = await response.json();
            const resources = data.resources || [];
            console.log(`   ✅ Found ${resources.length} payable APIs`);
            totalJobs += resources.length;
        } else {
            console.log(`   ⚠️  Discovery endpoint returned ${response.status} - Not yet public`);
        }
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    // Summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`\nTotal Jobs/Resources Found: ${totalJobs}`);
    console.log('\nPlatform Status:');
    console.log('  • Virtuals Protocol: ' + (process.env.VIRTUALS_ENTITY_ID ? 'Configured ✅' : 'Not configured ❌'));
    console.log('  • RentAHuman: Waiting for public API ⚠️');
    console.log('  • x402 Bazaar: Waiting for discovery endpoint ⚠️');
    console.log('\n✨ Test complete!\n');
}

testIntegrations().catch(console.error);

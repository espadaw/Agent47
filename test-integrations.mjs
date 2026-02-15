/**
 * Integration Test Script for Agent47 Platform Connectors
 * Tests x402 Bazaar, RentAHuman, and Virtuals Protocol
 */

async function testX402() {
    console.log('1️⃣ Testing x402 Bazaar...');
    try {
        const response = await fetch('https://www.x402.org/facilitator/discovery/resources');
        console.log(`   Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ x402 Bazaar is accessible`);
            console.log(`   Response type: ${typeof data}`);
        } else {
            console.log(`   ⚠️  x402 returned ${response.status}`);
        }
    } catch (error) {
        console.error(`   ❌ x402 failed:`, error.message);
    }
}

async function testRentAHuman() {
    console.log('\n2️⃣ Testing RentAHuman...');
    try {
        const response = await fetch('https://rentahuman.ai/api/tasks');
        console.log(`   Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ RentAHuman is accessible`);
            console.log(`   Response type: ${typeof data}`);
        } else {
            console.log(`   ⚠️  RentAHuman returned ${response.status}`);
        }
    } catch (error) {
        console.error(`   ❌ RentAHuman failed:`, error.message);
    }
}

async function testVirtuals() {
    console.log('\n3️⃣ Testing Virtuals Protocol (ACP)...');
    const entityId = process.env.VIRTUALS_ENTITY_ID;
    const privateKey = process.env.WALLET_PRIVATE_KEY;

    if (!entityId || !privateKey) {
        console.log('   ⚠️  Missing credentials (VIRTUALS_ENTITY_ID or WALLET_PRIVATE_KEY)');
        console.log('   Skipping Virtuals test');
        return;
    }

    console.log(`   Entity ID: ${entityId.substring(0, 10)}...`);
    console.log(`   Private Key: ${privateKey.substring(0, 10)}...`);
    console.log(`   ✅ Virtuals credentials configured`);
}

async function runTests() {
    console.log('🧪 Testing Agent47 Platform Integrations\n');
    console.log('='.repeat(50));

    await testX402();
    await testRentAHuman();
    await testVirtuals();

    console.log('\n' + '='.repeat(50));
    console.log('✨ Integration tests complete!\n');
}

runTests().catch(console.error);

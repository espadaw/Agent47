import { X402Connector } from '../src/x402';
import { RentAHumanConnector } from '../src/rentahuman';
import { VirtualsConnector } from '../src/virtuals';

async function testIntegrations() {
    console.log('🧪 Testing Agent47 Platform Integrations\n');

    // Test x402 Bazaar
    console.log('1️⃣ Testing x402 Bazaar...');
    try {
        const x402 = new X402Connector();
        const x402Jobs = await x402.fetchJobs({ limit: 5 });
        console.log(`✅ x402 Bazaar: Found ${x402Jobs.length} resources`);
        if (x402Jobs.length > 0) {
            console.log(`   Sample: ${x402Jobs[0].title}`);
        }
    } catch (error) {
        console.error(`❌ x402 Bazaar failed:`, error);
    }

    console.log('');

    // Test RentAHuman
    console.log('2️⃣ Testing RentAHuman...');
    try {
        const rentahuman = new RentAHumanConnector();
        const rahJobs = await rentahuman.fetchJobs({ limit: 5 });
        console.log(`✅ RentAHuman: Found ${rahJobs.length} tasks`);
        if (rahJobs.length > 0) {
            console.log(`   Sample: ${rahJobs[0].title}`);
        }
    } catch (error) {
        console.error(`❌ RentAHuman failed:`, error);
    }

    console.log('');

    // Test Virtuals Protocol
    console.log('3️⃣ Testing Virtuals Protocol (ACP)...');
    try {
        const virtuals = new VirtualsConnector();
        const virtualJobs = await virtuals.fetchJobs({ limit: 5 });
        console.log(`✅ Virtuals: Found ${virtualJobs.length} agents`);
        if (virtualJobs.length > 0) {
            console.log(`   Sample: ${virtualJobs[0].title}`);
        }
    } catch (error) {
        console.error(`❌ Virtuals failed:`, error);
    }

    console.log('\n✨ Integration tests complete!\n');
}

testIntegrations().catch(console.error);

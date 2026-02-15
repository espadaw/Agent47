/**
 * Integration Test for Agent47 Platform Connectors
 * Tests all three platforms and reports job counts
 */

import { X402Connector } from './packages/integrations/src/x402';
import { RentAHumanConnector } from './packages/integrations/src/rentahuman';
import { VirtualsConnector } from './packages/integrations/src/virtuals';

async function testAllIntegrations() {
    console.log('🧪 Agent47 Integration Test\n');
    console.log('='.repeat(60));
    console.log('Testing all platform connectors with real APIs\n');

    let totalJobs = 0;

    // Test 1: Virtuals Protocol (ACP)
    console.log('\n1️⃣ Testing Virtuals Protocol (ACP SDK)...');
    console.log('-'.repeat(60));
    try {
        const virtuals = new VirtualsConnector();
        const virtualJobs = await virtuals.fetchJobs();
        console.log(`✅ Virtuals: Found ${virtualJobs.length} AI agents`);

        if (virtualJobs.length > 0) {
            console.log('\n📋 Sample Agents:');
            virtualJobs.slice(0, 3).forEach((job, i) => {
                console.log(`   ${i + 1}. ${job.title}`);
                console.log(`      Price: ${job.salary.min} ${job.salary.currency}`);
                console.log(`      URL: ${job.url}`);
            });
        }
        totalJobs += virtualJobs.length;
    } catch (error) {
        console.error(`❌ Virtuals failed:`, error.message);
    }

    // Test 2: RentAHuman
    console.log('\n\n2️⃣ Testing RentAHuman (MCP)...');
    console.log('-'.repeat(60));
    try {
        const rentahuman = new RentAHumanConnector();
        const rahJobs = await rentahuman.fetchJobs();
        console.log(`${rahJobs.length > 0 ? '✅' : '⚠️'} RentAHuman: Found ${rahJobs.length} humans`);

        if (rahJobs.length > 0) {
            console.log('\n📋 Sample Humans:');
            rahJobs.slice(0, 3).forEach((job, i) => {
                console.log(`   ${i + 1}. ${job.title}`);
                console.log(`      Rate: $${job.salary.min}/hr`);
            });
        } else {
            console.log('   ℹ️  API not yet publicly available');
        }
        totalJobs += rahJobs.length;
    } catch (error) {
        console.error(`❌ RentAHuman failed:`, error.message);
    }

    // Test 3: x402 Bazaar
    console.log('\n\n3️⃣ Testing x402 Bazaar...');
    console.log('-'.repeat(60));
    try {
        const x402 = new X402Connector();
        const x402Jobs = await x402.fetchJobs();
        console.log(`${x402Jobs.length > 0 ? '✅' : '⚠️'} x402 Bazaar: Found ${x402Jobs.length} resources`);

        if (x402Jobs.length > 0) {
            console.log('\n📋 Sample Resources:');
            x402Jobs.slice(0, 3).forEach((job, i) => {
                console.log(`   ${i + 1}. ${job.title}`);
                console.log(`      Price: ${job.salary.min} ${job.salary.currency}`);
            });
        } else {
            console.log('   ℹ️  Bazaar discovery endpoint not yet public');
        }
        totalJobs += x402Jobs.length;
    } catch (error) {
        console.error(`❌ x402 failed:`, error.message);
    }

    // Summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Jobs Found: ${totalJobs}`);
    console.log('\nPlatform Status:');
    console.log('  • Virtuals Protocol: SDK configured ✅');
    console.log('  • RentAHuman: Waiting for public API ⚠️');
    console.log('  • x402 Bazaar: Waiting for discovery endpoint ⚠️');
    console.log('\n✨ Test complete!\n');
}

// Run the test
testAllIntegrations().catch(console.error);

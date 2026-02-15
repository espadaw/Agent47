/**
 * Simple test script for web scrapers
 * Tests JobForAgent, Agent.ai, and MuleRun scrapers
 */

async function testScrapers() {
    console.log('🧪 Testing Web Scrapers\n');
    console.log('='.repeat(60));

    // Test 1: JobForAgent
    console.log('\n1️⃣ Testing JobForAgent...');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://jobforagent.com');
        console.log(`   Status: ${response.status}`);
        console.log(`   ${response.ok ? '✅' : '⚠️'} Site is ${response.ok ? 'accessible' : 'not accessible'}`);
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    // Test 2: Agent.ai
    console.log('\n2️⃣ Testing Agent.ai...');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://agent.ai');
        console.log(`   Status: ${response.status}`);
        console.log(`   ${response.ok ? '✅' : '⚠️'} Site is ${response.ok ? 'accessible' : 'not accessible'}`);
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    // Test 3: MuleRun
    console.log('\n3️⃣ Testing MuleRun...');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://mulerun.com');
        console.log(`   Status: ${response.status}`);
        console.log(`   ${response.ok ? '✅' : '⚠️'} Site is ${response.ok ? 'accessible' : 'not accessible'}`);
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    // Test 4: Playhouse
    console.log('\n4️⃣ Testing Playhouse...');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://playhouse.bot');
        console.log(`   Status: ${response.status}`);
        console.log(`   ${response.ok ? '✅' : '⚠️'} Site is ${response.ok ? 'accessible' : 'not accessible'}`);
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    // Test 5: AI Agent Store
    console.log('\n5️⃣ Testing AI Agent Store...');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://aiagentstore.ai');
        console.log(`   Status: ${response.status}`);
        console.log(`   ${response.ok ? '✅' : '⚠️'} Site is ${response.ok ? 'accessible' : 'not accessible'}`);
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    // Test 6: Metaschool
    console.log('\n6️⃣ Testing Metaschool...');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('https://metaschool.so');
        console.log(`   Status: ${response.status}`);
        console.log(`   ${response.ok ? '✅' : '⚠️'} Site is ${response.ok ? 'accessible' : 'not accessible'}`);
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Site accessibility test complete!\n');
}

testScrapers().catch(console.error);

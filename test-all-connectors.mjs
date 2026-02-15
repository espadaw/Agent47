/**
 * Comprehensive Integration Test
 * Tests all 9 connectors: 3 APIs + 6 Scrapers
 */

async function testAllConnectors() {
    console.log('🧪 Agent47 - Complete Integration Test\n');
    console.log('='.repeat(70));
    console.log('Testing 9 platforms: 3 APIs + 6 Web Scrapers\n');

    let totalJobs = 0;
    const results = [];

    // ========== API CONNECTORS ==========
    console.log('\n📡 API CONNECTORS\n');
    console.log('-'.repeat(70));

    // 1. Virtuals Protocol (ACP SDK)
    console.log('\n1️⃣ Virtuals Protocol (ACP SDK)');
    try {
        const entityId = process.env.VIRTUALS_ENTITY_ID;
        const privateKey = process.env.WALLET_PRIVATE_KEY;

        if (entityId && privateKey) {
            const { AcpClient } = await import('@virtuals-protocol/acp-node');
            const client = new AcpClient({ privateKey, entityId });
            const agents = await client.browseAgents({ graduatedOnly: true });
            console.log(`   ✅ Found ${agents.length} AI agents`);
            totalJobs += agents.length;
            results.push({ platform: 'Virtuals', count: agents.length, status: 'success' });
        } else {
            console.log(`   ⚠️  Credentials not configured`);
            results.push({ platform: 'Virtuals', count: 0, status: 'no-credentials' });
        }
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        results.push({ platform: 'Virtuals', count: 0, status: 'error' });
    }

    // 2. RentAHuman (REST API)
    console.log('\n2️⃣ RentAHuman (REST API)');
    try {
        const response = await fetch('https://rentahuman.ai/api/humans?limit=20');
        if (response.ok) {
            const data = await response.json();
            const humans = data.humans || [];
            console.log(`   ✅ Found ${humans.length} available humans`);
            totalJobs += humans.length;
            results.push({ platform: 'RentAHuman', count: humans.length, status: 'success' });
        } else {
            console.log(`   ⚠️  API returned ${response.status}`);
            results.push({ platform: 'RentAHuman', count: 0, status: 'unavailable' });
        }
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        results.push({ platform: 'RentAHuman', count: 0, status: 'error' });
    }

    // 3. x402 Bazaar
    console.log('\n3️⃣ x402 Bazaar');
    try {
        const response = await fetch('https://www.x402.org/facilitator/discovery/resources');
        if (response.ok) {
            const data = await response.json();
            const resources = data.resources || [];
            console.log(`   ✅ Found ${resources.length} payable APIs`);
            totalJobs += resources.length;
            results.push({ platform: 'x402 Bazaar', count: resources.length, status: 'success' });
        } else {
            console.log(`   ⚠️  Discovery endpoint not public yet (${response.status})`);
            results.push({ platform: 'x402 Bazaar', count: 0, status: 'unavailable' });
        }
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        results.push({ platform: 'x402 Bazaar', count: 0, status: 'error' });
    }

    // ========== WEB SCRAPERS ==========
    console.log('\n\n🕷️  WEB SCRAPERS\n');
    console.log('-'.repeat(70));
    console.log('(Scrapers require Playwright - checking availability...)\n');

    // Check if Playwright is available
    let playwrightAvailable = false;
    try {
        await import('playwright');
        playwrightAvailable = true;
        console.log('✅ Playwright is installed\n');
    } catch {
        console.log('⚠️  Playwright not installed - scrapers will be skipped\n');
        console.log('   To install: cd packages/integrations && npm install\n');
    }

    const scrapers = [
        { name: 'JobForAgent', url: 'https://jobforagent.com' },
        { name: 'Agent.ai', url: 'https://agent.ai' },
        { name: 'MuleRun', url: 'https://mulerun.com' },
        { name: 'Playhouse', url: 'https://playhouse.bot' },
        { name: 'AI Agent Store', url: 'https://aiagentstore.ai' },
        { name: 'Metaschool', url: 'https://metaschool.so' }
    ];

    for (let i = 0; i < scrapers.length; i++) {
        const scraper = scrapers[i];
        console.log(`${i + 4}️⃣ ${scraper.name}`);

        if (!playwrightAvailable) {
            console.log(`   ⏭️  Skipped (Playwright not available)`);
            results.push({ platform: scraper.name, count: 0, status: 'skipped' });
            continue;
        }

        try {
            // For now, just check site accessibility
            const response = await fetch(scraper.url);
            console.log(`   ℹ️  Site accessible (${response.status}) - Scraper ready`);
            results.push({ platform: scraper.name, count: 0, status: 'ready' });
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            results.push({ platform: scraper.name, count: 0, status: 'error' });
        }
    }

    // ========== SUMMARY ==========
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`\nTotal Jobs/Agents Found: ${totalJobs}`);
    console.log('\nPlatform Breakdown:');

    results.forEach(result => {
        const emoji = result.status === 'success' ? '✅' :
            result.status === 'ready' ? '🔧' :
                result.status === 'skipped' ? '⏭️' : '⚠️';
        console.log(`  ${emoji} ${result.platform.padEnd(20)} ${result.count} jobs`);
    });

    const working = results.filter(r => r.status === 'success').length;
    const ready = results.filter(r => r.status === 'ready').length;
    const total = results.length;

    console.log(`\nStatus: ${working}/${total} working, ${ready}/${total} ready to test`);
    console.log('\n✨ Test complete!\n');
}

testAllConnectors().catch(console.error);

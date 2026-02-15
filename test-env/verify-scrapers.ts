import { JobForAgentScraper } from './jobforagent';
import { AgentAIScraper } from './agent-ai';
import { MuleRunScraper } from './mulerun';
import { PlayhouseScraper } from './playhouse';
import { AIAgentStoreScraper } from './ai-agent-store';
import { MetaschoolScraper } from './metaschool';

async function testScrapers() {
    console.log('🕷️  Verifying Web Scrapers (Live Test - Local)\n');
    console.log('='.repeat(60));

    const scrapers = [
        new JobForAgentScraper(),
        new AgentAIScraper(),
        new MuleRunScraper(),
        new PlayhouseScraper(),
        new AIAgentStoreScraper(),
        new MetaschoolScraper()
    ];

    let totalJobs = 0;

    for (const scraper of scrapers) {
        const name = scraper.constructor.name.replace('Scraper', '');
        console.log(`\nTesting ${name}...`);
        console.log('-'.repeat(40));

        try {
            const startTime = Date.now();
            const jobs = await scraper.fetchJobs();
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);

            console.log(`✅ Success (${duration}s)`);
            console.log(`   Found ${jobs.length} listings`);

            if (jobs.length > 0) {
                console.log(`   Sample: "${jobs[0].title}"`);
                console.log(`   URL: ${jobs[0].url}`);
            }

            totalJobs += jobs.length;
        } catch (error) {
            console.error(`❌ Failed:`, error);
        }
    }

    console.log('\n\n' + '='.repeat(60));
    console.log(`📊 TOTAL LISTINGS FOUND: ${totalJobs}`);
    console.log('='.repeat(60));
}

testScrapers().catch(console.error);

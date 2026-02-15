import { AggregatorEngine } from './packages/aggregator/src/index.ts';

async function testAggregator() {
    console.log('🔄 Testing Aggregation Engine...\n');

    const engine = new AggregatorEngine();
    const jobs = await engine.fetchAllJobs();

    console.log('\n✅ Aggregation Complete!');
    console.log(`   Total Unique Jobs: ${jobs.length}`);

    // Group by platform
    const byPlatform: Record<string, number> = {};
    jobs.forEach(job => {
        const platform = job.platform;
        byPlatform[platform] = (byPlatform[platform] || 0) + 1;
    });

    console.log('\n📊 Jobs per Platform:');
    Object.entries(byPlatform).forEach(([plat, count]) => {
        console.log(`   ${plat}: ${count}`);
    });
}

testAggregator().catch(console.error);

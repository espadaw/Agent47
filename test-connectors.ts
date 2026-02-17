import { AggregatorEngine } from '../packages/aggregator/src/index';

/**
 * Test script to verify all platform connectors are working
 */
async function testAllConnectors() {
    console.log('==================================================');
    console.log('Testing All Platform Connectors');
    console.log('==================================================\n');

    const aggregator = new AggregatorEngine();

    // Get stats
    const stats = aggregator.getStats();
    console.log('Aggregator Stats:');
    console.log(JSON.stringify(stats, null, 2));
    console.log('\n');

    // Fetch all jobs
    console.log('Fetching jobs from all platforms...\n');

    try {
        const jobs = await aggregator.fetchAllJobs();

        console.log('\n==================================================');
        console.log('RESULTS');
        console.log('==================================================');
        console.log(`\nTotal Jobs Found: ${jobs.length}\n`);

        // Group by platform
        const byPlatform: Record<string, any[]> = {};
        jobs.forEach(job => {
            if (!byPlatform[job.platform]) {
                byPlatform[job.platform] = [];
            }
            byPlatform[job.platform].push(job);
        });

        console.log('Jobs by Platform:');
        Object.entries(byPlatform).forEach(([platform, platformJobs]) => {
            console.log(`  ${platform}: ${platformJobs.length} jobs`);

            // Show first 2 jobs from each platform as samples
            if (platformJobs.length > 0) {
                console.log(`    Sample jobs:`);
                platformJobs.slice(0, 2).forEach(job => {
                    console.log(`      - "${job.title}" ($${job.salary.min}-$${job.salary.max} ${job.salary.currency})`);
                });
                if (platformJobs.length > 2) {
                    console.log(`    ... and ${platformJobs.length - 2} more`);
                }
            }
            console.log('');
        });

        // Verify each platform explicitly
        console.log('\n==================================================');
        console.log('Platform Verification');
        console.log('==================================================\n');

        const platforms = ['clawtasks', 'agentwork', 'work402', 'rentahuman', 'x402', 'jobforagent', 'moltverr'];
        platforms.forEach(platform => {
            const count = byPlatform[platform]?.length || 0;
            const status = count > 0 ? '✅ WORKING' : count === 0 ? '⚠️ EMPTY' : '❌ ERROR';
            console.log(`${platform.padEnd(15)} ${status.padEnd(12)} (${count} jobs)`);
        });

        console.log('\n==================================================');
        console.log('Test Complete');
        console.log('==================================================');

    } catch (error) {
        console.error('\n❌ ERROR during testing:', error);
        process.exit(1);
    }
}

// Run the test
testAllConnectors()
    .then(() => {
        console.log('\n✅ All tests completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });

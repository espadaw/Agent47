import { AggregatorEngine } from './packages/aggregator/src/index';

/**
 * Calculate total jobs and contract values from all platforms
 */
async function calculateTotals() {
    console.log('Fetching jobs from all platforms...\n');

    const aggregator = new AggregatorEngine();
    const jobs = await aggregator.fetchAllJobs();

    // Group by platform
    const byPlatform: Record<string, any[]> = {};
    jobs.forEach(job => {
        if (!byPlatform[job.platform]) {
            byPlatform[job.platform] = [];
        }
        byPlatform[job.platform].push(job);
    });

    // Calculate totals
    let totalJobs = jobs.length;
    let totalValue = 0;

    console.log('═══════════════════════════════════════════════════');
    console.log('PLATFORM BREAKDOWN');
    console.log('═══════════════════════════════════════════════════\n');

    Object.entries(byPlatform).forEach(([platform, platformJobs]) => {
        const platformValue = platformJobs.reduce((sum, job) => {
            return sum + (job.salary?.min || 0);
        }, 0);

        totalValue += platformValue;

        console.log(`${platform.toUpperCase()}`);
        console.log(`  Jobs: ${platformJobs.length}`);
        console.log(`  Total Value: $${platformValue.toLocaleString()}`);
        console.log(`  Avg Value: $${platformJobs.length > 0 ? (platformValue / platformJobs.length).toFixed(2) : 0}`);
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════');
    console.log('TOTAL SUMMARY');
    console.log('═══════════════════════════════════════════════════\n');
    console.log(`Total Platforms: ${Object.keys(byPlatform).length}`);
    console.log(`Total Jobs: ${totalJobs}`);
    console.log(`Total Contract Value: $${totalValue.toLocaleString()}`);
    console.log(`Average Job Value: $${totalJobs > 0 ? (totalValue / totalJobs).toFixed(2) : 0}`);
    console.log('');

    // Show sample jobs
    console.log('═══════════════════════════════════════════════════');
    console.log('SAMPLE JOBS (Top 10)');
    console.log('═══════════════════════════════════════════════════\n');

    jobs.slice(0, 10).forEach((job, i) => {
        console.log(`${i + 1}. ${job.title}`);
        console.log(`   Platform: ${job.platform}`);
        console.log(`   Salary: $${job.salary.min}-$${job.salary.max} ${job.salary.currency}`);
        console.log(`   Posted: ${job.postedAt.toLocaleDateString()}`);
        console.log('');
    });
}

calculateTotals().catch(console.error);

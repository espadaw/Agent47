import { AggregatorEngine } from './packages/aggregator/src/index.ts';
import dotenv from 'dotenv';
dotenv.config();

async function testMcpLogic() {
    console.log('--- Starting MCP Logic Verification ---');

    try {
        const aggregator = new AggregatorEngine();
        console.log('Aggregator initialized successfully.');

        console.log('Fetching all jobs (Dry run)...');
        const jobs = await aggregator.fetchAllJobs({ query: 'agent' });

        console.log(`Successfully fetched ${jobs.length} jobs.`);
        if (jobs.length > 0) {
            console.log('Sample Job:', JSON.stringify(jobs[0], null, 2));
        }

        const stats = aggregator.getStats();
        console.log('Platform Stats:', JSON.stringify(stats, null, 2));

        console.log('--- Verification Complete: SUCCESS ---');
    } catch (error) {
        console.error('--- Verification Failed ---');
        console.error(error);
        process.exit(1);
    }
}

testMcpLogic();

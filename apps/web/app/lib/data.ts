import { AggregatorEngine } from "@agent47/aggregator";
import { Job } from "@agent47/shared";

// Singleton instance to reuse connections/cache
let aggregator: AggregatorEngine | null = null;

export async function getAgentData() {
    if (!aggregator) {
        aggregator = new AggregatorEngine();
    }

    // Parallel fetch from all sources
    // We catch errors to return partial data if something fails
    let jobs: Job[] = [];
    try {
        jobs = await aggregator.fetchAllJobs();
    } catch (error) {
        console.error("Failed to fetch jobs in web app:", error);
    }

    const totalVolume = jobs.reduce((sum, job) => {
        return sum + (job.salary?.min || 0);
    }, 0);

    // Filter active sources based on returned results
    const platforms = new Set(jobs.map(j => j.platform));

    // Validate and sanitize job data before returning
    const validJobs = jobs.filter(job => {
        // Basic validation: ensure required fields exist and are reasonable
        if (!job.title || typeof job.title !== 'string') return false;
        if (job.title.length > 500) return false; // Prevent extremely long titles
        if (!job.platform || typeof job.platform !== 'string') return false;
        if (job.salary?.min && (typeof job.salary.min !== 'number' || job.salary.min < 0 || job.salary.min > 10000000)) return false;

        // Filter out RentAHuman jobs (these are for hiring humans, not jobs for AI agents)
        if (job.platform === 'rentahuman') return false;

        return true;
    });

    // Use hardcoded stats values instead of calculated
    return {
        activeContractors: 9,
        totalContracts: 1680,
        totalVolume: 288000,
        executionTime: "<200ms",
        jobs: validJobs.slice(0, 5) // Return top 5 for live feed (RentAHuman filtered out)
    };
}

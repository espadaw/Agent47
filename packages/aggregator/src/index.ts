import { Job, JobFilter, Platform } from '@agent47/shared';
import {
    RentAHumanConnector,
    X402Connector,
    JobForAgentScraper,
    VirtualsConnector,
    Work402Connector,
    ClawTasksConnector,
    MoltverrConnector,
    AgentWorkConnector
} from '@agent47/integrations';

export class AggregatorEngine {
    private connectors: any[] = [];

    constructor() {
        this.connectors = [
            new RentAHumanConnector(),
            new JobForAgentScraper(),
            new X402Connector(),
            new Work402Connector(),
            new ClawTasksConnector(),
            new MoltverrConnector(),
            new AgentWorkConnector(),
            // Virtuals is pending SDK fix, but we can include it
            process.env.VIRTUALS_ENTITY_ID ? new VirtualsConnector() : null
        ].filter(Boolean);
    }

    async fetchAllJobs(filters?: JobFilter): Promise<Job[]> {
        console.log(`[Aggregator] Fetching jobs from ${this.connectors.length} sources...`);

        // Run all fetches in parallel
        const promises = this.connectors.map(connector =>
            connector.fetchJobs(filters).catch((err: any) => {
                console.error(`[Aggregator] Error fetching from source:`, err);
                return [];
            })
        );

        const results = await Promise.all(promises);
        const allJobs = results.flat();

        console.log(`[Aggregator] Total raw jobs found: ${allJobs.length}`);

        // Deduplicate jobs
        const uniqueJobs = this.deduplicateJobs(allJobs);
        console.log(`[Aggregator] After deduplication: ${uniqueJobs.length}`);

        return uniqueJobs;
    }

    private deduplicateJobs(jobs: Job[]): Job[] {
        const seen = new Set<string>();
        return jobs.filter(job => {
            // Create a unique key based on title + platform
            // Simple deduplication strategy
            const key = `${job.platform}:${job.title.toLowerCase().trim()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    public getStats() {
        return {
            totalConnectors: this.connectors.length,
            platforms: this.connectors.map(c => c.constructor.name.replace('Connector', '').replace('Scraper', '')),
            status: 'active'
        };
    }
}

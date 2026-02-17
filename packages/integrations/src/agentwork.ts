import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * AgentWork Connector - Job marketplace with escrow payments
 * 50% on claim, 50% on approval
 */
export class AgentWorkConnector {
    private baseUrl = 'https://agentwork.wtf';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.error('[AgentWork] Fetching jobs...');

            // TODO: AgentWork requires investigation
            // Has /docs endpoint but no manifest.json
            // May have undocumented API

            console.error('[AgentWork] API not yet implemented, returning empty');
            return [];

            // Placeholder for future implementation
        } catch (error) {
            console.error('[AgentWork] Error fetching jobs:', error);
            return [];
        }
    }

    private transformJobs(jobs: any[]): Job[] {
        return jobs.map(job => ({
            id: `agentwork-${job.id}`,
            title: job.title,
            description: job.description,
            salary: {
                min: job.reward || 0,
                max: job.reward || 0,
                currency: 'USDC'
            },
            postedAt: job.createdAt ? new Date(job.createdAt) : new Date(),
            category: JobCategory.DEVELOPMENT,
            tags: [],
            platform: Platform.AGENTWORK,
            url: `${this.baseUrl}/jobs/${job.id}`
        }));
    }
}

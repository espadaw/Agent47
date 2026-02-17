import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * AgentWork Connector - Job marketplace with escrow payments
 * Full API integration using /api/jobs endpoint
 * API: https://agentwork.wtf/api/jobs
 */
export class AgentWorkConnector {
    private baseUrl = 'https://agentwork.wtf';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.log('[AgentWork] Fetching jobs...');

            const response = await fetch(`${this.baseUrl}/api/jobs`);

            if (!response.ok) {
                console.error(`[AgentWork] API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            const jobs = this.transformJobs(data.jobs || []);

            console.log(`[AgentWork] Found ${jobs.length} jobs`);
            return jobs;
        } catch (error) {
            console.error('[AgentWork] Error fetching jobs:', error);
            return [];
        }
    }

    private transformJobs(jobs: any[]): Job[] {
        if (!Array.isArray(jobs)) {
            return [];
        }

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
            tags: job.tags || [],
            platform: Platform.AGENTWORK,
            url: `${this.baseUrl}/jobs/${job.id}`
        }));
    }
}

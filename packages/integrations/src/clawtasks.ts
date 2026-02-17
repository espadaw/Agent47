import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * ClawTasks Connector - Agent-to-agent bounty marketplace
 * Note: Platform currently in "free-task only" mode (beta)
 * API: https://clawtasks.com/skill.md
 */
export class ClawTasksConnector {
    private baseUrl = 'https://clawtasks.com';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.error('[ClawTasks] Fetching bounties...');

            // TODO: ClawTasks API endpoint needs investigation
            // Platform is currently in "free-task only" beta mode
            // May not have active paid bounties

            console.error('[ClawTasks] Platform in free-task mode, returning empty for now');
            return [];

            // When API is available, implement like this:
            // const response = await fetch(`${this.baseUrl}/api/bounties`);
            // const data = await response.json();
            // return this.transformBounties(data);
        } catch (error) {
            console.error('[ClawTasks] Error fetching jobs:', error);
            return [];
        }
    }

    private transformBounties(bounties: any[]): Job[] {
        return bounties.map(bounty => ({
            id: `clawtasks-${bounty.id}`,
            title: bounty.title,
            description: bounty.description,
            salary: {
                min: bounty.amount || 0,
                max: bounty.amount || 0,
                currency: 'USDC'
            },
            postedAt: bounty.createdAt ? new Date(bounty.createdAt) : new Date(),
            category: JobCategory.BOUNTY,
            tags: [],
            platform: Platform.CLAWTASKS,
            url: `${this.baseUrl}/bounties/${bounty.id}`
        }));
    }
}

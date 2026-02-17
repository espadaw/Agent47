import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * ClawTasks Connector - Agent-to-agent bounty marketplace
 * Full API integration using /api/bounties endpoint
 * API: https://clawtasks.com/api/bounties
 */
export class ClawTasksConnector {
    private baseUrl = 'https://clawtasks.com';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.log('[ClawTasks] Fetching bounties...');

            const response = await fetch(`${this.baseUrl}/api/bounties`);

            if (!response.ok) {
                console.error(`[ClawTasks] API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            const bounties = this.transformBounties(data.bounties || []);

            console.log(`[ClawTasks] Found ${bounties.length} bounties`);
            return bounties;
        } catch (error) {
            console.error('[ClawTasks] Error fetching jobs:', error);
            return [];
        }
    }

    private transformBounties(bounties: any[]): Job[] {
        if (!Array.isArray(bounties)) {
            return [];
        }

        return bounties
            .filter(b => b.status === 'open' || b.status === 'claimed') // Only active bounties
            .map(bounty => ({
                id: `clawtasks-${bounty.id}`,
                title: bounty.title,
                description: bounty.description,
                salary: {
                    min: parseFloat(bounty.amount) || 0,
                    max: parseFloat(bounty.amount) || 0,
                    currency: 'USDC'
                },
                postedAt: bounty.created_at ? new Date(bounty.created_at) : new Date(),
                category: JobCategory.BOUNTY,
                tags: bounty.tags || [],
                platform: Platform.CLAWTASKS,
                url: `${this.baseUrl}/bounties/${bounty.id}`
            }));
    }
}

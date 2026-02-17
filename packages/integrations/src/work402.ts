import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * Work402 Connector - Agent-to-agent commerce protocol
 * API Docs: https://work402.com/manifest.json
 */
export class Work402Connector {
    private baseUrl = 'https://api.work402.com/v1';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.error('[Work402] Fetching bounties...');

            // Build query params
            const params = new URLSearchParams();
            if (filters?.query) params.append('s', filters.query); // skill search
            if (filters?.minPrice) params.append('p', filters.minPrice.toString()); // min pay

            const url = `${this.baseUrl}/bounties${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`[Work402] API error: ${response.status}`);
                return [];
            }

            const data = await response.json();

            // Transform bounties to Job format
            const jobs = this.transformBounties(data.bounties || data || []);
            console.error(`[Work402] Found ${jobs.length} bounties`);

            return jobs;
        } catch (error) {
            console.error('[Work402] Error fetching jobs:', error);
            return [];
        }
    }

    private transformBounties(bounties: any[]): Job[] {
        if (!Array.isArray(bounties)) {
            console.error('[Work402] Invalid bounties data structure');
            return [];
        }

        return bounties.map(bounty => ({
            id: `work402-${bounty.id || bounty._id || Math.random()}`,
            title: bounty.title || bounty.name || 'Untitled Bounty',
            description: bounty.description || bounty.details || 'No description provided',
            salary: {
                min: bounty.pay || bounty.amount || bounty.reward || 0,
                max: bounty.pay || bounty.amount || bounty.reward || 0,
                currency: 'USDC'
            },
            postedAt: bounty.createdAt ? new Date(bounty.createdAt) : new Date(),
            category: JobCategory.BOUNTY,
            tags: bounty.skills || bounty.tags || [],
            platform: Platform.WORK402,
            url: `https://work402.com/bounties/${bounty.id || bounty._id}`
        })).filter(job => job.salary.min > 0); // Only include paid bounties
    }
}

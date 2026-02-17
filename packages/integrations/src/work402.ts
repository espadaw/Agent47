import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * Work402 Connector - Agent-to-agent commerce protocol  
 * API Docs: https://work402.com/listagent/skill.md
 * Public browsing endpoint (no auth required)
 */
export class Work402Connector {
    private baseUrl = 'https://work402.com';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.log('[Work402] Fetching bounties...');

            // Build query params - Work402 uses /api/bounties (not /api/v1/bounties)
            const params = new URLSearchParams();
            params.append('status', 'open'); // Only fetch open bounties
            if (filters?.query) params.append('skill', filters.query); // skill filter
            if (filters?.minPrice) params.append('min_payment', filters.minPrice.toString());

            const url = `${this.baseUrl}/api/bounties?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`[Work402] API error: ${response.status}`);
                return [];
            }

            const data = await response.json();

            // Transform bounties to Job format
            const jobs = this.transformBounties(data.bounties || []);
            console.log(`[Work402] Found ${jobs.length} bounties`);

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
            id: `work402-${bounty.id}`,
            title: bounty.title || 'Untitled Bounty',
            description: bounty.description || 'No description provided',
            salary: {
                min: parseFloat(bounty.payment?.amount || 0),
                max: parseFloat(bounty.payment?.amount || 0),
                currency: bounty.payment?.currency || 'USDC'
            },
            postedAt: bounty.created_at ? new Date(bounty.created_at) : new Date(),
            category: JobCategory.BOUNTY,
            tags: bounty.skills_required || [],
            platform: Platform.WORK402,
            url: `${this.baseUrl}/bounties/${bounty.id}`
        })).filter(job => job.salary.min > 0); // Only paid bounties
    }
}

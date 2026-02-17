import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * Moltverr Connector - Freelance marketplace for AI agents
 * Authenticated API access with registered agent
 * Expected: 30+ gigs, ~$480.97 total value
 */
export class MoltverrConnector {
    private baseUrl = 'https://www.moltverr.com';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.log('[Moltverr] Fetching gigs...');

            // Get API key from environment
            const apiKey = process.env.MOLTVERR_API_KEY;

            if (!apiKey) {
                console.warn('[Moltverr] No API key found - set MOLTVERR_API_KEY in .env');
                return [];
            }

            // Use authenticated API endpoint
            const response = await fetch(`${this.baseUrl}/api/gigs`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'User-Agent': 'Agent47-Aggregator/1.0'
                }
            });

            if (!response.ok) {
                console.error(`[Moltverr] API error: ${response.status}`);

                if (response.status === 401) {
                    console.error('[Moltverr] Invalid or expired API key');
                } else if (response.status === 403) {
                    console.error('[Moltverr] Account not yet claimed - visit claim URL');
                }
                return [];
            }

            const data = await response.json();

            // Handle different response formats
            const gigs = data.gigs || data.data || data || [];

            if (!Array.isArray(gigs)) {
                console.error('[Moltverr] Unexpected response format');
                return [];
            }

            const jobs = this.transformGigs(gigs);
            console.log(`[Moltverr] Found ${jobs.length} gigs`);

            return jobs;

        } catch (error) {
            console.error('[Moltverr] Error fetching jobs:', error);
            return [];
        }
    }

    private transformGigs(gigs: any[]): Job[] {
        return gigs
            .filter(gig => gig.status === 'open' || !gig.status) // Only open gigs
            .map(gig => ({
                id: `moltverr-${gig.id || gig._id}`,
                title: gig.title || 'Untitled Gig',
                description: gig.description || '',
                salary: {
                    min: parseFloat(gig.budget || 0),
                    max: parseFloat(gig.budget || 0),
                    currency: 'USD'
                },
                postedAt: gig.createdAt ? new Date(gig.createdAt) : new Date(),
                category: JobCategory.GIG,
                tags: Array.isArray(gig.tags) ? gig.tags : (gig.category ? [gig.category] : []),
                platform: Platform.MOLTVERR,
                url: `${this.baseUrl}/gigs/${gig.id || gig._id}`
            }));
    }
}

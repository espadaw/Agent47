import { Job, JobFilter, Platform, JobCategory } from '@agent47/shared';

/**
 * Moltverr Connector - Freelance marketplace for AI agents
 * Humans post gigs, agents complete them
 * 
 * ⚠️ REQUIRES AGENT REGISTRATION: This platform requires agents to register
 * and obtain an API key before accessing gig listings.
 * 
 * Registration: POST https://www.moltverr.com/api/agents/register
 * Required: name, bio, skills
 * Returns: api_key (save this!), claim_url (send to human for verification)
 * 
 * Until registration is implemented, this connector returns empty.
 * See: https://moltverr.com/skill.md for full documentation
 */
export class MoltverrConnector {
    private baseUrl = 'https://moltverr.com';

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            console.error('[Moltverr] Fetching gigs...');

            // TODO: Moltverr requires agent registration + API key authentication
            // Cannot browse gigs without authentication
            // See skill.md for registration process

            console.error('[Moltverr] Registration required - returning empty until implemented');
            return [];

            // Placeholder for future implementation when API key is available
        } catch (error) {
            console.error('[Moltverr] Error fetching jobs:', error);
            return [];
        }
    }

    private transformGigs(gigs: any[]): Job[] {
        return gigs.map(gig => ({
            id: `moltverr-${gig.id}`,
            title: gig.title,
            description: gig.description,
            salary: {
                min: gig.budget || 0,
                max: gig.budget || 0,
                currency: 'USD'
            },
            postedAt: gig.createdAt ? new Date(gig.createdAt) : new Date(),
            category: JobCategory.GIG,
            tags: [],
            platform: Platform.MOLTVERR,
            url: `${this.baseUrl}/gigs/${gig.id}`
        }));
    }
}

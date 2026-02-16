import { BasePlatformConnector } from './base';
import { Platform, JobCategory } from '@agent47/shared';
import fetch from 'node-fetch';
/**
 * RentAHuman Connector
 *
 * RentAHuman provides human-in-the-loop services for AI agents via MCP.
 *
 * Note: As of Feb 2026, the RentAHuman API and MCP integration are not yet
 * publicly available. The platform is in development. This connector will
 * return real data once RentAHuman launches their public API/MCP server.
 *
 * For early access, contact RentAHuman directly at https://rentahuman.ai
 */
export class RentAHumanConnector extends BasePlatformConnector {
    apiUrl = 'https://rentahuman.ai/api';
    async fetchJobs(filters) {
        try {
            console.log('[RentAHuman] Fetching available humans...');
            // Try the real API endpoint for browsing humans
            const response = await fetch(`${this.apiUrl}/humans?limit=20`);
            if (response.ok) {
                const data = await response.json();
                const humans = data.humans || [];
                console.log(`[RentAHuman] Found ${humans.length} available humans`);
                return humans
                    .map(human => this.normalizeJob(human))
                    .filter(job => this.matchesFilter(job, filters));
            }
            else if (response.status === 401 || response.status === 403) {
                console.log(`[RentAHuman] API requires authentication (${response.status})`);
                console.log('[RentAHuman] Please contact RentAHuman for API access');
                return [];
            }
            else {
                console.log(`[RentAHuman] API returned ${response.status}`);
                return [];
            }
        }
        catch (error) {
            this.handleError(error, Platform.RENTAHUMAN);
            console.error('[RentAHuman] API Error:', error);
            return [];
        }
    }
    normalizeJob(human) {
        const rate = human.hourlyRate || human.rate || human.price || 0;
        const rateNum = typeof rate === 'string' ? parseFloat(rate.replace(/[^0-9.]/g, '')) : rate;
        return {
            id: human.id || human.userId || `rah-${Date.now()}`,
            platform: Platform.RENTAHUMAN,
            title: `Hire Human: ${human.name || human.username || 'Available Worker'}`,
            description: human.bio || human.description || human.skills?.join(', ') || 'Human worker available for tasks',
            url: human.profileUrl || `https://rentahuman.ai/humans/${human.id}`,
            salary: {
                min: rateNum,
                max: rateNum,
                currency: human.currency || 'USD',
            },
            postedAt: human.createdAt ? new Date(human.createdAt) : new Date(),
            category: JobCategory.DATA,
            tags: human.skills || ['human-in-the-loop', 'verification'],
        };
    }
    matchesFilter(job, filters) {
        if (!filters)
            return true;
        if (filters.query) {
            const query = filters.query.toLowerCase();
            if (!job.title.toLowerCase().includes(query) &&
                !job.description.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (filters.minPrice && job.salary.min < filters.minPrice)
            return false;
        if (filters.maxPrice && job.salary.max > filters.maxPrice)
            return false;
        return true;
    }
}

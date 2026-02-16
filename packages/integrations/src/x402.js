import { BasePlatformConnector } from './base';
import { Platform, JobCategory } from '@agent47/shared';
import fetch from 'node-fetch';
/**
 * x402 Bazaar Connector
 *
 * Note: The x402 Bazaar discovery endpoint is in early development.
 * This connector will return real data once the public API is available.
 */
export class X402Connector extends BasePlatformConnector {
    facilitatorUrl = 'https://www.x402.org/facilitator';
    async fetchJobs(filters) {
        try {
            console.log('[x402] Fetching resources from Bazaar discovery endpoint...');
            const response = await fetch(`${this.facilitatorUrl}/discovery/resources`);
            if (response.ok) {
                const data = await response.json();
                const resources = data.resources || [];
                console.log(`[x402] Found ${resources.length} resources`);
                return resources
                    .map(resource => this.normalizeJob(resource))
                    .filter(job => this.matchesFilter(job, filters));
            }
            else {
                console.log(`[x402] Discovery endpoint not yet available (${response.status})`);
                console.log('[x402] The Bazaar is in early development - check back soon');
                return [];
            }
        }
        catch (error) {
            this.handleError(error, Platform.X402_BAZAAR);
            console.error('[x402] API Error:', error);
            return [];
        }
    }
    normalizeJob(resource) {
        const priceAmount = resource.pricing?.amount
            ? parseFloat(resource.pricing.amount)
            : 0;
        return {
            id: resource.id,
            platform: Platform.X402_BAZAAR,
            title: resource.metadata?.title || resource.description.substring(0, 60),
            description: resource.description,
            url: resource.endpoint,
            salary: {
                min: priceAmount,
                max: priceAmount,
                currency: resource.pricing?.currency || 'USDC',
            },
            postedAt: new Date(),
            category: this.mapCategory(resource.metadata?.category || ''),
            tags: resource.metadata?.tags || ['x402'],
        };
    }
    mapCategory(category) {
        const cat = category.toLowerCase();
        if (cat.includes('dev') || cat.includes('code'))
            return JobCategory.DEVELOPMENT;
        if (cat.includes('data') || cat.includes('analysis'))
            return JobCategory.DATA;
        if (cat.includes('design') || cat.includes('creative'))
            return JobCategory.CREATIVE;
        if (cat.includes('write') || cat.includes('content'))
            return JobCategory.WRITING;
        return JobCategory.OTHER;
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

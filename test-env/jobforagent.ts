import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from './types';

export class JobForAgentScraper extends BaseScraper {
    // We found a direct API endpoint!
    private apiUrl = 'https://jobforagent.com/api/jobs/raw';

    protected getPlatform(): Platform { return Platform.JOBFORAGENT; }

    // Override fetchJobs to use API directly, skipping Playwright overhead
    async fetchJobs(filters?: any): Promise<Job[]> {
        try {
            console.log('[JobForAgent] Fetching jobs from API...');
            // Use node-fetch or global fetch
            const response = await fetch(this.apiUrl);

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            // Expected format: array of jobs or { jobs: [...] }
            // Let's assume array based on "raw" in URL, but handle object wrapper
            const jobs = Array.isArray(data) ? data : (data.jobs || []);

            console.log(`[JobForAgent] Found ${jobs.length} jobs via API`);

            return jobs.map((job: any) => this.normalizeJob(job));
        } catch (error) {
            console.error('[JobForAgent] API error:', error);
            // Fallback to scraping if API fails? No, API is better.
            return [];
        }
    }

    // Keep scrapeJobs for interface compliance but it won't be called
    protected async scrapeJobs(): Promise<Job[]> {
        return [];
    }

    protected normalizeJob(rawJob: any): Job {
        // Adapt to API response structure (checking properties)
        return {
            id: rawJob.id || `jfa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.JOBFORAGENT,
            title: rawJob.title || rawJob.name || 'Untitled Job',
            description: rawJob.description || rawJob.details || '',
            url: rawJob.url || rawJob.link || 'https://jobforagent.com',
            salary: this.parseSalary(rawJob.salary || rawJob.payment || rawJob.budget || ''),
            postedAt: rawJob.created_at ? new Date(rawJob.created_at) : new Date(),
            category: JobCategory.OTHER,
            tags: rawJob.tags || ['ai-agent-job'],
        };
    }
}

import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from '@agent47/shared';

export class JobForAgentScraper extends BaseScraper {
    private apiUrl = 'https://jobforagent.com/api/jobs/raw';

    protected getPlatform(): Platform { return Platform.JOBFORAGENT; }

    async fetchJobs(filters?: any): Promise<Job[]> {
        try {
            console.log('[JobForAgent] Fetching jobs from API...');
            const response = await fetch(this.apiUrl);

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json() as any;
            const jobs = Array.isArray(data) ? data : (data.jobs || []);

            console.log(`[JobForAgent] Found ${jobs.length} jobs via API`);

            return jobs.map((job: any) => this.normalizeJob(job));
        } catch (error) {
            console.error('[JobForAgent] API error:', error);
            return [];
        }
    }

    protected async scrapeJobs(): Promise<Job[]> {
        return [];
    }

    protected normalizeJob(rawJob: any): Job {
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

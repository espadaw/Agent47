import { BaseScraper } from './base-scraper';
import { Platform, JobCategory } from '@agent47/shared';
export class JobForAgentScraper extends BaseScraper {
    apiUrl = 'https://jobforagent.com/api/jobs/raw';
    getPlatform() { return Platform.JOBFORAGENT; }
    async fetchJobs(filters) {
        try {
            console.log('[JobForAgent] Fetching jobs from API...');
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }
            const data = await response.json();
            const jobs = Array.isArray(data) ? data : (data.jobs || []);
            console.log(`[JobForAgent] Found ${jobs.length} jobs via API`);
            return jobs.map((job) => this.normalizeJob(job));
        }
        catch (error) {
            console.error('[JobForAgent] API error:', error);
            return [];
        }
    }
    async scrapeJobs() {
        return [];
    }
    normalizeJob(rawJob) {
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

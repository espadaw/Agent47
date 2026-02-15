import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from './types';

export class PlayhouseScraper extends BaseScraper {
    private baseUrl = 'https://playhouse.bot';
    protected getPlatform(): Platform { return Platform.PLAYHOUSE; }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();
        try {
            console.log('[Playhouse] Navigating to agents...');
            await this.navigateWithRetry(page, `${this.baseUrl}/agents`);
            await page.waitForTimeout(3000);
            const agents = await page.evaluate(() => {
                const listings: any[] = [];
                document.querySelectorAll('a[href*="/agent/"]').forEach(el => {
                    const title = el.querySelector('div')?.textContent || el.textContent || '';
                    if (title.trim()) listings.push({ title, url: el.href });
                });
                return listings;
            });
            console.log(`[Playhouse] Found ${agents.length} agents`);
            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[Playhouse] Scraping error:', error);
            return [];
        } finally { await page.close(); }
    }
    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `playhouse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.PLAYHOUSE,
            title: rawAgent.title || 'Playhouse Agent',
            description: 'Business automation agent',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: JobCategory.DEVELOPMENT,
            tags: ['business-automation'],
        };
    }
}

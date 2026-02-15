import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from './types';

export class MetaschoolScraper extends BaseScraper {
    private baseUrl = 'https://metaschool.so';
    protected getPlatform(): Platform { return Platform.METASCHOOL; }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();
        try {
            console.log('[Metaschool] Navigating to marketplace...');
            await this.navigateWithRetry(page, `${this.baseUrl}/ai-agents`);
            await page.waitForTimeout(3000);
            const agents = await page.evaluate(() => {
                const listings: any[] = [];
                const cards = document.querySelectorAll('[class*="card"]');
                cards.forEach(el => {
                    const title = el.querySelector('h2, h3')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    if (title && link) listings.push({ title, url: link });
                });
                return listings;
            });
            console.log(`[Metaschool] Found ${agents.length} agents`);
            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[Metaschool] Scraping error:', error);
            return [];
        } finally { await page.close(); }
    }
    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `metaschool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.METASCHOOL,
            title: rawAgent.title,
            description: 'AI agent or automation tool',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: JobCategory.DEVELOPMENT,
            tags: ['automation'],
        };
    }
}

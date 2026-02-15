import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from './types';

export class AIAgentStoreScraper extends BaseScraper {
    private baseUrl = 'https://aiagentstore.ai';
    protected getPlatform(): Platform { return Platform.AI_AGENT_STORE; }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();
        try {
            console.log('[AI Agent Store] Navigating to store...');
            await this.navigateWithRetry(page, this.baseUrl);
            await page.waitForTimeout(3000);
            const agents = await page.evaluate(() => {
                const listings: any[] = [];
                const items = document.querySelectorAll('.card, .item, [role="listitem"]');
                items.forEach(el => {
                    const title = el.querySelector('h2, h3, h4')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    if (title && link) listings.push({ title, url: link });
                });
                return listings;
            });
            console.log(`[AI Agent Store] Found ${agents.length} agents`);
            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[AI Agent Store] Scraping error:', error);
            return [];
        } finally { await page.close(); }
    }
    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `aistore-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.AI_AGENT_STORE,
            title: rawAgent.title,
            description: 'AI agent from store directory',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: JobCategory.OTHER,
            tags: ['ai-agent'],
        };
    }
}

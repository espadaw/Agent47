import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from './types';

export class MuleRunScraper extends BaseScraper {
    private baseUrl = 'https://mulerun.com';
    protected getPlatform(): Platform { return Platform.MULERUN; }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();
        try {
            console.log('[MuleRun] Navigating to homepage...');
            // Try homepage instead of marketplace
            await this.navigateWithRetry(page, this.baseUrl);
            await page.waitForTimeout(5000);

            // Try to scroll
            await page.evaluate(() => window.scrollTo(0, 500));
            await page.waitForTimeout(1000);

            const agents = await page.evaluate(() => {
                const listings: any[] = [];
                // Look for any links that look like product/agent pages
                const links = Array.from(document.querySelectorAll('a'));
                const productLinks = links.filter(a => a.href.includes('/product/') || a.href.includes('/agent/'));

                // Deduplicate
                const uniqueLinks = new Map();
                productLinks.forEach(a => {
                    const url = a.href;
                    if (!uniqueLinks.has(url)) {
                        const title = a.textContent?.trim() || a.querySelector('h3, h4, div')?.textContent?.trim();
                        if (title) uniqueLinks.set(url, title);
                    }
                });

                uniqueLinks.forEach((title, url) => {
                    listings.push({ title, url });
                });

                return listings;
            });
            console.log(`[MuleRun] Found ${agents.length} agents`);
            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[MuleRun] Scraping error:', error);
            return [];
        } finally { await page.close(); }
    }

    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `mulerun-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.MULERUN,
            title: rawAgent.title,
            description: 'AI agent from MuleRun',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: JobCategory.OTHER,
            tags: ['marketplace', 'autonomous-agent'],
        };
    }
}

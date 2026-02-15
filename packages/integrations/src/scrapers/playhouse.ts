import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from '@agent47/shared';

/**
 * Playhouse Scraper
 * 
 * Scrapes AI agent listings from playhouse.bot - 500+ business automation agents
 */
export class PlayhouseScraper extends BaseScraper {
    private baseUrl = 'https://playhouse.bot';

    protected getPlatform(): Platform {
        return Platform.PLAYHOUSE;
    }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();

        try {
            console.log('[Playhouse] Navigating to agents...');
            await this.navigateWithRetry(page, `${this.baseUrl}/agents`);

            await page.waitForTimeout(3000);

            // Scroll to load more
            for (let i = 0; i < 2; i++) {
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
                await page.waitForTimeout(500);
            }

            const agents = await page.evaluate(() => {
                const listings: any[] = [];
                const agentElements = document.querySelectorAll('[class*="agent"], [class*="card"]');

                agentElements.forEach((el) => {
                    const title = el.querySelector('h2, h3, [class*="title"]')?.textContent?.trim();
                    const description = el.querySelector('p, [class*="description"]')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    const category = el.querySelector('[class*="category"]')?.textContent?.trim();

                    if (title && link) {
                        listings.push({ title, description: description || '', url: link, category: category || '' });
                    }
                });

                return listings;
            });

            console.log(`[Playhouse] Found ${agents.length} agents`);
            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[Playhouse] Scraping error:', error);
            return [];
        } finally {
            await page.close();
        }
    }

    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `playhouse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.PLAYHOUSE,
            title: rawAgent.title,
            description: rawAgent.description || 'Business automation agent',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: this.mapCategory(rawAgent.category),
            tags: [rawAgent.category, 'business-automation'].filter(Boolean),
        };
    }

    private mapCategory(category: string): JobCategory {
        if (!category) return JobCategory.OTHER;
        const cat = category.toLowerCase();
        if (cat.includes('data')) return JobCategory.DATA;
        if (cat.includes('creative')) return JobCategory.CREATIVE;
        if (cat.includes('writing')) return JobCategory.WRITING;
        return JobCategory.DEVELOPMENT;
    }
}

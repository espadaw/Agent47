import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from '@agent47/shared';

/**
 * Metaschool Scraper
 * 
 * Scrapes AI agent listings from metaschool.so - AI agents and tools marketplace
 */
export class MetaschoolScraper extends BaseScraper {
    private baseUrl = 'https://metaschool.so';

    protected getPlatform(): Platform {
        return Platform.METASCHOOL;
    }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();

        try {
            console.log('[Metaschool] Navigating to marketplace...');
            await this.navigateWithRetry(page, `${this.baseUrl}/ai-agents`);

            await page.waitForTimeout(3000);

            // Scroll to load more agents
            for (let i = 0; i < 2; i++) {
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
                await page.waitForTimeout(500);
            }

            const agents = await page.evaluate(() => {
                const listings: any[] = [];
                const agentElements = document.querySelectorAll('[class*="agent"], [class*="tool"], [class*="card"]');

                agentElements.forEach((el) => {
                    const title = el.querySelector('h2, h3, [class*="title"]')?.textContent?.trim();
                    const description = el.querySelector('p, [class*="description"]')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    const category = el.querySelector('[class*="category"], [class*="type"]')?.textContent?.trim();

                    if (title && link) {
                        listings.push({ title, description: description || '', url: link, category: category || '' });
                    }
                });

                return listings;
            });

            console.log(`[Metaschool] Found ${agents.length} agents/tools`);
            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[Metaschool] Scraping error:', error);
            return [];
        } finally {
            await page.close();
        }
    }

    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `metaschool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.METASCHOOL,
            title: rawAgent.title,
            description: rawAgent.description || 'AI agent or automation tool',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: this.mapCategory(rawAgent.category),
            tags: [rawAgent.category, 'automation', 'tools'].filter(Boolean),
        };
    }

    private mapCategory(category: string): JobCategory {
        if (!category) return JobCategory.OTHER;
        const cat = category.toLowerCase();
        if (cat.includes('automation') || cat.includes('dev')) return JobCategory.DEVELOPMENT;
        if (cat.includes('data') || cat.includes('analysis')) return JobCategory.DATA;
        if (cat.includes('content') || cat.includes('write')) return JobCategory.WRITING;
        if (cat.includes('creative')) return JobCategory.CREATIVE;
        return JobCategory.OTHER;
    }
}

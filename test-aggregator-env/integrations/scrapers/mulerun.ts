import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from '@agent47/shared';

/**
 * MuleRun Scraper
 * 
 * Scrapes AI agent listings from mulerun.com - largest AI agent marketplace globally
 */
export class MuleRunScraper extends BaseScraper {
    private baseUrl = 'https://mulerun.com';

    protected getPlatform(): Platform {
        return Platform.MULERUN;
    }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();

        try {
            console.log('[MuleRun] Navigating to marketplace...');
            await this.navigateWithRetry(page, `${this.baseUrl}/marketplace`);

            // Wait for marketplace to load
            await page.waitForTimeout(3000);

            // Scroll to trigger lazy loading
            for (let i = 0; i < 3; i++) {
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
                await page.waitForTimeout(500);
            }

            // Extract agent listings
            const agents = await page.evaluate(() => {
                const listings: any[] = [];

                // Look for agent/product cards
                const agentElements = document.querySelectorAll(
                    '[class*="agent"], [class*="product"], [class*="card"], [class*="item"]'
                );

                agentElements.forEach((el) => {
                    const title = el.querySelector('h2, h3, h4, [class*="title"], [class*="name"]')?.textContent?.trim();
                    const description = el.querySelector('p, [class*="description"]')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    const price = el.querySelector('[class*="price"], [class*="cost"]')?.textContent?.trim();
                    const category = el.querySelector('[class*="category"], [class*="tag"]')?.textContent?.trim();

                    if (title && link) {
                        listings.push({
                            title,
                            description: description || '',
                            url: link,
                            price: price || 'Free',
                            category: category || '',
                        });
                    }
                });

                return listings;
            });

            console.log(`[MuleRun] Found ${agents.length} agents`);

            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[MuleRun] Scraping error:', error);
            return [];
        } finally {
            await page.close();
        }
    }

    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `mulerun-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.MULERUN,
            title: rawAgent.title,
            description: rawAgent.description || 'AI agent available on MuleRun marketplace',
            url: rawAgent.url,
            salary: this.parseSalary(rawAgent.price),
            postedAt: new Date(),
            category: this.mapCategory(rawAgent.category),
            tags: [rawAgent.category, 'marketplace', 'autonomous-agent'].filter(Boolean),
        };
    }

    private mapCategory(category: string): JobCategory {
        if (!category) return JobCategory.OTHER;

        const cat = category.toLowerCase();

        if (cat.includes('video') || cat.includes('image') || cat.includes('creative')) {
            return JobCategory.CREATIVE;
        }
        if (cat.includes('content') || cat.includes('writing')) {
            return JobCategory.WRITING;
        }
        if (cat.includes('data') || cat.includes('analysis') || cat.includes('research')) {
            return JobCategory.DATA;
        }
        if (cat.includes('code') || cat.includes('develop') || cat.includes('automation')) {
            return JobCategory.DEVELOPMENT;
        }

        return JobCategory.OTHER;
    }
}

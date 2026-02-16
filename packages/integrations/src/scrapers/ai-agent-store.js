import { BaseScraper } from './base-scraper';
import { Platform, JobCategory } from '@agent47/shared';
/**
 * AI Agent Store Scraper
 *
 * Scrapes AI agent listings from aiagentstore.ai - comprehensive directory
 */
export class AIAgentStoreScraper extends BaseScraper {
    baseUrl = 'https://aiagentstore.ai';
    getPlatform() {
        return Platform.AI_AGENT_STORE;
    }
    async scrapeJobs() {
        const page = await this.browser.newPage();
        try {
            console.log('[AI Agent Store] Navigating to store...');
            await this.navigateWithRetry(page, this.baseUrl);
            await page.waitForTimeout(3000);
            // Scroll to load lazy content
            for (let i = 0; i < 3; i++) {
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
                await page.waitForTimeout(500);
            }
            const agents = await page.evaluate(() => {
                const listings = [];
                const agentElements = document.querySelectorAll('[class*="agent"], [class*="item"], [class*="card"]');
                agentElements.forEach((el) => {
                    const title = el.querySelector('h2, h3, h4, [class*="title"], [class*="name"]')?.textContent?.trim();
                    const description = el.querySelector('p, [class*="description"]')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    const tags = Array.from(el.querySelectorAll('[class*="tag"], [class*="category"]'))
                        .map(tag => tag.textContent?.trim())
                        .filter(Boolean);
                    if (title && link) {
                        listings.push({ title, description: description || '', url: link, tags });
                    }
                });
                return listings;
            });
            console.log(`[AI Agent Store] Found ${agents.length} agents`);
            return agents.map(agent => this.normalizeJob(agent));
        }
        catch (error) {
            console.error('[AI Agent Store] Scraping error:', error);
            return [];
        }
        finally {
            await page.close();
        }
    }
    normalizeJob(rawAgent) {
        return {
            id: `aistore-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.AI_AGENT_STORE,
            title: rawAgent.title,
            description: rawAgent.description || 'AI agent from store directory',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: this.categorizeFromTags(rawAgent.tags),
            tags: rawAgent.tags || ['ai-agent'],
        };
    }
    categorizeFromTags(tags) {
        if (!tags || tags.length === 0)
            return JobCategory.OTHER;
        const tagsStr = tags.join(' ').toLowerCase();
        if (tagsStr.includes('code') || tagsStr.includes('dev'))
            return JobCategory.DEVELOPMENT;
        if (tagsStr.includes('data'))
            return JobCategory.DATA;
        if (tagsStr.includes('creative') || tagsStr.includes('design'))
            return JobCategory.CREATIVE;
        if (tagsStr.includes('write') || tagsStr.includes('content'))
            return JobCategory.WRITING;
        return JobCategory.OTHER;
    }
}

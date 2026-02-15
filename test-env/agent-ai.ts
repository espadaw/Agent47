import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from './types';

export class AgentAIScraper extends BaseScraper {
    private baseUrl = 'https://agent.ai';
    protected getPlatform(): Platform { return Platform.AGENT_AI; }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();
        try {
            console.log('[Agent.ai] Navigating to agent directory...');
            await this.navigateWithRetry(page, `${this.baseUrl}/agents`);
            await page.waitForTimeout(3000);
            await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
            await page.waitForTimeout(1000);

            const agents = await page.evaluate(() => {
                const listings: any[] = [];
                const agentElements = document.querySelectorAll('[class*="agent"], [class*="card"], [class*="profile"]');
                agentElements.forEach((el) => {
                    const name = el.querySelector('h2, h3, [class*="name"], [class*="title"]')?.textContent?.trim();
                    const description = el.querySelector('p, [class*="description"], [class*="bio"]')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    if (name && link) {
                        listings.push({ name, description: description || '', url: link });
                    }
                });
                return listings;
            });
            console.log(`[Agent.ai] Found ${agents.length} agents`);
            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[Agent.ai] Scraping error:', error);
            return [];
        } finally { await page.close(); }
    }

    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `agent-ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.AGENT_AI,
            title: `Hire Agent: ${rawAgent.name}`,
            description: rawAgent.description || 'AI agent available for hire',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' },
            postedAt: new Date(),
            category: JobCategory.OTHER,
            tags: ['ai-agent'],
        };
    }
}

import { BaseScraper } from './base-scraper';
import { Job, Platform, JobCategory } from '@agent47/shared';

/**
 * Agent.ai Scraper
 * 
 * Scrapes AI agent listings from agent.ai - professional network for AI agents
 */
export class AgentAIScraper extends BaseScraper {
    private baseUrl = 'https://agent.ai';

    protected getPlatform(): Platform {
        return Platform.AGENT_AI;
    }

    protected async scrapeJobs(): Promise<Job[]> {
        const page = await this.browser!.newPage();

        try {
            console.log('[Agent.ai] Navigating to agent directory...');
            await this.navigateWithRetry(page, `${this.baseUrl}/agents`);

            // Wait for content
            await page.waitForTimeout(3000);

            // Scroll to load more agents (if lazy loading)
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForTimeout(1000);

            // Extract agent listings
            const agents = await page.evaluate(() => {
                const listings: any[] = [];

                // Look for agent cards
                const agentElements = document.querySelectorAll('[class*="agent"], [class*="card"], [class*="profile"]');

                agentElements.forEach((el) => {
                    const name = el.querySelector('h2, h3, [class*="name"], [class*="title"]')?.textContent?.trim();
                    const description = el.querySelector('p, [class*="description"], [class*="bio"]')?.textContent?.trim();
                    const link = el.querySelector('a')?.href;
                    const skills = Array.from(el.querySelectorAll('[class*="skill"], [class*="tag"]'))
                        .map(tag => tag.textContent?.trim())
                        .filter(Boolean);

                    if (name && link) {
                        listings.push({
                            name,
                            description: description || '',
                            url: link,
                            skills,
                        });
                    }
                });

                return listings;
            });

            console.log(`[Agent.ai] Found ${agents.length} agents`);

            return agents.map(agent => this.normalizeJob(agent));
        } catch (error) {
            console.error('[Agent.ai] Scraping error:', error);
            return [];
        } finally {
            await page.close();
        }
    }

    protected normalizeJob(rawAgent: any): Job {
        return {
            id: `agent-ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform: Platform.AGENT_AI,
            title: `Hire Agent: ${rawAgent.name}`,
            description: rawAgent.description || 'AI agent available for hire',
            url: rawAgent.url,
            salary: { min: 0, max: 0, currency: 'USD' }, // Agent.ai doesn't show pricing upfront
            postedAt: new Date(),
            category: this.categorizeAgent(rawAgent.skills),
            tags: rawAgent.skills || ['ai-agent'],
        };
    }

    private categorizeAgent(skills: string[]): JobCategory {
        if (!skills || skills.length === 0) return JobCategory.OTHER;

        const skillsStr = skills.join(' ').toLowerCase();

        if (skillsStr.includes('code') || skillsStr.includes('develop')) return JobCategory.DEVELOPMENT;
        if (skillsStr.includes('data') || skillsStr.includes('analysis')) return JobCategory.DATA;
        if (skillsStr.includes('design') || skillsStr.includes('creative')) return JobCategory.CREATIVE;
        if (skillsStr.includes('write') || skillsStr.includes('content')) return JobCategory.WRITING;

        return JobCategory.OTHER;
    }
}

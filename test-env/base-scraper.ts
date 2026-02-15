import { Browser, chromium, Page } from 'playwright';
import { BasePlatformConnector } from './base';
import { Job, JobFilter, Platform } from './types';

export abstract class BaseScraper extends BasePlatformConnector {
    protected browser: Browser | null = null;
    protected lastRequest: number = 0;
    protected minDelay: number = 2000;

    protected abstract scrapeJobs(): Promise<Job[]>;

    protected async initBrowser(): Promise<void> {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    }

    protected async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    protected async waitIfNeeded(): Promise<void> {
        const elapsed = Date.now() - this.lastRequest;
        if (elapsed < this.minDelay) {
            await new Promise(resolve => setTimeout(resolve, this.minDelay - elapsed));
        }
        this.lastRequest = Date.now();
    }

    protected async navigateWithRetry(page: Page, url: string, maxRetries: number = 3): Promise<void> {
        for (let i = 0; i < maxRetries; i++) {
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                return;
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`[Scraper] Retry ${i + 1}/${maxRetries} for ${url}`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }

    async fetchJobs(filters?: JobFilter): Promise<Job[]> {
        try {
            await this.waitIfNeeded();
            await this.initBrowser();
            const jobs = await this.scrapeJobs();
            return jobs.filter(job => this.matchesFilter(job, filters));
        } catch (error) {
            this.handleError(error, this.getPlatform());
            console.error(`[${this.getPlatform()}] Scraping failed:`, error);
            return [];
        } finally {
            await this.closeBrowser();
        }
    }

    protected abstract getPlatform(): Platform;

    protected parseSalary(salaryStr: string): { min: number; max: number; currency: string } {
        if (!salaryStr) return { min: 0, max: 0, currency: 'USD' };
        const cleaned = salaryStr.toLowerCase().replace(/per hour|\/hr|hourly/gi, '').trim();
        let currency = 'USD';
        if (cleaned.includes('usdc')) currency = 'USDC';
        else if (cleaned.includes('eth')) currency = 'ETH';
        else if (cleaned.includes('€')) currency = 'EUR';
        else if (cleaned.includes('£')) currency = 'GBP';

        const numbers = cleaned.match(/\d+(?:,\d{3})*(?:\.\d{2})?/g);
        if (!numbers || numbers.length === 0) return { min: 0, max: 0, currency };

        const values = numbers.map(n => parseFloat(n.replace(/,/g, '')));
        if (values.length === 1) return { min: values[0], max: values[0], currency };
        return { min: Math.min(...values), max: Math.max(...values), currency };
    }

    protected matchesFilter(job: Job, filters?: JobFilter): boolean {
        if (!filters) return true;
        if (filters.query) {
            const query = filters.query.toLowerCase();
            if (!job.title.toLowerCase().includes(query) && !job.description.toLowerCase().includes(query)) return false;
        }
        if (filters.minPrice && job.salary.min < filters.minPrice) return false;
        if (filters.maxPrice && job.salary.max > filters.maxPrice) return false;
        return true;
    }
}

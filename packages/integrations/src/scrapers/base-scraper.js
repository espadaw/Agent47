import { chromium } from 'playwright';
import { BasePlatformConnector } from '../base';
/**
 * Base Scraper Class
 *
 * Provides common functionality for web scraping-based connectors.
 * Uses Playwright for browser automation and handles caching, rate limiting, and error handling.
 */
export class BaseScraper extends BasePlatformConnector {
    browser = null;
    lastRequest = 0;
    minDelay = 2000; // 2 seconds between requests
    /**
     * Initialize Playwright browser
     */
    async initBrowser() {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    }
    /**
     * Close Playwright browser
     */
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
    /**
     * Rate limiting - wait if needed before making request
     */
    async waitIfNeeded() {
        const elapsed = Date.now() - this.lastRequest;
        if (elapsed < this.minDelay) {
            await new Promise(resolve => setTimeout(resolve, this.minDelay - elapsed));
        }
        this.lastRequest = Date.now();
    }
    /**
     * Navigate to URL with retry logic
     */
    async navigateWithRetry(page, url, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                await page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                });
                return;
            }
            catch (error) {
                if (i === maxRetries - 1)
                    throw error;
                console.log(`[Scraper] Retry ${i + 1}/${maxRetries} for ${url}`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    /**
     * Main fetch method - handles browser lifecycle and error handling
     */
    async fetchJobs(filters) {
        try {
            await this.waitIfNeeded();
            await this.initBrowser();
            const jobs = await this.scrapeJobs();
            return jobs.filter(job => this.matchesFilter(job, filters));
        }
        catch (error) {
            this.handleError(error, this.getPlatform());
            console.error(`[${this.getPlatform()}] Scraping failed:`, error);
            // Return empty array instead of throwing
            // This prevents one broken scraper from breaking the entire system
            return [];
        }
        finally {
            await this.closeBrowser();
        }
    }
    /**
     * Parse salary string into structured format
     */
    parseSalary(salaryStr) {
        if (!salaryStr) {
            return { min: 0, max: 0, currency: 'USD' };
        }
        // Remove common words
        const cleaned = salaryStr.toLowerCase()
            .replace(/per hour|\/hr|hourly/gi, '')
            .trim();
        // Extract currency
        let currency = 'USD';
        if (cleaned.includes('usdc'))
            currency = 'USDC';
        else if (cleaned.includes('eth'))
            currency = 'ETH';
        else if (cleaned.includes('€'))
            currency = 'EUR';
        else if (cleaned.includes('£'))
            currency = 'GBP';
        // Extract numbers
        const numbers = cleaned.match(/\d+(?:,\d{3})*(?:\.\d{2})?/g);
        if (!numbers || numbers.length === 0) {
            return { min: 0, max: 0, currency };
        }
        const values = numbers.map(n => parseFloat(n.replace(/,/g, '')));
        if (values.length === 1) {
            const val = values[0] ?? 0; // Fallback to 0 if undefined (should not happen due to length check)
            return { min: val, max: val, currency };
        }
        else {
            return {
                min: Math.min(...values),
                max: Math.max(...values),
                currency
            };
        }
    }
    /**
     * Filter jobs based on criteria
     */
    matchesFilter(job, filters) {
        if (!filters)
            return true;
        if (filters.query) {
            const query = filters.query.toLowerCase();
            if (!job.title.toLowerCase().includes(query) &&
                !job.description.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (filters.minPrice && job.salary.min < filters.minPrice)
            return false;
        if (filters.maxPrice && job.salary.max > filters.maxPrice)
            return false;
        return true;
    }
}

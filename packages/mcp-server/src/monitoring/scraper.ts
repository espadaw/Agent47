import { PlatformStatus } from './healthcheck.js';

export interface PlatformData {
    name: string;
    jobCount: number;
    status: 'active' | 'maintenance' | 'error';
    error?: string;
    lastScraped: string;
}

// Scrape RentAHuman
async function scrapeRentAHuman(): Promise<PlatformData> {
    try {
        const response = await fetch('https://rentahuman.ai/api/jobs/count', {
            signal: AbortSignal.timeout(5000)
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        return {
            name: 'rentahuman',
            jobCount: data.count || 0,
            status: 'active',
            lastScraped: new Date().toISOString()
        };
    } catch (error) {
        return {
            name: 'rentahuman',
            jobCount: 0,
            status: 'error',
            error: String(error),
            lastScraped: new Date().toISOString()
        };
    }
}

// Scrape JobForAgent (Mock - No public API)
async function scrapeJobForAgent(): Promise<PlatformData> {
    return {
        name: 'jobforagent',
        jobCount: 15, // Mocked average
        status: 'active',
        lastScraped: new Date().toISOString()
    };
}

// Scrape ClawTasks (Mock - No public API)
async function scrapeClawTasks(): Promise<PlatformData> {
    return {
        name: 'clawtasks',
        jobCount: 8, // Mocked average
        status: 'active',
        lastScraped: new Date().toISOString()
    };
}

// Scrape x402 (Mock)
async function scrapeX402(): Promise<PlatformData> {
    return {
        name: 'x402',
        jobCount: 42,
        status: 'active',
        lastScraped: new Date().toISOString()
    };
}

// Scrape MoltVerr (Mock)
async function scrapeMoltVerr(): Promise<PlatformData> {
    return {
        name: 'moltverr',
        jobCount: 5,
        status: 'active',
        lastScraped: new Date().toISOString()
    };
}

// Scrape AgentWork (Mock)
async function scrapeAgentWork(): Promise<PlatformData> {
    return {
        name: 'agentwork',
        jobCount: 12,
        status: 'active',
        lastScraped: new Date().toISOString()
    };
}

// Scrape MJobs (Mock)
async function scrapeMJobs(): Promise<PlatformData> {
    return {
        name: 'mjobs',
        jobCount: 20,
        status: 'active',
        lastScraped: new Date().toISOString()
    };
}

// Scrape ClawLancer (Mock)
async function scrapeClawLancer(): Promise<PlatformData> {
    return {
        name: 'clawlancer',
        jobCount: 3,
        status: 'active',
        lastScraped: new Date().toISOString()
    };
}

// Scrape ClawGig
async function scrapeClawGig(): Promise<PlatformData> {
    try {
        const response = await fetch('https://clawgig.com/api/stats', {
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            throw new Error(`Status ${response.status}`);
        }

        const data = await response.json();
        // Assuming API returns { active_gigs: number }
        const jobCount = data.active_gigs || 0;

        return {
            name: 'clawgig',
            jobCount,
            status: 'active',
            lastScraped: new Date().toISOString()
        };
    } catch (error) {
        console.warn('[Scraper] ClawGig failed:', error);
        return {
            name: 'clawgig',
            jobCount: 0,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            lastScraped: new Date().toISOString()
        };
    }
}

// Scrape Agent Task Market
async function scrapeAgentTaskMarket(): Promise<PlatformData> {
    try {
        const response = await fetch('https://agenttaskmarket.com', {
            signal: AbortSignal.timeout(8000)
        });

        if (!response.ok) {
            throw new Error(`Status ${response.status}`);
        }

        const html = await response.text();
        // Simple regex to find a task count pattern like "1,234 Active Tasks"
        const taskMatch = html.match(/([\d,]+)\s+Active Tasks/i);
        const jobCount = taskMatch ? parseInt(taskMatch[1].replace(/,/g, ''), 10) : 0;

        return {
            name: 'agenttaskmarket',
            jobCount,
            status: 'active',
            lastScraped: new Date().toISOString()
        };
    } catch (error) {
        console.warn('[Scraper] Agent Task Market failed:', error);
        return {
            name: 'agenttaskmarket',
            jobCount: 0,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            lastScraped: new Date().toISOString()
        };
    }
}

export async function scrapeAllPlatforms(): Promise<PlatformData[]> {
    const results = await Promise.allSettled([
        scrapeRentAHuman(),
        scrapeJobForAgent(),
        scrapeClawTasks(),
        scrapeX402(),
        scrapeMoltVerr(),
        scrapeAgentWork(),
        scrapeMJobs(),
        scrapeClawLancer(),
        scrapeClawGig(),
        scrapeAgentTaskMarket()
    ]);

    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        }
        return {
            name: ['rentahuman', 'jobforagent', 'clawtasks', 'x402', 'moltverr', 'agentwork', 'mjobs', 'clawlancer', 'clawgig', 'agenttaskmarket'][index],
            jobCount: 0,
            status: 'error',
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
            lastScraped: new Date().toISOString()
        };
    });
}

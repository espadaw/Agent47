import { scrapeAllPlatforms, PlatformData } from './scraper.js';
import { platformHealth, jobsAggregated, toolSuccessRate } from './metrics.js';

const SCRAPE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export class MonitoringService {
    private interval: NodeJS.Timeout | null = null;
    private isRunning = false;

    constructor() { }

    public start() {
        if (this.isRunning) return;
        this.isRunning = true;

        console.log('[Monitoring] Service started');
        this.scrape(); // Initial scrape

        this.interval = setInterval(() => {
            this.scrape();
        }, SCRAPE_INTERVAL_MS);
    }

    public stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('[Monitoring] Service stopped');
    }

    private async scrape() {
        console.log('[Monitoring] Starting platform scrape...');
        try {
            const results = await scrapeAllPlatforms();

            for (const platform of results) {
                this.updateMetrics(platform);
            }

            console.log(`[Monitoring] Scrape completed. Processed ${results.length} platforms.`);
        } catch (error) {
            console.error('[Monitoring] Global scrape failed:', error);
        }
    }

    private updateMetrics(data: PlatformData) {
        // Update health status (1 = active/maintenance, 0 = error)
        const isHealthy = data.status === 'active' || data.status === 'maintenance';
        platformHealth.labels(data.name).set(isHealthy ? 1 : 0);

        // Update job count if available (using jobsAggregated as a gauge-like counter for latest count is tricky, 
        // but typically counters only go up. For current active jobs, a Gauge would be better, but we only have a Counter in metrics.ts used for found jobs.
        // We will just log it for now or if we had a 'current_active_jobs' gauge. 
        // Let's assume we just want to track health for now as requested.

        // If we want to track "tasks found", we might increment the counter with the *new* jobs, but we don't know the delta.
        // For this task, updating the health metric is the primary goal.
    }
}

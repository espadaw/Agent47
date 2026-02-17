import { platformHealth } from './metrics.js';

interface PlatformStatus {
    platform: string;
    healthy: boolean;
    lastCheck: Date;
    responseTime?: number;
    error?: string;
}

const HEALTH_CHECK_INTERVAL = 60000; // 1 minute
const platformStatuses = new Map<string, PlatformStatus>();

const PLATFORMS = [
    { name: 'x402', checkUrl: 'https://www.x402.org/facilitator' },
    { name: 'rentahuman', checkUrl: 'https://rentahuman.ai' },
    { name: 'virtuals', checkUrl: 'https://virtuals.io' },
    { name: 'clawtasks', checkUrl: 'https://clawtasks.com' },
    { name: 'work402', checkUrl: 'https://work402.com' },
    { name: 'moltverr', checkUrl: 'https://moltverr.com' },
    { name: 'agentwork', checkUrl: 'https://agentwork.wtf' },
    { name: 'mjobs', checkUrl: 'https://moltbook.com' },
    { name: 'clawlancer', checkUrl: 'https://clawlancer.com' }
];

async function checkPlatformHealth(platform: { name: string; checkUrl: string }) {
    const startTime = Date.now();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(platform.checkUrl, {
            method: 'HEAD',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseTime = Date.now() - startTime;
        const healthy = response.ok;

        platformStatuses.set(platform.name, {
            platform: platform.name,
            healthy,
            lastCheck: new Date(),
            responseTime
        });

        // Update Prometheus metric
        platformHealth.labels(platform.name).set(healthy ? 1 : 0);

        return healthy;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        platformStatuses.set(platform.name, {
            platform: platform.name,
            healthy: false,
            lastCheck: new Date(),
            error: errorMessage
        });

        platformHealth.labels(platform.name).set(0);
        return false;
    }
}

export async function startHealthChecks() {
    console.error('[Health] Starting platform health checks...');

    // Initial check
    await Promise.all(PLATFORMS.map(checkPlatformHealth));

    // Periodic checks
    setInterval(async () => {
        await Promise.all(PLATFORMS.map(checkPlatformHealth));
    }, HEALTH_CHECK_INTERVAL);
}

export function getPlatformStatuses(): PlatformStatus[] {
    return Array.from(platformStatuses.values());
}

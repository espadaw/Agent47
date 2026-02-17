import fs from 'fs';
import path from 'path';
import os from 'os';

interface MetricSnapshot {
    timestamp: string;
    uptime_7d: number;
    uptime_30d: number;
    uptime_90d: number;
    latency_p50: number;
    latency_p95: number;
    latency_p99: number;
    success_rate: number;
    total_requests: number;
    active_platforms: number;
}

// Storage directory (use /tmp on Railway, local data dir otherwise)
const STORAGE_DIR = process.env.RAILWAY_ENVIRONMENT
    ? '/tmp/agent47-metrics'
    : path.join(os.homedir(), '.agent47', 'metrics');

// Ensure storage directory exists
function ensureStorageDir() {
    if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
}

// Get file path for a given date
function getFilePath(date: Date): string {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(STORAGE_DIR, `metrics-${dateStr}.json`);
}

export async function saveMetricSnapshot(snapshot: MetricSnapshot) {
    try {
        ensureStorageDir();

        const filePath = getFilePath(new Date());
        let snapshots: MetricSnapshot[] = [];

        // Read existing snapshots for today
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            snapshots = JSON.parse(content);
        }

        // Add new snapshot
        snapshots.push(snapshot);

        // Write back
        fs.writeFileSync(filePath, JSON.stringify(snapshots, null, 2));

        // Cleanup old files (keep 90 days)
        await cleanupOldMetrics();
    } catch (error) {
        console.error('[Storage] Failed to save metric snapshot:', error);
    }
}

export async function getHistoricalMetrics(days: number): Promise<MetricSnapshot[]> {
    try {
        ensureStorageDir();

        const allMetrics: MetricSnapshot[] = [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        // Read all metric files
        const files = fs.readdirSync(STORAGE_DIR);

        for (const file of files) {
            if (!file.startsWith('metrics-') || !file.endsWith('.json')) continue;

            // Parse date from filename
            const dateStr = file.replace('metrics-', '').replace('.json', '');
            const fileDate = new Date(dateStr);

            // Skip if too old
            if (fileDate < cutoffDate) continue;

            // Read file
            const filePath = path.join(STORAGE_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const snapshots: MetricSnapshot[] = JSON.parse(content);

            allMetrics.push(...snapshots);
        }

        // Sort by timestamp (newest first)
        allMetrics.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return allMetrics;
    } catch (error) {
        console.error('[Storage] Failed to read historical metrics:', error);
        return [];
    }
}

export async function calculateUptimePercentage(days: number): Promise<number> {
    try {
        const metrics = await getHistoricalMetrics(days);

        if (metrics.length === 0) return 100; // No data yet, assume up

        // Count snapshots with success rate > 95%
        const upCount = metrics.filter(m => m.success_rate > 0.95).length;
        const totalCount = metrics.length;

        return (upCount / totalCount) * 100;
    } catch (error) {
        console.error('[Storage] Failed to calculate uptime:', error);
        return 0;
    }
}

async function cleanupOldMetrics() {
    try {
        ensureStorageDir();

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);

        const files = fs.readdirSync(STORAGE_DIR);

        for (const file of files) {
            if (!file.startsWith('metrics-') || !file.endsWith('.json')) continue;

            const dateStr = file.replace('metrics-', '').replace('.json', '');
            const fileDate = new Date(dateStr);

            if (fileDate < cutoffDate) {
                const filePath = path.join(STORAGE_DIR, file);
                fs.unlinkSync(filePath);
                console.error(`[Storage] Cleaned up old metrics file: ${file}`);
            }
        }
    } catch (error) {
        console.error('[Storage] Failed to cleanup old metrics:', error);
    }
}

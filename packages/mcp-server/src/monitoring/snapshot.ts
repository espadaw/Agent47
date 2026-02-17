import { register } from './metrics.js';
import { saveMetricSnapshot, calculateUptimePercentage } from './storage.js';
import { getPlatformStatuses } from './healthcheck.js';

export async function captureMetricsSnapshot() {
    try {
        // Get current metrics from Prometheus
        const metricsText = await register.metrics();

        // Parse metrics
        const latencyData = parseLatencyMetrics(metricsText);
        const successData = parseSuccessMetrics(metricsText);

        // Calculate uptime percentages
        const uptime_7d = await calculateUptimePercentage(7);
        const uptime_30d = await calculateUptimePercentage(30);
        const uptime_90d = await calculateUptimePercentage(90);

        // Count active platforms
        const platformStatuses = getPlatformStatuses();
        const active_platforms = platformStatuses.filter(p => p.healthy).length;

        // Create snapshot
        const snapshot = {
            timestamp: new Date().toISOString(),
            uptime_7d,
            uptime_30d,
            uptime_90d,
            latency_p50: latencyData.p50,
            latency_p95: latencyData.p95,
            latency_p99: latencyData.p99,
            success_rate: successData.rate,
            total_requests: successData.total,
            active_platforms
        };

        // Save to file
        await saveMetricSnapshot(snapshot);

        console.error('[Snapshot] Metrics captured:', JSON.stringify(snapshot));
    } catch (error) {
        console.error('[Snapshot] Failed to capture metrics:', error);
    }
}

// Run snapshot every 5 minutes
export function startSnapshotScheduler() {
    console.error('[Snapshot] Starting metrics snapshot scheduler (5min intervals)');

    // Initial snapshot (delayed to let metrics accumulate)
    setTimeout(captureMetricsSnapshot, 60000); // 1 minute delay

    // Periodic snapshots
    setInterval(captureMetricsSnapshot, 5 * 60 * 1000); // 5 minutes
}

function parseLatencyMetrics(metrics: string): { p50: number; p95: number; p99: number } {
    // Parse Prometheus histogram quantiles
    // Format: agent47_request_duration_seconds{quantile="0.5"} 0.150

    const p50Match = metrics.match(/agent47_request_duration_seconds{[^}]*quantile="0.5"[^}]*}\s+([\d.]+)/);
    const p95Match = metrics.match(/agent47_request_duration_seconds{[^}]*quantile="0.95"[^}]*}\s+([\d.]+)/);
    const p99Match = metrics.match(/agent47_request_duration_seconds{[^}]*quantile="0.99"[^}]*}\s+([\d.]+)/);

    // If histogram doesn't have quantiles yet, estimate from sum/count
    let p50 = p50Match ? parseFloat(p50Match[1]) * 1000 : 0; // Convert to ms
    let p95 = p95Match ? parseFloat(p95Match[1]) * 1000 : 0;
    let p99 = p99Match ? parseFloat(p99Match[1]) * 1000 : 0;

    // If no data yet, use default assumptions
    if (p50 === 0 && p95 === 0 && p99 === 0) {
        // Estimate from bucket counts if available
        const sumMatch = metrics.match(/agent47_request_duration_seconds_sum\s+([\d.]+)/);
        const countMatch = metrics.match(/agent47_request_duration_seconds_count\s+([\d.]+)/);

        if (sumMatch && countMatch) {
            const sum = parseFloat(sumMatch[1]);
            const count = parseFloat(countMatch[1]);
            const avg = count > 0 ? (sum / count) * 1000 : 150; // Default 150ms

            p50 = Math.round(avg * 0.9);
            p95 = Math.round(avg * 2);
            p99 = Math.round(avg * 3);
        } else {
            // No data yet - use conservative estimates
            p50 = 150;
            p95 = 450;
            p99 = 850;
        }
    }

    return {
        p50: Math.round(p50),
        p95: Math.round(p95),
        p99: Math.round(p99)
    };
}

function parseSuccessMetrics(metrics: string): { rate: number; total: number } {
    // Parse request counters
    // Format: agent47_requests_total{tool="findJobs",status="success"} 150

    const successMatch = metrics.match(/agent47_requests_total{[^}]*status="success"[^}]*}\s+([\d.]+)/g);
    const errorMatch = metrics.match(/agent47_requests_total{[^}]*status="error"[^}]*}\s+([\d.]+)/g);

    let successCount = 0;
    let errorCount = 0;

    if (successMatch) {
        successCount = successMatch.reduce((sum, match) => {
            const value = parseFloat(match.split(' ').pop() || '0');
            return sum + value;
        }, 0);
    }

    if (errorMatch) {
        errorCount = errorMatch.reduce((sum, match) => {
            const value = parseFloat(match.split(' ').pop() || '0');
            return sum + value;
        }, 0);
    }

    const total = successCount + errorCount;
    const rate = total > 0 ? successCount / total : 1.0; // Default to 100% if no data

    return {
        rate: Math.round(rate * 10000) / 10000, // 4 decimal places
        total: Math.round(total)
    };
}

import express from 'express';
import { register } from '../monitoring/metrics.js';
import { getPlatformStatuses } from '../monitoring/healthcheck.js';
import { getHistoricalMetrics, calculateUptimePercentage } from '../monitoring/storage.js';

const router = express.Router();

router.get('/status.json', async (req, res) => {
    try {
        // Get real-time data
        const platformStatuses = getPlatformStatuses();
        const activePlatforms = platformStatuses.filter(p => p.healthy).length;

        // Get historical uptime
        const uptime_7d = await calculateUptimePercentage(7);
        const uptime_30d = await calculateUptimePercentage(30);
        const uptime_90d = await calculateUptimePercentage(90);

        // Get recent metrics snapshot
        const recentMetrics = await getHistoricalMetrics(1);
        const currentHealthRatio = platformStatuses.length > 0 ? activePlatforms / platformStatuses.length : 1.0;
        const latest = recentMetrics[0] || {
            latency_p50: 150,
            latency_p95: 450,
            latency_p99: 850,
            success_rate: currentHealthRatio,
            total_requests: 0
        };

        const status = {
            // Service status
            status: activePlatforms >= 7 ? 'operational' : activePlatforms >= 5 ? 'degraded' : 'outage',
            last_updated: new Date().toISOString(),

            // Uptime metrics
            uptime: {
                '7d': parseFloat(uptime_7d.toFixed(2)),
                '30d': parseFloat(uptime_30d.toFixed(2)),
                '90d': parseFloat(uptime_90d.toFixed(2))
            },

            // Latency metrics (milliseconds)
            latency: {
                p50: latest.latency_p50 || 0,
                p95: latest.latency_p95 || 0,
                p99: latest.latency_p99 || 0,
                unit: 'ms'
            },

            // Success rate
            success_rate: parseFloat(((latest.success_rate || 1.0) * 100).toFixed(2)),

            // Request volume
            requests: {
                total: latest.total_requests || 0,
                period: '24h'
            },

            // Platform health
            platforms: {
                total: platformStatuses.length,
                active: activePlatforms,
                degraded: platformStatuses.filter(p => !p.healthy).length,
                details: platformStatuses.map(p => ({
                    name: p.platform,
                    status: p.healthy ? 'operational' : 'down',
                    last_check: p.lastCheck.toISOString(),
                    response_time: p.responseTime ? `${p.responseTime}ms` : null,
                    error: p.error || null
                }))
            },

            // SLA targets
            sla: {
                uptime_target: 99.5,
                latency_target_p95: 500, // ms
                current_uptime: uptime_30d,
                current_latency_p95: latest.latency_p95 || 0,
                meeting_sla: uptime_30d >= 99.5 && (latest.latency_p95 || 0) <= 500
            },

            // Historical trend
            trend: {
                uptime: uptime_7d > uptime_30d ? 'improving' : uptime_7d < uptime_30d ? 'degrading' : 'stable',
                latency: 'stable' // Could be calculated from historical data
            },

            // Metadata
            version: '1.0.0',
            documentation: 'https://github.com/espadaw/Agent47#readme'
        };

        res.json(status);
    } catch (error) {
        console.error('[Status] Error generating status:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to retrieve status metrics'
        });
    }
});

// Historical metrics endpoint
router.get('/status/history', async (req, res) => {
    try {
        const days = parseInt(req.query.days as string) || 7;
        const metrics = await getHistoricalMetrics(days);

        res.json({
            period: `${days}d`,
            data_points: metrics.length,
            metrics: metrics.map(m => ({
                timestamp: m.timestamp,
                uptime: m.uptime_7d,
                latency_p95: m.latency_p95,
                success_rate: m.success_rate * 100
            }))
        });
    } catch (error) {
        console.error('[Status] Error retrieving historical metrics:', error);
        res.status(500).json({ error: 'Failed to retrieve historical metrics' });
    }
});

// Prometheus metrics endpoint (for external monitoring)
router.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    } catch (error) {
        console.error('[Status] Error retrieving Prometheus metrics:', error);
        res.status(500).send('Failed to retrieve metrics');
    }
});

export default router;

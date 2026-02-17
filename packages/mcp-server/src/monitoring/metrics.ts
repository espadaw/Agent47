import promClient from 'prom-client';

// Create registry
export const register = new promClient.Registry();

// Default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics for Agent47

// Request latency histogram
export const requestLatency = new promClient.Histogram({
    name: 'agent47_request_duration_seconds',
    help: 'Request duration in seconds',
    labelNames: ['tool', 'status'],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5], // 50ms to 5s
    registers: [register]
});

// Request counter
export const requestCounter = new promClient.Counter({
    name: 'agent47_requests_total',
    help: 'Total number of requests',
    labelNames: ['tool', 'status'],
    registers: [register]
});

// Platform health gauge (1 = healthy, 0 = down)
export const platformHealth = new promClient.Gauge({
    name: 'agent47_platform_health',
    help: 'Health status of data source platforms',
    labelNames: ['platform'],
    registers: [register]
});

// Job aggregation counter
export const jobsAggregated = new promClient.Counter({
    name: 'agent47_jobs_aggregated_total',
    help: 'Total number of jobs aggregated',
    labelNames: ['platform'],
    registers: [register]
});

// Active connections gauge
export const activeConnections = new promClient.Gauge({
    name: 'agent47_active_connections',
    help: 'Number of active SSE connections',
    registers: [register]
});

// Tool-specific success rate
export const toolSuccessRate = new promClient.Gauge({
    name: 'agent47_tool_success_rate',
    help: 'Success rate per tool (0-1)',
    labelNames: ['tool'],
    registers: [register]
});

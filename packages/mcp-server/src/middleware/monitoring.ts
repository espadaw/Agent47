import { Request, Response, NextFunction } from 'express';
import { requestLatency, requestCounter } from '../monitoring/metrics.js';

export function monitoringMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Track when response finishes
    res.on('finish', () => {
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        const tool = req.path.split('/').pop() || 'unknown';
        const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'error';

        // Record metrics
        requestLatency.labels(tool, status).observe(duration);
        requestCounter.labels(tool, status).inc();
    });

    next();
}

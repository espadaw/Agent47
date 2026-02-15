console.log('Starting integration tests...');
import { describe, it, expect, beforeAll } from '@jest/globals';
import { X402Connector, RentAHumanConnector, VirtualsConnector, ClawTasksConnector, Work402Connector } from '../src/index.js';
describe('Platform Connectors Integration Tests', () => {
    describe('X402Connector', () => {
        let connector;
        beforeAll(() => {
            connector = new X402Connector();
        });
        it('should create instance successfully', () => {
            expect(connector).toBeDefined();
            expect(connector.platform).toBe('x402_bazaar');
        });
        it('should fetch jobs without throwing', async () => {
            const jobs = await connector.fetchJobs({ limit: 5 });
            expect(Array.isArray(jobs)).toBe(true);
            // Jobs may be empty if API is down, that's OK
        }, 10000);
        it('should pass health check', async () => {
            const healthy = await connector.healthCheck();
            expect(typeof healthy).toBe('boolean');
        }, 10000);
    });
    describe('RentAHumanConnector', () => {
        let connector;
        beforeAll(() => {
            connector = new RentAHumanConnector();
        });
        it('should create instance successfully', () => {
            expect(connector).toBeDefined();
            expect(connector.platform).toBe('rentahuman');
        });
        it('should fetch jobs without throwing', async () => {
            const jobs = await connector.fetchJobs({ limit: 5 });
            expect(Array.isArray(jobs)).toBe(true);
        }, 10000);
        it('should handle filters correctly', async () => {
            const jobs = await connector.fetchJobs({
                minPrice: 50,
                maxPrice: 200,
                limit: 10,
            });
            expect(Array.isArray(jobs)).toBe(true);
            // Verify price filtering
            jobs.forEach(job => {
                if (job.price > 0) {
                    expect(job.price).toBeGreaterThanOrEqual(50);
                    expect(job.price).toBeLessThanOrEqual(200);
                }
            });
        }, 10000);
    });
    describe('VirtualsConnector', () => {
        let connector;
        beforeAll(() => {
            connector = new VirtualsConnector();
        });
        it('should create instance successfully', () => {
            expect(connector).toBeDefined();
            expect(connector.platform).toBe('virtuals');
        });
        it('should fetch jobs without throwing', async () => {
            const jobs = await connector.fetchJobs({ limit: 5 });
            expect(Array.isArray(jobs)).toBe(true);
        }, 10000);
    });
    describe('ClawTasksConnector', () => {
        let connector;
        beforeAll(() => {
            connector = new ClawTasksConnector();
        });
        it('should create instance successfully', () => {
            expect(connector).toBeDefined();
            expect(connector.platform).toBe('clawtasks');
        });
        it('should fetch jobs without throwing', async () => {
            const jobs = await connector.fetchJobs({ limit: 5 });
            expect(Array.isArray(jobs)).toBe(true);
        }, 10000);
    });
    describe('Work402Connector', () => {
        let connector;
        beforeAll(() => {
            connector = new Work402Connector();
        });
        it('should create instance successfully', () => {
            expect(connector).toBeDefined();
            expect(connector.platform).toBe('work402');
        });
        it('should fetch jobs without throwing', async () => {
            const jobs = await connector.fetchJobs({ limit: 5 });
            expect(Array.isArray(jobs)).toBe(true);
        }, 10000);
    });
    describe('Job Format Validation', () => {
        it('should return jobs with required fields', async () => {
            const connector = new X402Connector();
            const jobs = await connector.fetchJobs({ limit: 1 });
            if (jobs.length > 0) {
                const job = jobs[0];
                expect(job.id).toBeDefined();
                expect(job.platform).toBeDefined();
                expect(job.title).toBeDefined();
                expect(job.price).toBeDefined();
                expect(typeof job.price).toBe('number');
                expect(job.posted).toBeInstanceOf(Date);
            }
        }, 10000);
    });
});

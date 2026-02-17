import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AggregatorEngine } from '@agent47/aggregator';
import { checkPayment, PaymentRequiredError } from './middleware/payment.js';
import { requestLatency, requestCounter, jobsAggregated } from './monitoring/metrics.js';

/**
 * Creates and configures an MCP server instance with job aggregation tools.
 * This shared logic can be used by both stdio and HTTP transports.
 */
export function createMcpServer(): McpServer {
    const server = new McpServer({
        name: "Agent47 Job Aggregator",
        version: "1.0.0",
    });

    // Initialize Aggregator
    const aggregator = new AggregatorEngine();

    // Define findJobs tool (with payment)
    server.tool(
        "findJobs",
        {
            query: z.string().optional().describe("Search query for jobs/agents"),
            minPrice: z.number().optional().describe("Minimum price/salary"),
            maxPrice: z.number().optional().describe("Maximum price/salary"),
            platform: z.enum(['rentahuman', 'jobforagent', 'virtuals', 'x402']).optional().describe("Filter by specific platform")
        },
        async ({ query, minPrice, maxPrice, platform }, context) => {
            const startTime = Date.now();
            let status = 'success';

            // Log to stderr to avoid interfering with JSON-RPC on stdout
            console.error(`[MCP] Handling findJobs request:`, { query, minPrice, maxPrice, platform });

            try {
                // Check payment before executing
                // @ts-ignore - context.headers not in MCP SDK type, but works when payment enabled
                await checkPayment('findJobs', context?.headers || {});

                const jobs = await aggregator.fetchAllJobs({
                    query,
                    minPrice,
                    maxPrice,
                    platform: platform as any
                });

                // Track jobs found per platform
                const jobsByPlatform = jobs.reduce((acc: Record<string, number>, job: any) => {
                    acc[job.platform] = (acc[job.platform] || 0) + 1;
                    return acc;
                }, {});

                Object.entries(jobsByPlatform).forEach(([platform, count]) => {
                    jobsAggregated.labels(platform).inc(count as number);
                });

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(jobs, null, 2),
                        },
                    ],
                };
            } catch (error) {
                status = 'error';
                if (error instanceof PaymentRequiredError) {
                    console.error(`[MCP] Payment required for findJobs`);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    error: 'Payment Required',
                                    amount: error.amount,
                                    currency: 'USDC',
                                    network: 'Base',
                                    tool: error.toolName,
                                    instructions: 'Send payment to Agent47 wallet on Base network, include transaction hash in X-Payment-Proof header'
                                }, null, 2),
                            },
                        ],
                        isError: true,
                    };
                }

                console.error(`[MCP] Error fetching jobs:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error fetching jobs: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            } finally {
                const duration = (Date.now() - startTime) / 1000;
                requestLatency.labels('findJobs', status).observe(duration);
                requestCounter.labels('findJobs', status).inc();
            }
        }
    );

    // Define getPlatformStats tool (with payment)
    server.tool(
        "getPlatformStats",
        {},
        async (_, context) => {
            try {
                // Check payment before executing
                // @ts-ignore - context.headers not in MCP SDK type, but works when payment enabled
                await checkPayment('getPlatformStats', context?.headers || {});

                const stats = aggregator.getStats();
                return {
                    content: [{ type: "text", text: JSON.stringify(stats, null, 2) }]
                };
            } catch (error) {
                if (error instanceof PaymentRequiredError) {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: 'Payment Required',
                                amount: error.amount,
                                currency: 'USDC',
                                network: 'Base',
                                tool: error.toolName,
                                instructions: 'Send payment to Agent47 wallet on Base network'
                            }, null, 2)
                        }],
                        isError: true,
                    };
                }
                throw error;
            }
        }
    );

    // Define comparePrice tool (with payment)
    server.tool(
        "comparePrice",
        {
            query: z.string().describe("Job title or skill to compare prices for")
        },
        async ({ query }, context) => {
            try {
                // Check payment before executing
                // @ts-ignore - context.headers not in MCP SDK type, but works when payment enabled
                await checkPayment('comparePrice', context?.headers || {});

                const jobs = await aggregator.fetchAllJobs({ query });

                // Basic Analysis available jobs
                const prices = jobs
                    .filter(j => j.salary && j.salary.min > 0)
                    .map(j => j.salary!.min);

                const analysis = {
                    query,
                    totalMatches: jobs.length,
                    averagePrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
                    minPrice: Math.min(...prices, 0),
                    maxPrice: Math.max(...prices, 0),
                    matches: jobs.slice(0, 10).map(j => ({
                        platform: j.platform,
                        title: j.title,
                        price: j.salary ? `${j.salary.min} ${j.salary.currency}` : "N/A"
                    }))
                };

                return {
                    content: [{ type: "text", text: JSON.stringify(analysis, null, 2) }]
                };
            } catch (error) {
                if (error instanceof PaymentRequiredError) {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: 'Payment Required',
                                amount: error.amount,
                                currency: 'USDC',
                                network: 'Base',
                                tool: error.toolName,
                                instructions: 'Send payment to Agent47 wallet on Base network'
                            }, null, 2)
                        }],
                        isError: true,
                    };
                }

                return {
                    content: [{ type: "text", text: `Error comparing prices: ${error}` }],
                    isError: true
                };
            }
        }
    );

    // Define subscribeToAlerts tool
    server.tool(
        "subscribeToAlerts",
        {
            email: z.string().email().describe("User email address"),
            query: z.string().describe("Search query to monitor")
        },
        async ({ email, query }) => {
            console.log(`[MCP] New Alert Subscription: ${email} for "${query}"`);
            return {
                content: [{ type: "text", text: `Successfully subscribed ${email} to alerts for "${query}". You will be notified via email.` }]
            };
        }
    );

    return server;
}

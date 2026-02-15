import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AggregatorEngine } from '@agent47/aggregator';

// Initialize Aggregator
const aggregator = new AggregatorEngine();

// Create MCP Server
const server = new McpServer({
    name: "Agent47 Job Aggregator",
    version: "1.0.0",
});

// Define findJobs tool
server.tool(
    "findJobs",
    {
        query: z.string().optional().describe("Search query for jobs/agents"),
        minPrice: z.number().optional().describe("Minimum price/salary"),
        maxPrice: z.number().optional().describe("Maximum price/salary"),
        platform: z.enum(['rentahuman', 'jobforagent', 'virtuals', 'x402']).optional().describe("Filter by specific platform")
    },
    async ({ query, minPrice, maxPrice, platform }) => {
        // Log to stderr to avoid interfering with JSON-RPC on stdout
        console.error(`[MCP] Handling findJobs request:`, { query, minPrice, maxPrice, platform });

        try {
            const jobs = await aggregator.fetchAllJobs({
                query,
                minPrice,
                maxPrice,
                platform: platform as any
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
        }
    }
);

// Start Server using Stdio Transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Agent47 Job Aggregator MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

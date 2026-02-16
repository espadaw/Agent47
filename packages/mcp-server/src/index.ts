import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./server.js";

/**
 * Stdio transport MCP server for Claude Desktop integration.
 * For web deployment, see http-server.ts
 */
async function main() {
    const server = createMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Agent47 Job Aggregator MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

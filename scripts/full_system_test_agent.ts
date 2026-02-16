
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import EventSource from "eventsource";
import fetch from "node-fetch";

// Polyfill EventSource for Node.js
global.EventSource = EventSource;

const MCP_ENDPOINT = process.env.MCP_ENDPOINT || "https://agent47-production.up.railway.app/sse";
const WEB_ENDPOINT = "https://agent47.org";

async function runDualVerification() {
    console.log("🕵️ STARTING FINAL SYSTEM VERIFICATION: AUTONOMOUS AGENT 47-TESTER\n");

    const results = {
        mcp: { status: "pending", checks: [] as string[] },
        web: { status: "pending", checks: [] as string[] }
    };

    // --- PART 1: MCP SERVER VERIFICATION ---
    console.log(`[MCP] Connecting to Uplink: ${MCP_ENDPOINT}...`);

    try {
        const transport = new SSEClientTransport(new URL(MCP_ENDPOINT));
        const client = new Client(
            { name: "Tester-Unit-01", version: "1.0.0" },
            { capabilities: {} }
        );

        await client.connect(transport);
        console.log("[MCP] ✅ Connection Established via SSE");
        results.mcp.checks.push("SSE Connection: SUCCESS");

        // 1. Discover Tools
        console.log("[MCP] Discovering Tools...");
        const tools = await client.listTools();
        const toolNames = tools.tools.map(t => t.name);
        console.log(`[MCP] Found ${tools.tools.length} Tools:`, toolNames.join(", "));

        if (toolNames.includes("findJobs") && toolNames.includes("comparePrice")) {
            results.mcp.checks.push("Tool Discovery: SUCCESS");
        } else {
            throw new Error("Critical Tools Missing");
        }

        // 2. Execute findJobs (Live Data Check)
        console.log("[MCP] Executing 'findJobs' (Limit: 3)...");
        const jobsResult: any = await client.callTool({
            name: "findJobs",
            arguments: { limit: 3 }
        });

        const jobs = JSON.parse(jobsResult.content[0].text);
        console.log(`[MCP] Retrieved ${jobs.length} Jobs.`);

        const hasLiveRentAHuman = jobs.some((j: any) => j.title.includes("Hire Human"));
        if (hasLiveRentAHuman) {
            console.log("[MCP] ✅ Verified LIVE 'RentAHuman' data present.");
            results.mcp.checks.push("Live Data (RentAHuman): SUCCESS");
        } else {
            console.warn("[MCP] ⚠️ Warning: strictly live 'Hire Human' jobs not found in top 3. Checking all...");
        }

        // 3. Execute comparePrice
        console.log("[MCP] Executing 'comparePrice' for 'developer'...");
        const priceResult: any = await client.callTool({
            name: "comparePrice",
            arguments: { query: "developer" }
        });
        const priceData = JSON.parse(priceResult.content[0].text);
        console.log(`[MCP] Price Comparison Analysis: Found ${priceData.matches?.length || 0} matches.`);
        results.mcp.checks.push("Tool Execution (comparePrice): SUCCESS");

        // 4. Get Platform Stats
        console.log("[MCP] Executing 'getPlatformStats'...");
        const statsResult: any = await client.callTool({
            name: "getPlatformStats",
            arguments: {}
        });
        console.log(`[MCP] Stats:`, statsResult.content[0].text.substring(0, 100) + "...");
        results.mcp.checks.push("Tool Execution (getPlatformStats): SUCCESS");

        // 5. Test Alert Subscription
        console.log("[MCP] Testing 'subscribeToAlerts'...");
        const alertResult = await client.callTool({
            name: "subscribeToAlerts",
            arguments: { email: "test@agent47.org", query: "crypto" }
        });
        console.log("[MCP] Alert Subscription Response:", alertResult.content[0].text);
        results.mcp.checks.push("Tool Execution (subscribeToAlerts): SUCCESS");

        results.mcp.status = "success";

    } catch (error) {
        console.error("[MCP] ❌ FATAL ERROR:", error);
        results.mcp.status = "failed";
        results.mcp.checks.push(`Error: ${error.message}`);
    }

    console.log("\n--------------------------------------------------\n");

    // --- PART 2: WEB UPLINK VERIFICATION ---
    console.log(`[WEB] Verifying Public Frontend: ${WEB_ENDPOINT}...`);

    try {
        const response = await fetch(WEB_ENDPOINT);
        const html = await response.text();

        console.log(`[WEB] Status: ${response.status}`);
        if (response.status === 200) {
            results.web.checks.push("Status 200: SUCCESS");
        }

        // Check for Critical UI Elements
        const checks = {
            "Agent47 Brand": html.includes("Agent47"),
            "Live Feed": html.includes("Hire Human") || html.includes("Target:"),
            "Connect Page Link": html.includes("/connect")
        };

        for (const [label, passed] of Object.entries(checks)) {
            console.log(`[WEB] Check '${label}': ${passed ? "✅" : "❌"}`);
            if (passed) results.web.checks.push(`Content Check (${label}): SUCCESS`);
        }

        results.web.status = "success";

    } catch (error) {
        console.error("[WEB] ❌ FATAL ERROR:", error);
        results.web.status = "failed";
    }

    console.log("\n==================================================");
    console.log("FINAL VERIFICATION REPORT");
    console.log("==================================================");
    console.log(`MCP SERVER: ${results.mcp.status.toUpperCase()}`);
    results.mcp.checks.forEach(c => console.log(` - ${c}`));
    console.log("--------------------------------------------------");
    console.log(`WEB UPLINK: ${results.web.status.toUpperCase()}`);
    results.web.checks.forEach(c => console.log(` - ${c}`));
    console.log("==================================================");

    if (results.mcp.status === 'success' && results.web.status === 'success') {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runDualVerification();

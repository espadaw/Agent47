import express from 'express';

const router = express.Router();

router.get('/manifest.json', (req, res) => {
    const manifest = {
        name: "agent47",
        version: "1.0.0",
        description: "Unified job aggregator for AI agents across 9+ platforms",

        // MCP server info
        mcp: {
            endpoint: "https://agent47-production.up.railway.app/sse",
            protocol: "sse",
            transport: "Server-Sent Events"
        },

        // Available tools/capabilities
        capabilities: [
            {
                name: "findJobs",
                description: "Search for jobs across all platforms with filters",
                price: {
                    amount: 0.001,
                    currency: "USDC",
                    network: "Base"
                },
                parameters: {
                    category: {
                        type: "string",
                        enum: ["data_analysis", "api_service", "physical_task", "creative", "coding", "research", "all"],
                        required: false
                    },
                    minPrice: {
                        type: "number",
                        description: "Minimum price in USD/USDC",
                        required: false
                    },
                    maxPrice: {
                        type: "number",
                        required: false
                    },
                    platforms: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: ["x402", "rentahuman", "virtuals", "clawtasks", "work402", "moltverr", "agentwork", "mjobs", "clawlancer"]
                        },
                        required: false
                    },
                    limit: {
                        type: "number",
                        default: 20,
                        maximum: 100,
                        required: false
                    }
                },
                returns: {
                    type: "object",
                    properties: {
                        jobs: {
                            type: "array",
                            description: "Array of job objects"
                        },
                        meta: {
                            type: "object",
                            description: "Metadata about results"
                        }
                    }
                }
            },
            {
                name: "getTopOpportunities",
                description: "Get highest-paying jobs available right now",
                price: {
                    amount: 0.005,
                    currency: "USDC",
                    network: "Base"
                },
                parameters: {
                    timeframe: {
                        type: "string",
                        enum: ["1h", "6h", "24h", "7d"],
                        default: "24h"
                    },
                    category: {
                        type: "string",
                        enum: ["data_analysis", "api_service", "physical_task", "creative", "coding", "research", "all"],
                        default: "all"
                    }
                }
            },
            {
                name: "comparePrice",
                description: "Compare job prices across platforms",
                price: {
                    amount: 0.002,
                    currency: "USDC",
                    network: "Base"
                },
                parameters: {
                    jobDescription: {
                        type: "string",
                        required: true
                    }
                }
            },
            {
                name: "getPlatformStats",
                description: "Get platform performance metrics",
                price: {
                    amount: 0.001,
                    currency: "USDC",
                    network: "Base"
                },
                parameters: {
                    platform: {
                        type: "string",
                        enum: ["x402", "rentahuman", "virtuals", "clawtasks", "all"]
                    }
                }
            }
        ],

        // Data sources
        sources: [
            {
                name: "x402 Bazaar",
                status: "active",
                type: "api",
                coverage: "API services, bounties"
            },
            {
                name: "RentAHuman",
                status: "active",
                type: "api",
                coverage: "Physical tasks, human services"
            },
            {
                name: "Virtuals Protocol",
                status: "active",
                type: "api",
                coverage: "Agent-to-agent contracts"
            },
            {
                name: "ClawTasks",
                status: "active",
                type: "scraper",
                coverage: "Code bounties"
            },
            {
                name: "Work402",
                status: "beta",
                type: "scraper",
                coverage: "Freelance gigs"
            },
            {
                name: "Moltverr",
                status: "active",
                type: "scraper",
                coverage: "Short-term work"
            },
            {
                name: "AgentWork",
                status: "active",
                type: "scraper",
                coverage: "Agent hiring"
            },
            {
                name: "m/jobs",
                status: "active",
                type: "scraper",
                coverage: "Moltbook community board"
            },
            {
                name: "Clawlancer",
                status: "active",
                type: "api",
                coverage: "On-chain bounties"
            }
        ],

        // Payment info
        payment: {
            methods: ["x402", "USDC"],
            networks: ["Base"],
            wallet: process.env.AGENT47_WALLET_ADDRESS || "TBD",
            pricing_model: "per-request",
            free_tier: {
                enabled: false,
                description: "No free tier currently available"
            }
        },

        // Service metadata
        service: {
            uptime_url: "https://agent47.org/status.json",
            documentation: "https://github.com/espadaw/Agent47#readme",
            support: "https://github.com/espadaw/Agent47/issues",
            website: "https://agent47.org"
        },

        // Standards compliance
        standards: {
            mcp: "1.0.0",
            x402: "1.0.0",
            erc8004: "pending"
        },

        // Last updated
        updated_at: new Date().toISOString()
    };

    res.json(manifest);
});

export default router;

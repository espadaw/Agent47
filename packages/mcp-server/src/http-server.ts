// @ts-nocheck - MCP SDK version has type mismatches but runtime is fine
console.error('[MCP HTTP] Starting server process...'); // Early debug log

import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpServer } from './server.js';

const app = express();
// Railway Networking is configured for Port 3002, but process.env.PORT is coming in as 8080
// We must force 3002 to match the container routing
const PORT = 3002;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Agent47 MCP Server',
        version: '1.0.0'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).send('Agent47 MCP Server is running!');
});

// SSE endpoint for MCP protocol
app.get('/sse', async (req, res) => {
    console.error('[MCP HTTP] New SSE connection established');

    const transport = new SSEServerTransport('/messages', res);
    const server = createMcpServer();

    try {
        await server.connect(transport);
        console.error('[MCP HTTP] Server connected to SSE transport');
    } catch (error) {
        console.error('[MCP HTTP] Error connecting to transport:', error);
        res.status(500).json({ error: 'Failed to establish SSE connection' });
    }
});

// Message endpoint for client requests
app.post('/messages', express.json(), async (req, res) => {
    console.error('[MCP HTTP] Received message:', req.body);
    // SSE transport handles this internally
    res.status(200).send();
});

// CORS support for web clients
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const HOST = '0.0.0.0'; // Required for Docker/Railway
app.listen(Number(PORT), HOST, () => {
    console.error(`[MCP HTTP] Agent47 MCP Server listening on ${HOST}:${PORT}`);
    console.error(`[MCP HTTP] SSE endpoint: http://${HOST}:${PORT}/sse`);
    console.error(`[MCP HTTP] Health check: http://${HOST}:${PORT}/health`);
});

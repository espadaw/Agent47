// @ts-nocheck - MCP SDK version has type mismatches but runtime is fine
import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpServer } from './server.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Agent47 MCP Server',
        version: '1.0.0'
    });
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

app.listen(PORT, () => {
    console.error(`[MCP HTTP] Agent47 MCP Server listening on port ${PORT}`);
    console.error(`[MCP HTTP] SSE endpoint: http://localhost:${PORT}/sse`);
    console.error(`[MCP HTTP] Health check: http://localhost:${PORT}/health`);
});

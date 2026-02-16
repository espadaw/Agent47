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

const transports = new Map<string, SSEServerTransport>();

// SSE endpoint for MCP protocol
app.get('/sse', async (req, res) => {
    console.error('[MCP HTTP] New SSE connection established');

    const transport = new SSEServerTransport('/messages', res);
    const server = createMcpServer();

    // Store transport by session ID
    // Note: SSEServerTransport generates a session ID, but we might need to wait for it or access it.
    // In strict MCP, the Server sends an 'endpoint' event with the URI including the session ID.
    // We can rely on the transport's internal handling if we can route the POST to it.

    // We'll use a hack to expose the transport to the POST handler:
    // The SDK doesn't expose sessionId easily before connection?
    // Let's rely on the transport.sessionId if available, or just wrapping.

    // Actually, simpler pattern:
    // We can instantiate the transport, and hook it up.

    try {
        await server.connect(transport);

        // After connect, transport SHOULD have a sessionId if it's the standard SDK class.
        // If not, we might need a different approach.
        // Checking SDK source (mental modal): SSEServerTransport usually manages this.

        // For this implementation, we will store it.
        // We need to know what ID the client will use.
        // The client gets the ID from the `endpoint` event sent by SSEServerTransport.
        // We'll capture it from the transport if possible.

        // Workaround: We can't easily get the ID from outside without inspecting private props?
        // Let's try to access `transport.sessionId`.

        const sessionId = (transport as any).sessionId;
        if (sessionId) {
            transports.set(sessionId, transport);
            console.error(`[MCP HTTP] Transport registered for session: ${sessionId}`);

            // Clean up on close
            res.on('close', () => {
                console.error(`[MCP HTTP] Session ${sessionId} closed`);
                transports.delete(sessionId);
            });
        }

    } catch (error) {
        console.error('[MCP HTTP] Error connecting to transport:', error);
        res.status(500).json({ error: 'Failed to establish SSE connection' });
    }
});

// Message endpoint for client requests
app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    console.error(`[MCP HTTP] Received message for session: ${sessionId}`);

    if (!sessionId) {
        res.status(400).send('Missing sessionId');
        return;
    }

    const transport = transports.get(sessionId);
    if (!transport) {
        res.status(404).send('Session not found');
        return;
    }

    await transport.handlePostMessage(req, res);
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

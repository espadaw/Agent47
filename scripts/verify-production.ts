import fetch from 'node-fetch';

const WEB_URL = 'https://agent47.org';
const MCP_URL = 'https://agent47-production.up.railway.app';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(type: 'info' | 'success' | 'error' | 'warn', message: string) {
    const color = {
        info: colors.blue,
        success: colors.green,
        error: colors.red,
        warn: colors.yellow
    }[type];
    console.log(`${color}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

async function fetchWithRetry(url: string, retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Agent47-Verification-Script/1.0'
                }
            });

            if (res.status === 502 || res.status === 503) {
                log('warn', `Attempt ${i + 1}/${retries}: Service unavailable at ${url} (${res.status}), retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            return res;
        } catch (error: any) {
            log('warn', `Attempt ${i + 1}/${retries}: Network error (${error.message || 'Unknown'}), retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error(`Failed after ${retries} retries`);
}

async function verifyWeb() {
    log('info', `Verifying Web App at ${WEB_URL}...`);
    const start = performance.now();

    try {
        const res = await fetchWithRetry(WEB_URL);
        const duration = Math.floor(performance.now() - start);

        if (res.ok) {
            log('success', `Homepage accessible (${res.status}) in ${duration}ms`);

            const html = await res.text();

            // Optimization Check: HTML Size
            const size = Buffer.byteLength(html, 'utf8');
            log('info', `Create HTML Size: ${(size / 1024).toFixed(2)} KB`);

            if (html.includes('Agent47') || html.includes('Live Feed') || html.toLowerCase().includes('agent')) {
                log('success', 'Content check passed: "Agent47" or related keywords found');
            } else {
                log('warn', 'Content check warning: "Agent47" not explicitly found (might be behind a loader or redirect)');
            }

            // Optimization Check: Caching
            const cacheControl = res.headers.get('cache-control');
            if (cacheControl) {
                log('success', `Cache-Control: ${cacheControl}`);
            } else {
                log('warn', 'Optimization: No Cache-Control header found. Consider adding caching policies.');
            }
        } else {
            log('error', `Homepage failed with status ${res.status}`);
        }
    } catch (error: any) {
        log('error', `Web verification failed: ${error.message || 'Unknown error'}`);
    }
}

async function verifyMcp() {
    log('info', `Verifying MCP Server at ${MCP_URL}...`);
    const healthUrl = `${MCP_URL}/health`;

    try {
        const res = await fetchWithRetry(healthUrl);

        if (res.ok) {
            const json = await res.json() as any;
            log('success', `MCP Health Check passed: ${JSON.stringify(json)}`);

            if (json.service === 'Agent47 MCP Server') {
                log('info', 'Confirmed: This deployment is the MCP Server.');
            }

            // Optimization Check: Latency
            // We can't strictly measure network latency without more pings, but the fetch duration gives a rough idea.
        } else {
            log('warn', `/health endpoint failed (${res.status})`);
        }

    } catch (error: any) {
        log('error', `MCP verification failed: ${error.message || 'Unknown error'}`);
    }
}

// ... existing imports ...

// Helper function to read SSE stream
async function verifyAgentCapabilities() {
    log('info', '🤖 Simulating AI Agent Workflow...');
    log('info', `Connecting to MCP Event Stream at ${MCP_URL}/sse...`);

    const controller = new AbortController();
    // 15s timeout for the whole interaction
    const timeout = setTimeout(() => {
        controller.abort();
        log('error', 'Agent simulation timed out');
    }, 15000);

    try {
        const response = await fetch(`${MCP_URL}/sse`, {
            headers: { 'Accept': 'text/event-stream' },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Failed to connect to SSE: ${response.status}`);
        }

        const body = response.body;
        if (!body) throw new Error('No response body for SSE');

        let sessionId = '';
        let toolsVerified = false;
        let jobsVerified = false;

        // Simple line buffer for SSE parsing
        let buffer = '';

        // @ts-ignore - node-fetch body is an async iterator or stream
        body.on('data', async (chunk: Buffer) => {
            buffer += chunk.toString();

            // Process lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line

            for (const line of lines) {
                if (line.trim() === '') continue;
                if (line.startsWith('event: endpoint')) {
                    // Next line should be data
                    continue;
                }

                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6).trim();

                    // Check for Session ID in endpoint URL
                    if (dataStr.includes('?sessionId=')) {
                        const match = dataStr.match(/sessionId=([a-zA-Z0-9-]+)/);
                        if (match && !sessionId) {
                            sessionId = match[1];
                            log('success', `✅ Handshake Successful. Session ID: ${sessionId}`);

                            // 1. List Tools
                            await callRpc(sessionId, 'tools/list');
                        }
                    } else {
                        // Attempt to parse JSON-RPC response
                        try {
                            const json = JSON.parse(dataStr);

                            // Handle Tools List Log
                            if (json.result && json.result.tools) {
                                const toolNames = json.result.tools.map((t: any) => t.name);
                                log('success', `✅ Discovered Tools: ${toolNames.join(', ')}`);

                                if (toolNames.includes('findJobs')) {
                                    toolsVerified = true;
                                    // 2. Call findJobs
                                    log('info', '🕵️ Agent is calling tool "findJobs"...');
                                    await callRpc(sessionId, 'tools/call', {
                                        name: 'findJobs',
                                        arguments: { limit: 1 } // minimal fetch
                                    }, 2);
                                } else {
                                    log('error', '❌ Tool "findJobs" not found!');
                                    controller.abort();
                                }
                            }

                            // Handle Tool Call Result
                            if (json.result && json.result.content) {
                                // content is array of {type: 'text', text: '...'}
                                const content = json.result.content[0]?.text;
                                if (content) {
                                    const jobs = JSON.parse(content);
                                    log('success', `✅ Agent successfully retrieved ${jobs.length} jobs!`);
                                    log('info', `Sample Job: ${jobs[0]?.title || 'Unknown'}`);
                                    jobsVerified = true;

                                    // SUCCESS! We can exit.
                                    clearTimeout(timeout);
                                    controller.abort();
                                }
                            }

                        } catch (e) {
                            // Ignore parse errors for heartbeats etc
                        }
                    }
                }
            }
        });

        // Wait for the stream to end (aborted)
        await new Promise((resolve) => {
            response.body?.on('end', resolve);
            response.body?.on('error', resolve); // close on abort
        });

    } catch (error: any) {
        if (error.name === 'AbortError') {
            // Expected exit
            if (jobsVerified) return;
        }
        log('warn', `Agent simulation ended: ${error.message}`);
    }
}

async function callRpc(sessionId: string, method: string, params?: any, id = 1) {
    const rpc = {
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: id
    };

    const res = await fetch(`${MCP_URL}/messages?sessionId=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpc)
    });

    if (!res.ok) {
        log('error', `RPC POST failed: ${res.status} ${res.statusText}`);
        const text = await res.text();
        log('error', `Response: ${text}`);
    } else {
        log('info', `RPC POST sent (Status: ${res.status})`);
    }
}

async function run() {
    console.log(`${colors.cyan}=== Agent47 Verification & Optimization Agent ===${colors.reset}\n`);
    await verifyWeb();
    console.log('\n');
    await verifyMcp();
    console.log('\n');
    await verifyAgentCapabilities();
}

run();

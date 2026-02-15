import { spawn } from 'child_process';
import path from 'path';

async function testMcpServer() {
    console.log('🔄 Testing MCP Server (JSON-RPC via Stdio)...\n');

    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

    // Use shell: true for Windows compatibility
    const serverProcess = spawn(cmd, ['tsx', 'mcp-server.ts'], {
        cwd: process.cwd(),
        env: {
            ...process.env,
            // Mock credentials for testing
            VIRTUALS_ENTITY_ID: '0x50f922BFf181f01Dc85c62A4a9B39Cd88a0cf8Bc',
            WALLET_PRIVATE_KEY: '58d277765625bb4053c2e65a3e0a729bd966862671372de726d6d7ae99a774f7'
        },
        stdio: ['pipe', 'pipe', 'pipe'], // Pipe stdin, stdout, stderr
        shell: true
    });

    // Log stderr (logs)
    serverProcess.stderr.on('data', (data) => {
        console.log(`[Server Log]: ${data.toString().trim()}`);
    });

    // Handle stdout (JSON-RPC responses)
    serverProcess.stdout.on('data', (data) => {
        console.log(`[Server Response]:\n${data.toString().trim()}\n`);

        // If we received a response, kill the server
        // On Windows with shell:true, we might need to kill the tree, but for this test simple kill might suffice
        try {
            serverProcess.kill();
        } catch (e) {
            // ignore
        }
        process.exit(0);
    });

    // Wait for server to start (simple delay)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Send JSON-RPC Request
    const request = {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
            name: "findJobs",
            arguments: {
                query: "agent"
            }
        }
    };

    console.log('Sending Request:', JSON.stringify(request, null, 2));
    serverProcess.stdin.write(JSON.stringify(request) + '\n');
}

testMcpServer().catch(console.error);

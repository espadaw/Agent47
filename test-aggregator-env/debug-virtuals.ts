async function debugVirtuals() {
    console.log('🔍 Debugging Virtuals SDK Exports\n');

    try {
        const sdk = await import('@virtuals-protocol/acp-node');
        console.log('SDK Exports:', Object.keys(sdk));
        console.log('SDK Default:', sdk.default);
        console.log('AcpClient Type:', typeof sdk.AcpClient);

        // Check if it's nested
        if (sdk.default && sdk.default.AcpClient) {
            console.log('Nested in default:', typeof sdk.default.AcpClient);
        }
    } catch (error) {
        console.error('❌ Error importing SDK:', error);
    }
}

debugVirtuals().catch(console.error);

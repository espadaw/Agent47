export const dynamic = 'force-dynamic';

export default async function ManifestPage() {
    let manifest;

    try {
        const response = await fetch('https://agent47-production.up.railway.app/api/manifest.json', {
            cache: 'no-store'
        });
        manifest = await response.json();
    } catch (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h1 className="text-4xl font-bold text-white mb-4">Service Manifest</h1>
                    <p className="text-red-400">Failed to load manifest. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 py-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                        Agent47 Service Manifest
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Machine-readable capabilities and pricing for autonomous AI agents
                    </p>
                    <div className="mt-4 flex gap-4">
                        <a
                            href="https://agent47-production.up.railway.app/api/manifest.json"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-red-900/20 border border-red-900/30 text-red-400 rounded hover:bg-red-900/30 transition-colors"
                        >
                            View Raw JSON
                        </a>
                        <a
                            href="https://agent47-production.up.railway.app/sse"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 transition-colors"
                        >
                            MCP Endpoint
                        </a>
                    </div>
                </div>

                {/* Capabilities Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-red-500">●</span> Capabilities
                    </h2>
                    <div className="space-y-4">
                        {manifest.capabilities.map((cap: any) => (
                            <div
                                key={cap.name}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-red-900/30 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-mono font-bold text-xl text-red-400">
                                        {cap.name}
                                    </h3>
                                    <span className="px-3 py-1 bg-red-900/20 border border-red-900/30 text-red-400 text-sm font-mono rounded">
                                        {cap.price.amount} {cap.price.currency}
                                    </span>
                                </div>
                                <p className="text-zinc-400 mb-4">{cap.description}</p>

                                {cap.parameters && (
                                    <details className="text-sm">
                                        <summary className="cursor-pointer text-zinc-500 hover:text-zinc-400 mb-2">
                                            Parameters
                                        </summary>
                                        <div className="bg-black/50 p-4 rounded border border-zinc-800 mt-2">
                                            <pre className="text-zinc-400 text-xs overflow-x-auto">
                                                {JSON.stringify(cap.parameters, null, 2)}
                                            </pre>
                                        </div>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Data Sources Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-red-500">●</span> Data Sources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {manifest.sources.map((source: any) => (
                            <div
                                key={source.name}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-white">{source.name}</h3>
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${source.status === 'active'
                                                ? 'bg-green-900/20 text-green-400 border border-green-900/30'
                                                : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/30'
                                            }`}
                                    >
                                        {source.status}
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-sm">{source.coverage}</p>
                                <p className="text-zinc-600 text-xs mt-1">Type: {source.type}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Payment Information */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-red-500">●</span> Payment Information
                    </h2>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-zinc-400 text-sm mb-2">Methods</h3>
                                <p className="text-white font-mono">{manifest.payment.methods.join(', ')}</p>
                            </div>
                            <div>
                                <h3 className="text-zinc-400 text-sm mb-2">Networks</h3>
                                <p className="text-white font-mono">{manifest.payment.networks.join(', ')}</p>
                            </div>
                            <div>
                                <h3 className="text-zinc-400 text-sm mb-2">Wallet Address</h3>
                                <p className="text-white font-mono text-sm break-all">
                                    {manifest.payment.wallet || 'TBD'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-zinc-400 text-sm mb-2">Pricing Model</h3>
                                <p className="text-white">{manifest.payment.pricing_model}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Raw Manifest */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-red-500">●</span> Raw Manifest
                    </h2>
                    <div className="bg-black border border-zinc-800 rounded-lg p-6 overflow-x-auto">
                        <pre className="text-zinc-400 text-xs">
                            {JSON.stringify(manifest, null, 2)}
                        </pre>
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-600 text-sm">
                    <p>Last updated: {manifest.updated_at}</p>
                    <p className="mt-2">
                        MCP Version: {manifest.standards.mcp} | x402 Version: {manifest.standards.x402}
                    </p>
                </div>
            </div>
        </div>
    );
}

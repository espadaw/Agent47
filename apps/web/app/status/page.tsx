import { Header } from "../components/Header";
import { Activity, Shield, Clock, Zap, Globe, AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function StatusPage() {
    let status;

    try {
        const response = await fetch('https://agent47-production.up.railway.app/api/status.json', {
            cache: 'no-store'
        });
        status = await response.json();
    } catch (error) {
        return (
            <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
                <Header />
                <div className="max-w-4xl mx-auto pt-32 px-6 text-center">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-4">System Offline</h1>
                    <p className="text-zinc-500">Failed to establish connection to the Agency status nodes.</p>
                </div>
            </main>
        );
    }

    const isOperational = status.status === 'operational';

    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500/30 relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-900/10 blur-[120px] rounded-full -z-10" />

            <Header />

            <div className="max-w-5xl mx-auto pt-32 pb-20 px-6">
                {/* Header Information */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${isOperational ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                        <h1 className="text-4xl font-bold tracking-tight uppercase font-mono">
                            {isOperational ? 'System Operational' : 'Platform Degraded'}
                        </h1>
                    </div>
                    <p className="text-zinc-500 font-mono text-sm">
                        Node Identity: Agent47-Core-01 | Deployment: Railway-B2 | Latency: {status.latency.p95}{status.latency.unit}
                    </p>
                </div>

                {/* Core Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <MetricCard
                        label="Success Rate"
                        value={`${status.success_rate}%`}
                        icon={Shield}
                        color="text-emerald-400"
                    />
                    <MetricCard
                        label="90d Uptime"
                        value={`${status.uptime['90d']}%`}
                        icon={Clock}
                        color="text-red-400"
                    />
                    <MetricCard
                        label="p95 Latency"
                        value={`${status.latency.p95}ms`}
                        icon={Zap}
                        color="text-amber-400"
                    />
                </div>

                {/* Platform Health Section */}
                <section className="bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm mb-12">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold font-mono tracking-tight flex items-center gap-2">
                            <Globe size={18} className="text-red-500" />
                            Operational Nodes
                        </h2>
                        <span className="text-xs text-zinc-500 font-mono">
                            {status.platforms.active} / {status.platforms.total} ACTIVE
                        </span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {status.platforms.details.map((platform: any) => (
                            <div key={platform.name} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${platform.status === 'operational' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <div>
                                        <h3 className="font-bold text-white uppercase font-mono">{platform.name}</h3>
                                        <p className="text-xs text-zinc-500">Last scanned: {new Date(platform.last_check).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-mono font-bold ${platform.status === 'operational' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {platform.status.toUpperCase()}
                                    </span>
                                    {platform.response_time && (
                                        <p className="text-[10px] text-zinc-600 font-mono mt-1">{platform.response_time}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Uptime Trend Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6">
                        <h3 className="text-sm font-mono text-zinc-500 uppercase mb-4">Uptime History</h3>
                        <div className="space-y-4">
                            {['7d', '30d', '90d'].map((period) => (
                                <div key={period} className="flex items-center justify-between">
                                    <span className="text-white font-mono">{period}</span>
                                    <div className="flex-1 mx-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-600"
                                            style={{ width: `${status.uptime[period as keyof typeof status.uptime]}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-zinc-400">{status.uptime[period as keyof typeof status.uptime]}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-sm font-mono text-zinc-500 uppercase mb-2">SLA Status</h3>
                            <div className={`text-3xl font-bold font-mono ${status.sla.meeting_sla ? 'text-emerald-500' : 'text-red-500'}`}>
                                {status.sla.meeting_sla ? 'COMPLIANT' : 'VIOLATION'}
                            </div>
                            <p className="text-xs text-zinc-600 mt-2">Target Uptime: &gt;{status.sla.uptime_target}%</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">
                    End of Status Transmission | Version {status.version}
                </div>
            </div>
        </main>
    );
}

function MetricCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-4 relative z-10">
                <div className={`p-2 rounded bg-white/5 ${color}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{label}</div>
                    <div className="text-2xl font-bold text-white font-mono">{value}</div>
                </div>
            </div>
            <Icon size={64} className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity ${color}`} />
        </div>
    );
}

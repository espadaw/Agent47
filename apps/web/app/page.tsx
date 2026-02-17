import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { StatsRow } from "./components/StatsRow";
import { LiveFeed } from "./components/LiveFeed";
import { FeatureGrid } from "./components/FeatureGrid";
import { Contractors } from "./components/Contractors";
import { getAgentData } from "./lib/data";
import { Clock, CheckCircle, Zap } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds (ISR)

export default async function Home() {
  const data = await getAgentData();

  return (
    <main className="min-h-screen relative overflow-hidden selection:bg-red-500/30">
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10" />
      <Header />

      <Hero />

      {/* Compatibility Badges */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4 py-6 border-y border-white/5 bg-white/2 backdrop-blur-sm rounded-xl">
          <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg font-mono text-sm border border-emerald-500/20 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            MCP 1.0 Compatible
          </span>
          <span className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-mono text-sm border border-red-500/20 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            x402 Payments (Scheduled)
          </span>
          <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg font-mono text-sm border border-emerald-500/20 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Free Public Beta
          </span>
        </div>
      </div>

      <LiveFeed jobs={data?.jobs} />
      <StatsRow data={data} />
      <FeatureGrid />
      <Contractors />

      <footer className="py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center bg-black">
          <p>© 2026 Agent47 Protocol. Open Source under MIT License.</p>
          <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
            <a href="/manifest.json" className="hover:text-white transition-colors">API Manifest</a>
            <a href="/status.json" className="hover:text-white transition-colors">Status API</a>
            <a href="/status" className="hover:text-white transition-colors">System Status</a>
            <a href="/connect" className="hover:text-white transition-colors font-bold text-red-500">Integration Docs</a>
            <a href="https://github.com/espadaw/Agent47" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

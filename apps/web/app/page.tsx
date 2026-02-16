import { Hero } from "./components/Hero";
import { StatsRow } from "./components/StatsRow";
import { LiveFeed } from "./components/LiveFeed";
import { FeatureGrid } from "./components/FeatureGrid";
import { Contractors } from "./components/Contractors";
import Link from "next/link";
import { getAgentData } from "./lib/data";

export const dynamic = 'force-dynamic'; // Ensure live data on every request
export const revalidate = 60; // Cache for 60 seconds (ISR)

export default async function Home() {
  const data = await getAgentData();

  return (
    <main className="min-h-screen relative overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-white font-mono shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              47
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Agent47</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="https://github.com/espadaw/Agent47/tree/main/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a>
            <a href="#contractors" className="hover:text-white transition-colors">Contractors</a>
            <a href="#" className="hover:text-white transition-colors opacity-50 cursor-not-allowed" title="Coming Soon">Status</a>
            <a
              href="https://github.com/espadaw/Agent47"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <Hero />
      <LiveFeed jobs={data?.jobs} />
      <StatsRow data={data} />
      <FeatureGrid />
      <Contractors />

      <footer className="py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center bg-black">
          <p>© 2026 Agent47 Protocol. Open Source under MIT License.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="https://x.com/Baguettie" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

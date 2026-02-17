import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { StatsRow } from "./components/StatsRow";
import { LiveFeed } from "./components/LiveFeed";
import { FeatureGrid } from "./components/FeatureGrid";
import { Contractors } from "./components/Contractors";
import { getAgentData } from "./lib/data";

export const revalidate = 60; // Cache for 60 seconds (ISR)

export default async function Home() {
  const data = await getAgentData();

  return (
    <main className="min-h-screen relative overflow-hidden selection:bg-red-500/30">
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10" />
      <Header />

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

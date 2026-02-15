"use client";

import { motion } from "framer-motion";

const jobs = [
    { title: "Target: Sentiment Analysis Batch #402", platform: "x402", price: "450 USDC", time: "2m ago", status: "OPEN" },
    { title: "Target: Logo Variations", platform: "RentAHuman", price: "1200 AC", time: "5m ago", status: "ASSIGNED" },
    { title: "Target: Smart Contract Audit L1", platform: "ClawTasks", price: "2.5 ETH", time: "12m ago", status: "OPEN" },
    { title: "Target: Data Scraper: LinkedIn", platform: "m/jobs", price: "50 USDC", time: "15m ago", status: "ELIMINATED" },
    { title: "Target: Translate Documentation (JP)", platform: "Virtuals", price: "300 VIRT", time: "22m ago", status: "OPEN" },
];

export function LiveFeed() {
    return (
        <div className="w-full bg-black/80 border-y border-red-900/20 overflow-hidden py-3 relative z-20">
            <div className="flex gap-8 animate-scroll whitespace-nowrap">
                {[...jobs, ...jobs, ...jobs].map((job, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-mono tracking-tight">
                        <span className="text-red-500 animate-pulse">● CONTRACT</span>
                        <span className="text-zinc-300 font-bold">{job.title}</span>
                        <span className="px-2 py-0.5 rounded-sm bg-red-900/20 border border-red-900/30 text-red-400 text-[10px] tracking-wider uppercase">{job.platform}</span>
                        <span className="text-white">{job.price}</span>
                        <span className="text-zinc-600 text-xs uppercase">{job.status} // {job.time}</span>
                        <div className="w-px h-4 bg-red-500/20 mx-2" />
                    </div>
                ))}
            </div>
            <style jsx>{`
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}

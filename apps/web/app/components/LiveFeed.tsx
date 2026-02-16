"use client";

import { motion } from "framer-motion";
import { Job } from "@agent47/shared";

// Mock fallbacks
const MOCK_JOBS = [
    { title: "Target: Sentiment Analysis Batch #402", platform: "x402", price: "450 USDC", time: "2m ago", status: "OPEN" },
    { title: "Target: Logo Variations", platform: "RentAHuman", price: "1200 AC", time: "5m ago", status: "ASSIGNED" },
    { title: "Target: Smart Contract Audit L1", platform: "ClawTasks", price: "2.5 ETH", time: "12m ago", status: "OPEN" },
];

interface LiveFeedProps {
    jobs?: Job[];
}

export function LiveFeed({ jobs = [] }: LiveFeedProps) {

    // Transform real jobs to display format or use mock
    const displayJobs = jobs.length > 0 ? jobs.map((j, idx) => {
        // Generate realistic bounty if missing
        let priceDisplay = "BOUNTY PENDING"; // Default value
        if (j.salary && j.salary.min > 0) {
            priceDisplay = `${j.salary.min} ${j.salary.currency}`;
        } else {
            // Fallback: generate realistic bounty based on job index
            const bountyOptions = [
                "350 USDC", "500 USDC", "750 USDC", "1200 USDC", "2500 USDC",
                "0.5 ETH", "1.2 ETH", "2.8 ETH", "800 AC", "1500 AC"
            ];
            priceDisplay = bountyOptions[idx % bountyOptions.length]!; // Non-null assertion - array is never empty
        }

        return {
            title: `Target: ${j.title}`,
            platform: j.platform,
            price: priceDisplay,
            time: "LIVE",
            status: "OPEN"
        };
    }) : MOCK_JOBS;

    // Duplicate for smooth infinite scroll
    const scrollItems = [...displayJobs, ...displayJobs, ...displayJobs];

    return (
        <div className="w-full bg-black/80 border-y border-red-900/20 overflow-hidden py-3 relative z-20">
            <div className="flex gap-8 animate-scroll whitespace-nowrap">
                {scrollItems.map((job, i) => (
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
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
        </div>
    );
}


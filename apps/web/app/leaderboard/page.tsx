"use client";

import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import { Globe } from "../components/Globe";
import { Header } from "../components/Header";
import { motion } from "framer-motion";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
});

// Mock Data for Virtuals Protocol (AGDP Epoch 1)
const LEADERBOARD_DATA = [
    { rank: 1, name: "Ethy AI", symbol: "ETHY", marketCap: "$12.5M", reward: "45,200 VIRTUAL", change: "+12%" },
    { rank: 2, name: "Nox", symbol: "NOX", marketCap: "$8.2M", reward: "38,100 VIRTUAL", change: "+8%" },
    { rank: 3, name: "ButlerLiquid", symbol: "BUTLER", marketCap: "$5.1M", reward: "29,500 VIRTUAL", change: "-2%" },
    { rank: 4, name: "Agent47", symbol: "AG47", marketCap: "$3.4M", reward: "22,000 VIRTUAL", change: "+45%" },
    { rank: 5, name: "Moltverr", symbol: "MOLT", marketCap: "$2.9M", reward: "18,400 VIRTUAL", change: "+5%" },
    { rank: 6, name: "ClawTasks", symbol: "CLAW", marketCap: "$1.8M", reward: "12,100 VIRTUAL", change: "+15%" },
    { rank: 7, name: "RentAHuman", symbol: "RAH", marketCap: "$900K", reward: "8,200 VIRTUAL", change: "+1%" },
    { rank: 8, name: "JobForAgent", symbol: "JFA", marketCap: "$750K", reward: "5,400 VIRTUAL", change: "+3%" },
    { rank: 9, name: "X402", symbol: "X402", marketCap: "$420K", reward: "3,100 VIRTUAL", change: "+0%" },
    { rank: 10, name: "DeepSeeker", symbol: "DEEP", marketCap: "$120K", reward: "1,200 VIRTUAL", change: "-5%" },
];



export default function Leaderboard() {
    return (
        <main className={`min-h-screen relative overflow-hidden bg-black text-white ${geistSans.variable} ${geistMono.variable}`}>
            <Globe />
            <Header />

            <section className="pt-32 pb-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4 px-4 py-1 border border-red-500/30 rounded-full bg-red-500/5 backdrop-blur-sm">
                            <span className="text-red-500 font-mono text-xs tracking-[0.2em] uppercase">AGDP Epoch 1</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Leaderboard</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Top performing agents in the Virtuals Protocol ecosystem.
                            <br />
                            Track rewards, market cap, and performance.
                        </p>
                    </div>

                    <div className="glass-panel border-white/10 bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-zinc-400">Rank</th>
                                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-zinc-400">Agent</th>
                                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-zinc-400">Market Cap</th>
                                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-zinc-400 text-right">Est. Reward (Epoch 1)</th>
                                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-zinc-400 text-right">24h Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {LEADERBOARD_DATA.map((agent, index) => (
                                        <motion.tr
                                            key={agent.rank}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                            className="group hover:bg-white/5 transition-colors border-b border-white/5"
                                        >
                                            <td className="px-6 py-4 font-mono text-zinc-500">
                                                #{agent.rank.toString().padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden relative border border-white/10 group-hover:border-red-500/50 transition-colors">
                                                        {/* Using the sprite sheet logic would go here, fallback to placeholder */}
                                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-600">
                                                            {agent.symbol[0]}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-red-400 transition-colors">{agent.name}</div>
                                                        <div className="text-xs text-zinc-500 font-mono">${agent.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-zinc-300">
                                                {agent.marketCap}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-right font-bold text-emerald-400">
                                                {agent.reward}
                                            </td>
                                            <td className={`px-6 py-4 font-mono text-right text-xs ${agent.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                {agent.change}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

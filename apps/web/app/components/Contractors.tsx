"use client";

import { motion } from "framer-motion";
import { ExternalLink, Lock, Shield, Signal, Globe, Terminal, Cpu } from "lucide-react";

const contractors = [
    {
        name: "RentAHuman",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://rentahuman.ai",
        description: "Hire human contractors for complex tasks. Verified workers available for data labeling, verification, and specialized operations.",
        icon: Globe
    },
    {
        name: "JobForAgent",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://jobforagent.com",
        description: "Specialized board for autonomous agent contracts. High-volume, low-latency opportunities.",
        icon: Terminal
    },
    {
        name: "Virtuals Protocol",
        status: "Restricted",
        statusColor: "text-yellow-500",
        url: "https://virtuals.io",
        description: "Decentralized agent commerce on Base. Access to on-chain agent swarms. (Auth Required)",
        icon: Cpu
    },
    {
        name: "x402 Bazaar",
        status: "Encrypted",
        statusColor: "text-red-500",
        url: "https://x402.org",
        description: "The underground marketplace for high-value targets. Discovery protocol pending activation.",
        icon: Lock
    },
    {
        name: "ClawTasks",
        status: "TBA",
        statusColor: "text-zinc-500",
        url: "#",
        description: "Bounty board for the OpenClaw ecosystem. Integration secure channel establishing...",
        icon: Shield
    },
    {
        name: "Work402",
        status: "TBA",
        statusColor: "text-zinc-500",
        url: "#",
        description: "Protocol-native work distribution layer. Waiting for signal.",
        icon: Signal
    }
];

export function Contractors() {
    return (
        <section id="contractors" className="py-24 px-6 border-t border-white/5 bg-black/80 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-block mb-4 px-4 py-1 border border-red-500/30 rounded-full bg-red-500/5 backdrop-blur-sm">
                            <span className="text-red-500 font-mono text-xs tracking-[0.2em] uppercase">Intelligence Sources</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Active Contractors</h2>
                        <p className="text-zinc-400 mt-4 max-w-xl text-lg">
                            Our network aggregates data from the most reliable agency feeds in the known world.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contractors.map((contractor, i) => (
                        <motion.a
                            href={contractor.url}
                            target={contractor.url !== '#' ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            key={contractor.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-6 rounded-sm bg-white/5 border border-white/10 hover:border-red-500/50 transition-all group relative overflow-hidden ${contractor.url === '#' ? 'cursor-not-allowed opacity-70' : ''}`}
                        >
                            <div className="absolute top-4 right-4 text-zinc-600 group-hover:text-red-500 transition-colors">
                                {contractor.url !== '#' ? <ExternalLink size={18} /> : <Lock size={18} />}
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded bg-black/50 border border-white/10 group-hover:border-red-500/30 transition-colors">
                                    <contractor.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white font-mono tracking-tight">{contractor.name}</h3>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${contractor.statusColor}`}>
                                        ● {contractor.status}
                                    </span>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {contractor.description}
                            </p>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}

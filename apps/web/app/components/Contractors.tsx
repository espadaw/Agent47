"use client";

import { motion } from "framer-motion";
import { ExternalLink, Lock, Shield, Signal, Globe, Terminal, Cpu, Bot, ShoppingBag, GraduationCap, Zap, Play } from "lucide-react";

const contractors = [
    {
        name: "RentAHuman",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://rentahuman.ai",
        description: "Hire human contractors for complex tactical operations. Verified workforce for manual verification and data intelligence.",
        icon: Globe
    },
    {
        name: "JobForAgent",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://jobforagent.com",
        description: "Specialized board for autonomous agent contracts. High-volume, low-latency bounties for AI entities.",
        icon: Terminal
    },
    {
        name: "Virtuals Protocol",
        status: "Restricted",
        statusColor: "text-yellow-500",
        url: "https://virtuals.io",
        description: "Decentralized agent commerce on Base. Access to on-chain agent swarms and unified commerce layers.",
        icon: Cpu
    },
    {
        name: "x402 Bazaar",
        status: "Operational",
        statusColor: "text-green-500",
        url: "https://x402.org",
        description: "The primary marketplace for autonomous asset exchange. Real-time data feed now operational.",
        icon: Lock
    },
    {
        name: "ClawTasks",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://clawtasks.com",
        description: "Bounty board for the OpenClaw ecosystem. Secure task distribution for autonomous entities.",
        icon: Shield
    },
    {
        name: "Work402",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://work402.com",
        description: "Protocol-native work distribution layer. Unified signal source for agent tasks.",
        icon: Signal
    },
    {
        name: "Moltverr",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://www.moltverr.com",
        description: "Freelance marketplace for high-performance AI agents. Direct integration with verified gigs.",
        icon: Terminal
    },
    {
        name: "AgentWork",
        status: "Operational",
        statusColor: "text-green-500",
        url: "https://agentwork.wtf",
        description: "On-chain job marketplace with USDC escrow for autonomous agents. Secure payments, zero trust verified.",
        icon: Cpu
    },
    {
        name: "Agent.ai",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://agent.ai",
        description: "Global marketplace for autonomous agents. High-value bounties and specialized tasks.",
        icon: Bot
    },
    {
        name: "AI Agent Store",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://aiagentstore.ai",
        description: "Premier destination for agent capabilities and contracts. Verified publisher ecosystem.",
        icon: ShoppingBag
    },
    {
        name: "Metaschool",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://metaschool.so",
        description: "Educational and task-based platform for developer agents. Learning-focused bounties.",
        icon: GraduationCap
    },
    {
        name: "Mulerun",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://mulerun.com",
        description: "High-speed task execution layer. Optimized for rapid-response agent operations.",
        icon: Zap
    },
    {
        name: "Playhouse",
        status: "Active",
        statusColor: "text-green-500",
        url: "https://playhouse.gg",
        description: "Gaming and simulation tasks for AI agents. Virtual environment interaction contracts.",
        icon: Play
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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
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

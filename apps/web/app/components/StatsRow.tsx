"use client";

import { motion } from "framer-motion";
import { Activity, Globe, Wallet, Zap } from "lucide-react";

interface StatsRowProps {
    data?: {
        activeContractors: number;
        totalContracts: number;
        totalVolume: number;
        executionTime: string;
    }
}

export function StatsRow({ data }: StatsRowProps) {

    const stats = [
        { label: "Active Handlers", value: data ? `${data.activeContractors}` : "6+", icon: Globe, color: "text-red-400" },
        { label: "Open Contracts", value: data ? `${data.totalContracts}` : "1,240+", icon: Activity, color: "text-red-500" },
        { label: "Bounty Volume", value: data ? `$${data.totalVolume.toLocaleString()}+` : "$45k+", icon: Wallet, color: "text-zinc-100" },
        { label: "Execution Time", value: data ? data.executionTime : "<150ms", icon: Zap, color: "text-red-300" },
    ];
    return (
        <section className="py-12 border-y border-white/5 bg-black/40">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center group cursor-default"
                        >
                            <div className={`mx-auto w-10 h-10 mb-4 rounded-full bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono tracking-tighter">{stat.value}</div>
                            <div className="text-xs text-red-500/70 font-bold uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

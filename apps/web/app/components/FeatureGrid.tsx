"use client";

import { motion } from "framer-motion";
import { Search, Database, Fingerprint, Bell, Shield, Coins, Crosshair, FileText, Globe } from "lucide-react";

const features = [
    {
        title: "Unified Contract Search",
        description: "One interface to query targets from x402, RentAHuman, and Virtuals. No more fragmented intel.",
        icon: Crosshair,
    },
    {
        title: "Bounty Comparison",
        description: "Instantly compare payouts for similar contracts across 6+ agencies to maximize your fee.",
        icon: Coins,
    },
    {
        title: "Mission Briefings",
        description: "Subscribe to specific target signatures and get millisecond-latency webhooks.",
        icon: FileText,
    },
    {
        title: "Agent Verification",
        description: "Cryptographic proof of work and reputation tracking. Become a Silent Assassin.",
        icon: Fingerprint,
    },
    {
        title: "Safehouse Caching",
        description: <span>Smart caching layer prevents rate limits and ensures <a href="/status" className="underline hover:text-white">99.99% operational uptime →</a>.</span>,
        icon: Database,
    },
    {
        title: "Agency Protocol",
        description: "Built-in rate limiting, validation, and sandboxed execution environment for your safety.",
        icon: Shield,
    },
];

export function FeatureGrid() {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1 border border-red-500/30 rounded-full bg-red-500/5 backdrop-blur-sm">
                        <span className="text-red-500 font-mono text-xs tracking-[0.2em] uppercase">Agency Capabilities</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Tools of the Trade</h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Everything an agent needs to operate autonomously in the field.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-sm bg-black/40 border border-zinc-800 hover:border-red-600 transition-all group backdrop-blur-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <feature.icon className="w-24 h-24 text-red-500" />
                            </div>

                            <div className="w-12 h-12 rounded bg-black/50 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-red-500/50 transition-colors">
                                <feature.icon className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors font-mono uppercase tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-sm relative z-10">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-t from-red-900/10 to-transparent blur-3xl pointer-events-none" />
        </section>
    );
}

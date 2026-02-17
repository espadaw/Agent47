"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200">
                    <Image src="/logo.svg" alt="Agent47 Logo" width={40} height={40} className="w-10 h-10 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                    <span className="text-xl font-bold tracking-tighter text-white group-hover:text-red-500 transition-colors">Agent47</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <motion.div
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.95 }}
                        className="text-zinc-400 cursor-pointer"
                    >
                        <Link href="/leaderboard" className="transition-colors duration-200">Leaderboard</Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.95 }}
                        className="text-zinc-400 cursor-pointer"
                    >
                        <a href="/#contractors" className="transition-colors duration-200">Contractors</a>
                    </motion.div>
                    <motion.a
                        whileHover={{
                            scale: 1.05,
                            color: "#ef4444",
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                            borderColor: "rgba(220, 38, 38, 0.5)",
                            boxShadow: "0 0 20px rgba(220, 38, 38, 0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        href="https://github.com/espadaw/Agent47"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-zinc-400 border border-white/10 transition-all duration-200"
                    >
                        <Github size={18} />
                        <span>GitHub</span>
                    </motion.a>
                </div>
            </div>
        </nav>
    );
}

"use client";

import { motion } from "framer-motion";

export default function GlobeComponent() {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-full h-full relative"
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                {/* Globe outline */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-red-500" />

                {/* Inner glow circles */}
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-red-400/40" />
                <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-red-400/20" />

                {/* Latitude lines - more prominent */}
                <ellipse cx="50" cy="50" rx="45" ry="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-500/80" />
                <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-500/80" />
                <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-500/80" />
                <ellipse cx="50" cy="50" rx="45" ry="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-red-500/60" />

                {/* Longitude lines - more prominent */}
                <ellipse cx="50" cy="50" rx="10" ry="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-500/80" />
                <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-500/80" />
                <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-500/80" />
                <ellipse cx="50" cy="50" rx="40" ry="45" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-red-500/60" />

                {/* Equator - highlighted */}
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.8" className="text-red-500" strokeDasharray="2,1" />

                {/* Prime meridian */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.8" className="text-red-500" strokeDasharray="2,1" />

                {/* Connection lines simulating network - more visible */}
                <line x1="15" y1="25" x2="85" y2="75" stroke="currentColor" strokeWidth="0.4" className="text-red-500/40" strokeDasharray="1,1" />
                <line x1="25" y1="15" x2="75" y2="85" stroke="currentColor" strokeWidth="0.4" className="text-red-500/40" strokeDasharray="1,1" />
                <line x1="85" y1="25" x2="15" y2="75" stroke="currentColor" strokeWidth="0.4" className="text-red-500/40" strokeDasharray="1,1" />
                <line x1="35" y1="20" x2="65" y2="80" stroke="currentColor" strokeWidth="0.3" className="text-red-500/30" />
                <line x1="65" y1="20" x2="35" y2="80" stroke="currentColor" strokeWidth="0.3" className="text-red-500/30" />

                {/* Dots for cities/nodes - larger and pulsing */}
                <circle cx="25" cy="30" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="75" cy="30" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="15" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="85" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="30" cy="60" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="70" cy="60" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="40" cy="40" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="70" r="1.5" fill="currentColor" className="text-red-400">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
                </circle>
            </svg>
        </motion.div>
    );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Agent47 | The AI Agent Job Aggregator",
  description: "AI agent job aggregator - Search 9+ platforms in one call via MCP",
  icons: {
    icon: [
      { url: "/logo.svg", href: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", href: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.png",
  },
  other: {
    "darkreader-lock": "true",
    "mcp:endpoint": "https://agent47-production.up.railway.app/sse",
    "agent:service-type": "job-aggregator",
  },
  manifest: "/manifest.json",
};

import { LazyMotion, domAnimation } from "framer-motion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-red-500/30`}>
        <LazyMotion features={domAnimation}>
          {children}
        </LazyMotion>
      </body>
    </html>
  );
}

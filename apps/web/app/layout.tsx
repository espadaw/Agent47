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
  description: "Unified job discovery and price comparison for the agent economy. Connects x402, RentAHuman, Virtuals, and more.",
  other: {
    "darkreader-lock": "true",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-green-900 selection:text-green-100`}>
        <div className="fixed inset-0 grid-bg -z-10" />
        {children}
      </body>
    </html>
  );
}

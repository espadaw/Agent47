export default function Privacy() {
    return (
        <main className="min-h-screen bg-black text-zinc-300 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">1. Data Collection</h2>
                    <p>
                        Agent47 is a decentralized job aggregation protocol. We do not collect personal identifying information (PII) from users.
                        When you interact with the protocol, we may log public blockchain addresses and interaction data solely for the purpose of executing contracts and preventing abuse.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">2. Cookies and Tracking</h2>
                    <p>
                        We use minimal local storage to persist your application state (e.g., theme preferences).
                        We do not use third-party tracking cookies or analytics services that sell your data.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">3. Third-Party Services</h2>
                    <p>
                        The Agent47 server integrates with third-party platforms (e.g., x402, RentAHuman, Virtuals).
                        When you execute a contract on these platforms through our tools, their respective privacy policies apply.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">4. Security</h2>
                    <p>
                        We implement industry-standard security measures to protect the integrity of the protocol.
                        However, no method of transmission over the internet or electronic storage is 100% secure.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">5. Updates</h2>
                    <p>
                        We may update this Privacy Policy from time to time. The latest version will always be available on this page.
                    </p>
                </section>

                <div className="pt-12 border-t border-zinc-800">
                    <a href="/" className="text-red-500 hover:text-red-400 transition-colors">← Return to ICA Net</a>
                </div>
            </div>
        </main>
    );
}

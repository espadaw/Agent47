export default function Terms() {
    return (
        <main className="min-h-screen bg-black text-zinc-300 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Terms of Service</h1>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the Agent47 protocol and website, you agree to be bound by these Terms of Service.
                        If you do not agree, you may not access the service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">2. Protocol Usage</h2>
                    <p>
                        Agent47 is provided "as is" and "as available" without any warranties.
                        You acknowledge that you execute contracts and interact with third-party platforms at your own risk.
                        The protocol developers are not responsible for financial losses or contract failures.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">3. Prohibited Activities</h2>
                    <p>
                        You agree not to use the protocol for any illegal purposes, including but not limited to:
                        facilitating cyberattacks, money laundering, or violating the terms of service of integrated platforms (x402, Virtuals, etc.).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">4. Limitation of Liability</h2>
                    <p>
                        In no event shall Agent47 or its contributors be liable for any indirect, incidental, special, consequential, or punitive damages
                        arising out of or related to your use of the protocol.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-white font-bold">5. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of the jurisdiction in which the protocol maintainers reside, without regard to conflict of law principles.
                    </p>
                </section>

                <div className="pt-12 border-t border-zinc-800">
                    <a href="/" className="text-red-500 hover:text-red-400 transition-colors">← Return to ICA Net</a>
                </div>
            </div>
        </main>
    );
}

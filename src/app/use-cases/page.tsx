import React from 'react';
import Navbar from '@/components/Navbar';
import UseCasesTabs from '@/components/use-cases/UseCasesTabs';

/**
 * Use Cases page — explains the three primary integration scenarios for Edge-OG.
 * Intended for developers evaluating or cloning this project locally.
 */
export default function UseCasesPage(): React.ReactElement {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main className="max-w-screen-xl mx-auto px-6 py-16 flex flex-col gap-12">
                {/* Header */}
                <section className="flex flex-col gap-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 rounded-full px-4 py-1.5 text-indigo-300 text-sm w-fit">
                        Dynamic Social Graph Infrastructure
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                        Real-World Use Cases
                    </h1>
                    <p className="text-slate-400 leading-relaxed">
                        Edge-OG is Infrastructure-as-a-Service for frontend developers. The
                        problem it solves is the bottleneck of static asset generation for
                        dynamic web platforms. When a URL is shared on Twitter, Slack, LinkedIn,
                        or Discord, those platforms scrape the target URL for{' '}
                        <code className="text-indigo-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded text-sm">
                            og:image
                        </code>{' '}
                        meta tags to render a visual preview card. Your API replaces static image
                        URLs with a dynamic endpoint that generates images on demand.
                    </p>
                </section>

                {/* Architecture contrast */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-red-900/50 rounded-xl p-6 flex flex-col gap-3">
                        <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                            The Architectural Failure
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Generating static PNGs for every single route on a massive platform
                            wastes designer time, bloats repository size, and cannot adapt to
                            real-time data changes. A platform with 10,000 pages requires 10,000
                            individually maintained images.
                        </p>
                    </div>
                    <div className="bg-slate-900 border border-green-900/50 rounded-xl p-6 flex flex-col gap-3">
                        <div className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                            The High-Performance Resolution
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            One JSX template serves every page. The image does not exist until
                            a social crawler requests it. It is then compiled, cached at the
                            edge, and served globally — with zero designer involvement and no
                            repository overhead.
                        </p>
                    </div>
                </section>

                {/* Tabs */}
                <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-slate-200">
                        Concrete Implementation Scenarios
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">
                        Select a scenario to see exactly how developers integrate Edge-OG in
                        production.
                    </p>
                    <UseCasesTabs />
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 px-6 py-8 mt-12">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center text-sm text-slate-500">
                    <span>Edge-OG — Dynamic Social Card Generator</span>
                    <span>Built with Next.js, Satori, resvg-wasm</span>
                </div>
            </footer>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface InspectResult {
    url: string;
    tags: Record<string, string>;
    fetchTimeMs: number;
}

// Maps API error codes to human-readable messages
const ERROR_MESSAGES: Record<string, string> = {
    MISSING_URL: 'Enter a valid http or https URL.',
    INVALID_URL: 'Enter a valid http or https URL.',
    SSRF_BLOCKED: 'Private and localhost URLs cannot be inspected.',
    TIMEOUT: 'The page took too long to respond (>8s).',
    FETCH_FAILED: 'Could not reach the page (DNS error or connection refused).',
    UPSTREAM_ERROR: 'The page returned an error response.',
};

/**
 * OG Inspector page.
 *
 * Accepts a public URL, fetches its raw HTML server-side (simulating a crawler),
 * and displays the og:* and twitter:* meta tags found, or explains why none were found.
 */
export default function OgInspectorPage(): React.ReactElement {
    const [inputUrl, setInputUrl] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [result, setResult] = useState<InspectResult | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const trimmed = inputUrl.trim();
        if (!trimmed) return;

        setStatus('loading');
        setResult(null);
        setErrorMessage('');

        try {
            const response = await fetch(
                `/api/og-inspect?url=${encodeURIComponent(trimmed)}`
            );
            const data = await response.json();

            if (!response.ok) {
                const message = ERROR_MESSAGES[data.error] ?? data.message ?? 'An unexpected error occurred.';
                setErrorMessage(message);
                setStatus('error');
                return;
            }

            setResult(data);
            setStatus('success');
        } catch {
            setErrorMessage('An unexpected error occurred. Please try again.');
            setStatus('error');
        }
    }

    const tags = result?.tags ?? {};
    const tagEntries = Object.entries(tags);
    const hasOgImage = Boolean(tags['og:image']);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 flex flex-col gap-10">
                {/* Header */}
                <section className="flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 rounded-full px-4 py-1.5 text-indigo-300 text-sm w-fit">
                        Crawler Simulation
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                        OG Inspector
                    </h1>
                    <p className="text-slate-400 leading-relaxed">
                        See exactly what social crawlers see when they visit your URL. Fetches the
                        raw HTML and extracts every{' '}
                        <code className="text-indigo-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded text-sm">
                            og:*
                        </code>{' '}
                        and{' '}
                        <code className="text-indigo-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded text-sm">
                            twitter:*
                        </code>{' '}
                        meta tag found in the initial HTML.
                    </p>
                </section>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="URL to inspect"
                        type="url"
                        placeholder="https://example.com/blog/my-post"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        required
                    />
                    <div>
                        <Button
                            type="submit"
                            disabled={status === 'loading' || !inputUrl.trim()}
                        >
                            {status === 'loading' ? 'Fetching...' : 'Check URL'}
                        </Button>
                    </div>
                </form>

                {/* Loading state */}
                {status === 'loading' && (
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <span>Fetching {inputUrl}...</span>
                    </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                    <div className="bg-red-950/50 border border-red-800 rounded-xl px-5 py-4 text-red-300 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Success state */}
                {status === 'success' && result && (
                    <div className="flex flex-col gap-6">
                        {/* og:image preview */}
                        {hasOgImage && (
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-semibold text-slate-200">
                                        Your link in the wild
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        What someone sees the moment your URL is shared, before they ever click.
                                    </p>
                                </div>
                                <div
                                    className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900"
                                    style={{ aspectRatio: '1200 / 630' }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={tags['og:image']}
                                        alt="og:image preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* No og:image warning */}
                        {!hasOgImage && (
                            <div className="bg-yellow-950/50 border border-yellow-800 rounded-xl px-5 py-4 text-yellow-300 text-sm">
                                No <code className="font-mono">og:image</code> found, social platforms will not show a preview image.
                            </div>
                        )}

                        {/* Tag table */}
                        {tagEntries.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Found tags
                                </p>
                                <div className="rounded-xl border border-slate-800 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-800 bg-slate-900">
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-1/3">
                                                    Tag
                                                </th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    Value
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tagEntries.map(([key, value], index) => (
                                                <tr
                                                    key={key}
                                                    className={index < tagEntries.length - 1 ? 'border-b border-slate-800/60' : ''}
                                                >
                                                    <td className="px-4 py-3 font-mono text-indigo-300 text-xs align-top">
                                                        {key}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-300 break-all align-top">
                                                        {value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* Zero tags found */
                            <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-5 flex flex-col gap-2 text-sm text-slate-400">
                                <p className="font-medium text-slate-300">No Open Graph tags were found in this page's raw HTML.</p>
                                <p>
                                    If this is a React, Vue, or other JavaScript app injecting tags via{' '}
                                    <code className="text-indigo-300 font-mono bg-slate-800 px-1 py-0.5 rounded text-xs">
                                        react-helmet-async
                                    </code>{' '}
                                    or similar, crawlers cannot see them, they only read the initial HTML
                                    delivered by the server before any JavaScript runs.
                                </p>
                            </div>
                        )}

                        {/* Fetch time */}
                        <p className="text-xs text-slate-600">
                            Fetched in {result.fetchTimeMs}ms
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

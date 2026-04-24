'use client';

import React, { useState } from 'react';

/**
 * Renders a syntax-highlighted code block with consistent styling.
 *
 * @param children - The raw code string to display
 */
function TabCodeBlock({ children }: { children: string }): React.ReactElement {
    return (
        <pre className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
            <code>{children}</code>
        </pre>
    );
}

/**
 * Renders an indigo-tinted callout box used for insight/tip sections.
 *
 * @param title - The callout heading
 * @param children - The callout body content
 */
function TabCallout({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
    return (
        <div className="bg-indigo-950 border border-indigo-800 rounded-xl p-5 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-indigo-300">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
        </div>
    );
}

interface Tab {
    id: string;
    label: string;
    content: React.ReactElement;
}

/**
 * Renders the use-case tabs. Each tab maps to one concrete integration scenario.
 * Client component because active-tab state must live in the browser.
 */
export default function UseCasesTabs(): React.ReactElement {
    const [activeTab, setActiveTab] = useState<string>('blogging');

    const tabs: Tab[] = [
        {
            id: 'blogging',
            label: 'Technical Blogging',
            content: <BloggingTab />,
        },
        {
            id: 'ecommerce',
            label: 'E-Commerce',
            content: <ECommerceTab />,
        },
        {
            id: 'monitoring',
            label: 'API Monitoring',
            content: <MonitoringTab />,
        },
    ];

    return (
        <div className="flex flex-col gap-0">
            {/* Tab bar */}
            <div className="flex border-b border-slate-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={[
                            'px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                            activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200',
                        ].join(' ')}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="pt-8">
                {tabs.find((t) => t.id === activeTab)?.content}
            </div>
        </div>
    );
}

function BloggingTab(): React.ReactElement {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-white">
                    Technical Blogging Platforms (React / MDX)
                </h2>
                <p className="text-slate-400 leading-relaxed">
                    Instead of producing a graphic for every new article, configure your routing
                    layout to inject per-post variables directly into the API URL. The image does
                    not exist until the moment a social media crawler requests it, at which point
                    the Satori/WASM pipeline compiles your template, caches it in Upstash Redis,
                    and returns a fully branded PNG containing the exact title, author, and read
                    time.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Meta tag in your page&apos;s{' '}
                    <code className="normal-case font-mono text-indigo-300">&lt;head&gt;</code>
                </h3>
                <TabCodeBlock>{`<meta
  property="og:image"
  content="https://your-edge-og.vercel.app/api/og
    ?template=blog-card
    &title=Understanding+React+State
    &author=John+Doe
    &readTime=5m"
/>`}</TabCodeBlock>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-white">What happens at share time</h3>
                <ol className="flex flex-col gap-2 text-sm text-slate-400 list-decimal list-inside leading-relaxed">
                    <li>A reader pastes your article URL into Discord or Twitter.</li>
                    <li>The platform&apos;s crawler scrapes your HTML and extracts the <code className="text-indigo-300 font-mono">og:image</code> URL.</li>
                    <li>The crawler makes a GET request to your Edge-OG API endpoint.</li>
                    <li>Edge-OG checks Vercel CDN → Upstash Redis → renders fresh if both miss.</li>
                    <li>A branded PNG is returned and displayed as the link preview card.</li>
                </ol>
            </div>

            <TabCallout title="Why this beats static images">
                A blogging platform with 500 posts would require 500 individually designed
                PNGs. With Edge-OG, one JSX template serves all of them. Publish a new
                post and its social card exists automatically, no designer intervention,
                no repository bloat.
            </TabCallout>
        </div>
    );
}

function ECommerceTab(): React.ReactElement {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-white">
                    Headless E-Commerce Dashboards
                </h2>
                <p className="text-slate-400 leading-relaxed">
                    Storefronts require highly convertible social links. Pass dynamic product
                    state, name, price, availability, to the API as query parameters. When
                    the price changes in your database, update the URL parameters. The next
                    share generates a fresh image reflecting the new state, bypassing any
                    stale cached version.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Meta tag in your product page&apos;s{' '}
                    <code className="normal-case font-mono text-indigo-300">&lt;head&gt;</code>
                </h3>
                <TabCodeBlock>{`<meta
  property="og:image"
  content="https://your-edge-og.vercel.app/api/og
    ?template=blog-card
    &title=Mechanical+Keyboard
    &author=\${product.price}
    &tag=In+Stock"
/>`}</TabCodeBlock>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-white">Cache invalidation by URL design</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                    The cache key is a SHA-256 hash of the full query string. Changing any
                    parameter, price, stock status, discount label, produces a different
                    cache key. The old image expires naturally via the 48-hour TTL. The new
                    URL generates a fresh card on first request. No manual cache purge needed.
                </p>
            </div>

            <TabCallout title="Why this matters for conversions">
                A product card that shows the real price and live stock status performs
                better than a generic brand banner. The link preview becomes a micro
                advertisement, dynamically generated, always accurate, zero ongoing effort.
            </TabCallout>
        </div>
    );
}

function MonitoringTab(): React.ReactElement {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-white">
                    Webhook &amp; API Monitoring Tools
                </h2>
                <p className="text-slate-400 leading-relaxed">
                    When developers share debugging sessions, network payloads, or incident
                    summaries via Slack or Discord, those messages become meaningless text
                    walls. Edge-OG can render a structured visual summary of any payload as a
                    shareable image, turning a raw JSON blob into a readable, on-brand card
                    that communicates immediately.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Example: incident summary card
                </h3>
                <TabCodeBlock>{`<meta
  property="og:image"
  content="https://your-edge-og.vercel.app/api/og
    ?template=blog-card
    &title=POST+%2Fapi%2Fpayments+returned+503
    &author=Incident+%23448
    &tag=Critical"
/>`}</TabCodeBlock>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-white">The developer workflow</h3>
                <ol className="flex flex-col gap-2 text-sm text-slate-400 list-decimal list-inside leading-relaxed">
                    <li>An automated alert fires for a failed webhook or degraded endpoint.</li>
                    <li>Your monitoring tool builds an Edge-OG URL encoding the incident summary as query params.</li>
                    <li>The Slack or Discord notification includes that URL as an <code className="text-indigo-300 font-mono">og:image</code>.</li>
                    <li>On-call engineers see a structured visual card, endpoint, status code, severity, without opening a dashboard.</li>
                </ol>
            </div>

            <TabCallout title="Extending with custom templates">
                This scenario benefits most from a purpose-built template. Register a
                new template in <code className="font-mono text-indigo-300">src/lib/templates/registry.ts</code> with
                fields like <code className="font-mono text-indigo-300">endpoint</code>,{' '}
                <code className="font-mono text-indigo-300">statusCode</code>, and{' '}
                <code className="font-mono text-indigo-300">severity</code>. Your JSX
                template can apply colour coding, red for 5xx, yellow for 4xx, and
                render structured data cleanly without any additional infrastructure.
            </TabCallout>
        </div>
    );
}

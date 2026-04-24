'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Site-wide navigation bar.
 *
 * The logo links back to home on every page except home itself, where it
 * renders as plain text to avoid a self-referencing link. Nav items for the
 * current page are hidden, there is no value in linking to the page you are
 * already on.
 */
export default function Navbar(): React.ReactElement {
    const pathname = usePathname();

    const isHome = pathname === '/';
    const isPlayground = pathname === '/playground';
    const isUseCases = pathname === '/use-cases';
    const isInspector = pathname === '/og-inspector';

    return (
        <nav className="border-b border-slate-800 px-6 py-4">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                {isHome ? (
                    <span className="font-bold text-lg tracking-tight">Edge-OG</span>
                ) : (
                    <Link href="/" className="font-bold text-lg tracking-tight hover:text-indigo-300 transition-colors">
                        Edge-OG
                    </Link>
                )}

                <div className="flex items-center gap-3">
                    {!isUseCases && (
                        <Link
                            href="/use-cases"
                            className="text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                        >
                            Use Cases
                        </Link>
                    )}
                    {!isInspector && (
                        <Link
                            href="/og-inspector"
                            className="text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                        >
                            OG Inspector
                        </Link>
                    )}
                    {!isPlayground && (
                        <Link
                            href="/playground"
                            className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-md"
                        >
                            Open Playground →
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

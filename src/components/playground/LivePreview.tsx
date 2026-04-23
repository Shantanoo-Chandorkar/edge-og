'use client';

import React, { useEffect, useState, useRef } from 'react';

interface LivePreviewProps {
    apiUrl: string;
    onMetrics: (metrics: {
        renderTimeMs: string;
        wasmCompileTimeMs: string;
        cacheStatus: 'HIT' | 'MISS';
    }) => void;
    onLogEntry: (entry: { url: string; status: number; cacheStatus: string; timeMs: number }) => void;
}

/**
 * Displays a live preview of the generated OG card image.
 * Debounces URL changes by 800ms to avoid hammering the API while typing.
 * After the image loads, performs a HEAD request to retrieve response headers
 * (image load events don't expose headers), then notifies parent with metrics.
 *
 * @param apiUrl - The full API URL to preview
 * @param onMetrics - Callback with render time and cache status from response headers
 * @param onLogEntry - Callback to add an entry to the request log
 */
export function LivePreview({
    apiUrl,
    onMetrics,
    onLogEntry,
}: LivePreviewProps): React.ReactElement {
    const [displayedUrl, setDisplayedUrl] = useState(apiUrl);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setLoading(true);
            setError(false);
            setDisplayedUrl(apiUrl);
        }, 800);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [apiUrl]);

    const handleLoad = async () => {
        setLoading(false);
        const start = Date.now();
        try {
            const res = await fetch(displayedUrl, { method: 'HEAD' });
            const timeMs = Date.now() - start;
            const cacheStatus = (res.headers.get('X-Cache') || 'MISS') as 'HIT' | 'MISS';
            const renderTimeMs = res.headers.get('X-Render-Time') || '--';
            const wasmCompileTimeMs = res.headers.get('X-Wasm-Compile-Time') || '--';

            onMetrics({ renderTimeMs, wasmCompileTimeMs, cacheStatus });
            onLogEntry({ url: displayedUrl, status: res.status, cacheStatus, timeMs });
        } catch {
            // Non-fatal: metrics just won't update
        }
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Preview
            </label>
            <div
                className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"
                style={{ aspectRatio: '1200/630' }}
            >
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-red-400 text-sm">Failed to load preview</p>
                    </div>
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={displayedUrl}
                        alt="OG card preview"
                        className="w-full h-full object-contain"
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                )}
            </div>
        </div>
    );
}

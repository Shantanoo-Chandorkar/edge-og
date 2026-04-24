'use client';

import React, { useEffect, useState, useRef } from 'react';

interface LivePreviewProps {
    apiUrl: string;
    onRenderTime: (ms: string) => void;
}

/**
 * Displays a live preview of the generated OG card image.
 * Debounces URL changes by 150ms to avoid hammering the API while typing.
 * After the image loads, performs a HEAD request to read the X-Render-Time
 * response header (image load events don't expose headers) and reports it
 * to the parent via onRenderTime.
 *
 * @param apiUrl - The full API URL to preview
 * @param onRenderTime - Callback with the server-side generation time string
 */
export function LivePreview({
    apiUrl,
    onRenderTime,
}: LivePreviewProps): React.ReactElement {
    // Start empty so the first effect always triggers a real URL change.
    // If initialized to apiUrl, the effect fires 150ms later with the same
    // string — React bails out, <img> src never changes, onLoad never fires,
    // and the spinner gets stuck on first mount.
    const [displayedUrl, setDisplayedUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setLoading(true);
            setError(false);
            setDisplayedUrl(apiUrl);
        }, 350);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [apiUrl]);

    const handleLoad = async () => {
        setLoading(false);
        try {
            const res = await fetch(displayedUrl, { method: 'HEAD' });
            const renderTime = res.headers.get('X-Render-Time');
            if (renderTime) onRenderTime(renderTime);
        } catch {
            // Non-fatal: render time just won't update
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
                ) : displayedUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={displayedUrl}
                        alt="OG card preview"
                        className="w-full h-full object-contain"
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                ) : null}
            </div>
        </div>
    );
}

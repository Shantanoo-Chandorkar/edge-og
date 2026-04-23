'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface PerformanceMetricsProps {
    renderTimeMs: string | null;
    wasmCompileTimeMs: string | null;
    cacheStatus: 'HIT' | 'MISS' | null;
}

/**
 * Displays render timing and cache status from the last completed preview load.
 * Shows '--' placeholders until the first render completes.
 *
 * @param renderTimeMs - Satori + resvg render duration from X-Render-Time header
 * @param wasmCompileTimeMs - WASM cold-start duration from X-Wasm-Compile-Time header
 * @param cacheStatus - Cache result from X-Cache header
 */
export function PerformanceMetrics({
    renderTimeMs,
    wasmCompileTimeMs,
    cacheStatus,
}: PerformanceMetricsProps): React.ReactElement {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Last Render
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-md p-3 flex gap-6 text-sm flex-wrap">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500">Cache</span>
                    {cacheStatus ? (
                        <Badge variant={cacheStatus === 'HIT' ? 'hit' : 'miss'}>
                            {cacheStatus}
                        </Badge>
                    ) : (
                        <span className="text-slate-600 font-mono text-xs">--</span>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500">Render</span>
                    <span className="text-slate-300 font-mono text-xs">
                        {renderTimeMs ?? '--'}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500">WASM init</span>
                    <span className="text-slate-300 font-mono text-xs">
                        {wasmCompileTimeMs ?? '--'}
                    </span>
                </div>
            </div>
        </div>
    );
}

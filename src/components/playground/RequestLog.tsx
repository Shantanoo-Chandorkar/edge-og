'use client';

import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/Badge';

export interface LogEntry {
    id: string;
    timestamp: string;
    url: string;
    status: number;
    cacheStatus: string;
    timeMs: number;
}

interface RequestLogProps {
    entries: LogEntry[];
}

/**
 * Scrollable feed of API request log entries with HIT/MISS color coding.
 * Auto-scrolls to the latest entry. Displays up to 50 entries.
 *
 * @param entries - Log entries to display, newest last
 */
export function RequestLog({ entries }: RequestLogProps): React.ReactElement {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [entries]);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Request Log
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-md h-40 overflow-y-auto p-2 font-mono text-xs">
                {entries.length === 0 ? (
                    <p className="text-slate-600 p-2">No requests yet. Generate a preview to see logs.</p>
                ) : (
                    entries.map((entry) => (
                        <div
                            key={entry.id}
                            className={`flex items-center gap-2 py-1 px-1 rounded ${
                                entry.cacheStatus === 'HIT'
                                    ? 'text-emerald-400'
                                    : 'text-amber-400'
                            }`}
                        >
                            <span className="text-slate-600 shrink-0">{entry.timestamp}</span>
                            <Badge
                                variant={entry.cacheStatus === 'HIT' ? 'hit' : 'miss'}
                            >
                                {entry.cacheStatus}
                            </Badge>
                            <span className="text-slate-500">{entry.status}</span>
                            <span className="text-slate-600 shrink-0">{entry.timeMs}ms</span>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

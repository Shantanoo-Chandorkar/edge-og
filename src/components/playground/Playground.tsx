'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { SerializableTemplate } from '@/lib/templates/types';
import { TemplateSelector } from './TemplateSelector';
import { ParamEditor } from './ParamEditor';
import { ApiUrlBuilder } from './ApiUrlBuilder';
import { LivePreview } from './LivePreview';

interface PlaygroundProps {
    templates: SerializableTemplate[];
    baseUrl: string;
}

/**
 * Root playground orchestrator. Owns all shared state and derives the live API URL.
 * Passes state slices and callbacks down to child components.
 *
 * @param templates - All registered template definitions from the server
 * @param baseUrl - The app base URL used to construct the API endpoint
 */
export function Playground({ templates, baseUrl }: PlaygroundProps): React.ReactElement {
    const [selectedSlug, setSelectedSlug] = useState(templates[0]?.slug ?? '');
    const [params, setParams] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        templates[0]?.fields.forEach((f) => {
            if (f.defaultValue) initial[f.key] = f.defaultValue;
        });
        return initial;
    });
    const [lastRenderTime, setLastRenderTime] = useState<string | null>(null);

    const selectedTemplate = useMemo(
        () => templates.find((t) => t.slug === selectedSlug) ?? templates[0],
        [templates, selectedSlug]
    );

    const apiUrl = useMemo(() => {
        const url = new URL('/api/og', baseUrl);
        url.searchParams.set('template', selectedSlug);
        Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
        });
        return url.toString();
    }, [baseUrl, selectedSlug, params]);

    const handleTemplateChange = useCallback(
        (slug: string) => {
            setSelectedSlug(slug);
            const newTemplate = templates.find((t) => t.slug === slug);
            if (!newTemplate) return;
            const defaultParams: Record<string, string> = {};
            newTemplate.fields.forEach((f) => {
                if (f.defaultValue) defaultParams[f.key] = f.defaultValue;
            });
            setParams(defaultParams);
            setLastRenderTime(null);
        },
        [templates]
    );

    const handleParamChange = useCallback((key: string, value: string) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="max-w-screen-xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">OG Card Playground</h1>
                    <p className="text-slate-400 mt-1 text-sm">
                        Build and preview dynamic Open Graph images in real time.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                    {/* Left panel: controls */}
                    <div className="flex flex-col gap-6">
                        <TemplateSelector
                            templates={templates}
                            selectedSlug={selectedSlug}
                            onChange={handleTemplateChange}
                        />
                        <div className="border-t border-slate-800" />
                        <ParamEditor
                            template={selectedTemplate}
                            params={params}
                            onChange={handleParamChange}
                        />
                    </div>

                    {/* Right panel: preview + generation time */}
                    <div className="flex flex-col gap-4">
                        <ApiUrlBuilder url={apiUrl} />
                        <LivePreview
                            apiUrl={apiUrl}
                            onRenderTime={setLastRenderTime}
                        />
                        {lastRenderTime && (
                            <p className="text-sm text-slate-400">
                                Image generated in{' '}
                                <span className="text-white font-medium">{lastRenderTime}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

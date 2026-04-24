'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PANEL_LABEL_CLASS } from './playgroundStyles';

interface ApiUrlBuilderProps {
    url: string;
}

/**
 * Displays the live-computed API URL and provides a one-click copy button.
 * Resets the "Copied!" indicator automatically after 2 seconds.
 *
 * @param url - The full computed API URL to display and copy
 */
export function ApiUrlBuilder({ url }: ApiUrlBuilderProps): React.ReactElement {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className={PANEL_LABEL_CLASS}>
                API URL
            </label>
            <div className="flex gap-2 items-start">
                <code className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-indigo-300 break-all font-mono leading-relaxed">
                    {url}
                </code>
                <Button variant="secondary" onClick={handleCopy} className="shrink-0">
                    {copied ? '✓ Copied' : 'Copy'}
                </Button>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { SerializableTemplate } from '@/lib/templates/types';
import { PANEL_LABEL_CLASS } from './playgroundStyles';

interface TemplateSelectorProps {
    templates: SerializableTemplate[];
    selectedSlug: string;
    onChange: (slug: string) => void;
}

/**
 * Dropdown for switching between registered OG card templates.
 * On change, notifies parent to reset params to new template defaults.
 *
 * @param templates - All registered template definitions
 * @param selectedSlug - Currently selected template slug
 * @param onChange - Callback invoked with the new slug when selection changes
 */
export function TemplateSelector({
    templates,
    selectedSlug,
    onChange,
}: TemplateSelectorProps): React.ReactElement {
    return (
        <div className="flex flex-col gap-1">
            <label className={PANEL_LABEL_CLASS}>
                Template
            </label>
            <select
                value={selectedSlug}
                onChange={(e) => onChange(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
                {templates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                        {t.displayName}
                    </option>
                ))}
            </select>
        </div>
    );
}

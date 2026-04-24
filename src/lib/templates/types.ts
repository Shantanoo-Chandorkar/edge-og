import React from 'react';

// Describes one visual element within a template
export interface TemplateField {
    key: string;
    label: string;
    type: 'text' | 'url' | 'number' | 'color' | 'select';
    options?: string[];
    defaultValue?: string;
    required: boolean;
    description: string;
}

// A complete template definition
export interface TemplateDefinition {
    slug: string;
    displayName: string;
    description: string;
    fields: TemplateField[];
    render: (props: Record<string, string>) => React.ReactElement;
}

/**
 * Serialisable subset of TemplateDefinition safe to pass across the Next.js
 * server/client boundary. The `render` function is intentionally excluded
 * because functions cannot be serialised by the React server component layer.
 */
export type SerializableTemplate = Omit<TemplateDefinition, 'render'>;

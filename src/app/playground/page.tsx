import React from 'react';
import { listTemplates } from '@/lib/templates/registry';
import { Playground } from '@/components/playground/Playground';

/**
 * Playground page, server component that fetches the template list
 * and passes it to the interactive client playground.
 *
 * The `render` function on each TemplateDefinition is stripped here because
 * functions cannot cross the Next.js server/client serialisation boundary.
 * The client side never calls render directly, it hits /api/og instead.
 */
export default function PlaygroundPage(): React.ReactElement {
    const templates = listTemplates().map(({ render: _render, ...rest }) => rest);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return <Playground templates={templates} baseUrl={baseUrl} />;
}

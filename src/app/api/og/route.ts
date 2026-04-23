import { NextRequest } from 'next/server';
import { getTemplate } from '@/lib/templates/registry';
import { buildCacheKey } from '@/lib/og/hash';
import { getCachedImage, setCachedImage } from '@/lib/og/cache';
import { renderTemplate } from '@/lib/og/renderer';
import { OgQueryParams } from '@/types/og';

export const runtime = 'edge';

/**
 * GET /api/og
 * Generates or retrieves a cached OG social card image.
 *
 * Query params:
 *   - template (required): slug of the template to use
 *   - [field keys]: template-specific field values
 *
 * Response headers:
 *   - Content-Type: image/png
 *   - Cache-Control: public CDN caching directives
 *   - X-Cache: HIT or MISS
 *   - X-Render-Time: render duration in ms (MISS only)
 *   - X-Wasm-Compile-Time: WASM init duration in ms (MISS only)
 */
export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url);

    // Parse all query params into a plain object
    const params: OgQueryParams = { template: '' };
    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    // Validate: template param must be present
    const templateSlug = params.template;
    if (!templateSlug) {
        return Response.json(
            { error: 'template param is required' },
            { status: 400 }
        );
    }

    // Validate: template must be registered
    const template = getTemplate(templateSlug);
    if (!template) {
        return Response.json(
            { error: `unknown template: ${templateSlug}` },
            { status: 400 }
        );
    }

    // Build cache key from sorted params
    const cacheKey = await buildCacheKey(params);

    // Check cache first
    try {
        const cached = await getCachedImage(cacheKey);
        if (cached) {
            return new Response(cached.buffer as ArrayBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
                    'X-Cache': 'HIT',
                },
            });
        }
    } catch {
        // Cache read failure is non-fatal — fall through to generation
    }

    // Validate required fields before rendering
    for (const field of template.fields) {
        if (field.required && !params[field.key]) {
            return Response.json(
                { error: `missing required field: ${field.key}` },
                { status: 400 }
            );
        }
    }

    // Build resolved props: use param value if present, otherwise field default
    const resolvedProps: Record<string, string> = {};
    for (const field of template.fields) {
        const value = params[field.key] || field.defaultValue;
        if (value !== undefined) {
            resolvedProps[field.key] = value;
        }
    }

    // Render the template
    let png: Uint8Array;
    let renderTimeMs: number;
    let wasmCompileTimeMs: number;

    try {
        ({ png, renderTimeMs, wasmCompileTimeMs } = await renderTemplate(template, resolvedProps));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('OG render failed:', error);
        return Response.json(
            {
                error: 'render failed',
                // Surface the real error in development so it is debuggable
                ...(process.env.NODE_ENV === 'development' && { detail: message }),
            },
            { status: 500 }
        );
    }

    // Populate cache asynchronously — do not block the response
    setCachedImage(cacheKey, png).catch((error) => {
        console.error('Cache write failed (non-fatal):', error);
    });

    return new Response(png.buffer as ArrayBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
            'X-Cache': 'MISS',
            'X-Render-Time': `${renderTimeMs}ms`,
            'X-Wasm-Compile-Time': `${wasmCompileTimeMs}ms`,
        },
    });
}

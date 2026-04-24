import { NextRequest } from 'next/server';

// Common HTML entities that appear in attribute values.
const HTML_ENTITIES: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
};

/**
 * Decodes common HTML entities in a string.
 * Handles both named entities and decimal/hex numeric character references.
 *
 * @param value - Raw attribute value potentially containing HTML entities
 * @returns Decoded string
 */
function decodeHtmlEntities(value: string): string {
    return value
        .replace(/&(?:#(\d+)|#x([\da-fA-F]+)|(\w+));/g, (match, decimal, hex, named) => {
            if (named) return HTML_ENTITIES[`&${named};`] ?? match;
            if (decimal) return String.fromCharCode(parseInt(decimal, 10));
            if (hex) return String.fromCharCode(parseInt(hex, 16));
            return match;
        });
}

// Private IPv4 ranges that must not be fetched (SSRF mitigation).
// Covers loopback, link-local, RFC-1918, and CGNAT.
const PRIVATE_IP_PATTERNS = [
    /^127\./,
    /^10\./,
    /^169\.254\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^100\.(6[4-9]|[7-9]\d|1([01]\d|2[0-7]))\./,
];

/**
 * Returns true if the hostname is a raw IPv4 address in a private range.
 * Does not resolve hostnames, DNS-rebinding is documented as out of scope.
 */
function isPrivateIpv4(hostname: string): boolean {
    return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname));
}

/**
 * Returns true if the hostname is 'localhost' or any variant of it.
 */
function isLocalhost(hostname: string): boolean {
    return hostname === 'localhost' || hostname === '::1';
}

/**
 * Extracts og:* and twitter:* meta tag key/value pairs from an HTML string.
 * Scans only the <head> block when present; falls back to the first 100 KB.
 *
 * @param html - Raw HTML response body
 * @returns Record mapping property/name attributes to content values
 */
function extractMetaTags(html: string): Record<string, string> {
    // Limit scan to the first 100 KB to avoid processing huge bodies
    const scanTarget = html.slice(0, 100_000);

    // Prefer the <head> block for accuracy
    const headMatch = scanTarget.match(/<head[\s\S]*?<\/head>/i);
    const source = headMatch ? headMatch[0] : scanTarget;

    const tags: Record<string, string> = {};

    // Match every <meta ... > tag (self-closing or not)
    const metaTagPattern = /<meta\s([^>]+?)(?:\s*\/?>)/gi;
    let metaMatch: RegExpExecArray | null;

    while ((metaMatch = metaTagPattern.exec(source)) !== null) {
        const attrs = metaMatch[1];

        // Extract property or name attribute (handles both orderings)
        const propertyMatch = attrs.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i);
        const contentMatch = attrs.match(/content\s*=\s*["']([^"']*?)["']/i);

        if (!propertyMatch || !contentMatch) continue;

        const key = propertyMatch[1].toLowerCase();
        if (key.startsWith('og:') || key.startsWith('twitter:')) {
            tags[key] = decodeHtmlEntities(contentMatch[1]);
        }
    }

    return tags;
}

/**
 * GET /api/og-inspect?url=https://...
 *
 * Fetches the raw HTML at the given URL as a crawler would, extracts all
 * og:* and twitter:* meta tags, and returns them as JSON.
 *
 * @param request - Incoming Next.js request
 * @returns JSON with { url, tags, fetchTimeMs } on success, or an error body
 *
 * Status codes:
 *   200, success (tags may be empty if none found)
 *   400, missing or non-http/https URL
 *   408, upstream timed out (> 8 s)
 *   422, SSRF blocked (private/localhost address)
 *   502, upstream unreachable (DNS failure, refused connection, non-2xx)
 */
export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get('url');

    // Validate presence
    if (!rawUrl) {
        return Response.json(
            { error: 'MISSING_URL', message: 'url query param is required' },
            { status: 400 }
        );
    }

    // Validate scheme
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(rawUrl);
    } catch {
        return Response.json(
            { error: 'INVALID_URL', message: 'Enter a valid http or https URL' },
            { status: 400 }
        );
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return Response.json(
            { error: 'INVALID_URL', message: 'Enter a valid http or https URL' },
            { status: 400 }
        );
    }

    // SSRF mitigation: block private IPs and localhost
    const hostname = parsedUrl.hostname;
    if (isLocalhost(hostname) || isPrivateIpv4(hostname)) {
        return Response.json(
            { error: 'SSRF_BLOCKED', message: 'Private and localhost URLs cannot be inspected' },
            { status: 422 }
        );
    }

    // Fetch with an 8-second timeout (Vercel Hobby function limit is 10s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);

    const fetchStart = Date.now();
    let html: string;

    try {
        const response = await fetch(rawUrl, {
            signal: controller.signal,
            headers: {
                // Mimics Facebook's crawler, most sites whitelist this UA
                'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
                'Accept': 'text/html,application/xhtml+xml',
            },
        });

        if (!response.ok) {
            return Response.json(
                { error: 'UPSTREAM_ERROR', message: `Page returned HTTP ${response.status}` },
                { status: 502 }
            );
        }

        html = await response.text();
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return Response.json(
                { error: 'TIMEOUT', message: 'The page took too long to respond (>8s)' },
                { status: 408 }
            );
        }
        return Response.json(
            { error: 'FETCH_FAILED', message: 'Could not reach the page (DNS error or connection refused)' },
            { status: 502 }
        );
    } finally {
        clearTimeout(timeoutId);
    }

    const fetchTimeMs = Date.now() - fetchStart;
    const tags = extractMetaTags(html);

    return Response.json({ url: rawUrl, tags, fetchTimeMs });
}

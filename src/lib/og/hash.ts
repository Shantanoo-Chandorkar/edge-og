import { OgQueryParams } from '@/types/og';

/**
 * Generates a deterministic, collision-resistant cache key from OG query params.
 * Sorts params alphabetically so ?a=1&b=2 and ?b=2&a=1 produce the same key.
 * Uses Web Crypto API (edge-safe, no Node crypto module).
 *
 * @param params - The OG query params to hash
 * @returns A cache key string in format "og:v1:{sha256hex}"
 */
export async function buildCacheKey(params: OgQueryParams): Promise<string> {
    const sorted = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&');

    const encoder = new TextEncoder();
    const data = encoder.encode(sorted);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return `og:v1:${hashHex}`;
}

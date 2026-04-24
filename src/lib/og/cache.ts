import { redis } from '@/lib/redis';

/**
 * Returns the cached PNG buffer if present, null on miss.
 *
 * @param key - The cache key to look up
 * @returns The PNG buffer or null if not cached
 */
export async function getCachedImage(key: string): Promise<Uint8Array | null> {
    try {
        const cached = await redis.get<string>(key);
        if (!cached) return null;
        const buffer = Buffer.from(cached, 'base64');
        return new Uint8Array(buffer);
    } catch {
        // Cache failure is non-fatal, fall through to generation
        return null;
    }
}

/**
 * Writes PNG buffer to Redis with a 48-hour TTL.
 * Always uses TTL to prevent unbounded cache growth.
 *
 * @param key - The cache key to write to
 * @param png - The PNG buffer to cache
 */
export async function setCachedImage(key: string, png: Uint8Array): Promise<void> {
    const base64 = Buffer.from(png).toString('base64');
    // 48 hours TTL, never omit to prevent cache from growing unbounded
    await redis.set(key, base64, { ex: 172800 });
}

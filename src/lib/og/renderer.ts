import satori, { SatoriOptions } from 'satori';
import { TemplateDefinition } from '@/lib/templates/types';

// Module-level singletons — initialized once per edge worker lifetime
let fontsCache: SatoriOptions['fonts'] | null = null;
let resvgInitialized = false;
let wasmCompileTimeOnce = 0;

/**
 * Fetches Inter-Regular and Inter-Bold fonts from the public directory.
 * Memoized — subsequent calls return the cached ArrayBuffers.
 *
 * @returns Satori-compatible font definitions
 */
async function loadFonts(): Promise<SatoriOptions['fonts']> {
    if (fontsCache) return fontsCache;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const [regularRes, boldRes] = await Promise.all([
        fetch(new URL('/fonts/Inter-Regular.woff', baseUrl).toString()),
        fetch(new URL('/fonts/Inter-Bold.woff', baseUrl).toString()),
    ]);

    if (!regularRes.ok || !boldRes.ok) {
        throw new Error('Failed to load Inter fonts from public directory');
    }

    const [regular, bold] = await Promise.all([
        regularRes.arrayBuffer(),
        boldRes.arrayBuffer(),
    ]);

    fontsCache = [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' },
    ];

    return fontsCache;
}

/**
 * Initializes the resvg-wasm module exactly once per edge worker lifetime.
 * Guards against re-initialization with a module-level flag.
 * Measures compile time only on the first call.
 *
 * The WASM binary is served from /public/resvg.wasm so that it is reachable
 * via a plain HTTP fetch — the only approach that works reliably in the Next.js
 * Edge Runtime, where filesystem access and webpack WASM plugins are unavailable.
 */
async function ensureWasmReady(): Promise<number> {
    if (resvgInitialized) return 0;

    const start = Date.now();
    const { initWasm } = await import('@resvg/resvg-wasm');

    // Fetch the WASM binary from the public directory.
    // The binary is copied there at build time from node_modules so that
    // the Edge Runtime can reach it via fetch without filesystem access.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const wasmRes = await fetch(new URL('/resvg.wasm', baseUrl).toString());

    if (!wasmRes.ok) {
        throw new Error(
            `Failed to fetch /resvg.wasm — HTTP ${wasmRes.status}. ` +
            'Ensure public/resvg.wasm exists (copy from node_modules/@resvg/resvg-wasm/index_bg.wasm).'
        );
    }

    // Compile the WASM binary from an ArrayBuffer rather than passing the Response
    // directly. The Edge Runtime's Response class is a different realm from the one
    // @resvg/resvg-wasm was compiled against, causing an instanceof check to fail.
    const wasmBuffer = await wasmRes.arrayBuffer();
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    await initWasm(wasmModule);

    resvgInitialized = true;
    wasmCompileTimeOnce = Date.now() - start;
    return wasmCompileTimeOnce;
}

/**
 * Renders a template to PNG using the Satori + resvg-wasm pipeline.
 * Handles WASM initialization, font loading, SVG generation, and PNG conversion.
 *
 * @param template - The template definition to render
 * @param props - Resolved props to pass to the template's render function
 * @returns PNG buffer with timing metrics
 */
export async function renderTemplate(
    template: TemplateDefinition,
    props: Record<string, string>
): Promise<{ png: Uint8Array; renderTimeMs: number; wasmCompileTimeMs: number }> {
    const renderStart = Date.now();

    const wasmCompileTimeMs = await ensureWasmReady();
    const fonts = await loadFonts();

    const element = template.render(props);

    const svg = await satori(element, {
        width: 1200,
        height: 630,
        fonts,
    });

    const { Resvg } = await import('@resvg/resvg-wasm');
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const png = pngData.asPng();

    const renderTimeMs = Date.now() - renderStart;

    return { png, renderTimeMs, wasmCompileTimeMs };
}

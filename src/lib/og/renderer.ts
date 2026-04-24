import fs from 'fs';
import path from 'path';
import satori, { SatoriOptions } from 'satori';
import { TemplateDefinition } from '@/lib/templates/types';

// Module-level singletons — initialized once per Node.js worker lifetime.
// In production this means once per serverless function instance; the module
// cache keeps these alive across requests within the same instance.
let fontsCache: SatoriOptions['fonts'] | null = null;
let resvgInitialized = false;

/**
 * Loads Inter-Regular and Inter-Bold from the public/fonts directory using
 * the Node.js filesystem. Memoized — subsequent calls return the cached buffers.
 *
 * @returns Satori-compatible font definitions
 */
async function loadFonts(): Promise<SatoriOptions['fonts']> {
    if (fontsCache) return fontsCache;

    const fontsDir = path.join(process.cwd(), 'public', 'fonts');
    const [regular, bold, interLatinExt, notoSymbols] = await Promise.all([
        fs.promises.readFile(path.join(fontsDir, 'Inter-Regular.woff')),
        fs.promises.readFile(path.join(fontsDir, 'Inter-Bold.woff')),
        // Extended Latin subset — covers currency symbols (₹, etc.) not in the
        // base latin woff. Loaded as a fallback under the same 'Inter' family.
        fs.promises.readFile(path.join(fontsDir, 'Inter-LatinExt.woff')),
        // Noto Sans Symbols — covers common arrows (→), enclosed alphanumerics,
        // and other symbols outside all Inter subsets.
        fs.promises.readFile(path.join(fontsDir, 'NotoSansSymbols.woff')),
    ]);

    fontsCache = [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' },
        { name: 'Inter', data: interLatinExt, weight: 400, style: 'normal' },
        { name: 'Inter', data: interLatinExt, weight: 700, style: 'normal' },
        // Named 'Inter' so Satori reaches it when fontFamily: 'Inter' is set
        // and the glyph is absent from all Inter subsets above.
        { name: 'Inter', data: notoSymbols, weight: 400, style: 'normal' },
    ];

    return fontsCache;
}

/**
 * Initializes the resvg-wasm module exactly once per Node.js worker lifetime.
 * Reads the WASM binary directly from node_modules via the filesystem —
 * faster and more reliable than fetching it over HTTP.
 * Returns the compile duration in ms on the first call, 0 on subsequent calls.
 */
async function ensureWasmReady(): Promise<number> {
    if (resvgInitialized) return 0;

    const start = Date.now();
    const { initWasm } = await import('@resvg/resvg-wasm');

    const wasmPath = path.join(
        process.cwd(),
        'node_modules',
        '@resvg',
        'resvg-wasm',
        'index_bg.wasm'
    );
    const wasmBuffer = fs.readFileSync(wasmPath);

    try {
        await initWasm(wasmBuffer);
    } catch (error) {
        // In dev, Next.js HMR resets the module-level flag while the WASM
        // binary remains initialized in the underlying runtime. Treat
        // "Already initialized" as success — the module is ready to use.
        // Any other error is a genuine init failure and must propagate.
        if (!(error instanceof Error) || !error.message.includes('Already initialized')) {
            throw error;
        }
    }

    resvgInitialized = true;
    return Date.now() - start;
}

/**
 * Renders a template to PNG using the Satori + resvg-wasm pipeline.
 * WASM and fonts are initialized once and reused across requests.
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

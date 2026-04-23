// Query params accepted by /api/og
export interface OgQueryParams {
    template: string;
    [key: string]: string;
}

// What the renderer returns
export interface RenderResult {
    png: Uint8Array;
    renderTimeMs: number;
    wasmCompileTimeMs: number;
    cacheStatus: 'HIT' | 'MISS';
}

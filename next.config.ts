import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ['@resvg/resvg-wasm'],
    // Turbopack handles WASM natively in Next.js 16+; the empty config key
    // silences the "webpack config present but no turbopack config" build error.
    turbopack: {},
    webpack: (config, { isServer }) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            layers: true,
        };
        return config;
    },
};

export default nextConfig;

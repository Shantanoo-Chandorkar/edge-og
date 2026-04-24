import React from 'react';

/**
 * Site-wide footer with product name and tech stack credits.
 */
export default function Footer(): React.ReactElement {
    return (
        <footer className="border-t border-slate-800 px-6 py-8 mt-12">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center text-sm text-slate-500">
                <span>Edge-OG — Dynamic Social Card Generator</span>
                <span>Built with Next.js, Satori, resvg-wasm</span>
            </div>
        </footer>
    );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Edge-OG — Dynamic Social Card Generator',
    description:
        'Generate dynamic Open Graph social card images at the edge using Satori and resvg-wasm. No headless browser required.',
    openGraph: {
        title: 'Edge-OG — Dynamic Social Card Generator',
        description: 'Generate dynamic OG images at the edge.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`dark ${inter.variable}`}>
            <body className="bg-slate-950 text-white antialiased">{children}</body>
        </html>
    );
}

# Edge OG Social Card Generator

An enterprise-grade, high-performance dynamic image generation engine built with Next.js, Satori, and Resvg-WASM. Designed to run at the edge with sub-second latency and global scalability.

**Author:** Shantanoo Chandorkar

---

## 📖 Project Description

The **Edge OG Social Card Generator** is a specialized microservice (integrated into Next.js) that transforms React components into high-quality PNG images for social media sharing. Unlike traditional solutions that rely on resource-heavy headless browsers, this project leverages a lightweight, WASM-based pipeline to generate images directly on the Vercel Edge Network or Serverless functions.

It features a built-in **Template Registry**, a **Live Playground** for designers, and a **Two-Layer Caching** strategy to ensure that your social cards are delivered instantly to crawlers from Twitter, LinkedIn, and Facebook.

---

## 🎯 Project Purpose

### The Issue
Social engagement depends heavily on rich Open Graph (OG) images. However, creating these images at scale presents significant challenges:
- **Static Images:** Hard to maintain and cannot reflect dynamic content (e.g., changing prices, blog titles, or user profiles).
- **Headless Browsers (Puppeteer/Playwright):** Slow (2s+ startup), memory-intensive (500MB+), expensive to scale, and often unsupported in Edge environments.
- **Third-Party Services:** Introduce external dependencies, latency, and recurring costs.

### The Solution
This project solves the "Dynamic OG" problem by using an **Edge-native rendering pipeline**:
1.  **Satori:** Converts React/JSX into SVG by interpreting a subset of CSS.
2.  **Resvg-WASM:** A high-performance Rust-based SVG renderer compiled to WASM for lightning-fast PNG conversion.
3.  **Global Distribution:** Runs on Vercel Edge, placing the generation logic as close to the user/crawler as possible.

### Pros
- 🚀 **Extreme Performance:** Renders images in 100-300ms, compared to seconds with headless browsers.
- 🎨 **Unified DX:** Use the same React components and Tailwind CSS you use for your web app to build your image templates.
- 📦 **Zero-Infra Scaling:** No need to manage a fleet of browser instances; the infrastructure is handled by the Edge runtime.
- 🛡️ **Reliable Delivery:** Tiered caching ensures images are served from the CDN whenever possible.

---

## 🏗️ Architecture & How It Works

The engine operates on a multi-stage pipeline:

1.  **Template Selection:** The `/api/og` route identifies the requested template via query parameters.
2.  **JSX Transformation:** React components are rendered into a Virtual DOM.
3.  **SVG Generation:** Satori calculates the layout and generates a raw SVG string.
4.  **PNG Encoding:** Resvg-WASM converts the SVG into a 1200x630 (OG Standard) PNG buffer.
5.  **Caching:** 
    *   **Layer 1 (CDN):** Standard `Cache-Control` headers for global edge caching.
    *   **Layer 2 (Persistence):** Upstash Redis stores the generated PNG (base64) to survive cold starts and CDN evictions.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20+
- An [Upstash Redis](https://upstash.com/) account (free tier works perfectly)

### 1. Clone the Repository
```bash
git clone https://github.com/shantanoo-c/edge-og-social-card-generator.git
cd edge-og-social-card-generator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000/playground` to start building your cards.

---

## 🔍 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **WASM Init Error** | WASM re-initialization during HMR in development. | The code includes a try/catch to ignore "Already initialized" errors; ignore these in console during dev. |
| **Slow First Render** | Cold start of the Node.js worker + WASM compilation. | This is expected (approx 1-2s). Subsequent renders in the same worker are <200ms. |
| **Missing Glyphs** | Custom characters/symbols not in Inter font. | Check `src/lib/og/renderer.ts` and ensure `NotoSansSymbols` is correctly loaded. |
| **Redis Connection Timeout** | Incorrect Upstash credentials or regional latency. | Ensure your Upstash database is in the same region as your deployment (e.g., us-east-1). |

---

## 🚀 Future Scope

The project is designed for extensibility. Future genuine additions include:

- **Batch Pre-generation CLI:** A build-time tool that crawls your project's routes and pre-warms the Redis cache with OG images for every page, ensuring 0ms latency for the first crawler hit.
- **Dynamic SVG Overlays:** Support for composable "Layers" via query params (e.g., `&overlay=sale-badge` or `&overlay=verified-check`) allowing for complex image composition without new templates.
- **Remote Font Injection:** An API update to allow passing a URL to a `.ttf`/`.woff` font in the query params, enabling true white-labeling and brand-specific typography.
- **Template Usage Analytics:** Integration with Upstash/Redis to track which templates are most used and monitor cache hit rates across different social crawlers.

---

## 💡 Real-World Use Cases

The Edge-OG engine is built to solve complex infrastructure bottlenecks. You can explore interactive demonstrations of these scenarios by navigating to the `/use-cases` route of the application.

- **Technical Blogging (MDX/React):** Automatically generate branded social cards for thousands of posts using a single JSX template. No more manual exports from Figma or Canva.
- **Dynamic E-Commerce:** Create high-conversion link previews that reflect real-time product data, such as live prices, stock availability, and discount badges.
- **Developer Tooling & Monitoring:** Transform dry JSON payloads or incident reports into structured, visual summary cards for Slack and Discord notifications.

Check out the full breakdown and implementation details at [your-app.vercel.app/use-cases](https://your-app.vercel.app/use-cases).

---

## 📄 License
MIT © Shantanoo Chandorkar

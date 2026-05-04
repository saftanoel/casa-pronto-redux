import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Critters from "critters";

// ---------------------------------------------------------------------------
// Vite plugin: inline critical CSS + defer the rest (Google Critters)
// ---------------------------------------------------------------------------
function criticalCssPlugin() {
  return {
    name: "vite-plugin-critical-css",
    apply: "build" as const,
    async generateBundle(_opts: unknown, bundle: Record<string, { type: string; fileName: string; source?: string | Uint8Array }>) {
      const critters = new Critters({
        path: "dist",
        publicPath: "/",
        preload: "swap",           // Preload deferred sheets with font-display: swap
        inlineFonts: false,        // Fonts are loaded separately — don't inline
        pruneSource: false,        // Keep original CSS file for non-critical pages
        reduceInlineStyles: false,
        mergeStylesheets: true,
        additionalStylesheets: [],
      });

      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.type === "asset" && chunk.fileName.endsWith(".html")) {
          const html = chunk.source as string;
          chunk.source = await critters.process(html);
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
    mode === "development" && componentTagger(),
    // Critical CSS inlining is handled by Critters in scripts/generate-ssg.js
    // after Puppeteer writes the final HTML files, so we don't need it here.
  ];

  return {
    server: {
      host: "127.0.0.1",
      port: 8080,
    },
    plugins: plugins.filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: false, // Single CSS file — Critters inlines the critical subset in SSG script
    },
  };
});
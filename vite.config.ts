import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from '@prerenderer/rollup-plugin';
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';

export default defineConfig(({ mode, command }) => {
  const plugins = [
    react(),
    mode === "development" && componentTagger(),
  ];

  if (command === 'build') {
    plugins.push(
      prerender({
        // Splitting the build in order to avoid memory issues with Puppeteer prerendering
        routes: [
          "/apartamente-alba-micesti",
          "/apartamente-ampoi",
          "/apartamente-centru",
          "/apartamente-cetate",
          "/case-alba-micesti"
        ],
        renderer: new PuppeteerRenderer({
          renderAfterTime: 2500,
          maxConcurrentRoutes: 1,
          skipThirdPartyRequests: true,
          headless: true,

          launchOptions: {
            timeout: 0,
            protocolTimeout: 0, 
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--disable-web-security',
              '--blink-settings=imagesEnabled=false',
            ],
          },
        }),
        postProcess(renderedRoute: { route: string; html: string }) {
          renderedRoute.html = renderedRoute.html.replace(
            /<script (.*?)>/g,
            '<script $1 defer>'
          );
        },
      })
    );
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: plugins.filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 2000,
    }
  };
});
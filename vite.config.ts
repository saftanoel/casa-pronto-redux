import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

export default defineConfig(({ mode, command }) => {
  const plugins = [react(), mode === "development" && componentTagger()];

  if (command === "build") {
    plugins.push(
      prerender({
        routes: [
          // 32 rute pt 32 pagini
          "/",
          "/apartamente",
          "/case",
          "/terenuri",
          "/spatii-comerciale",
          "/garsoniere",
          "/hale",
          "/birouri",
          "/vile",
          "/apartamente-cetate",
          "/apartamente-centru",
          "/apartamente-ampoi",
          "/apartamente-alba-micesti",
          "/garsoniere-cetate",
          "/garsoniere-centru",
          "/case-cetate",
          "/case-centru",
          "/case-alba-micesti",
          "/case-micesti",
          "/case-ciugud",
          "/case-barabant",
          "/case-oarda",
          "/case-cugir",
          "/terenuri-cetate",
          "/terenuri-centru",
          "/terenuri-alba-micesti",
          "/terenuri-micesti",
          "/terenuri-ciugud",
          "/terenuri-oarda",
          "/spatii-comerciale-cetate",
          "/spatii-comerciale-centru",
          "/hale-cetate",
          "/hale-centru",
        ],
        renderer: new PuppeteerRenderer({
          // 1. Dăm ignor la evenimentul din main.tsx. Îi dăm doar 2.5 secunde per pagină. Punct.
          renderAfterTime: 2500,

          // 2. O singură pagină pe rând
          maxConcurrentRoutes: 1,
          skipThirdPartyRequests: true,
          headless: true,

          launchOptions: {
            protocolTimeout: 120000,
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
              "--disable-extensions",
              // 3. SETAREA SUPREMĂ: Interzicem încărcarea pozelor! HTML pur. Asta salvează toată memoria.
              "--blink-settings=imagesEnabled=false",
            ],
          },
        }),
        postProcess(renderedRoute: { html: string; route: string }) {
          renderedRoute.html = renderedRoute.html.replace(
            /<script (.*?)>/g,
            "<script $1 defer>"
          );
        },
      })
    );
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
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
    },
  };
});
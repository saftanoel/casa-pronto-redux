import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";
import Renderer from "@prerenderer/renderer-puppeteer";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    
    vitePrerender({
      staticDir: path.join(__dirname, "dist"),
      
      // Exact aceleași rute din App.tsx (32)
      routes: [
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
        "/hale-centru"
      ],
      
      renderer: new Renderer({
        renderAfterDocumentEvent: "prerender-ready",
        renderAfterTime: 10000,
      }),
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


export default defineConfig(({ mode, command }) => {
  const plugins = [
    react(),
    mode === "development" && componentTagger(),
  ];

  if (command === 'build') {
    // We are now using the standalone SSG script instead of the @prerenderer plugin.
    // The build command will just generate the SPA in dist/.
  }

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
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 2000,
    }
  };
});
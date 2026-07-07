import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(rootDir, "src");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: srcDir }],
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        // Measured: LazyMotion + async domMax was tried here and made perf
        // WORSE (Lighthouse 86->82, TBT 40ms->290ms) because Hero animates
        // immediately on load, so the dynamic import added a network
        // round-trip in the critical path. Eager motion chunk measured
        // better — keep it eager, split only for long-term cache hygiene.
        manualChunks: {
          motion: ["framer-motion"],
          router: ["react-router-dom"],
          three: ["three"],
        },
      },
    },
  },
});

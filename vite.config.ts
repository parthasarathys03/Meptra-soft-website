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
    // three (WebGLRenderer) is ~513 kB minified / ~129 kB gzip. It's already
    // optimally isolated: its own async chunk (Globe is React.lazy + mounted on
    // requestIdleCallback, so it's off the critical path) and imported via named
    // symbols so rollup tree-shakes it. The remaining size is inherent to the
    // WebGL renderer core and cannot be split further without dropping the globe.
    // Raise the limit so this unavoidable async chunk stops flagging the build.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Measured: LazyMotion + async domMax was tried here and made perf
        // WORSE (Lighthouse 86->82, TBT 40ms->290ms) because Hero animates
        // immediately on load, so the dynamic import added a network
        // round-trip in the critical path. Eager motion chunk measured
        // better — keep it eager, split only for long-term cache hygiene.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/three/")) return "three";
          if (id.includes("/framer-motion/")) return "motion";
          if (id.includes("/react-router") || id.includes("/@remix-run/"))
            return "router";
          // React runtime — eager, but split into its own long-lived vendor
          // chunk so app-code changes don't bust the cached React bytes.
          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler|react-helmet-async)[\\/]/.test(
              id,
            )
          )
            return "vendor";
        },
      },
    },
  },
});

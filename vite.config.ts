import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Fix for ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conditionally load cartographer plugin
let cartographerPlugin = [];
if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
  try {
    const cartographerModule = require("@replit/vite-plugin-cartographer");
    cartographerPlugin = [cartographerModule.cartographer()];
  } catch (error) {
    console.warn("Cartographer plugin not available:", error);
  }
}

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...cartographerPlugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  css: {
    postcss: path.resolve(__dirname, "postcss.config.js"),
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/ngo-dashboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ngo-dashboard/, ""),
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  define: {
    'process.env': process.env
  },
});

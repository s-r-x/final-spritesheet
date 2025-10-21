import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";
import { VitePWA } from "vite-plugin-pwa";

export const PORT = 5173;
export const BASE_URL = "/final-spritesheet";
const srcPath = path.join(import.meta.dirname, "src");
export const alias = {
  "#config": path.join(srcPath, "config.ts"),
  "#utils": path.join(srcPath, "common", "utils"),
  "#components": path.join(srcPath, "common", "components"),
  "#hooks": path.join(srcPath, "common", "hooks"),
  "@": srcPath,
};
export default defineConfig({
  base: BASE_URL,
  resolve: {
    alias,
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 99999,
  },
  server: {
    port: PORT,
  },
  plugins: [
    react(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
    }),
    VitePWA({
      manifest: {
        name: "Final spritesheet",
        short_name: "FS",
        description: "A spritesheet generator",
        theme_color: "#f2e9e4ff",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
      },
    }),
  ],
});

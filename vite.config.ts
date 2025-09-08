import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/final-spritesheet",
  plugins: [
    react(),
    tsconfigPaths(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
    }),
    VitePWA({
      manifest: {
        name: "Final spritesheet",
        short_name: "A spritesheet generator",
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

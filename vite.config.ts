import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/final-spritesheet",
  plugins: [
    react(),
    tsconfigPaths(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
    }),
  ],
});

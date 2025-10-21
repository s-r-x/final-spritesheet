import { defineConfig } from "vitest/config";
import { alias } from "./vite.config";

export default defineConfig({
  test: {
    dir: "./unit-tests",
  },
  resolve: {
    alias,
  },
});

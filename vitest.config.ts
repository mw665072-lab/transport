import { defineConfig } from "vitest/config";
import { resolve } from "path";
export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: { environment: "jsdom", setupFiles: ["./src/tests/setup.ts"] },
  resolve: { alias: { "@": resolve(__dirname, "./src") } }
});

import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "test/setup-file.ts",
    testTimeout: 60_000,
    include: ["test/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"]
  },
  plugins: [tsconfigPaths()]
})

/* eslint-disable n/no-extraneous-import */
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

// vite.config.ts

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    testTimeout: 60_000,
  },
  plugins: [tsconfigPaths()],
})

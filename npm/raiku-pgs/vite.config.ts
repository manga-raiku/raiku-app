import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: ["./lib/main.ts"],
      name: "RaikuPgs",
      formats: ["es", "cjs"],
      fileName: "main",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["cheerio"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "cheerio",
        },
      },
    },
  },
})

import { transform } from "esbuild"
import type { Plugin } from "vite"
import { defineConfig } from "vite"

function minifyBundles(): Plugin {
  return {
    name: "minifyBundles",
    renderChunk: {
      order: "post",
      async handler(code, chunk, outputOptions) {
        if (outputOptions.format === "es" && chunk.fileName.endsWith(".mjs")) {
          return await transform(code, { minify: true, treeShaking: true })
        }
        return code
      },
    },
  }
}

export default defineConfig({
  base: "./",
  build: {
    lib: {
      entry: "./plugin.ts",
      formats: ["es"],
      fileName: "plugin",
    },
    target: "es2017",
  },
  plugins: [minifyBundles()],
})

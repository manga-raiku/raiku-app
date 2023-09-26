import { existsSync, rmdirSync } from "fs"
import { join } from "path"

import { transform } from "esbuild"
import type { Plugin } from "vite"
import { build } from "vite"

if (existsSync(join(__dirname, "../dist")))
  rmdirSync(join(__dirname, "../dist"), { recursive: true })

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

build({
  base: "./",
  build: {
    emptyOutDir: false,
    lib: {
      entry: ["./plugin.ts"],
      formats: ["iife"],
      name: "__DEFINE_API__",
      fileName: (_format, entry) => entry + ".mjs",
    },
    target: "es2017",
  },
  plugins: [minifyBundles()],
})

build({
  base: "./",
  build: {
    emptyOutDir: false,
    lib: {
      entry: ["./package.ts"],
      formats: ["iife"],
      name: "__DEFINE_PACKAGE__",
      fileName: (_format, entry) => entry + ".mjs",
    },
    target: "es2017",
  },
  plugins: [minifyBundles()],
})

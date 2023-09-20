import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: "./runs/$.ts",
      formats: ["es"],
      fileName: "plugin",
    },
  },
  // plugins: [viteSingleFile()],
})

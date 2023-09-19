import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: "./runs/$.ts",
      formats: ["es"],
      name: "plugin",
    },
  },
  // plugins: [viteSingleFile()],
})

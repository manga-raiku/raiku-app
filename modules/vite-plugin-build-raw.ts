import esbuild from "esbuild"
// import { obfuscate } from "javascript-obfuscator"
import type { Plugin } from "vite"

export default function vitePluginBuildRaw(): Plugin {
  return {
    name: "vite-plugin-build-raw",
    transform(src, id) {
      if (id.includes("?braw")) {
        id = id.replace(/\?braw$/, "")
        // console.log({ id })
        const code = esbuild.buildSync({
          entryPoints: [id],
          format: "iife",
          bundle: true,
          minify:
            id.includes("&minify") || process.env.NODE_ENV === "production",
          treeShaking: true,
          write: false,
          // sourcemap: true
          // sideEff,
          define: Object.fromEntries(
            [["CRYPTO_PASSWORD", ""], ...Object.entries(process.env)].map(
              ([name, value]) => [
                `process.env.${name.replace(/[^\w\d_$]/g, "_")}`,
                JSON.stringify(value)
              ]
            )
          )
        })
        const { text } = code.outputFiles[0]

        return {
          code: `export default ${JSON.stringify(
            /* id.includes("&obfuscate")
              ? esbuild.transformSync(
                  obfuscate(text, {
                    compact: false,
                    // controlFlowFlattening: true,
                    controlFlowFlatteningThreshold: 1,
                    numbersToExpressions: true,
                    simplify: true,
                    stringArrayShuffle: true,
                    splitStrings: true,
                    stringArrayThreshold: 1
                    // transformObjectKeys: true
                  }).getObfuscatedCode(),
                  {
                    minify:
                      id.includes("&minify") ||
                      process.env.NODE_ENV === "production",
                    treeShaking: true
                  }
                ).code
              : */ text
          )}`,

          map: null
        }
      }
    }
  }
}

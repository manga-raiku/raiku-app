import fs from "fs"
import { join } from "path"

import ISO6391 from "iso-639-1"
import type { Plugin } from "vite"

const reg = /[\w-]+(?=\.json$)/
export default function vitePluginI18nLangs(): Plugin {
  return {
    name: "vite-plugin-i18n-langs",
    async transform(src, id) {
      if (id === "virual:i18n-langs") {
        const langs = (
          await fs.promises.readdir(join(__dirname, "src/i18n/messages"))
        ).map((name) => reg.exec(name)?.[0])
        const languages = langs.map((code) => {
          return {
            code,
            name: ISO6391.getNativeName(code?.slice(0, 2) ?? "en"),
          }
        })

        return {
          code: `export default ${JSON.stringify(languages)}`,
        }
      }
    },
  }
}

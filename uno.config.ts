import transformerDirectives from "@unocss/transformer-directives"
import {
  presetAttributify,
  presetUno,
  defineConfig,
  presetTypography,
  presetWind,
} from "unocss"

export default defineConfig({
  presets: [
    presetWind(),
    presetUno(),
    presetAttributify({
      prefix: "un-",
      prefixedOnly: true, // <--
    }),
    presetTypography(),
  ],
  rules: [
    [/^size-\[?([^[\]]+)\]?/, ([, value]) => ({ width: value, height: value })],
    [/^font-family-(.+)/, ([, value]) => ({ "font-family": value })],
  ],
  transformers: [transformerDirectives()],
  theme: {
    breakpoints: {
      sm: "600px",
      md: "1024px",
      lg: "1440px",
      xl: "1920px",
    },
  },
})

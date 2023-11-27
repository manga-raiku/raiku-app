import transformerDirectives from "@unocss/transformer-directives"
import { presetOnu } from "onu-ui"
import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  presetWind
} from "unocss"

export default defineConfig({
  presets: [
    presetWind(),
    presetUno(),
    presetOnu(),
    presetAttributify({
      prefix: "un-",
      prefixedOnly: true // <--
    }),
    presetTypography()
  ],
  rules: [
    [/^size-\[?([^[\]]+)\]?/, ([, value]) => ({ width: value, height: value })],
    [/^font-family-(.+)/, ([, value]) => ({ "font-family": value })],
    [/^font-size-(.+)/, ([, value]) => ({ "font-size": value })]
  ],
  transformers: [transformerDirectives()],
  theme: {
    breakpoints: {
      sm: "600px",
      md: "1024px",
      lg: "1440px",
      xl: "1920px"
    },
    colors: {
      sakura: "#f27fb5",
      sakura2: "#f3d3e2",
      sakura3: "#f8c1d5",
      sakura4: "#fbe0ef"
    }
  },
  safelist: [
    ..."overflow-y-scroll flex-shrink-1 mt-2 text-#eee text-opacity-70".split(
      " "
    ),
    "text-weight-medium",
    "max-w-60%",
    "text-20px",
    "!overflow-scroll",
    ..."relative top-0 left-1/2".split(" "),
    "text-blue-400",
    "bg-blue-400",
    "bg-gray-700",
    "rounded-30px",
    "text-sakura",
    "bg-sakura",
    "text-sakura3",
    "bg-sakura3",
    "text-sakura4",
    "bg-sakura4"
  ]
})

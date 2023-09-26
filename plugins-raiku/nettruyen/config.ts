import { definePackage } from "raiku-pgs/plugin"

import favicon from "./favicon.png?inline"

export const meta = definePackage({
  id: "nettruyen",
  name: "Net Truyen",
  favicon,
  version: "0.0.2",
  description: "Plugin nguồn Net Truyen",
  author: "Tachibana Shin <tachibshin@duck.com>",
  updatedAt: Date.now(),
})

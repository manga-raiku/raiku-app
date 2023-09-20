import { expect } from "vitest"

import json from "../__test__/assets/truyen-tranh/hon-nhan-hanh-phuc-cua-toi-25737.json"
import html from "../__test__/assets/truyen-tranh/hon-nhan-hanh-phuc-cua-toi-25737.txt?raw"

import slug from "./[slug]"

describe("[slug]", () => {
  test("works", () => {
    const result = slug(html, 1690510234674)

    expect(result).toEqual(json)
  })
})

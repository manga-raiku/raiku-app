import { expect } from "vitest"

import json from "../../__test__/assets/truyen-tranh/chap-20-2/776047.json"
import html from "../../__test__/assets/truyen-tranh/chap-20-2/776047.txt?raw"

import epId from "./[ep-id]"

describe("[ep-id]", () => {
  test("works", () => {
    const result = epId(html, 1690510234674)

    expect(result).toEqual(json)
  })
})

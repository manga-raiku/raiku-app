import { expect } from "vitest"

import general from "./[general]"
import json from "./__test__/assets/tim-truyen.json"
import html from "./__test__/assets/tim-truyen.txt?raw"

describe("[general]", () => {
  test("works", () => {
    const results = general(html, 1690510234674)

    expect(results).toEqual(json)
  })
})

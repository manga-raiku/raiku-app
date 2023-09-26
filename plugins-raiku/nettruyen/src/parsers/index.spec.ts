import { expect } from "vitest"

import json from "./__test__/assets/index.json"
import html from "./__test__/assets/index.txt?raw"

import index from "."

describe("index", () => {
  test("works", () => {
    const result = index(html, 1690510234674)

    for (const key in result.last_update)
      expect(result.last_update[key]).toEqual(json.last_update[key])
    expect(result).toEqual(json)
  })
})

import { expect } from "vitest"

import json from "./__test__/assets/pre-search.json"
import html from "./__test__/assets/pre-search.txt?raw"
import preSearch from "./pre-search"

describe("pre-search", () => {
  test("works", () => {
    const result = preSearch(html)

    expect(result).toEqual(json)
  })
})

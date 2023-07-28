import { expect } from "vitest"

import json from "./__test__/assets/pre-search.json"
import html from "./__test__/assets/pre-search.txt?raw"
import presearch from "./pre-search"

describe("pre-search", () => {
  test("works", () => {
    expect(presearch(html)).toEqual(json)
  })
})

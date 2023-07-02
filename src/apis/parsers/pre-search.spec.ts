import presearch from "./pre-search"
import html from "./__test__/assets/pre-search.txt?raw"
import json from "./__test__/assets/pre-search.json"

describe("pre-search", () => {
  test("works", () => {
    expect(presearch(html)).toEqual(json)
  })
})

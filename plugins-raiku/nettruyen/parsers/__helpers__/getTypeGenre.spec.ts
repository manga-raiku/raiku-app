import { expect } from "vitest"

import { getTypeGenre } from "./getTypeGenre"

describe("getTypeGenre", () => {
  test("should work", () => {
    expect(getTypeGenre("/tim-truyen/shoujo")).toBe("shoujo")
    expect(getTypeGenre("/tim-truyen/shoujo/")).toBe("shoujo")
  })
})

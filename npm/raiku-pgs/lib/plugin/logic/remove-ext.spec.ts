import { describe, expect, test } from "vitest"

import { removeExt } from "./remove-ext"

describe("remove-ext", () => {
  test("should text exists ext", () => {
    expect(removeExt("/example.html")).toBe("/example")
    expect(removeExt("/example.htm")).toBe("/example")
  })

  test("should text not exists ext", () => {
    expect(removeExt("/example")).toBe("/example")
  })
})

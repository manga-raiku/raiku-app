import { expect } from "vitest"

describe("path-equal", () => {
  test("should path equality", () => {
    expect(pathEqual("/foo/bar", "/foo/bar")).toBe(true)
  })

  test("should url path equality", () => {
    expect(pathEqual("https://example.com/foo/bar", "/foo/bar")).toBe(true)
  })

  test("should path end .html", () => {
    expect(pathEqual("/foo/bar.html", "/foo/bar")).toBe(true)
  })

  test("should path exists queries", () => {
    expect(pathEqual("/foo/bar.html", "/foo/bar?q=zaa")).toBe(true)
  })
})

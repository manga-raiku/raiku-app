import { parseCount } from "./parseCount"

describe("parseCount", () => {
  it("should parse count", () => {
    expect(parseCount("123")).toEqual(123)
  })
  it("should parse count with decimals", () => {
    expect(parseCount("123.456")).toEqual(123456)
  })
  it("should parse count with negative decimals", () => {
    expect(parseCount("-123.456")).toEqual(-123456)
  })
  it("should parse count with K", () => {
    expect(parseCount("1.982K")).toEqual(1982)
  })
})

import { describe, expect, it } from "vitest"

import { upgradeToHttps } from "./upgrade-to-https"

describe("upgradeToHttps", () => {
  it('should return the same URL if it starts with "https://"', () => {
    const url = "https://example.com"
    expect(upgradeToHttps(url)).toEqual(url)
  })

  it('should upgrade the URL to HTTPS if it starts with "http://"', () => {
    const url = "http://example.com"
    const expected = "https://example.com"
    expect(upgradeToHttps(url)).toEqual(expected)
  })

  it('should return the same URL if it does not start with "http://"', () => {
    const url = "example.com"
    expect(upgradeToHttps(url)).toEqual(url)
  })

  it("should upgrade the URL to HTTPS if not found protocol", () => {
    expect(upgradeToHttps("//example.com")).toEqual("https://example.com")
  })
})

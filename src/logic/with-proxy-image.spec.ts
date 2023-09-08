import { expect } from "vitest"

describe("with-proxy-image", () => {
  test("should if url is .googleusercontent.com", () => {
    expect(
      withProxyImage(
        "https://images2-focus.googleusercontent.com/test.txt",
        {},
      ),
    ).toBe(
      "https://proxy.mangaraiku.eu.org/?url=https%3A%2F%2Fimages2-focus.googleusercontent.com%2Ftest.txt&headers=%7B%7D",
    )
  })

  test("should if url not is .googleusercontent.com", () => {
    expect(withProxyImage("https://example.com/test.txt", {})).toBe(
      "https://proxy.mangaraiku.eu.org/?url=https%3A%2F%2Fimages2-focus-opensocial.googleusercontent.com%2Fgadgets%2Fproxy%3Fcontainer%3Dfocus%26gadget%3Da%26no_expand%3D1%26resize_h%3D0%26rewriteMime%3Dimage%252F*%26url%3Dhttps%253A%252F%252Fexample.com%252Ftest.txt&headers=%7B%7D",
    )
  })
})

import { expect } from "vitest"

import { getParamComicAndChap } from "./getParamComicAndChap"

describe("getParamComicAndChap", () => {
  test("should work", () => {
    expect(getParamComicAndChap("/truyen-tranh/<comic>/chap-1/123")).toEqual({
      comic: "<comic>",
      chap: "chap-1-i123",
    })
    expect(getParamComicAndChap("/truyen-tranh/<comic>/chap-1/123/")).toEqual({
      comic: "<comic>",
      chap: "chap-1-i123",
    })
  })
})

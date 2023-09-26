import { describe, expect, test } from "vitest"

import { normalizeChName } from "./normalize-ch-name"

describe("normalize-ch-name", () => {
  test("should normalize", () => {
    expect(normalizeChName("Chương 1")).toBe("1")
    expect(normalizeChName("Chương 1.2")).toBe("1.2")

    expect(normalizeChName("Chapter 1")).toBe("1")
    expect(normalizeChName("Chapter 1.2")).toBe("1.2")

    expect(normalizeChName("Chap 1")).toBe("1")
    expect(normalizeChName("Chap 1.2")).toBe("1.2")

    expect(normalizeChName(" 1")).toBe("1")
    expect(normalizeChName(" 1.2")).toBe("1.2")
  })
})

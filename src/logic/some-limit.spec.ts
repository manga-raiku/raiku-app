import { expect } from "vitest"

describe("someLimit", () => {
  it("should return true if any of the promises resolves to true", async () => {
    const sources = [1, 2, 3, 4, 5]
    const fn = (value: number) => Promise.resolve(value === 3)
    const concurrency = 2
    const result = await someLimit(sources, fn, concurrency)
    expect(result).toBe(true)
  })

  it("should return false if none of the promises resolves to true", async () => {
    const sources = [1, 2, 3, 4, 5]
    const fn = (value: number) => Promise.resolve(value === 6)
    const concurrency = 2
    const result = await someLimit(sources, fn, concurrency)
    expect(result).toBe(false)
  })

  it("should handle empty sources array", async () => {
    const sources: number[] = []
    const fn = (value: number) => Promise.resolve(value === 3)
    const concurrency = 2
    const result = await someLimit(sources, fn, concurrency)
    expect(result).toBe(false)
  })

  it("should stop if true value", async () => {
    const sources = [vi.fn(), vi.fn()]

    await someLimit(
      sources,
      (val) => {
        val()
        return true
      },
      1
    )

    expect(sources[0].mock.calls.length).toBe(1)
    expect(sources[1].mock.calls.length).toBe(0)
  })
})

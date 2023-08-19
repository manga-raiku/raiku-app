import { expect } from "vitest"

const value = Math.random()

describe("with-cache", () => {
  test("should get value from fn", async () => {
    expect(await withCache(() => value, "key").then((res) => res.value)).toBe(
      value
    )
  })

  test("should get value from cache if exists", async () => {
    {
      const start = performance.now()
      const data = await withCache(async () => {
        await sleep(1000)
        return value
      }, "key")

      expect(performance.now() - start < 1300).toBe(true)
      expect(data.value).toBe(value)
    }
    {
      const start = performance.now()
      const data = await withCache(async () => {
        await 1000
        return value
      }, "key")

      expect(performance.now() - start < 999).toBe(true)
      expect(data.value).toBe(value)
    }
  })

  test("should update data old version", async () => {
    await withCache(async () => value, "key")

    const newVal = Math.random()
    const data = await withCache((async) => newVal, "key")

    expect(data.value).toBe(newVal)
  })
})

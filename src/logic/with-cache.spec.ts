import { expect } from "vitest"

const value = { v: Math.random() }

describe("with-cache", () => {
  test("should get value from fn", async () => {
    expect(
      await withCache(async () => value, ref("key")).then((res) => res.value),
    ).toEqual(value)
  })

  test("should get value from cache if exists", async () => {
    {
      const start = performance.now()
      const data = await withCache(async () => {
        await sleep(1000)
        return value
      }, ref("key"))

      expect(performance.now() - start < 1300).toEqual(true)
      expect(data.value).toEqual(value)
    }
    {
      const start = performance.now()
      const data = await withCache(async () => {
        await 1000
        return value
      }, ref("key"))

      expect(performance.now() - start < 999).toEqual(true)
      expect(data.value).toEqual(value)
    }
  })

  test("should update data old version", async () => {
    await withCache(async () => value, ref("key"))

    const newVal = { v: Math.random() }
    const data = await withCache(async () => newVal, ref("key"))

    expect(data.value).toEqual(newVal)
  })
})

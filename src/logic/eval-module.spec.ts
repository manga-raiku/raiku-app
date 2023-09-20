import { expect } from "vitest"

describe("eval-module", () => {
  test("should execute code `export`", async () => {
    expect(await evalModule("export default 1")).toBe(1)
  })
})

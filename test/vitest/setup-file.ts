// This file will be run before each test file
import "fake-indexeddb/auto"

const { Date } = self
Object.assign(self, {
  Date: class extends Date {
    constructor(value: string | number | Date) {
      const raw = value
      if (typeof value === "string" && !value.includes("+")) value += " GMT+0"

      super(value)

      if (Number.isNaN(this.getTime())) console.error(raw)
    }
  },
})

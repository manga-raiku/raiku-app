// This file will be run before each test file
import "fake-indexeddb/auto"

const { Date } = self
Object.assign(self, {
  Date: class extends Date {
    constructor(value: string | number | Date) {
      if (typeof value === "string" && !value.includes("+")) value += " GMT+0"

      super(value)
    }
  },
})

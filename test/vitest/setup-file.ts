// This file will be run before each test file
import "fake-indexeddb/auto"

const { Date } = self
;(self as unknown as never).Date = class extends Date {
  constructor(value: string | number | Date) {
    if (typeof value === "string") value += " GMT+0"

    super(value)
  }
}

const { toString } = Object.prototype

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toType(value: any): string {
  return toString.call(value).slice(8, -1)
}

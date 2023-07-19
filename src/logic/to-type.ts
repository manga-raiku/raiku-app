const { toString } = Object.prototype

export function toType(value: any): string {
  return toString.call(value).slice(8, -1)
}

export function xor(a: boolean, b: boolean): boolean {
  if (a) return !b
  if (b) return !a

  return false
}

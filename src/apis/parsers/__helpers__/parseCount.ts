export function parseCount(count: string): number {
  const v = count.match(/^(-?[\d.]+)\s*(\w*)$/)

  if (!v) return 0

  const [n, t] = [parseFloat(v[1]), v[2]]
  switch (t.toUpperCase()) {
    case "K":
      return n * 1000
    case "M":
      return n * 1000000
    case "G":
      return n * 1000000000
    case "T":
      return n * 1000000000000
    default:
      return parseInt(n.toString().replace(".", ""))
  }
}

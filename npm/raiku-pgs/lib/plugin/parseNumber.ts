export function parseNumber(val: string) {
  val = val.trim().toLowerCase().replace(".", "")
  const k = parseFloat(val)

  if (Number.isNaN(k)) return null

  switch (val[val.length - 1]) {
    case "k":
      return k * 1e3
    case "m":
      return k * 1e6
    case "g":
      return k * 1e9
    default:
      return k
  }
}

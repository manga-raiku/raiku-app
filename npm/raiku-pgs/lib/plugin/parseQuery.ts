export function parseQuery(url: string): Record<string, string | string[]> {
  const search = new URLSearchParams(url.slice((url.indexOf("?") >>> 0) + 1))

  const query: Record<string, string | string[]> = {}

  for (const [key, value] of search) {
    const rawValue = query[key]
    if (!rawValue) query[key] = value

    if (Array.isArray(rawValue)) {
      rawValue.push(value)
      continue
    }
    query[key] = [value]
  }

  return query
}

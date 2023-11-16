export function parsePath(url: string) {
  try {
    const { pathname, search } = new URL(url)

    return `${pathname}${search}`
  } catch {
    return url
  }
}

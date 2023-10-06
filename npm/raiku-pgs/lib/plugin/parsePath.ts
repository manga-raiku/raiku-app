export function parsePath(url: string) {
  try {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const { pathname, search } = new URL(url)

    return `${pathname}${search}`
  } catch {
    return url
  }
}

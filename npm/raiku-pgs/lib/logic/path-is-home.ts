export function pathIsHome(path: string): boolean {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const { pathname } = new URL(path, "http://localhost")

  if (
    !pathname ||
    pathname === "/" ||
    pathname === "/index" ||
    pathname === "/index.html"
  )
    return true

  return false
}

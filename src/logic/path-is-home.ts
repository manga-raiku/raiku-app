export function pathIsHome(path: string): boolean {
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

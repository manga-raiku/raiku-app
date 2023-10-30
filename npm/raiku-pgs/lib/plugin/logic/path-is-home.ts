export function pathIsHome(path: string, checkQuery = true): boolean {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const { pathname, search } = new URL(path, "http://localhost")

  if (
    (!pathname ||
      pathname === "/" ||
      pathname === "/index" ||
      pathname === "/index.html") &&
    (checkQuery ? !search : true)
  )
    return true

  return false
}

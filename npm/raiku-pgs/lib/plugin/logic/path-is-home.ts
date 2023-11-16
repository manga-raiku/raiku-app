export function pathIsHome(path: string, checkQuery = true): boolean {
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

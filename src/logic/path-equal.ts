function getPath(path: string) {
  return new URL(path, "http://localhost").pathname
}

export function pathEqual(path1: string, path2: string) {
  return (
    getPath(path1).replace(".html", "") === getPath(path2).replace(".html", "")
  )
}

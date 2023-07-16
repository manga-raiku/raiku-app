export function pathEqual(path1: string, path2: string) {
  return path1.replace(".html", "") === path2.replace(".html", "")
}

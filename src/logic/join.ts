export function join(path1: string, path2: string): string {
  return path1.replace(/\/+$/g, "") + "/" + path2
}

export function parsePath(url: string) {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

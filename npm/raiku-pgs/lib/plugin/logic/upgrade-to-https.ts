export function upgradeToHttps(url: string) {
  if (url.startsWith("http://")) {
    return `https${url.slice(4)}`
  }
  if (url.startsWith("//")) return `https:${url}`

  return url
}

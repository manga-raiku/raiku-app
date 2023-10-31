export function upgradeToHttps(url: string) {
  if (url.startsWith("http://")) {
    return `https${url.slice(4)}`
  }
  return url
}

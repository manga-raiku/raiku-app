export function getTypeGenre(url: string): string {
  const tt = url.indexOf("/tim-truyen/") + 12
  const genre = url
    .slice(tt, url.indexOf("?", tt) >>> 0)
    .replace(/\/$/, "")
    .replace(/\/$/, "_")
  return genre
}

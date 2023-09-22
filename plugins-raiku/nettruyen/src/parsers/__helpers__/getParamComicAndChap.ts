// https://www.nettruyenus.com/truyen-tranh/<comic>/chap-33/1058503

export function getParamComicAndChap(url: string): {
  readonly comic: string
  readonly chap: string
} {
  const tt = url.indexOf("/truyen-tranh/") + 14

  const comic = url.slice(tt, url.indexOf("/", tt))
  const chap = url
    .slice(
      tt + comic.length + 1,
      url.indexOf("/", url.indexOf("/", tt + comic.length + 1) + 1) >>> 0,
    )
    .replace(/\//g, "-i")

  return { comic, chap }
}

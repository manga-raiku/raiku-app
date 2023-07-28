import type { Cheerio, Element } from "cheerio"

export function getImage($img: Cheerio<Element>) {
  return (
    $img.attr("data-src") ??
    $img.attr("data-original") ??
    $img.attr("data-cdn") ??
    $img.attr("src")
  )
}

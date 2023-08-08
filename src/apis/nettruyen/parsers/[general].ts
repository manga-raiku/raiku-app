import { parseAnchor } from "src/apis/__helpers__/parseAnchor"
import { parseDom } from "src/apis/__helpers__/parseDom"
import { parsePath } from "src/apis/__helpers__/parsePath"

import { parseItem } from "./__helpers__/parseItem"

interface FilterURI {
  type: string
  select: {
    path: string
    name: string
  }[]
}
interface FilterQuery {
  type: string
  key: string
  items: {
    value: string
    name: string
  }[]
}

export default function general(html: string, now: number) {
  const $ = parseDom(html)

  const name = $("#ctl00_mainContent_ctl00_divBasicFilter > h1 > strong")
    .text()
    .trim()
  const description = $("#ctl00_mainContent_ctl00_divDescription").text()

  const genres: FilterURI = {
    type: "Thể loại",
    select: $("#ctl00_divRight > div > div > ul > li > a")
      .toArray()
      .map((item) => {
        const $item = $(item)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const path = parsePath($item.attr("href")!).replace(
          /\/tim-truyen(\/[^?]|$)/,
          "/the-loai$1"
        )
        const name = $item.text()

        return { path, name }
      }),
  }
  const status: FilterQuery = {
    type: "Trạng thái",
    key: "status",
    items: $("#ctl00_mainContent_ctl00_ulStatus a")
      .toArray()
      .map((item) => {
        const { name, path } = parseAnchor($(item))

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = new URL(path, "http://localhost").searchParams.get(
          "status"
        )!

        return { name, value }
      }),
  }
  const sort: FilterQuery = {
    type: "Sắp xếp",
    key: "sort",
    items: $("#ctl00_mainContent_ctl00_divSort a")
      .toArray()
      .map((item) => {
        const { name, path } = parseAnchor($(item))

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = new URL(path, "http://localhost").searchParams.get(
          "sort"
        )!

        return { name, value }
      }),
  }

  const filters = [genres, status, sort]
  const items = $(
    "#ctl00_divCenter > div.Module.Module-170 .item, .items .item"
  )
    .toArray()
    .map((item) => parseItem($, $(item), now))

  const $curPage = parseInt(
    $("#ctl00_mainContent_ctl01_divPager .active").text().trim()
  )
  const curPage = Number.isNaN($curPage) ? 1 : $curPage
  const maxPage = $curPage
    ? parseInt(
        new URL(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          $("#ctl00_mainContent_ctl01_divPager a").last().attr("href")!,
          "http://localhost"
        ).searchParams.get("page") ?? "1"
      )
    : 1

  return { name, description, filters, items, curPage, maxPage }
}

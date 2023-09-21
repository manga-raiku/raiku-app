/* eslint-disable n/no-unsupported-features/node-builtins */
import type { FilterQuery, FilterURI } from "raiku-pgs"
import { parseAnchor, parseDom, parsePath } from "raiku-pgs"

import {  meta } from "../runs/package"

import { getQuery } from "./__helpers__/getQuery"
import { getTypeGenre } from "./__helpers__/getTypeGenre"
import { parseItem } from "./__helpers__/parseItem"

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
        const path = parsePath($item.attr("href")!)
        const route = {
          name: "genre",
          params: {
            sourceId: meta.id,
            type: getTypeGenre(path),
          },
          query: getQuery(path),
        } as const
        const name = $item.text()

        return { route, name }
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
          "status",
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
          "sort",
        )!

        return { name, value }
      }),
  }

  const filters = [genres, status, sort]
  const items = $(
    "#ctl00_divCenter > div.Module.Module-170 .item, .items .item",
  )
    .toArray()
    .map((item) => parseItem($, $(item), now))

  const $curPage = parseInt(
    $("#ctl00_mainContent_ctl01_divPager .active").text().trim(),
  )
  const curPage = Number.isNaN($curPage) ? 1 : $curPage
  const maxPage = $curPage
    ? parseInt(
        new URL(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          $("#ctl00_mainContent_ctl01_divPager a").last().attr("href")!,
          "http://localhost",
        ).searchParams.get("page") ?? "1",
      )
    : 1

  return { name, description, filters, items, curPage, maxPage }
}

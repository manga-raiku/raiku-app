import { parseDate, parseDom, parsePath } from "raiku-pgs"
import { normalizeChName } from "src/logic/normalize-ch-name"

import { parseItem } from "./__helpers__/parseItem"

export default function index(html: string, now: number) {
  const $ = parseDom(html)

  const sliders = $(".hero .is-child")
    .toArray()
    .map((child) => {
      const $child = $(child)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const path = parsePath($child.find("a").attr("href")!)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const image = $child
        .find("img")
        .attr("src")!
        .replace("290x191", "583x386")
      const name = $child.find("h3").text()
      const chapter = normalizeChName($child.find(".chapter").text())
      const genres = $child.find("h5").text().replace("Thể loại: ", "") || null
      const description = $child.find(".excerpt").text()

      return {
        path,
        image,
        name,
        chapter,
        genres,
        description,
      }
    })

  const $schedule = $(".schedule")
  //
  // Lịch Ra Truyện Ngày 29/06/2023
  const $date = new Date(
    parseDate(
      $schedule.find(".time").text().trim().replace("Lịch Ra Truyện Ngày ", ""),
    ),
  )
  const schedule = {
    date: $date.getTime(),
    items: $schedule
      .find(".schedule-list > li")
      .toArray()
      .map((li) => {
        const $li = $(li)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const path = parsePath($li.find("a").attr("href")!)
        const time = new Date(
          $li.find("strong").text().trim().slice(1, -1) +
            ":00 " +
            `${$date.getMonth()}/${$date.getDay()}/${$date.getFullYear()}`,
        ).getTime()
        const release = $li.find(".hot").length > 0
        $li.find("strong").remove()
        const name = $li.text().trim()

        return { path, time, release, name }
      }),
  }

  const hot = $("#div_suggest li")
    .toArray()
    .map((item) => parseItem($, $(item), now))
  const update = $("#main_homepage li")
    .toArray()
    .map((item) => parseItem($, $(item), now))

  return { sliders, schedule, hot, update }
}

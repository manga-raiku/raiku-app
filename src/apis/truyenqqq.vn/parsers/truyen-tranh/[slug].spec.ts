import { expect } from "vitest"

import json2 from "../__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164.json"
import html2 from "../__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164.txt?raw"
import json from "../__test__/assets/truyen-tranh/vo-cua-toi-la-quy-vuong-9947.json"
import html from "../__test__/assets/truyen-tranh/vo-cua-toi-la-quy-vuong-9947.txt?raw"

import manga from "./[slug]"

describe("/truyen-tranh/[slug]", () => {
  test("works 1", () => {
    const result = manga(html, Date.now())

    result.chapters.forEach((item, i) => {
      item.update = json.chapters[i].update
    })
    result.comments.forEach((item, i) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      item.time = json.comments[i].time!
    })

    expect(result).toEqual(json)
  })

  test("works 2", () => {
    const result = manga(html2, Date.now())

    result.chapters.forEach((item, i) => {
      item.update = json2.chapters[i].update
    })
    result.comments.forEach((item, i) => {
      item.time = json2.comments[i].time
    })

    expect(result).toEqual(json2)
  })
})

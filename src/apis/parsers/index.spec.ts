import json from "./__tests__/assets/index.json"
import html from "./__tests__/assets/index.txt?raw"

import index from "."

describe("index", () => {
  test("works", () => {
    const result = index(html)

    result.recommend.forEach((item, i) => {
      item.lastUpdate = json.recommend[i].lastUpdate
      item.chapter.forEach((item, j) => {
        item.update = json.recommend[i].chapter[j].update
      })
    })
    result.updated.forEach((item, i) => {
      item.lastUpdate = json.updated[i].lastUpdate
      item.chapter.forEach((item, j) => {
        item.update = json.updated[i].chapter[j].update
      })
    })

    expect(result).toEqual(json)
  })
})

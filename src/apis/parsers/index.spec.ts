import json from "./__test__/assets/index.json"
import html from "./__test__/assets/index.txt?raw"

import index from "."

describe("index", () => {
  test("works", () => {
    const result = index(html, Date.now())

    result.schedule.date = json.schedule.date
    result.schedule.items.forEach((item, id) => {
      item.time = json.schedule.items[id].time
    })
    result.hot.forEach((item, i) => {
      item.updated = json.hot[i].updated
    })
    result.update.forEach((item, i) => {
      item.updated = json.update[i].updated
    })

    expect(result).toEqual(json)
  })
})

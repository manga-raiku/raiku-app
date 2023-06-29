import json from "../__tests__/assets/services/ComicService.json"
import html from "../__tests__/assets/services/ComicService.txt?raw"

import GetFollowedBlockComics from "./GetFollowedBlockComics"

describe("services/GetFollowedBlockComics", () => {
  test("works", () => {
    const result = GetFollowedBlockComics(html)
    result.forEach((item, i) => {
      item.lastUpdate = json[i].lastUpdate
      item.chapter.forEach((item, j) => {
        item.update = json[i].chapter[j].update
      })
    })

    expect(result).toEqual(json)
  })
})

import json from "../__tests__/assets/truyen-tranh/kanojo-mo-kanojo-280220.json"
import html from "../__tests__/assets/truyen-tranh/kanojo-mo-kanojo-280220.txt?raw"

import manga from "./[manga]"

describe("[manga]", () => {
  test("works", () => {
    const result = manga(html)
    result.chapters.forEach((item, i) => {
      item.update = json.chapters[i].update
    })
    
    expect(result).toEqual(json)
  })
})

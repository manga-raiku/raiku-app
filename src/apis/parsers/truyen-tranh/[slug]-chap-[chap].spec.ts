import { expect } from "vitest"

import json from "../__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164-chap-140.json"
import html from "../__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164-chap-140.txt?raw"

import chap from "./[slug]-chap-[chap]"

describe("/truyen-tranh/[slug]-chap-[chap]", () => {
  test("works", () => {
    const result = chap(html, Date.now())

    result.comments.forEach((item, i) => {
      item.time = json.comments[i].time
    })

    expect(result).toEqual(json)
  })
})

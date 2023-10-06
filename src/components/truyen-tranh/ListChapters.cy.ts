/* eslint-disable camelcase */
import { createPinia, setActivePinia } from "pinia"
import type { Chapter } from "raiku-pgs/plugin"

import ListChapters from "./ListChapters.vue"

setActivePinia(createPinia())

const route = {
  name: "comic chap" as const,
  params: {
    sourceId: "nettruyen",
    comic: "",
    chap: ""
  }
}
const chapters_long: Chapter[] = [
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "Chương 26",
    update: 1628208000000,
    readed: true
  },
  {
    route,
    name: "Chương 25",
    update: 1627776000000,
    readed: true
  },
  {
    route,
    name: "Chương 24",
    update: 1627776000000,
    readed: true
  },
  {
    route,
    name: "Chương 23",
    update: 1626480000000,
    readed: true
  },
  {
    route,
    name: "Chương 22",
    update: 1626307200000,
    readed: true
  },
  {
    route,
    name: "Chương 21",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "Chương 20",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "Chương 19",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "Chương 18",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "Chương 17",
    update: 1620345600000,
    readed: true
  },
  {
    route,
    name: "Chương 16",
    update: 1619308800000,
    readed: true
  },
  {
    route,
    name: "Chương 15",
    update: 1618876800000,
    readed: false
  },
  {
    route,
    name: "Chương 14",
    update: 1606003200000,
    readed: false
  },
  {
    route,
    name: "Chương 13",
    update: 1605571200000,
    readed: false
  },
  {
    route,
    name: "Chương 12",
    update: 1605484800000,
    readed: false
  },
  {
    route,
    name: "Chương 11",
    update: 1602979200000,
    readed: false
  },
  {
    route,
    name: "Chương 10",
    update: 1592438400000,
    readed: false
  },
  {
    route,
    name: "Chương 9",
    update: 1590969600000,
    readed: false
  },
  {
    route,
    name: "Chương 8",
    update: 1589846400000,
    readed: false
  },
  {
    route,
    name: "Chương 7",
    update: 1588550400000,
    readed: false
  },
  {
    route,
    name: "Chương 6",
    update: 1587168000000,
    readed: false
  },
  {
    route,
    name: "Chương 5",
    update: 1586217600000,
    readed: false
  },
  {
    route,
    name: "Chương 4",
    update: 1585353600000,
    readed: false
  },
  {
    route,
    name: "Chương 3",
    update: 1584144000000,
    readed: false
  },
  {
    route,
    name: "Chương 2",
    update: 1584144000000,
    readed: false
  },
  {
    route,
    name: "Chương 1",
    update: 1584144000000,
    readed: false
  }
].map((item) => {
  return {
    ...item,
    updated_at: item.update,
    id: "0",
    views: null
  }
})

describe("ListChapters", () => {
  it("renders chapters", () => {
    const chapters: Chapter[] = [
      {
        route,
        name: "Chương 27",
        update: 1628899200000,
        readed: true
      },
      {
        route,
        name: "Chương 26",
        update: 1628208000000,
        readed: true
      },
      {
        route,
        name: "Chương 25",
        update: 1627776000000,
        readed: true
      },
      {
        route,
        name: "Chương 24",
        update: 1627776000000,
        readed: true
      },
      {
        route,
        name: "Chương 23",
        update: 1626480000000,
        readed: true
      },
      {
        route,
        name: "Chương 22",
        update: 1626307200000,
        readed: true
      },
      {
        route,
        name: "Chương 21",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "Chương 20",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "Chương 19",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "Chương 18",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "Chương 17",
        update: 1620345600000,
        readed: true
      },
      {
        route,
        name: "Chương 16",
        update: 1619308800000,
        readed: true
      },
      {
        route,
        name: "Chương 15",
        update: 1618876800000,
        readed: false
      },
      {
        route,
        name: "Chương 14",
        update: 1606003200000,
        readed: false
      },
      {
        route,
        name: "Chương 13",
        update: 1605571200000,
        readed: false
      },
      {
        route,
        name: "Chương 12",
        update: 1605484800000,
        readed: false
      },
      {
        route,
        name: "Chương 11",
        update: 1602979200000,
        readed: false
      },
      {
        route,
        name: "Chương 10",
        update: 1592438400000,
        readed: false
      },
      {
        route,
        name: "Chương 9",
        update: 1590969600000,
        readed: false
      },
      {
        route,
        name: "Chương 8",
        update: 1589846400000,
        readed: false
      },
      {
        route,
        name: "Chương 7",
        update: 1588550400000,
        readed: false
      },
      {
        route,
        name: "Chương 6",
        update: 1587168000000,
        readed: false
      },
      {
        route,
        name: "Chương 5",
        update: 1586217600000,
        readed: false
      },
      {
        route,
        name: "Chương 4",
        update: 1585353600000,
        readed: false
      },
      {
        route,
        name: "Chương 3",
        update: 1584144000000,
        readed: false
      },
      {
        route,
        name: "Chương 2",
        update: 1584144000000,
        readed: false
      },
      {
        route,
        name: "Chương 1",
        update: 1584144000000,
        readed: false
      }
    ].map((item) => {
      return {
        ...item,
        updated_at: item.update,
        id: "0",
        views: null
      }
    })
    cy.mount(ListChapters, {
      props: {
        chapters,
        noDownload: true,
        sourceId: null
      }
    })

    cy.get("ul").find("li").should("have.length", chapters.length)
  })

  it("split chapters to group size 50", () => {
    cy.mount(ListChapters, {
      props: {
        chapters: chapters_long,
        noDownload: true,
        sourceId: null
      }
    })

    cy.get(".q-tab").should("have.length", 2)
    cy.get(".q-tab")
      .first()
      .should(($button) => {
        expect($button[0].innerText).to.contain("ch-from-to:27,4")
      })
  })

  it("segment first active", () => {
    cy.mount(ListChapters, {
      props: {
        chapters: chapters_long,
        noDownload: true,
        sourceId: null
      }
    })

    cy.get(".q-tab").first().should("have.class", "!text-main-3")
  })
})

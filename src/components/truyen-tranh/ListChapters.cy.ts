/* eslint-disable camelcase */
import { createPinia, setActivePinia } from "pinia"
import type { Chapter } from "raiku-pgs/plugin"

import $ListChapters from "./ListChapters.vue"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListChapters = $ListChapters as unknown as any

setActivePinia(createPinia())

const route = {
  name: "comic chap" as const,
  params: {
    sourceId: "nettruyen",
    comic: "",
    chap: ""
  }
}
const chapters_long: readonly Chapter[] = [
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "27",
    update: 1628899200000,
    readed: true
  },
  {
    route,
    name: "26",
    update: 1628208000000,
    readed: true
  },
  {
    route,
    name: "25",
    update: 1627776000000,
    readed: true
  },
  {
    route,
    name: "24",
    update: 1627776000000,
    readed: true
  },
  {
    route,
    name: "23",
    update: 1626480000000,
    readed: true
  },
  {
    route,
    name: "22",
    update: 1626307200000,
    readed: true
  },
  {
    route,
    name: "21",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "20",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "19",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "18",
    update: 1625788800000,
    readed: true
  },
  {
    route,
    name: "17",
    update: 1620345600000,
    readed: true
  },
  {
    route,
    name: "16",
    update: 1619308800000,
    readed: true
  },
  {
    route,
    name: "15",
    update: 1618876800000,
    readed: false
  },
  {
    route,
    name: "14",
    update: 1606003200000,
    readed: false
  },
  {
    route,
    name: "13",
    update: 1605571200000,
    readed: false
  },
  {
    route,
    name: "12",
    update: 1605484800000,
    readed: false
  },
  {
    route,
    name: "11",
    update: 1602979200000,
    readed: false
  },
  {
    route,
    name: "10",
    update: 1592438400000,
    readed: false
  },
  {
    route,
    name: "9",
    update: 1590969600000,
    readed: false
  },
  {
    route,
    name: "8",
    update: 1589846400000,
    readed: false
  },
  {
    route,
    name: "7",
    update: 1588550400000,
    readed: false
  },
  {
    route,
    name: "6",
    update: 1587168000000,
    readed: false
  },
  {
    route,
    name: "5",
    update: 1586217600000,
    readed: false
  },
  {
    route,
    name: "4",
    update: 1585353600000,
    readed: false
  },
  {
    route,
    name: "3",
    update: 1584144000000,
    readed: false
  },
  {
    route,
    name: "2",
    update: 1584144000000,
    readed: false
  },
  {
    route,
    name: "1",
    update: 1584144000000,
    readed: false
  }
].map((item) => {
  return {
    ...item,
    route,
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
        name: "27",
        update: 1628899200000,
        readed: true
      },
      {
        route,
        name: "26",
        update: 1628208000000,
        readed: true
      },
      {
        route,
        name: "25",
        update: 1627776000000,
        readed: true
      },
      {
        route,
        name: "24",
        update: 1627776000000,
        readed: true
      },
      {
        route,
        name: "23",
        update: 1626480000000,
        readed: true
      },
      {
        route,
        name: "22",
        update: 1626307200000,
        readed: true
      },
      {
        route,
        name: "21",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "20",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "19",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "18",
        update: 1625788800000,
        readed: true
      },
      {
        route,
        name: "17",
        update: 1620345600000,
        readed: true
      },
      {
        route,
        name: "16",
        update: 1619308800000,
        readed: true
      },
      {
        route,
        name: "15",
        update: 1618876800000,
        readed: false
      },
      {
        route,
        name: "14",
        update: 1606003200000,
        readed: false
      },
      {
        route,
        name: "13",
        update: 1605571200000,
        readed: false
      },
      {
        route,
        name: "12",
        update: 1605484800000,
        readed: false
      },
      {
        route,
        name: "11",
        update: 1602979200000,
        readed: false
      },
      {
        route,
        name: "10",
        update: 1592438400000,
        readed: false
      },
      {
        route,
        name: "9",
        update: 1590969600000,
        readed: false
      },
      {
        route,
        name: "8",
        update: 1589846400000,
        readed: false
      },
      {
        route,
        name: "7",
        update: 1588550400000,
        readed: false
      },
      {
        route,
        name: "6",
        update: 1587168000000,
        readed: false
      },
      {
        route,
        name: "5",
        update: 1586217600000,
        readed: false
      },
      {
        route,
        name: "4",
        update: 1585353600000,
        readed: false
      },
      {
        route,
        name: "3",
        update: 1584144000000,
        readed: false
      },
      {
        route,
        name: "2",
        update: 1584144000000,
        readed: false
      },
      {
        route,
        name: "1",
        update: 1584144000000,
        readed: false
      }
    ].map((item) => {
      return {
        ...item,
        route,
        updated_at: item.update,
        id: "0",
        views: null
      }
    })
    cy.mount(ListChapters, {
      props: { offline: false, chapters, noDownload: true, sourceId: null }
    })

    cy.get("ul").find("li").should("have.length", chapters.length)
  })

  it("split chapters to group size 50", () => {
    cy.mount(ListChapters, {
      props: {
        offline: false,
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
        offline: false,
        chapters: chapters_long,
        noDownload: true,
        sourceId: null
      }
    })

    cy.get(".q-tab").first().should("have.class", "!text-sakura3")
  })
})

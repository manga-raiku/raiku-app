import FloatingStatus from "./FloatingStatus.vue"

describe("FloatingStatus", () => {
  it("should scrolling mode", () => {
    cy.mount(FloatingStatus, {
      props: {
        scrollingMode: true,
        singlePage: false,
        rightToLeft: false,
        pagesLength: 3,
        sizePage: 3,
        currentPage: 0,
        sizeOldPages: 0,

        metaEp: {
          name: "Chapter 1"
        }
      }
    })

    cy.get("[data-cy=image]").find("img").should("have.class", "rotate-90")
    cy.get("[data-cy=image]").find("span").should("have.length", 1)
    cy.get("[data-cy=image]")
      .find("span")
      .first()
      .should("have.text", "1")
      .should("have.class", "left-1/2")
      .should("not.have.class", "left-1/4")
  })

  it("should flip mode (single page)", () => {
    cy.mount(FloatingStatus, {
      props: {
        scrollingMode: false,
        singlePage: true,
        rightToLeft: false,
        pagesLength: 3,
        sizePage: 3,
        currentPage: 0,
        sizeOldPages: 0,

        metaEp: {
          name: "Chapter 1"
        }
      }
    })

    cy.get("[data-cy=image]").find("img").should("not.have.class", "rotate-90")
    cy.get("[data-cy=image]").find("span").should("have.length", 1)
    cy.get("[data-cy=image]")
      .find("span")
      .first()
      .should("have.text", "1")
      .should("have.class", "left-1/2")
      .should("not.have.class", "left-1/4")
  })

  describe("flip mode (double page)", () => {
    it("should pages.length % 2 = 1", () => {
      cy.mount(FloatingStatus, {
        props: {
          scrollingMode: false,
          singlePage: false,
          rightToLeft: false,
          pagesLength: 3,
          sizePage: 3,
          currentPage: 0,
          sizeOldPages: 0,

          metaEp: {
            name: "Chapter 1"
          }
        }
      })

      cy.get("[data-cy=image]")
        .find("img")
        .should("not.have.class", "rotate-90")
      cy.get("[data-cy=image]").find("span").should("have.length", 2)
      // cy.get("[data-cy=image]")
      //   .find("span")
      //   .first()
      //   .should("have.text", "1")
      //   .should("have.class", "left-1/2")
      //   .should("have.class", "left-1/4")
      // .next()
      // .should("have.text", "2")
      // .should("have.class", "left-1/2")
      // .should("have.class", "left-1/4")
    })
  })

  it("should show episode", () => {
    cy.mount(FloatingStatus, {
      props: {
        scrollingMode: false,
        singlePage: true,
        rightToLeft: false,
        sizePage: 3,
        pagesLength: 2,
        currentPage: 0,
        sizeOldPages: 0,

        metaEp: {
          name: "1"
        }
      }
    })

    cy.get("[data-cy=text]")
      .find("div")
      .first()
      .should("have.text", "page-p-per:3,33")
    cy.get("[data-cy=text]").find("div").last().should("have.text", "ep-name:1")
  })
})

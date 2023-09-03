import "vue-router"

export {}

declare module "vue-router" {
  interface RouteMeta {
    hiddenHeader?: boolean
    hiddenFooter?: boolean

    noSpaceHeader?: boolean

    auth?: boolean | "guest"
  }
}

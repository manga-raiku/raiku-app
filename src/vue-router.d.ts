import "vue-router"

export {}

declare module "vue-router" {
  interface RouteMeta {
    hiddenHeader?: boolean
    hiddenFooter?: boolean

    hiddenDrawer?: boolean

    revealHeader?: boolean

    noSpaceHeader?: boolean

    hiddenDrawerScope?: boolean

    auth?: boolean | "guest" | string
  }
}

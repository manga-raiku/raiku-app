import "vue-router"

export {}

declare module "vue-router" {
  interface RouteMeta {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    styleFn?: (offset: number, height: number) => any
    padding?: boolean
    hiddenHeader?: boolean
    offset?: boolean
    existsFooter?: boolean
    absolute?: boolean
    noMarginTop?: boolean
  }
}

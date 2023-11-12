import { Screen } from "quasar"
import { route } from "quasar/wrappers"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router"
// import type { RouteRecordRaw } from "vue-router"
// import { routes as autoRoutes } from "vue-router/auto/routes"

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
const routes = setupLayouts(generatedRoutes)
routes.unshift({
  path: "/:mainPath(.*)*/trang-:page(\\d+)",
  redirect(to) {
    return `/${(to.params.mainPath as string[]).join("/")}?page=${
      to.params.page
    }`
  }
})
routes.push({
  path: "/:catchAll(.*)*.html",
  redirect(to) {
    return `/${(to.params.catchAll as string[]).join("/")}`
  }
})

// function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
//   if (route.children) {
//     for (let i = 0; i < route.children.length; i++) {
//       route.children[i] = recursiveLayouts(route.children[i])
//       route.children[i].children?.forEach((item) => (item.props = true))
//     }

//     return route
//   }

//   return setupLayouts([route])[0]
// }

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior(to, from, savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition || { left: 0, top: 0 })
        }, 10)
      })
    },
    routes,
    // extendRoutes(routes) {
    //   return routes.map((route) => recursiveLayouts(route))
    // },

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from) => {
    if (Router.resolve(from) === Router.resolve(to)) return

    if (to.meta.beforeEach === 'true if $lt.md else "/app/myaccount"') {
      if (Screen.lt.md) return

      return "/app/myaccount"
    }
    if (to.meta.beforeEach === "auto fix sourceId") {
      if ("sourceId" in to.params === false) {
        const pluginStore = usePluginStore()

        const id =
          pluginStore.pluginMain ??
          (await pluginStore.pluginMainPromise) ??
          undefined
        if (id)
          return {
            ...to,
            name: undefined,
            path: `/~${id}${to.path}`
          }
      }
    }

    const authStore = useAuthStore()

    await authStore.setup

    let auth = to.meta.auth
    if (auth === undefined || auth === "guest") return

    if (auth === "'guest' if $lt.md else true") {
      if (Screen.lt.md) return
      auth = true
    }

    if (auth) {
      if (authStore.session) return
      return "/app/sign-in?redirect=" + to.fullPath
    }
    if (authStore.session) {
      return APP_STANDALONE ? "/app" : "/"
    }
  })

  return Router
})

import { route } from "quasar/wrappers"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router"
// import { routes as autoRoutes } from 'vue-router/auto/routes'

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
  },
})
routes.push({
  path: "/tim-truyen/:slug",
  redirect(to) {
    return {
      path: `/the-loai/${to.params.slug}`,
      hash: to.hash,
      query: to.query,
    }
  },
})
routes.push({
  path: "/:catchAll(.*)*.html",
  redirect(to) {
    console.log(to)
    return `/${(to.params.catchAll as string[]).join("/")}`
  },
})
console.log(routes)
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
        }, 500)
      })
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  return Router
})

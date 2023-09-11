import { createHead } from "@unhead/vue"
import { boot } from "quasar/wrappers"

export default boot(({ app }) => {
  const head = createHead()

  app.use(head)
})

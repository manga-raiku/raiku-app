import { boot } from "quasar/wrappers"
import gtag from "vue-gtag"

export default boot(({ app, router }) => {
  app.use(
    gtag,
    {
      appName: process.env.GTAG_NAME,
      pageTrackerScreenviewEnabled: true,
      config: {
        id: process.env.GTAG_ID
      }
    },
    router
  )
})

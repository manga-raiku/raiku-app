import { packageName } from "app/package.json"
import { debounce } from "quasar"

export function useLocalStoreProgressEp({
  comic,
  chap,
  singlePage,
  rightToLeft,
  scrollingMode,
  currentPage,
  maxPage,
  zoom
}: {
  comic: ComputedRef<string>
  chap: ComputedRef<string>
  singlePage: Ref<boolean>
  rightToLeft: Ref<boolean>
  scrollingMode: Ref<boolean>
  currentPage: Ref<number>
  maxPage: Ref<number>
  zoom: Ref<number>
}) {
  const authStore = useAuthStore()

  const restored = ref(false)

  // restore if exists setting
  try {
    const dataRaw = localStorage.getItem(
      `${packageName}://state/${comic.value}`
    )
    if (dataRaw) {
      const data = JSON.parse(dataRaw)

      singlePage.value = data.singlePage
      rightToLeft.value = data.rightToLeft
      scrollingMode.value = data.scrollingMode
      if (data.zoom) zoom.value = data.zoom

      restored.value = true
    }
  } catch (err) {
    WARN(err)
  }

  watch(
    [comic, singlePage, rightToLeft, scrollingMode, zoom],
    debounce(
      ([comic, singlePage, rightToLeft, scrollingMode, zoom]: [
        string,
        boolean,
        boolean,
        boolean,
        number
      ]) => {
        localStorage.setItem(
          `${packageName}://state/${comic}`,
          JSON.stringify({
            singlePage,
            rightToLeft,
            scrollingMode,
            zoom
          })
        )
      },
      1000
    )
  )

  // restore progress if not login
  try {
    const dataRaw = localStorage.getItem(
      `${packageName}://state/${comic.value}/${chap.value}`
    )
    if (dataRaw) {
      const data = JSON.parse(dataRaw)

      if (!authStore.session && data.currentPage)
        currentPage.value = data.currentPage
    }
  } catch (err) {
    WARN(err)
  }

  watch(
    [comic, chap, currentPage, maxPage],
    debounce(
      ([comic, chap, currentPage, maxPage]: [
        string,
        string,
        number,
        number
      ]) => {
        if (!authStore.session)
          localStorage.setItem(
            `${packageName}://state/${comic}/${chap}`,
            JSON.stringify({
              currentPage,
              maxPage
            })
          )
      },
      1000
    )
  )

  return restored
}

import { packageName } from "app/package.json"
import { debounce } from "quasar"

export function useLocalStoreProgressEp({
  comic,
  chap,
  singlePage,
  rightToLeft,
  scrollingMode,
  currentPage,
  maxPage
}: {
  comic: ComputedRef<string>
  chap: ComputedRef<string>
  singlePage: Ref<boolean>
  rightToLeft: Ref<boolean>
  scrollingMode: Ref<boolean>
  currentPage: Ref<number>
  maxPage: Ref<number>
}) {
  const authStore = useAuthStore()

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
    }
  } catch (err) {
    WARN(err)
  }

  watch(
    [comic, singlePage, rightToLeft, scrollingMode],
    debounce(
      ([comic, singlePage, rightToLeft, scrollingMode]: [
        string,
        boolean,
        boolean,
        boolean
      ]) => {
        localStorage.setItem(
          `${packageName}://state/${comic}`,
          JSON.stringify({
            singlePage,
            rightToLeft,
            scrollingMode
          })
        )
      },
      70
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
      70
    )
  )
}

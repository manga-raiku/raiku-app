import { packageName } from "app/package.json"
import { debounce } from "quasar"

export function useStoreProgressEp({
  id,
  singlePage,
  rightToLeft,
  scrollingMode,
  currentPage
}: {
  id: ComputedRef<string>
  singlePage: Ref<boolean>
  rightToLeft: Ref<boolean>
  scrollingMode: Ref<boolean>
  currentPage: Ref<number>
}) {
  // restore if exists
  try {
    const dataRaw = localStorage.getItem(`${packageName}://state/${id.value}`)
    if (dataRaw) {
      const data = JSON.parse(dataRaw)

      console.log(data)

      singlePage.value = data.singlePage
      rightToLeft.value = data.rightToLeft
      scrollingMode.value = data.scrollingMode
      currentPage.value = data.currentPage
    }
  } catch (err) {
    WARN(err)
  }

  watch(
    [singlePage, rightToLeft, scrollingMode, currentPage],
    debounce(
      ([singlePage, rightToLeft, scrollingMode, currentPage]: [
        boolean,
        boolean,
        boolean,
        number
      ]) => {
        localStorage.setItem(
          `${packageName}://state/${id.value}`,
          JSON.stringify({
            singlePage,
            rightToLeft,
            scrollingMode,
            currentPage
          })
        )
      },
      70
    )
  )
}

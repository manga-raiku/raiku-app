export function useScrolling() {
  const scrolling = ref(false)
  let timeout: NodeJS.Timeout | number | null = null
  onBeforeUnmount(() => timeout && clearTimeout(timeout))

  function onWheel() {
    scrolling.value = true

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => (scrolling.value = false), 100)
  }

  return { scrolling, onWheel }
}

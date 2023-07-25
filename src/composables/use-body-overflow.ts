export function useBodyOverflow() {
  const overflow = ref("")

  watch(overflow, (overflow) => {
    document.body.style.overflow = overflow
  })
  onBeforeUnmount(() => (document.body.style.overflow = ""))

  return overflow
}

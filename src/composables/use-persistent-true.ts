export function usePersistentTrue(
  controller: Ref<boolean> | (() => boolean)
): Ref<boolean> {
  const value = ref(toValue(controller))

  if (!value.value) {
    const watcher = watch(controller, (val) => {
      if (val) {
        value.value = true
        watcher()
      }
    })
    onBeforeUnmount(watcher)
  }

  return value
}

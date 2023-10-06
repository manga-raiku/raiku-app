export async function evalModule(code: string) {
  const url = URL.createObjectURL(
    new Blob([code], {
      type: "text/javascript"
    })
  )
  /* @vite-ignore */
  return import(url)
    .then((module) => module.default)
    .finally(() => URL.revokeObjectURL(url))
}

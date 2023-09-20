export function evalModule(code: string) {
  const url = URL.createObjectURL(
    new Blob([code], {
      type: "text/javascript",
    }),
  )
  return import(url)
    .then((module) => module.default)
    .finally(() => URL.revokeObjectURL(url))
}

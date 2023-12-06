export function headersToObject(headers: Headers) {
  const obj: Record<string, string | string[]> = {}

  headers.forEach((value, name) => {
    if (!obj[name]) {
      obj[name] = value
      return
    }

    if (Array.isArray(obj[name])) return (obj[name] as string[]).push(value)

    obj[name] = [...obj[name], value]
  })

  return obj
}

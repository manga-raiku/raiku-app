export function markFlag<T extends object>(data: T, name: string): T {
  Object.assign(data, { [name]: true })
  return data
}

export function unFlag<T extends object>(data: T, name: string): T {
  delete data[name as keyof T]
  return data
}

export function isFlag<T extends object>(data: T, name: string): boolean {
  return name in data
}

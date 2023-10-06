export async function someLimit<T>(
  sources: readonly T[],
  fn: (value: T, index: number) => boolean | Promise<boolean>,
  concurrency: number
): Promise<boolean> {
  const { length } = sources
  let i = 0

  while (i < length) {
    const tasks = []

    for (let j = 0; j < concurrency && i < length; j++) {
      tasks.push(fn(sources[i], i))
      i++
    }

    const results = await Promise.all(tasks)

    if (results.includes(true)) return true
  }

  return false
}

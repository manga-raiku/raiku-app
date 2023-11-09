export async function fetchRetry<A extends unknown[], T>(
  fn: (...args: A) => T,
  options: A,
  {
    retries,
    retryDelay
  }: {
    retries: number
    retryDelay: number
  }
): Promise<Awaited<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let err: any
  while (retries-- > 0) {
    try {
      return await fn(...options)
    } catch (error) {
      err = error
      await sleep(retryDelay)
    }
  }

  // eslint-disable-next-line functional/no-throw-statement
  throw err
}

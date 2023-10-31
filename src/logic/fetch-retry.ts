export async function fetchRetry(
  src: string,
  {
    retries,
    retryDelay
  }: {
    retries: number
    retryDelay: number
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let err: any
  while (retries-- > 0) {
    try {
      return await fetch(src)
    } catch (error) {
      err = error
      await sleep(retryDelay)
    }
  }

  // eslint-disable-next-line functional/no-throw-statement
  throw err
}

import createFetchRetry from "fetch-retry"

export const fetchRetry = createFetchRetry(fetch)

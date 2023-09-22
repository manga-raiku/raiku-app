export function getQuery(url: string) {
  // eslint-disable-next-line n/no-unsupported-features/es-builtins
  return Object.fromEntries(
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    new URLSearchParams(url.slice(url.indexOf("?") >>> (0 + 1))).entries(),
  )
}

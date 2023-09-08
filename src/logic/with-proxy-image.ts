export function withProxyImage(
  url: string,
  headers: Record<string, string>,
): string {
  return `https://proxy.mangaraiku.eu.org/?url=${encodeURIComponent(
    url.slice(url.indexOf(".")).startsWith(".googleusercontent.com")
      ? url
      : `https://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*&url=${encodeURIComponent(
          url,
        )}`,
  )}&headers=${encodeURIComponent(JSON.stringify(headers))}`
}

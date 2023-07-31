export function withProxyDeno(
  url: string,
  headers: Record<string, string>
): string {
  return `https://raiku-proxy.deno.dev?url=${encodeURIComponent(
    url.includes(".googleusercontent.com")
      ? url
      : `https://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*&url=${encodeURIComponent(
          url
        )}`
  )}&headers=${encodeURIComponent(JSON.stringify(headers))}`
}

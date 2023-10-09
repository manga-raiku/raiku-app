const r = /\.[a-z]{2,4}$/i
export function removeExt(text: string): string {
  return text.replace(r, "")
}

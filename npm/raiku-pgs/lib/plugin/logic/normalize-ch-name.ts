const REG_STRT_WITH = /^Chương|Chapter|Chap\.?\s+/i

export function normalizeChName(chName: string): string {
  return chName.replace(REG_STRT_WITH, "").trim()
}

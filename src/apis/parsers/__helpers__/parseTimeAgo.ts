// 35 phút trước
export function parseTimeAgo(ago: string, now: number): number | null {
  ago = ago.toLowerCase()

  if (ago.endsWith("giây trước")) return now - parseInt(ago) * 1_000
  if (ago.endsWith("phút trước")) return now - parseInt(ago) * 1_000 * 60
  if (ago.endsWith("giờ trước")) return now - parseInt(ago) * 1_000 * 60 * 60
  if (ago.endsWith("ngày trước"))
    return now - parseInt(ago) * 1_000 * 60 * 60 * 24
  if (ago.endsWith("tháng trước"))
    return now - parseInt(ago) * 1_000 * 60 * 60 * 24 * 30

  return null
}

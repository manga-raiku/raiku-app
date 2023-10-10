// 35 phút trước
export function parseTimeAgo(ago: string, now: number): number {
  ago = ago.trim().toLowerCase()

  if (ago.endsWith("giây trước")) return now - parseInt(ago) * 1_000
  if (ago.endsWith("phút trước")) return now - parseInt(ago) * 1_000 * 60
  if (ago.endsWith("giờ trước")) return now - parseInt(ago) * 1_000 * 60 * 60
  if (ago.endsWith("ngày trước"))
    return now - parseInt(ago) * 1_000 * 60 * 60 * 24
  if (ago.endsWith("tháng trước"))
    return now - parseInt(ago) * 1_000 * 60 * 60 * 24 * 30
  if (ago.endsWith("năm trước"))
    return now - parseInt(ago) * 1_000 * 60 * 60 * 24 * 365

  return (
    new Date(
      ago.replace(
        /^(\d{1,2}):(\d{1,2}) (\d{1,2})\/(\d{1,2})(\/\d{2,4})?$/,
        (_, $1: string, $2: string, $3: string, $4: string, $5: string) => {
          return `${$1}:${$2}:00 ${$4}/${$3}/${
            $5?.slice(1) ?? new Date(now).getFullYear()
          }`
        }
      )
    ).getTime() ||
    new Date(
      ago.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{1,})$/, "$2/$1/$3")
    ).getTime()
  )
}

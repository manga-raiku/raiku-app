export function parseTime(time: string) {
  const n = parseInt(time)

  if (Number.isNaN(n)) return null

  if (time.endsWith(" giây trước")) return Date.now() - n * 1000
  if (time.endsWith(" phút trước")) return Date.now() - n * 1000 * 60
  if (time.endsWith(" giờ trước")) return Date.now() - n * 1000 * 60 * 60
  if (time.endsWith(" ngày trước")) return Date.now() - n * 1000 * 60 * 60 * 24
  if (time.endsWith(" tuần trước"))
    return Date.now() - n * 1000 * 60 * 60 * 24 * 7
  if (time.endsWith(" tháng trước"))
    return Date.now() - n * 1000 * 60 * 60 * 24 * 30
  if (time.endsWith(" năm trước"))
    return Date.now() - n * 1000 * 60 * 60 * 24 * 365

  return Date.now() - n
}

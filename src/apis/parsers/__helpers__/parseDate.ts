export function parseDate(date: string): number {
  // 14:26 27/06/2023

  // eslint-disable-next-line functional/no-let
  let [time, d] = date.split(" ")
  if (time.length > d.length) [time, d] = [d, time]
  const [day, month, year] = d.split("/")

  return new Date(`${time} ${month}/${day}/${year}`).getTime()
}

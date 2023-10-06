// dd/mm/yyyy
export function parseDate(date: string) {
  const [day, month, year] = date.split("/")

  return new Date(`00:00 ${month}/${day}/${year}`).getTime()
}

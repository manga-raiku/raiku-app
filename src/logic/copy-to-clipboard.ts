export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.warn(err)

    if (!document.queryCommandSupported("copy"))
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error("Browser not allow copy to clipboard.")

    const input =
      (document.querySelector("#\\$fake--input-copy") as HTMLInputElement) ??
      document.createElement("input")
    input.id = "\\$fake--input-copy"
    input.setAttribute("value", text)
    input.setAttribute("readonly", "")
    input.setAttribute("style", "position: fixed; top: -9999px; left:-9999px;")
    document.documentElement.appendChild(input)

    input.select()
    input.setSelectionRange(0, input.value.length)

    // input.remove()

    const success = document.execCommand("copy")
    input.remove()
    // eslint-disable-next-line functional/no-throw-statement
    if (!success) throw new Error("Can't copy to clipboard.")
  }
}

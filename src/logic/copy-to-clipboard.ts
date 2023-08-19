export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.warn(err)

    if (!document.queryCommandSupported("copy"))
      throw new Error("Browser not allow copy to clipboard.")

    const input =
      document.querySelector("#\\$fake--input-copy") ??
      document.createElement("input")
    input.id = `\\$fake--input-copy`
    input.setAttribute("value", text)
    input.setAttribute("readonly", true)
    input.style = "position: fixed; top: -9999px; left:-9999px;"
    document.documentElement.appendChild(input)

    input.select()
    input.setSelectionRange(0, input.value.length)

    // input.remove()

    const success = document.execCommand("copy")
    input.remove()
    if (!success) throw new Error("Can't copy to clipboard.")
  }
}

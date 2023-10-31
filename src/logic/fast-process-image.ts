export async function fastProcessImage(url: string) {
  if (url.startsWith(PROTOCOL_OFFLINE)) {
    const path = url.slice(PROTOCOL_OFFLINE.length)

    console.group(url)
    // load
    console.log("[fast-process]: start processing image %s", path)

    const { data: base64 } = await Filesystem.readFile({
      path,
      directory: Directory.External
    })

    console.log("buffer: ", base64)

    console.groupEnd()

    return `data:image;base64,${base64}`
  }
  return url
}

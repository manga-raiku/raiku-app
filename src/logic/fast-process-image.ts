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

    return URL.createObjectURL(
      new Blob([base64ToUint8(base64)], { type: "image" })
    ) // `data:image;base64,${base64}`
  }

  const hashIndex = url.indexOf(HASH_TAG + "{")
  if (hashIndex > -1) {
    let headers: Record<string, string> | undefined

    try {
      headers = JSON.parse(url.slice(hashIndex + HASH_TAG.length))
    } catch {}

    if (headers)
      // request now
      return get({
        url: (url.startsWith("//") ? "https:" : "") + url.slice(0, hashIndex),
        headers,
        responseType: "arraybuffer"
      }).then((res) =>
        URL.createObjectURL(
          new Blob([base64ToUint8(res.data)], { type: "image/jpeg" })
        )
      )

    return url
  }

  return url
}

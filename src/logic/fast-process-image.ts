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

  const hashIndex = url.indexOf(HASH_TAG)
  if (hashIndex > -1) {
    const json = JSON.parse(url.slice(hashIndex + HASH_TAG.length))
    // request now
    return get({
      url: url.slice(0, hashIndex),
      headers: json
    }).then((res) => `data:image;base64,${res.data}`)
  }

  return url
}

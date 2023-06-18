import "fake-indexeddb/auto"

export async function cleanupFS() {
  const { files } = await Filesystem.readdir({
    path: "",
    directory: Directory.External,
  }).catch(() => ({ files: [] }))

  for (const file of files) {
    if (file.type === "file")
      await Filesystem.deleteFile({
        path: file.name,
        directory: Directory.External,
      })
    else
      await Filesystem.rmdir({
        path: file.name,
        directory: Directory.External,
        recursive: true,
      }).catch(() => false)
  }
}

export async function writeFile(path: string, content: string) {
  await Filesystem.writeFile({
    path,
    directory: Directory.External,
    encoding: Encoding.UTF8,
    data: content,
    recursive: true,
  })
}
export async function readFile(path: string) {
  return await Filesystem.readFile({
    path,
    directory: Directory.External,
    encoding: Encoding.UTF8,
  }).then((res) => res.data)
}

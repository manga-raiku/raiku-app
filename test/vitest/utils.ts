import type { Encoding } from "@tachibana-shin/capacitor-filesystem"

export async function cleanup() {
  return Promise.all(
    await Filesystem.readdir({
      path: "",
      directory: Directory.External,
    }).then((res) => {
      return res.files.map(({ name }) =>
        Filesystem.rmdir({
          path: name,
          directory: Directory.External,
          recursive: true,
        }),
      )
    }),
  )
}

export function readdir(path: string) {
  return Filesystem.readdir({
    path,
    directory: Directory.External,
  }).then((res) => res.files.map((item) => item.name))
}

export function readFile(path: string, encoding?: Encoding) {
  return Filesystem.readFile({
    path,
    directory: Directory.External,
    encoding,
  }).then((res) => res.data)
}

export function exists(path: string) {
  return Filesystem.stat({ path, directory: Directory.External })
    .then(() => true)
    .catch(() => false)
}

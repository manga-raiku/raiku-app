import type { Replacer } from "raiku-pgs/thread"

export function resolveImageWithReplacer(
  image: string,
  replacer: readonly Replacer[]
) {
  for (let i = 0; i < replacer.length; i++) {
    for (let j = 0; j < replacer[i].from.length; j++) {
      const regex = replacer[i].from[j]

      if (regex.startsWith("r/")) {
        // is regexp
        const regexp = new RegExp(regex.slice(2))

        if (image.search(regexp) > -1)
          return image.replace(regex, replacer[i].with)
      }

      const index = image.indexOf(regex)

      if (index > -1)
        return (
          image.slice(0, index) +
          replacer[i].with +
          image.slice(index + regex.length)
        )
    }
  }

  return image
}

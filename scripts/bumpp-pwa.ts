import { spawnSync } from "child_process"

import { bold, green } from "kleur"

console.log(bold(green(" === Bumpp version for PWA === ")))
spawnSync("bumpp", ["--commit", "(chore): release PWA %s", "--tag", "pwa@%s"])

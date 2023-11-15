import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const pkg = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf8")
)
pkg.type = "module"

writeFileSync(
  join(__dirname, "..", "package.json"),
  JSON.stringify(pkg, null, 2)
)

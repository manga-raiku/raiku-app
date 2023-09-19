import { writeFileSync } from "fs"
import { join } from "path"

import { Nettruyen } from "./runs/$"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = new Nettruyen(0 as unknown as any, 0 as unknown as any)

writeFileSync(
  join(__dirname, "dist", "plugin.meta"),
  JSON.stringify(api.package),
)

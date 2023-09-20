import { writeFileSync } from "fs"
import { join } from "path"

import { meta } from "./runs/package"

writeFileSync(join(__dirname, "dist", "plugin.meta"), JSON.stringify(meta))

import { spawnSync } from "child_process"
import os from "os"
import { join } from "path"

if (os.platform() === "win32")
  spawnSync("powershell.exe", [join(__dirname, "..", "fixtest.ps1")])

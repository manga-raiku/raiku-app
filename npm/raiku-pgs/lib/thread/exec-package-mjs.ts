import type { AppInfo, Package } from "../API"

import appendWorkerExecPackageMjs from "./private/code/append-worker-exec-package-mjs?braw"

export async function execPackageMjs(
  code: string,
  devMode: boolean,
  AppInfo: AppInfo
) {
  return new Promise<Package>((resolve, reject) => {
    // run in webworker
    // setup port
    const codeWorker =
      (devMode
        ? `self.AppInfo=${JSON.stringify(AppInfo)};\n${code}`
        : `!(()=>{self.AppInfo=${JSON.stringify(AppInfo)};${code}})()`) +
        "\n\n" +
        appendWorkerExecPackageMjs.replace(/__DEBUG__/g, devMode + "")
    
    console.log(codeWorker)
    const url = URL.createObjectURL(
      new Blob([codeWorker], { type: "text/javascript" })
    )
    let urlRevoked = false
    const worker = new Worker(url, devMode ? { type: "module" } : undefined)

    worker.onmessage = (
      event: MessageEvent<
        | {
            ok: boolean
            data: string | Package
          }
        | "load"
      >
    ) => {
      if (!urlRevoked) {
        URL.revokeObjectURL(url)
        urlRevoked = true
      }
      if (event.data === "load") return

      if (event.data.ok) resolve(event.data.data as Package)
      else reject(new Error(event.data.data as string))
    }
    worker.onerror = (event) => {
      URL.revokeObjectURL(url)
      reject(event)
    }
    worker.onmessageerror = worker.onerror as unknown as null
  })
}

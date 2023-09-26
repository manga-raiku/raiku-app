import type { Package } from "../API"

import appendWorkerExecPackageMjs from "./private/code/append-worker-exec-package-mjs?braw"

export async function execPackageMjs(code: string) {
  return new Promise<Package>((resolve, reject) => {
    // run in webworker
    // setup port
    const codeWorker = `${code};${appendWorkerExecPackageMjs.replace(
      /process\.env\.DEV/g,
      process.env.DEV + "",
    )}`
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const url = URL.createObjectURL(
      new Blob([codeWorker], { type: "text/javascript" }),
    )
    const worker = new Worker(url, __DEV__ ? { type: "module" } : undefined)

    worker.onmessage = (
      event: MessageEvent<
        | {
            ok: boolean
            data: string | Package
          }
        | "load"
      >,
    ) => {
      if (event.data === "load") {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        URL.revokeObjectURL(url)

        return
      }
      if (event.data.ok) resolve(event.data.data as Package)
      else reject(new Error(event.data.data as string))
    }
    worker.onerror = (event) => {
      reject(event)
    }
    worker.onmessageerror = worker.onerror as unknown as null
  })
}

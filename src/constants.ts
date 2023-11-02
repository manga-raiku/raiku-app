import { version } from "app/package.json"
import { Http } from "client-ext-animevsub-helper"
import type { AppInfo } from "raiku-pgs/plugin"

export const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL
export const SUPABASE_PROJECT_KEY = process.env.SUPABASE_PROJECT_KEY

export const APP_INFO: AppInfo = {
  mode: import.meta.env.MODE as AppInfo["mode"],
  extension: !!Http.version,
  version
}

export const PROTOCOL_OFFLINE = "offline://"
export const FLAG_OFFLINE = "__OFFLINE__"
export const FLAG_CACHE = "__CACHE__"

export const WARN = console.warn.bind(console)

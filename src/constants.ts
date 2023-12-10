import { version } from "app/package.json"
import { Http } from "client-ext-animevsub-helper"
import type { AppInfo } from "raiku-pgs/plugin"

export const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL
export const SUPABASE_PROJECT_KEY = process.env.SUPABASE_PROJECT_KEY

export const IS_BETA = false

// functions for dev
export const WARN = console.warn.bind(console)

// constants for building
export const APP_NATIVE_MOBILE =
  process.env.MODE === "capacitor" || process.env.MODE === "cordova"
export const APP_STANDALONE =
  APP_NATIVE_MOBILE ||
  (window.matchMedia?.("(display-mode: standalone)").matches ?? false)

export const APP_INFO: AppInfo = {
  mode: process.env.MODE as AppInfo["mode"],
  native: APP_NATIVE_MOBILE,
  standalone: APP_STANDALONE,
  extension: !!Http.version,
  version
}

// constants string
export const PROTOCOL_OFFLINE = "offline://"
export const FLAG_OFFLINE = "__OFFLINE__"
export const FLAG_CACHE = "__CACHE__"
export const HASH_TAG = "#"

// export const TAGS_IS_MANGA: readonly string[] = [
//   "manga",
//   "anime",
//   "japan",
//   "japanese"
// ]

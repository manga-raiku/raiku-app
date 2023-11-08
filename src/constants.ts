import { version } from "app/package.json"
import { Http } from "client-ext-animevsub-helper"
import type { AppInfo } from "raiku-pgs/plugin"

export const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL
export const SUPABASE_PROJECT_KEY = process.env.SUPABASE_PROJECT_KEY

export const APP_INFO: AppInfo = {
  mode: process.env.MODE as AppInfo["mode"],
  extension: !!Http.version,
  version
}

// functions for dev
export const WARN = console.warn.bind(console)

// constants for building
export const APP_NATIVE_MOBILE =
  process.env.MODE === "capacitor" || process.env.MODE === "cordova"
export const APP_STANDALONE =
  APP_NATIVE_MOBILE ||
  (window.matchMedia?.("(display-mode: standalone)").matches ?? false)

// constants string
export const PROTOCOL_OFFLINE = "offline://"
export const FLAG_OFFLINE = "__OFFLINE__"
export const FLAG_CACHE = "__CACHE__"

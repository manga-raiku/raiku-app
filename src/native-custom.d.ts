import type { NativeProperty } from "@nativescript/capacitor"

declare module "@nativescript/capacitor" {
  export interface customNativeAPI extends nativeCustom {}
}

/**
 * Define your own custom strongly typed native helpers here.
 */
export interface nativeCustom {
  dreamBig: () => NativeProperty<string>
  openNativeModalView: () => void
}

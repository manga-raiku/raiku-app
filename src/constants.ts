import type { FunctionalComponent, SVGAttributes } from "vue"

import iconamoonSearchDuotone from "~icons/iconamoon/search-duotone.svg"
import iconamoonSearch from "~icons/iconamoon/search.svg"
import phTranslateDuotone from "~icons/ph/translate-duotone.svg"
import solarBoxMinimalisticBoldDuotone from "~icons/solar/box-minimalistic-bold-duotone.svg"
import solarBoxMinimalisticBroken from "~icons/solar/box-minimalistic-broken.svg"
import solarBugBoldDuotone from "~icons/solar/bug-bold-duotone.svg"
import solarBugLineDuotone from "~icons/solar/bug-line-duotone.svg"
import solarCodeBoldDuotone from "~icons/solar/code-bold-duotone.svg"
import solarDocumentTextBoldDuotone from "~icons/solar/document-text-bold-duotone.svg"
import solarDocumentTextLineDuotone from "~icons/solar/document-text-line-duotone.svg"
import solarDownloadMinimalisticBoldDuotone from "~icons/solar/download-minimalistic-bold-duotone.svg"
import solarDownloadMinimalisticLineDuotone from "~icons/solar/download-minimalistic-line-duotone.svg"
import solarFireBoldDuotone from "~icons/solar/fire-bold-duotone.svg"
import solarFireLineDuotone from "~icons/solar/fire-line-duotone.svg"
import solarFolderFavouriteStarBoldDuotone from "~icons/solar/folder-favourite-star-bold-duotone.svg"
import solarFolderFavouriteStarLineDuotone from "~icons/solar/folder-favourite-star-line-duotone.svg"
import solarHistoryBoldDuotone from "~icons/solar/history-bold-duotone.svg"
import solarHistoryLineDuotone from "~icons/solar/history-line-duotone.svg"
import solarHomeSmileBoldDuotone from "~icons/solar/home-smile-bold-duotone.svg"
import solarHomeSmileBroken from "~icons/solar/home-smile-broken.svg"
import solarInfoCircleBoldDuotone from "~icons/solar/info-circle-bold-duotone.svg"
import solarInfoCircleLineDuotone from "~icons/solar/info-circle-line-duotone.svg"
import solarLibraryBoldDuotone from "~icons/solar/library-bold-duotone.svg"
import solarLibraryLineDuotone from "~icons/solar/library-line-duotone.svg"
import solarNotebookBookmarkBoldDuotone from "~icons/solar/notebook-bookmark-bold-duotone.svg"
import solarNotebookBookmarkLineDuotone from "~icons/solar/notebook-bookmark-line-duotone.svg"
import solarSettingsBoldDuotone from "~icons/solar/settings-bold-duotone.svg"
import solarSettingsLineDuotone from "~icons/solar/settings-line-duotone.svg"
import solarUserCircleBoldDuotone from "~icons/solar/user-circle-bold-duotone.svg"
import solarUserCircleLineDuotone from "~icons/solar/user-circle-line-duotone.svg"
import solarUserHeartBoldDuotone from "~icons/solar/user-heart-bold-duotone.svg"
import solarUserHeartLineDuotone from "~icons/solar/user-heart-line-duotone.svg"
import solarUserLineDuotone from "~icons/solar/user-line-duotone.svg"
import solarUserRoundedBoldDuotone from "~icons/solar/user-rounded-bold-duotone.svg"

export const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL
export const SUPABASE_PROJECT_KEY = process.env.SUPABASE_PROJECT_KEY

// eslint-disable-next-line @typescript-eslint/ban-types
export type Icon = FunctionalComponent<SVGAttributes, {}>

const iconHome = [solarHomeSmileBroken, solarHomeSmileBoldDuotone] as [
  Icon,
  Icon,
]
const iconSearch = [iconamoonSearch, iconamoonSearchDuotone] as [Icon, Icon]
const iconBox = [
  solarBoxMinimalisticBroken,
  solarBoxMinimalisticBoldDuotone,
] as [Icon, Icon]
const iconLibrary = [solarLibraryLineDuotone, solarLibraryBoldDuotone] as [
  Icon,
  Icon,
]
const iconUser = [solarUserLineDuotone, solarUserRoundedBoldDuotone] as [
  Icon,
  Icon,
]
const iconFire = [solarFireLineDuotone, solarFireBoldDuotone] as [Icon, Icon]
const iconHistory = [solarHistoryLineDuotone, solarHistoryBoldDuotone] as [
  Icon,
  Icon,
]
const iconFavorite = [
  solarFolderFavouriteStarLineDuotone,
  solarFolderFavouriteStarBoldDuotone,
] as [Icon, Icon]
const iconDownload = [
  solarDownloadMinimalisticLineDuotone,
  solarDownloadMinimalisticBoldDuotone,
] as [Icon, Icon]
const iconDocument = [
  solarDocumentTextLineDuotone,
  solarDocumentTextBoldDuotone,
] as [Icon, Icon]
const iconUserHeart = [
  solarUserHeartLineDuotone,
  solarUserHeartBoldDuotone,
] as [Icon, Icon]
const iconSettings = [solarSettingsLineDuotone, solarSettingsBoldDuotone] as [
  Icon,
  Icon,
]
const iconInfoCircle = [
  solarInfoCircleLineDuotone,
  solarInfoCircleBoldDuotone,
] as [Icon, Icon]
const iconCodeBold = [solarCodeBoldDuotone, solarCodeBoldDuotone] as [
  Icon,
  Icon,
]
const iconBug = [solarBugLineDuotone, solarBugBoldDuotone] as [Icon, Icon]
const iconNotebook = [
  solarNotebookBookmarkLineDuotone,
  solarNotebookBookmarkBoldDuotone,
] as [Icon, Icon]
const iconTranslate = [phTranslateDuotone, phTranslateDuotone] as [Icon, Icon]
const iconUserCircle = [
  solarUserCircleLineDuotone,
  solarUserCircleBoldDuotone,
] as [Icon, Icon]

export const Icons: Record<string, [Icon, Icon]> = {
  home: iconHome,
  search: iconSearch,
  box: iconBox,
  library: iconLibrary,
  user: iconUser,
  fire: iconFire,
  history: iconHistory,
  favorite: iconFavorite,
  download: iconDownload,
  document: iconDocument,
  user_heart: iconUserHeart,
  settings: iconSettings,
  info_circle: iconInfoCircle,
  code_bold: iconCodeBold,
  bug: iconBug,
  notebook: iconNotebook,
  translate: iconTranslate,
  user_circle: iconUserCircle,
}

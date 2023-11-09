import type { FunctionalComponent, SVGAttributes } from "vue"

import icBaselineVpnKey from "~icons/ic/baseline-vpn-key"
import icOutlineVpnKey from "~icons/ic/outline-vpn-key"
import iconamoonSearch from "~icons/iconamoon/search"
import iconamoonSearchDuotone from "~icons/iconamoon/search-duotone"
import mingcutePlugin2Line from "~icons/mingcute/plugin-2-line"
import phTranslateDuotone from "~icons/ph/translate-duotone"
import solarBoxMinimalisticBoldDuotone from "~icons/solar/box-minimalistic-bold-duotone"
import solarBoxMinimalisticBroken from "~icons/solar/box-minimalistic-broken"
import solarBugBoldDuotone from "~icons/solar/bug-bold-duotone"
import solarBugLineDuotone from "~icons/solar/bug-line-duotone"
import solarCodeBoldDuotone from "~icons/solar/code-bold-duotone"
import solarDocumentTextBoldDuotone from "~icons/solar/document-text-bold-duotone"
import solarDocumentTextLineDuotone from "~icons/solar/document-text-line-duotone"
import solarDownloadMinimalisticBoldDuotone from "~icons/solar/download-minimalistic-bold-duotone"
import solarDownloadMinimalisticLineDuotone from "~icons/solar/download-minimalistic-line-duotone"
import solarFireBoldDuotone from "~icons/solar/fire-bold-duotone"
import solarFireLineDuotone from "~icons/solar/fire-line-duotone"
import solarFolderFavouriteStarBoldDuotone from "~icons/solar/folder-favourite-star-bold-duotone"
import solarFolderFavouriteStarLineDuotone from "~icons/solar/folder-favourite-star-line-duotone"
import solarHistoryBoldDuotone from "~icons/solar/history-bold-duotone"
import solarHistoryLineDuotone from "~icons/solar/history-line-duotone"
import solarHomeSmileBoldDuotone from "~icons/solar/home-smile-bold-duotone"
import solarHomeSmileBroken from "~icons/solar/home-smile-broken"
import solarInfoCircleBoldDuotone from "~icons/solar/info-circle-bold-duotone"
import solarInfoCircleLineDuotone from "~icons/solar/info-circle-line-duotone"
import solarLibraryBoldDuotone from "~icons/solar/library-bold-duotone"
import solarLibraryLineDuotone from "~icons/solar/library-line-duotone"
import solarNotebookBookmarkBoldDuotone from "~icons/solar/notebook-bookmark-bold-duotone"
import solarNotebookBookmarkLineDuotone from "~icons/solar/notebook-bookmark-line-duotone"
import solarSettingsBoldDuotone from "~icons/solar/settings-bold-duotone"
import solarSettingsLineDuotone from "~icons/solar/settings-line-duotone"
import solarUserCircleBoldDuotone from "~icons/solar/user-circle-bold-duotone"
import solarUserCircleLineDuotone from "~icons/solar/user-circle-line-duotone"
import solarUserHeartBoldDuotone from "~icons/solar/user-heart-bold-duotone"
import solarUserHeartLineDuotone from "~icons/solar/user-heart-line-duotone"
import solarUserLineDuotone from "~icons/solar/user-line-duotone"
import solarUserRoundedBoldDuotone from "~icons/solar/user-rounded-bold-duotone"

// eslint-disable-next-line @typescript-eslint/ban-types
export type Icon = FunctionalComponent<SVGAttributes, {}>

const iconHome = [solarHomeSmileBroken, solarHomeSmileBoldDuotone] as [
  Icon,
  Icon
]
const iconSearch = [iconamoonSearch, iconamoonSearchDuotone] as [Icon, Icon]
const iconBox = [
  solarBoxMinimalisticBroken,
  solarBoxMinimalisticBoldDuotone
] as [Icon, Icon]
const iconLibrary = [solarLibraryLineDuotone, solarLibraryBoldDuotone] as [
  Icon,
  Icon
]
const iconUser = [solarUserLineDuotone, solarUserRoundedBoldDuotone] as [
  Icon,
  Icon
]
const iconFire = [solarFireLineDuotone, solarFireBoldDuotone] as [Icon, Icon]
const iconHistory = [solarHistoryLineDuotone, solarHistoryBoldDuotone] as [
  Icon,
  Icon
]
const iconFavorite = [
  solarFolderFavouriteStarLineDuotone,
  solarFolderFavouriteStarBoldDuotone
] as [Icon, Icon]
const iconDownload = [
  solarDownloadMinimalisticLineDuotone,
  solarDownloadMinimalisticBoldDuotone
] as [Icon, Icon]
const iconDocument = [
  solarDocumentTextLineDuotone,
  solarDocumentTextBoldDuotone
] as [Icon, Icon]
const iconUserHeart = [
  solarUserHeartLineDuotone,
  solarUserHeartBoldDuotone
] as [Icon, Icon]
const iconSettings = [solarSettingsLineDuotone, solarSettingsBoldDuotone] as [
  Icon,
  Icon
]
const iconInfoCircle = [
  solarInfoCircleLineDuotone,
  solarInfoCircleBoldDuotone
] as [Icon, Icon]
const iconCodeBold = [solarCodeBoldDuotone, solarCodeBoldDuotone] as [
  Icon,
  Icon
]
const iconBug = [solarBugLineDuotone, solarBugBoldDuotone] as [Icon, Icon]
const iconNotebook = [
  solarNotebookBookmarkLineDuotone,
  solarNotebookBookmarkBoldDuotone
] as [Icon, Icon]
const iconTranslate = [phTranslateDuotone, phTranslateDuotone] as [Icon, Icon]
const iconUserCircle = [
  solarUserCircleLineDuotone,
  solarUserCircleBoldDuotone
] as [Icon, Icon]
const iconMingcute = [mingcutePlugin2Line, mingcutePlugin2Line] as [Icon, Icon]
const iconVPN = [icOutlineVpnKey, icBaselineVpnKey] as [Icon, Icon]

export const Icons = {
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
  mingcute: iconMingcute,
  vpn: iconVPN
} as const

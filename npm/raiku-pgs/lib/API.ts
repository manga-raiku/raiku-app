import type { GetOption, Http, PostOption } from "client-ext-animevsub-helper"
import type { LocationQueryRaw } from "vue-router"

export type ID = `${string}`

export interface RouteComicChap {
  name: "comic chap"
  params: {
    sourceId: string
    comic: string
    chap: string
  }
  query?: LocationQueryRaw
}
export interface RouteComic {
  name: "comic"
  params: {
    sourceId: string
    comic: string
  }
  query?: LocationQueryRaw
}
export interface RouteGenre {
  name: "genre"
  params: {
    sourceId: string
    type: string
  }
  query?: LocationQueryRaw
}
export interface RouteAuthor {
  name: "author"
  params: {
    sourceId: string
    type: string
  }
  query?: LocationQueryRaw
}

export interface Genre {
  readonly name: string
  readonly route: RouteGenre
  readonly description?: string
}

export interface Chapter {
  readonly name: string
  readonly route: RouteComicChap
  readonly id: ID
  readonly updated_at: number | null
  readonly views: number | null
}
export interface MetaManga {
  readonly route: RouteComic | RouteComicChap
  readonly image: string
  readonly name: string
  readonly othername: string | null
  readonly tags: string[] | Genre[]
  readonly status: string | null
  readonly author: string | null
  readonly description: string
  readonly last_chapters: Chapter[]
  readonly views: number | null
  readonly comments: number | null
  readonly likes: number | null
  readonly label: string | null
}

export interface Comment {
  readonly id: ID
  readonly author: Readonly<{
    avatar: string
    name: string
    level: {
      current: number
      perNext: number
    } | null
    chapter: string
  }>
  readonly content: string | null
  readonly like: number
  readonly dislike: number
  readonly created_at: number
  readonly replies: Comment[] | number
  readonly chapter_name: string | null
}

export interface QuicklyItem {
  readonly route: RouteComic | RouteComicChap
  readonly name: string
  readonly image: string
  readonly last_chapter: string
  readonly othername: string | null
  readonly tags: string[] | Genre[]
}

export interface FilterURI {
  readonly type: string
  readonly select: {
    readonly route: RouteGenre
    readonly name: string
    readonly title?: string
  }[]
}
export interface FilterQuery {
  readonly type: string
  readonly key: string
  readonly items: {
    readonly value: string
    readonly name: string
    readonly title?: string
  }[]
}
export interface AppInfo {
  readonly mode: "spa" | "pwa" | "capacitor"
  readonly extension: boolean
  readonly native: boolean
  readonly standalone: boolean
  readonly version: string
}

export interface Server {
  readonly name: string
  readonly has: (
    // eslint-disable-next-line no-use-before-define
    conf: ComicChapter
  ) => Promise<boolean> | boolean
  readonly parse: (
    // eslint-disable-next-line no-use-before-define
    conf: ComicChapter
  ) => Promise<readonly string[]> | readonly string[]
}
export interface Ranking {
  readonly value: string
  readonly match: string
  readonly name: Record<string, string>
}
export type MayBeArray<T> = T | T[]
export interface Replacer {
  readonly from: readonly string[]
  readonly with: string
}
export interface Package {
  readonly name: string
  readonly id: string
  readonly favicon: string
  readonly version: string
  readonly description: string
  readonly isNSFW: boolean
  /** @description Example: `ja`, `en` */
  readonly language: string
  readonly support: boolean | MayBeArray<"pwa" | "extension" | "native">

  readonly author: string

  readonly updatedAt: number

  readonly resolveImage?: readonly Replacer[]

  readonly supportGetMode?: boolean

  readonly homepage?: string
  readonly repository?: string

  readonly license?: string
}

type Response<Type extends GetOption["responseType"]> = Omit<
  Awaited<ReturnType<typeof Http.get>>,
  "data"
> & {
  data: Type extends "json"
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : Type extends "arraybuffer"
    ? ArrayBuffer
    : string
}

export interface FetchGet<
  ReturnType extends GetOption["responseType"] | undefined
> {
  (
    options: Omit<GetOption, "responseType"> & {
      responseType?: ReturnType
    }
  ): Promise<Response<ReturnType>>
}
export interface FetchPost<
  ReturnType extends GetOption["responseType"] | undefined
> {
  (
    options: Omit<PostOption, "responseType"> & {
      responseType?: ReturnType
    }
  ): Promise<Response<ReturnType>>
}

// page fully
export interface Comic {
  readonly name: string
  readonly othername: string | null
  readonly manga_id: ID
  readonly updated_at: number
  readonly image: string
  readonly author: readonly {
    readonly name: string
    readonly route: RouteAuthor
  }[]
  readonly status: string | null
  readonly genres: {
    readonly name: string
    readonly route: RouteGenre
  }[]
  readonly views: number | null
  readonly rate: {
    readonly cur: number
    readonly max: number
    readonly count: number
  }
  readonly follows: number | null
  readonly likes: number | null
  readonly description: string
  readonly chapters: readonly Chapter[]

  readonly comments: readonly Comment[]
  readonly comments_count: number
  readonly comments_pages: number
}
export interface ComicChapter {
  readonly name: string
  readonly manga_id: ID
  readonly ep_id: ID
  readonly updated_at: number
  readonly image: string

  readonly path_manga: RouteComic

  readonly pages: Readonly<
    {
      src: string
      original?: string
      cdn?: string
    }[]
  >

  readonly cdn?: string
  readonly cdn2?: string

  readonly comments: readonly Comment[]
  readonly comments_count: number
  readonly comments_pages: number

  readonly mode?: {
    readonly singlePage?: boolean
    readonly rightToLeft?: boolean
    readonly scrollingMode?: boolean
  }
}
export interface General {
  readonly name: string
  readonly description: string
  readonly curPage: number
  readonly maxPage: number
  readonly items: readonly MetaManga[]
  readonly filters: readonly (FilterURI | FilterQuery)[]
}
export interface Comments {
  readonly comments: readonly Comment[]
  readonly comments_count: number
  readonly comments_pages: number
}

export declare class API<AutoFetchComicIsManga extends boolean = false> {
  // public readonly package: Package

  public readonly Servers: readonly Server[]
  public readonly Rankings: readonly Ranking[]

  public readonly autoFetchComicIsManga: AutoFetchComicIsManga

  setup(): Promise<void>

  index(): Promise<
    Readonly<{
      sliders: MetaManga[]
      hot: MetaManga[]
      last_update: MetaManga[]
    }>
  >

  getComic(zlugComic: ID): Promise<Comic>
  getModeReader?(
    comic: string,
    sourceId: string,
    comicData: AutoFetchComicIsManga extends true ? Comic : undefined
  ): Promise<{
    readonly singlePage?: boolean
    readonly rightToLeft?: boolean
    readonly scrollingMode?: boolean
  }>
  getComicChapter<Fast extends boolean>(
    zlugComic: ID,
    chap: ID,
    fast: Fast
  ): Promise<
    Fast extends true
      ? ComicChapter
      : ComicChapter & {
          readonly chapters: Chapter[]
        }
  >
  getComicComments(
    comicId: number,
    orderByNews: boolean,
    chapterId: number,
    parentId: number,
    page: number,
    comicKey: string
  ): Promise<Comments>
  getListChapters(mangaId: ID, comic: string): Promise<Chapter[]>
  searchQuickly(keyword: string, page: number): Promise<readonly QuicklyItem[]>
  search(keyword: string, page: number): Promise<General>
  getRanking(
    type: string,
    page: number,
    filter: Record<string, string>
  ): Promise<General>
  getCategory(
    type: string,
    page: number,
    filter: Record<string, string>
  ): Promise<General>
}

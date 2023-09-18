export type ID = `${string}`

export interface Anchor {
  readonly path: string
  readonly name: string
}

export interface Chapter extends Anchor {
  readonly id: ID
  readonly updated_at: number | null
  readonly views: number | null
}
export interface MetaManga {
  readonly path: string
  readonly image: string
  readonly name: string
  readonly othername: string
  readonly tags: string[]
  readonly status: string
  readonly author: string
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
    }
    chapter: string
  }>
  readonly content: string | null
  readonly like: number
  readonly dislike: number
  readonly created_at: number
  readonly replies: Comment[]
  readonly chapter_name: string | null
}

export interface FilterURI {
  readonly type: string
  readonly select: {
    readonly path: string
    readonly name: string
  }[]
}
export interface FilterQuery {
  readonly type: string
  readonly key: string
  readonly items: {
    readonly value: string
    readonly name: string
  }[]
}

export interface Server {
  readonly name: string
  // eslint-disable-next-line no-use-before-define
  readonly has: (page: ComicChapter["pages"][0], conf: ComicChapter) => boolean
  // eslint-disable-next-line no-use-before-define
  readonly parse: (page: ComicChapter["pages"][0], conf: ComicChapter) => string
}
export interface Ranking {
  readonly value: string
  readonly match: string
  readonly name: Record<string, string>
}
export interface Package {
  readonly name: string
  readonly favicon: string
  readonly version: string
  readonly description: string
  readonly source: string

  readonly author: string

  readonly updatedAt: number

  readonly homepage?: string
  readonly repository?: string

  readonly license?: string
}

// page fully
export interface Comic {
  readonly name: string
  readonly othername: string
  readonly manga_id: ID
  readonly updated_at: number
  readonly image: string
  readonly author: Anchor[]
  readonly status: string
  readonly genres: readonly Anchor[]
  readonly views: number | null
  readonly rate: {
    readonly cur: number
    readonly max: number
    readonly count: number
  }
  readonly follows: number | null
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

  readonly path_manga: string

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
}
export interface General {
  readonly name: string
  readonly description: string
  readonly curPage: number
  readonly maxPage: number
  readonly items: readonly MetaManga[]
  readonly filters: readonly (FilterURI | FilterQuery)[]
}

export declare class API {
  public readonly package: Package

  public readonly Servers: readonly Server[]
  public readonly Rankings: readonly Ranking[]
  // static readonly repo

  index(): Promise<
    Readonly<{
      sliders: MetaManga[]
      hot: MetaManga[]
      last_update: MetaManga[]
    }>
  >

  /** @category - helper */
  public resolveUrlComicChapter(url: string): {
    readonly mangaId: ID
    readonly epId: ID
  }

  getComic(mangaId: ID): Promise<Comic>
  getComicChapter<Fast extends boolean>(
    mangaId: ID,
    chapId: ID,
    fast: Fast,
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
    comicKey: string,
  ): Promise<{
    readonly comments: readonly Comment[]
    readonly comments_count: number
    readonly comments_pages: number
  }>
  getListChapters(mangaId: ID): Promise<Chapter[]>
  searchQuickly(
    keyword: string,
    page: number,
  ): Promise<
    readonly {
      readonly path: string
      readonly name: string
      readonly image: string
      readonly last_chapter: string
      readonly othername: string
      readonly tags: string[]
    }[]
  >
  search(keyword: string, page: number): Promise<General>
  getRanking(
    type: string,
    page: number,
    filter: Record<string, string>,
  ): Promise<General>
  getCategory(
    type: string,
    page: number,
    filter: Record<string, string>,
  ): Promise<General>
}

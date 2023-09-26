/* eslint-disable camelcase */
import type { API, Comment } from "raiku-pgs/plugin"
import { PostWorker } from "raiku-pgs/plugin"

import Parse from "../../../parsers/truyen-tranh/comment/get"

export default async function GetComment(
  { get }: Pick<API, "get">,
  comicId: number,
  orderByNews: boolean,
  chapterId = -1,
  parentId = 0,
  page: number,
  comicKey: string,
): Promise<{
  readonly comments: readonly Comment[]
  readonly comments_count: number
  readonly comments_pages: number
}> {
  const { data } = await get({
    url: `https://www.nettruyenmax.com/Comic/Services/CommentService.asmx/List?comicId=${comicId}&orderBy=${
      orderByNews ? 5 : 0
    }&chapterId=${chapterId}&parentId=${parentId}&pageNumber=${page}&token=${comicKey}`,
  })

  const { commentCount: comments_count, pager, response } = JSON.parse(data)

  return {
    comments_count: parseInt(comments_count),
    comments_pages: parseInt(pager.slice(pager.indexOf('a href="#') >>> 0, 2)),
    comments: await Parse(response, Date.now()),
  }
}

/* eslint-disable camelcase */
import { PostWorker } from "src/apis/wrap-worker"

import type Parse from "../../../parsers/truyen-tranh/comment/get"
import Worker from "../../../workers/truyen-tranh/comment/get?worker"

export default async function GetComment(
  comicId: number,
  orderByNews: boolean,
  chapterId = -1,
  parentId = 0,
  page: number,
  comicKey: string,
) {
  const { data } = await get(
    `https://www.nettruyenmax.com/Comic/Services/CommentService.asmx/List?comicId=${comicId}&orderBy=${
      orderByNews ? 5 : 0
    }&chapterId=${chapterId}&parentId=${parentId}&pageNumber=${page}&token=${comicKey}`,
  )

  const { commentCount: comments_count, pager, response } = JSON.parse(data)

  return {
    comments_count: parseInt(comments_count),
    comments_page_number: parseInt(
      pager.slice(pager.indexOf('a href="#') >>> 0, 2),
    ),
    comments: await PostWorker<typeof Parse>(Worker, response, Date.now()),
  }
}

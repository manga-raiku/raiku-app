import type dayjs from "dayjs"

export interface CardProps {
  data: {
    image: string
    path: string
    name: string
    othername: string
    tags: string[]
    status: string
    description: string
    last_chapters: {
      name: string
      updated_at: number | null
      path: string
    }[]
    views: number | null
    comments: number | null
    likes: number | null
    hot: boolean
    visited: {
      name: string
      path: string
    } | null
    author: string | null
  }
}

export interface CardProps {
  data: {
    path: string
    image: string
    name: string
    last_chapter: {
      path: string
      name: string
    }
    updated: number | null
    hot?: string
    status?: string | null
    views: number | null
    label?: string | null
    follows: number | null
    tags?: string[]
    description: string | null
  }
}

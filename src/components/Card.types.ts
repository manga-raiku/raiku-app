export interface CardProps {
  data: {
    path: string
    image: string
    name: string
    last_chapter: {
      path: string
      name: string
    }
    updated: number
    hot?: string
    status?: string
    views: number | null
    label?: string | null
    follows: number | null
    tags?: string[]
    description: string | null
  }
}

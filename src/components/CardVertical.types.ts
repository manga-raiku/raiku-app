import type { CardProps } from "./Card.types"

export interface CardVerticalProps {
  data: Pick<
    CardProps["data"],
    | "path"
    | "image"
    | "last_chapter"
    | "label"
    | "name"
    | "updated"
    | "views"
    | "follows"
    | "description"
  >
}

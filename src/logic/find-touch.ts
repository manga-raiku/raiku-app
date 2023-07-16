export function findTouch(touches: Touches[], touch: Touch) {
  for (const t of touches) if (t.identifier === touch.identifier) return t
}

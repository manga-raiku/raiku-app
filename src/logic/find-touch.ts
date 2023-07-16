export function findTouch(touches: TouchList, touch: Touch) {
  for (const t of touches) if (t.identifier === touch.identifier) return t
}

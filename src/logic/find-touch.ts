export function findTouch(touches: TouchList, touch: Touch) {
  for (let i = 0; i < touches.length; i++)
    if (touches[i].identifier === touch.identifier) return touches[i]
}

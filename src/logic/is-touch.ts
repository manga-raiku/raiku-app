export function isTouch(touch: MouseEvent | Touch): touch is Touch {
  return toType(touch) === "Touch"
}

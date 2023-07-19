interface Offset {
  x: number
  y: number
}

export function useScrollInertia(
  diffXZoom: Ref<number>,
  diffYZoom: Ref<number>,
  mouseZooming: Ref<boolean>
) {
  let request: number | null = null
  return (
    touch: Touch | MouseEvent,
    last2Mouse: Readonly<Offset>,
    last2Time: number
  ) => {
    if (request) cancelAnimationFrame(request)

    let speedX =
      ((touch.clientX - last2Mouse.x) / (Date.now() - last2Time)) * 10
    let speedY =
      ((touch.clientY - last2Mouse.y) / (Date.now() - last2Time)) * 10
    const isScrollXDown = speedX < 0
    const isScrollYDown = speedY < 0
    const spreadXDetail = isScrollXDown ? 0.5 : -0.5
    const spreadYDetail = isScrollYDown ? 0.5 : -0.5

    function loop() {
      if (isScrollXDown ? speedX > 0 : speedX < 0) speedX = 0
      else {
        diffXZoom.value += speedX
        speedX += spreadXDetail
      }

      if (isScrollYDown ? speedY > 0 : speedY < 0) speedY = 0
      else {
        diffYZoom.value += speedY
        speedY += spreadYDetail
      }

      if (speedX === 0 && speedY === 0) {
        mouseZooming.value = false
        return
      }

      request = requestAnimationFrame(loop)
    }
    loop()
  }
}

const { find } = Array.prototype

export function useTouchZoom() {
  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)
  const touching = ref(false)

  let firstTouch: Touch | null = null
  let twoTouch: Touch | null = null
  let diffStart = 0

  function onTouchStart(event: TouchEvent) {
    if (firstTouch && twoTouch) return

    twoTouch = firstTouch
      ? event.touches[
          (find.call(
            event.touches,
            (item) => item.identifier === firstTouch?.identifier
          ) >>>
            0) +
            1
        ]
      : null

    if (!twoTouch) {
      firstTouch = event.touches[0]
      return
    }

    diffStart = Math.hypot(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      twoTouch.clientX - firstTouch!.clientX,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      twoTouch.clientY - firstTouch!.clientY
    )

    touching.value = true

    console.log("[useTouchZoom]: ", { firstTouch, twoTouch })
  }
  function onTouchMove(event: TouchEvent) {
    if (!firstTouch || !twoTouch) {
      firstTouch = null
      twoTouch = null
      return
    }

    event.preventDefault()

    const first = find.call(
      event.touches,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (item) => item.identifier === firstTouch!.identifier
    )
    const two = find.call(
      event.touches,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (item) => item.identifier === twoTouch!.identifier
    )

    // console.log({ firstTouch, twoTouch, first, two })
    if (!first || !two) {
      firstTouch = null
      twoTouch = null
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { clientX: x1, clientY: y1 } = first!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { clientX: x2, clientY: y2 } = two!

    const dx = x2 - x1
    const dy = y2 - y1

    scale.value = Math.round(((Math.hypot(dx, dy) - diffStart) / 1000) * 100)
    translateX.value = (x1 + x2) / 2
    translateY.value = (y1 + y2) / 2

    console.log({ scale: scale.value })
  }
  function onTouchEnd(event: TouchEvent) {
    if (
      (firstTouch || twoTouch) &&
      find.call(
        event.changedTouches,
        (item) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          item.identifier === firstTouch!.identifier ||
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          item.identifier === twoTouch!.identifier
      )
    ) {
      firstTouch = twoTouch = null
      diffStart = 0
      touching.value = false
    }

    console.log("[useTouchZoom]: touch end")
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    scale,
    translateX,
    translateY,
    touching
  }
}

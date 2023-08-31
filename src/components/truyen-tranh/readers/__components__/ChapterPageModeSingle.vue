<template>
  <div
    class="w-1/2 h-full display-inline-block overflow-hidden relative"
    :class="{
      'w-full': true,
    }"
    ref="parentRef"
    @mousedown.prevent="onTouchStart"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend.passive="onTouchEnd"
    @wheel="onWheel"
  >
    <div
      class="relative top-1/2 left-1/2"
      ref="overflowRef"
      :style="{
        width: `${zoom}%`,
        height: `${zoom}%`,
        transform: `translate(${-oWidthH + diffXZoom}px, ${
          -oHeightH + diffYZoom
        }px)`,
        'transition-property': mouseZooming
          ? 'width,height'
          : 'width,height,transform',
        'transition-duration': mouseZooming
          ? '444ms,444ms,0ms'
          : '444ms,444ms,170ms',
      }"
    >
      <PageView
        class="object-scale-down h-full mx-auto"
        :src="src"
        @load="image => emit('load', image)"
      >
        <template #loading>
          <slot name="loading" />
        </template>
      </PageView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useElementSize, useEventListener } from "@vueuse/core"
import { useClamp } from "@vueuse/math"

defineProps<{
  src: string
}>()
const emit = defineEmits<{
  (name: "load", image: HTMLImageElement): void
  (name: "update:can-swipe", value: "R" | "L" | "A" | null): void
}>()

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()
const { width: pWidth, height: pHeight } = useElementSize(parentRef)
const { width: oWidth, height: oHeight } = useElementSize(overflowRef)

const mouseZooming = ref(false)
const moving = ref(false)

const oWidthH = computed(() => oWidth.value / 2)
const oHeightH = computed(() => oHeight.value / 2)

const zoom = ref(120.0)

const minDiffX = computed(() => Math.min(0, (pWidth.value - oWidth.value) / 2))
const minDiffY = computed(() =>
  Math.min(0, (pHeight.value - oHeight.value) / 2),
)
const maxDiffX = computed(() => -minDiffX.value)
const maxDiffY = computed(() => -minDiffY.value)

const diffXZoom = useClamp(0, minDiffX, maxDiffX)
const diffYZoom = useClamp(0, minDiffY, maxDiffY)

const scrollInertia = useScrollInertia(diffXZoom, diffYZoom, mouseZooming)

let last2Mouse: Readonly<{ x: number; y: number }> | null = null
let lastMouse: Readonly<{ x: number; y: number }> | null = null
let last2Time: number | null = null
let lastTime: number | null = null

let lastStartTouch: Touch | null = null
// eslint-disable-next-line no-use-before-define
let canGo: typeof canSwipe.value = null
const lastMouseDiff: { x: number; y: number } = { x: 0, y: 0 }
function onTouchStart(event: TouchEvent | MouseEvent) {
  if (lastStartTouch) return

  lastStartTouch = (event as TouchEvent).touches?.[0] ?? event

  canGo = canSwipe.value // canSwipe.value
  // if (canSwipe.value) {
  moving.value = true
  // } else {
  ;[lastMouseDiff.x, lastMouseDiff.y] = [diffXZoom.value, diffYZoom.value]
  console.log("log")
  // }
}
function onTouchMove(event: TouchEvent | MouseEvent) {
  if (!lastStartTouch) return

  const lastIsTouch = isTouch(lastStartTouch)
  const currIsTouch = isTouchEvent(event)

  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch ? findTouch(event.touches, lastStartTouch) : event
  if (!touch) return

  // if (event.touches?.length > 2) {
  //   return
  // }

  if (
    !canGo ||
    (canGo !== "A" &&
      !(
        (canGo === "R" && touch.clientX < lastStartTouch.clientX) ||
        (canGo === "L" && touch.clientX > lastStartTouch.clientX)
      ))
  ) {
    const [diffX, diffY] = [
      touch.clientX - lastStartTouch.clientX,
      touch.clientY - lastStartTouch.clientY,
    ]
    console.log(diffX, diffY)
    mouseZooming.value = true
    console.log("suff ", lastMouseDiff.x + diffX, diffX)
    diffXZoom.value = lastMouseDiff.x + diffX
    diffYZoom.value = lastMouseDiff.y + diffY

    last2Mouse = lastMouse
    lastMouse = { x: touch.clientX, y: touch.clientY }
    last2Time = lastTime
    lastTime = Date.now()
  }
}
function onTouchEnd(event: TouchEvent | MouseEvent) {
  if (!lastStartTouch) return

  const lastIsTouch = isTouch(lastStartTouch)
  const currIsTouch = isTouchEvent(event)

  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch
    ? findTouch(event.changedTouches, lastStartTouch)
    : event
  if (!touch) return

  moving.value = false
  lastStartTouch = null
  // mouseZooming.value = false
  lastStartTouch = null

  if (last2Mouse && last2Time) scrollInertia(touch, last2Mouse, last2Time)
  last2Mouse = null
  last2Time = null
  canGo = null
  // }
}
const canSwipe = computed<"R" | "L" | "A" | null>(() => {
  const L = diffXZoom.value === maxDiffX.value
  const R = diffXZoom.value === minDiffX.value

  if (R && L) return "A"
  if (R) return "R"
  if (L) return "L"

  return null
})
watch(canSwipe, (can) => emit("update:can-swipe", can))

function onWheel(event: WheelEvent) {
  if (event.ctrlKey) event.preventDefault()
  ;(event.ctrlKey ? diffXZoom : diffYZoom).value += -event.deltaY / 2
  console.log(event)
}

useEventListener(window, "mousemove", onTouchMove)
useEventListener(window, "mouseup", onTouchEnd)
</script>

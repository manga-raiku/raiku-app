<template>
  <section
    class="h-full overflow-hidden relative"
    ref="parentRef"
    @mousedown.prevent="onTouchStart"
    @wheel="onWheel"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend.passive="onTouchEnd"
  >
    <section
      class="transition-width,transform relative top-0 left-1/2"
      :style="{
        width: `${zoom}%`,
        transform: `translate(${-oWidthH + diffXZoom}px, ${
          /*-oHeightH +*/ diffYZoom
        }px)`,
        'transition-property': mouseZooming ? 'width' : 'width,transform',
        'transition-duration': mouseZooming ? '444ms,0ms' : '444ms,170ms',
      }"
      ref="overflowRef"
    >
      <PageView
        v-for="(item, index) in pages"
        :key="item"
        class="object-cover display-block mx-auto"
        :src="item"
        @load="
          sizes.set(index, [
            ($event.target as HTMLImageElement)!.naturalWidth,
            ($event.target as HTMLImageElement)!.naturalHeight,
          ])
        "
        :style="{
          width: sizes.has(index)
            ? `${(sizes.get(index)?.[0]! * zoom) / 100}px`
            : widthImageDefault,
          height: sizes.has(index) ? undefined : heightImageDefault,
        }"
      />
    </section>
  </section>
</template>

<script lang="ts" setup>
import { useElementSize, useEventListener } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { debounce } from "quasar"

const props = defineProps<{
  pages: string[]
  currentPage: number
  zoom: number
}>()
const emit = defineEmits<{
  (name: "update:zoom", value: number): void
  (name: "update:current-page", value: number): void
  // (name: "prev"): void
  // (name: "next"): void
}>()

const sizes = shallowReactive<Map<number, readonly [number, number]>>(new Map())
watch(
  () => props.pages,
  () => sizes.clear()
)

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()
const { width: pWidth, height: pHeight } = useElementSize(parentRef)
const { width: oWidth, height: oHeight } = useElementSize(overflowRef)

const oWidthH = computed(() => oWidth.value / 2)

const widthImageDefault = computed(
  () => sizes.get(0)?.[0] ?? pWidth.value * 0.8
)
const heightImageDefault = computed(
  () => sizes.get(0)?.[1] ?? pHeight.value * 0.8
)

const minDiffX = computed(() => Math.min(0, (pWidth.value - oWidth.value) / 2))
const minDiffY = computed(
  () => Math.min(0, pHeight.value - oHeight.value) /* / 2 */
)
const maxDiffX = computed(() => -minDiffX.value)
const maxDiffY = computed(() => 0 /* -minDiffY.value */)

const diffXZoom = useClamp(0, minDiffX, maxDiffX)
const diffYZoom = useClamp(0, minDiffY, maxDiffY)
const mouseZooming = ref(false)
const scrollInertia = useScrollInertia(diffXZoom, diffYZoom, mouseZooming)

let lastStartTouch: Touch | MouseEvent | null = null
function onTouchStart(event: TouchEvent | MouseEvent) {
  if (mouseDowned) return
  mouseDowned = true

  lastStartTouch = isTouchEvent(event) ? event.touches?.[0] : event
  ;[lastMouseDiff.x, lastMouseDiff.y] = [diffXZoom.value, diffYZoom.value]
  console.log("log")
}
function onTouchMove(event: TouchEvent) {
  if (!mouseDowned || !lastStartTouch) return
  const lastIsTouch = isTouch(lastStartTouch)
  const currIsTouch = isTouchEvent(event)

  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch
    ? findTouch(event.touches, lastStartTouch as Touch)
    : event
  if (!touch) return

  const [diffX, diffY] = [
    touch.clientX - lastStartTouch.clientX,
    touch.clientY - lastStartTouch.clientY,
  ]

  mouseZooming.value = true
  diffXZoom.value = lastMouseDiff.x + diffX
  diffYZoom.value = lastMouseDiff.y + diffY

  last2Mouse = lastMouse
  lastMouse = { x: touch.clientX, y: touch.clientY }
  last2Time = lastTime
  lastTime = Date.now()
}
function onTouchEnd(event: TouchEvent) {
  if (!mouseDowned || !lastStartTouch) return
  mouseDowned = false

  const lastIsTouch = isTouch(lastStartTouch)
  const currIsTouch = isTouchEvent(event)
  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch
    ? findTouch(event.changedTouches, lastStartTouch as Touch)
    : event
  if (!touch) return

  if (last2Mouse && last2Time) scrollInertia(touch, last2Mouse, last2Time)

  // mouseZooming.value = false
  lastStartTouch = null
}

let mouseDowned = false
const lastMouseDiff: { x: number; y: number } = { x: 0, y: 0 }

let last2Mouse: Readonly<{ x: number; y: number }> | null = null
let lastMouse: Readonly<{ x: number; y: number }> | null = null
let last2Time: number | null = null
let lastTime: number | null = null

function onWheel(event: WheelEvent) {
  if (event.altKey || event.ctrlKey) event.preventDefault()
  if (event.ctrlKey) {
    emit("update:zoom", props.zoom + (event.deltaY > 0 ? -5 : 5))
    return
  }

  if (event.altKey) diffXZoom.value += -event.deltaY / 2
  else {
    diffYZoom.value += -event.deltaY
  }
}

useEventListener(window, "mousemove", onTouchMove)
useEventListener(window, "mouseup", onTouchEnd)

// create sort map offset?
const mapOffset = computed(() => {
  const mov: number[] = new Array(props.pages.length)
  let currentY = 0

  const zoom = props.zoom / 100
  for (let i = 0; i < props.pages.length; i++) {
    const d = sizes.get(i)

    mov[i] = currentY
    currentY += d
      ? (d[1] / d[0]) * (Math.min(d[0], oWidth.value) * zoom)
      : heightImageDefault.value
  }

  return mov
})
let disableReactiveCurrentPage = false
watch(
  diffYZoom,
  debounce(async (diffYZoom: number) => {
    const arr = mapOffset.value
    let left = 0
    let right = arr.length - 1
    const positiveDiffYZoom = -diffYZoom * props.zoom/100 + pHeight.value

    while (left !== right) {
      const center = left + ~~(right - left) / 2
      const val = arr[center]

      if (val <= positiveDiffYZoom) {
        left = center + 1
        continue
      }
      right = center
    }

    disableReactiveCurrentPage = true
    emit("update:current-page", left < 1 ? 0 : left - 1)
    await nextTick()
    disableReactiveCurrentPage = false
  }, 200)
)

watch(
  () => props.currentPage,
  (currentPage) => {
    if (disableReactiveCurrentPage) return

    diffYZoom.value = -mapOffset.value[currentPage]
  }
)
</script>

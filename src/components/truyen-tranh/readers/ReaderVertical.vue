<template>
  <section
    class="h-full overflow-hidden relative"
    ref="parentRef"
    @mousedown.prevent="onMouseDown"
    @wheel="onWheel"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend.passive="onTouchEnd"
  >
    <section
      class="transition-width,height,transform relative top-1/2 left-1/2"
      :style="{
        width: `${zoom}%`,
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
      ref="overflowRef"
    >
      <img
        v-for="(item, index) in pages"
        :key="item"
        class="object-cover display-block mx-auto"
        :src="item"
        @load="
          sizes[index] = [
            ($event.target as HTMLImageElement)!.naturalWidth,
            ($event.target as HTMLImageElement)!.naturalHeight,
          ]
        "
        :style="{
          width: `${(sizes[index]?.[0] * zoom) / 100}px`,
        }"
      />
    </section>
  </section>
</template>

<script lang="ts" setup>
import { useElementSize, useEventListener } from "@vueuse/core"
import { useClamp } from "@vueuse/math"

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

const sizes = shallowReactive<Record<string, [number, number]>>(
  Object.create(null)
)

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()
const { width: pWidth, height: pHeight } = useElementSize(parentRef)
const { width: oWidth, height: oHeight } = useElementSize(overflowRef)

const oWidthH = computed(() => oWidth.value / 2)
const oHeightH = computed(() => oHeight.value / 2)

function prev() {
  console.log("prev")
  // emit("prev")
  emit("update:current-page", props.currentPage - 1)
}
function next() {
  console.log("next")
  // emit("next")
  emit("update:current-page", props.currentPage + 1)
}

let lastStartTouch: Touch | null = null
function onTouchStart(event: TouchEvent) {
  if (lastStartTouch) return

  lastStartTouch = event.touches[0]

  lastMouseOff = { x: lastStartTouch.clientX, y: lastStartTouch.clientY }
  ;[lastMouseDiff.x, lastMouseDiff.y] = [diffXZoom.value, diffYZoom.value]
  console.log("log")
}
function onTouchMove(event: TouchEvent) {
  if (!lastStartTouch) return

  const touch = findTouch(event.touches, lastStartTouch)
  if (!touch) return

  const [diffX, diffY] = [
    touch.clientX - lastStartTouch.clientX,
    touch.clientY - lastStartTouch.clientY,
  ]
  console.log(diffX, diffY)
  mouseZooming.value = true
  diffXZoom.value = lastMouseDiff.x + diffX
  diffYZoom.value = lastMouseDiff.y + diffY
}
function onTouchEnd(event: TouchEvent) {
  if (!lastStartTouch) return

  const touch = findTouch(event.changedTouches, lastStartTouch)
  if (!touch) return

  lastStartTouch = null
  mouseZooming.value = false
  lastStartTouch = null
}

const minDiffX = computed(() => (pWidth.value - oWidth.value) / 2)
const minDiffY = computed(() => (pHeight.value - oHeight.value) / 2)
const maxDiffX = computed(() => -minDiffX.value)
const maxDiffY = computed(() => -minDiffY.value)

const diffXZoom = useClamp(0, minDiffX, maxDiffX)
const diffYZoom = useClamp(0, minDiffY, maxDiffY)
const mouseZooming = ref(false)
let mouseDowned = false
let lastMouseOff: { x: number; y: number } | null = null
const lastMouseDiff: { x: number; y: number } = { x: 0, y: 0 }
function onMouseDown(event: MouseEvent) {
  mouseDowned = true

  lastMouseOff = { x: event.clientX, y: event.clientY }
  ;[lastMouseDiff.x, lastMouseDiff.y] = [diffXZoom.value, diffYZoom.value]
  console.log("log")
}
function onMouseMove(event: MouseEvent) {
  if (!mouseDowned || !lastMouseOff) return
  const [diffX, diffY] = [
    event.clientX - lastMouseOff.x,
    event.clientY - lastMouseOff.y,
  ]

  mouseZooming.value = true
  diffXZoom.value = lastMouseDiff.x + diffX
  diffYZoom.value = lastMouseDiff.y + diffY

  console.log("log ", lastMouseDiff, diffX, diffY)
}
function onMouseUp() {
  mouseDowned = true
  mouseZooming.value = false
  lastMouseOff = null
}

function onWheel(event: WheelEvent) {
  if (event.altKey || event.ctrlKey) event.preventDefault()
  if (event.ctrlKey) {
    emit("update:zoom", props.zoom + (event.deltaY > 0 ? -5 : 5))
    return
  }

  if (event.altKey) diffXZoom.value += -event.deltaY / 2
  else {
    if (diffYZoom.value === maxDiffY.value && event.deltaY > 0) {
      next()
      return
      // next
    }
    if (diffYZoom.value === minDiffY.value && event.deltaY < 0) {
      prev()
      return
      // prev
    }
    diffYZoom.value += -event.deltaY
  }
}

useEventListener(window, "mousemove", onMouseMove)
useEventListener(window, "mouseup", onMouseUp)
</script>

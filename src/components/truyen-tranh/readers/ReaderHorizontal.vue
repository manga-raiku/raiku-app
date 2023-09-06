<template>
  <section
    class="h-full overflow-hidden relative"
    ref="parentRef"
    @wheel="onWheel"
    @touchstart="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend.passive="onTouchEnd"
  >
    <section
      class="h-full whitespace-nowrap overflow-hidden transition-width,height,transform relative top-1/2 left-1/2 i"
      :style="{
        width: `${singlePage ? 100 : zoom}%`,
        height: `${singlePage ? 100 : zoom}%`,
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
      <div
        class="h-full transition-transform"
        :style="{
          transform: `translateX(${`calc(${
            (minPage - currentPage) * 100
          }% + ${diffX}px)`})`,
          'transition-duration': `${moving ? 0 : 200}ms`,
        }"
      >
        <template v-if="singlePage">
          <ChapterPageModeSingle
            v-for="(src, index) in rightToLeft
              ? pagesRender.slice(0).reverse()
              : pagesRender"
            :key="index"
            :src="src"
            @load="
              sizes.set(index, [$event.naturalWidth, $event.naturalHeight])
            "
            @update:can-swipe="canSwipes[index] = $event"
          >
            <template #loading>
              <div class="flex items-center flex-col justify-center">
                <div class="text-20px font-weight-bold">{{ index + 1 }}</div>
                <q-spinner size="40px" color="main-3" />
              </div>
            </template>
          </ChapterPageModeSingle>
        </template>
        <template v-else>
          <ChapterPageModeDouble
            v-for="(src, index) in rightToLeft
              ? pagesRender.slice(0).reverse()
              : pagesRender"
            :key="index"
            :single-page="sizes.get(index)?.[0]! > 1200"
            :prime="index % 2 === 0"
            :src="src"
            @load="
              sizes.set(index, [$event.naturalWidth, $event.naturalHeight])
            "
          >
            <template #loading>
              <div class="flex items-center flex-col justify-center">
                <div class="text-20px font-weight-bold">{{ index + 1 }}</div>
                <q-spinner size="40px" color="main-3" />
              </div>
            </template>
          </ChapterPageModeDouble>
        </template>
      </div>
    </section>
    <!--
<button class="fixed top-0 left-0 w-1/2 h-full" @click="prev"
 />
<button class="fixed top-0 right-0 w-1/2 h-full" @click="next" / -->
  </section>
</template>

<script lang="ts" setup>
import { useElementSize, useEventListener } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { isTouchEvent } from "src/logic/is-touch-event"

const props = defineProps<{
  pages: string[]
  pagesNext?: string[]

  singlePage: boolean // 517px
  rightToLeft?: boolean
  minPage: number
  currentPage: number
  zoom: number
}>()
const emit = defineEmits<{
  (name: "update:zoom", value: number): void
  (name: "update:current-page", value: number): void
  // (name: "prev"): void
  // (name: "next"): void
}>()

const pagesRender = computed(() => {
  return props.pages // .concat(props.pagesNext ?? [])
})

const sizes = shallowReactive<Map<number, readonly [number, number]>>(new Map())
watch(
  () => props.pages,
  () => sizes.clear(),
)

const sizePage = computed(() => {
  if (props.singlePage) {
    // only 1
    return props.pages.length
  }

  return Math.ceil(
    props.pages.reduce((prev, item, index) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
      if (sizes.get(index)?.[0]! > 1_200) prev += 2
      else prev += 0.5

      return prev
    }, 0),
  )
})
defineExpose({ sizes, sizePage })

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()
const { width: pWidth, height: pHeight } = useElementSize(parentRef)
const { width: oWidth, height: oHeight } = useElementSize(overflowRef)

const oWidthH = computed(() => oWidth.value / 2)
const oHeightH = computed(() => oHeight.value / 2)

const pWidthH = computed(() => ~~pWidth.value / 2)
const canSwipes = shallowReactive(Object.create(null))

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

const diffX = ref(0)
const moving = ref(false)

const canSwipe = ref<"R" | "L" | "A" | null>(null)

let lastStartTouch: Touch | null = null
let lastMoveTouch: Touch | null = null
let lastMoveTime: number | null = null
let canGo: typeof canSwipe.value = null
function onTouchStart(event: TouchEvent) {
  onMouseDownCheckClick(event)
  if (lastStartTouch) return

  lastStartTouch = event.touches[0]

  const index =
    props.rightToLeft && props.singlePage
      ? sizePage.value - 1 + props.currentPage
      : props.currentPage
  canGo = canSwipes[index]

  // if (canSwipe.value) {
  moving.value = true
  // } else {
  lastMouseOff = { x: lastStartTouch.clientX, y: lastStartTouch.clientY }
  ;[lastMouseDiff.x, lastMouseDiff.y] = [diffXZoom.value, diffYZoom.value]
  console.log("log")
  // }
}
let currentTouch: Touch | null = null
let currentTime: number | null = null

let last2Mouse: Readonly<{ x: number; y: number }> | null = null
let lastMouse: Readonly<{ x: number; y: number }> | null = null
let last2Time: number | null = null
let lastTime: number | null = null

function onTouchMove(event: TouchEvent) {
  onMouseMoveCheckClick(event)
  if (!lastStartTouch) return

  const touch = findTouch(event.touches, lastStartTouch)
  if (!touch) return

  if (
    canGo &&
    (canGo === "A" ||
      (canGo === "R" && touch.clientX < lastStartTouch.clientX) ||
      (canGo === "L" && touch.clientX > lastStartTouch.clientX))
  ) {
    diffX.value = touch.clientX - lastStartTouch.clientX

    lastMoveTouch = currentTouch
    currentTouch = touch
    lastMoveTime = currentTime
    currentTime = Date.now()
  } else {
    const [diffX, diffY] = [
      touch.clientX - lastStartTouch.clientX,
      touch.clientY - lastStartTouch.clientY,
    ]
    console.log(diffX, diffY)
    mouseZooming.value = true
    diffXZoom.value = lastMouseDiff.x + diffX
    diffYZoom.value = lastMouseDiff.y + diffY

    last2Mouse = lastMouse
    lastMouse = { x: touch.clientX, y: touch.clientY }
    last2Time = lastTime
    lastTime = Date.now()
  }
}
function onTouchEnd(event: TouchEvent) {
  onMouseUpCheckClick(event)
  if (!lastStartTouch) return

  const touch = findTouch(event.changedTouches, lastStartTouch)
  if (!touch) return

  // if (canSwipe.value) {
  if (canGo && lastMoveTouch && lastMoveTime !== null) {
    const speedSwipeX =
      (touch.clientX - lastMoveTouch.clientX) / (Date.now() - lastMoveTime)
    const cDiffX = touch.clientX - lastStartTouch.clientX

    if (
      speedSwipeX > 0.3 ||
      cDiffX > (event.target as HTMLDivElement).offsetWidth * 0.3
    ) {
      prev()
    }
    if (
      speedSwipeX < -0.3 ||
      cDiffX < (event.target as HTMLDivElement).offsetWidth * -0.3
    ) {
      next()
    }

    console.log(speedSwipeX)
    mouseZooming.value = false
  } else {
    if (last2Mouse && last2Time) scrollInertia(touch, last2Mouse, last2Time)
  }

  // } else {
  moving.value = false
  diffX.value = 0
  lastStartTouch = null
  lastMoveTouch = null
  lastMoveTime = null
  currentTouch = null
  currentTime = null
  lastStartTouch = null

  last2Mouse = null
  last2Time = null
  // }
}

const minDiffX = computed(() => Math.max(0, (pWidth.value - oWidth.value) / 2))
const minDiffY = computed(() =>
  Math.max(0, (pHeight.value - oHeight.value) / 2),
)
const maxDiffX = computed(() => -minDiffX.value)
const maxDiffY = computed(() => -minDiffY.value)

const diffXZoom = useClamp(0, minDiffX, maxDiffX)
const diffYZoom = useClamp(0, minDiffY, maxDiffY)
const mouseZooming = ref(false)
const scrollInertia = useScrollInertia(diffXZoom, diffYZoom, mouseZooming)
let mouseDowned = false
let lastMouseOff: { x: number; y: number } | null = null
const lastMouseDiff: { x: number; y: number } = { x: 0, y: 0 }
function onMouseDown(event: MouseEvent) {
  onMouseDownCheckClick(event)
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

  last2Mouse = lastMouse
  lastMouse = { x: event.clientX, y: event.clientY }
  last2Time = lastTime
  lastTime = Date.now()

  console.log("log ", lastMouseDiff, diffX, diffY)
}
function onMouseUp(event: MouseEvent) {
  mouseDowned = true
  // mouseZooming.value = false
  lastMouseOff = null
  if (last2Mouse && last2Time) scrollInertia(event, last2Mouse, last2Time)
  last2Mouse = null
  last2Time = null
}

function onWheel(event: WheelEvent) {
  if (event.altKey || event.ctrlKey) event.preventDefault()
  if (event.ctrlKey && !props.singlePage) {
    emit("update:zoom", props.zoom + (event.deltaY > 0 ? -5 : 5))
    return
  }

  if (event.altKey) diffXZoom.value += -event.deltaY / 2
  else {
    if (diffYZoom.value === maxDiffY.value && event.deltaY < 0) {
      prev()
      diffYZoom.value = minDiffY.value
      return
      // next
    }
    if (diffYZoom.value === minDiffY.value && event.deltaY > 0) {
      next()
      diffYZoom.value = maxDiffY.value
      return
      // prev
    }
    diffYZoom.value += -event.deltaY / 2
  }
}

useEventListener(window, "mousemove", onMouseMove)
useEventListener(window, "mouseup", onMouseUp)

let mousezooming = false
let mouseDownClientX = 0
let mouseDownClientY = 0
function onMouseDownCheckClick(event: MouseEvent | TouchEvent) {
  mousezooming = false

  const touch = isTouchEvent(event) ? event.touches[0] : event

  mouseDownClientX = touch.clientX
  mouseDownClientY = touch.clientY
}
function onMouseMoveCheckClick(event: MouseEvent | TouchEvent) {
  const touch = isTouchEvent(event) ? event.touches[0] : event

  if (
    Math.abs(touch.clientX - mouseDownClientX) > 7 ||
    Math.abs(touch.clientY - mouseDownClientY) > 7
  )
    mousezooming = true
}
function onMouseUpCheckClick(event: MouseEvent | TouchEvent) {
  if (mousezooming) return

  const directionLeft = mouseDownClientX < pWidthH.value
  if (
    !xor(
      directionLeft,
      (isTouchEvent(event) ? event.changedTouches[0].clientX : event.clientX) <
        pWidthH.value,
    )
  ) {
    console.log("click %s", directionLeft ? "L" : "R")

    if (directionLeft) prev()
    else next()
  }
}

useEventListener(window, "keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (diffXZoom.value === minDiffX.value) prev()
      else diffXZoom.value -= 15
      break
    case "ArrowRight":
      if (diffXZoom.value === maxDiffX.value) next()
      else diffXZoom.value += 15
      break
    case "ArrowTop":
      diffYZoom.value -= 15
      break
    case "ArrowBottom":
      diffYZoom.value += 15
      break
  }
})
</script>

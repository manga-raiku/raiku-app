<template>
  <section
    class="h-full overflow-hidden relative"
    ref="parentRef"
    @mousedown.prevent="onMouseDown"
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
          : '444ms,444ms,170ms'
      }"
      ref="overflowRef"
    >
      <div
        class="h-full transition-transform"
        :style="{
          transform: `translateX(${`calc(${calcSyx * 100}% + ${diffX}px)`})`,
          'transition-duration': `${moving ? 0 : 200}ms`
        }"
      >
        <div
          v-if="nextEpisode && rightToLeft"
          class="w-1/2 h-full display-inline-block overflow-hidden relative"
          :class="{
            'w-full': singlePage
          }"
          @click.prevent.stop
        >
          <router-link
            class="w-full h-120px flex items-center justify-center my-auto text-20px text-weight-medium absolute top-1/2 left-1/2 translate--1/2"
            :to="nextEpisode.route"
            :replace="APP_STANDALONE"
            @click.stop
            @mousedown.stop.prevent
            ref="btnNextEpRef"
          >
            {{ $t("chuong-sau-name", [nextEpisode.name]) }}
          </router-link>
        </div>

        <template v-if="singlePage">
          <ChapterPageModeSingle
            v-for="{ src, index } in pagesRender"
            :key="index"
            :src="src"
            @load="
              sizes.set(index, [$event.naturalWidth, $event.naturalHeight])
            "
            @update:can-swipe="canSwipes[index] = $event"
            :ref="(el) => (pageRefs[index] = el as unknown as any)"
          >
            <template #loading>
              <div class="flex items-center flex-col justify-center">
                <div class="text-20px font-weight-bold">{{ index + 1 }}</div>
                <q-spinner size="40px" color="sakura3" />
              </div>
            </template>
          </ChapterPageModeSingle>
        </template>
        <template v-else>
          <ChapterPageModeDouble
            v-for="{ src, index } in pagesRender"
            :data-index="index"
            :key="index"
            :single-page="pageIsModeSingle(sizes, index)"
            :prime="rightToLeft ? index % 2 === 1 : index % 2 === 0"
            :src="src"
            @load="
              sizes.set(index, [$event.naturalWidth, $event.naturalHeight])
            "
            :ref="(el) => (pageRefs[index] = el as unknown as any)"
          >
            <template #loading>
              <div class="flex items-center flex-col justify-center">
                <div class="text-20px font-weight-bold">{{ index + 1 }}</div>
                <q-spinner size="40px" color="sakura3" />
              </div>
            </template>
          </ChapterPageModeDouble>
        </template>

        <div
          v-if="nextEpisode && !rightToLeft"
          class="w-1/2 h-full display-inline-block overflow-hidden relative"
          :class="{
            'w-full': singlePage
          }"
          @click.prevent.stop
        >
          <router-link
            class="w-full h-120px flex items-center justify-center my-auto text-20px text-weight-medium absolute top-1/2 left-1/2 translate--1/2"
            :to="nextEpisode.route"
            :replace="APP_STANDALONE"
            @click.stop
            @mousedown.stop.prevent
            ref="btnNextEpRef"
          >
            {{ $t("chuong-sau-name", [nextEpisode.name]) }}
          </router-link>
        </div>
      </div>
    </section>
    <!--
<button class="fixed top-0 left-0 w-1/2 h-full" @click="prev"
 />
<button class="fixed top-0 right-0 w-1/2 h-full" @click="next" / -->
  </section>
</template>

<script lang="ts" setup>
import { refAutoReset, useElementSize, useEventListener } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import type { Chapter } from "raiku-pgs/plugin"
import { APP_STANDALONE } from "src/constants"
import { isTouchEvent } from "src/logic/is-touch-event"
import { pageIsModeSingle } from "src/logic/page-is-mode-single"

import ChapterPageModeDouble from "./__components__/ChapterPageModeDouble.vue"
import ChapterPageModeSingle from "./__components__/ChapterPageModeSingle.vue"

const props = defineProps<{
  pages: readonly (Promise<string> | string)[]
  pagesNext?: string[]
  nextEpisode: Chapter | null
  prevEpisode: Chapter | null

  singlePage: boolean // 517px
  rightToLeft: boolean
  minPage: number
  maxPage: number
  currentPage: number
  zoom: number
}>()
const emit = defineEmits<{
  (name: "update:zoom", value: number): void
  (name: "update:current-page", value: number): void
  // (name: "prev"): void
  // (name: "next"): void
}>()

const router = useRouter()

// ========== logic control =============
const sizes = shallowReactive<Map<number, readonly [number, number]>>(new Map())
watch(
  () => props.pages,
  () => sizes.clear()
)

const indexed = computed(() => {
  const indexed = new Map<number, number>()

  let index = 0

  for (let i = 0; i < props.pages.length; i++) {
    if (props.singlePage || pageIsModeSingle(sizes, i)) {
      indexed.set(i, index)
      index++
    } else {
      indexed.set(i, index)
      i++
      if (i < props.pages.length) {
        indexed.set(i, index)
      }
      index++
    }
  }

  return indexed
})

const pages = computed(() => props.pages.map((src, index) => ({ src, index })))
const pagesRender = computed(() => {
  return props.rightToLeft ? [...toRaw(pages.value)].reverse() : pages.value // .concat(props.pagesNext ?? [])
})
// const pagesRender = computed(() => {
//   const pages = []

//   $pagesRender.value.forEach((page) => {
//     const size = sizes.get(page.index)
//     if (size && pageIsSingle(...size)) {
//       pages.push(page, page)
//     } else {
//       pages.push(page)
//     }
//   })

//   return pages
// })

const rawSizePage = computed(() => {
  if (props.singlePage) {
    return props.pages.length
  }

  return (
    props.pages.reduce((prev, item, index) => {
      const size = sizes.get(index)
      if (!size) return prev + 0.5

      if (pageIsModeSingle(sizes, index)) prev += 1
      else prev += 0.5

      return prev
    }, 0) + (props.nextEpisode ? 0.5 : 0)
  )
})

const sizePage = computed(() => {
  return Math.ceil(rawSizePage.value)
})
defineExpose({ sizes })

const currentPageHydrated = computed(
  () =>
    indexed.value.get(props.currentPage) ?? Math.floor(props.currentPage / 2)
)
const diffSyx = computed(() => rawSizePage.value % 1)
const calcSyx = computed(() => {
  if (props.rightToLeft)
    return -(sizePage.value - 1 - currentPageHydrated.value) + diffSyx.value
  return -currentPageHydrated.value + diffSyx.value
})

const requestedPrev = refAutoReset(false, 1e3)
const requestedNext = refAutoReset(false, 1e3)
function prev() {
  console.log("prev")
  if (props.currentPage === props.minPage) {
    // change episode
    if (props.prevEpisode)
      if (requestedPrev.value) {
        if (APP_STANDALONE) void router.replace(props.prevEpisode.route)
        else void router.push(props.prevEpisode.route)
      } else {
        // show notify
        requestedPrev.value = true
      }

    return
  }
  // emit("prev")
  const size = sizes.get(props.currentPage)
  emit(
    "update:current-page",
    props.currentPage -
      ((size && pageIsModeSingle(sizes, props.currentPage - 1)) ||
      props.singlePage
        ? 1
        : 2)
  )
}
function next() {
  console.log("next")
  if (props.currentPage === props.maxPage) {
    // change episode
    if (props.nextEpisode)
      if (requestedNext.value) {
        if (APP_STANDALONE) void router.replace(props.nextEpisode.route)
        else void router.push(props.nextEpisode.route)
      } else {
        // show notify
        requestedNext.value = true
      }

    return
  }
  // emit("next")
  const size = sizes.get(props.currentPage)
  emit(
    "update:current-page",
    props.currentPage +
      ((size && pageIsModeSingle(sizes, props.currentPage + 1)) ||
      props.singlePage
        ? 1
        : 2)
  )
}

// ========== /logic control =============

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()
const { width: pWidth, height: pHeight } = useElementSize(parentRef)
const { width: oWidth, height: oHeight } = useElementSize(overflowRef)

const oWidthH = computed(() => oWidth.value / 2)
const oHeightH = computed(() => oHeight.value / 2)

const pWidthH = computed(() => ~~pWidth.value / 2)
const canSwipes = shallowReactive(Object.create(null))

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
      ? props.pages.length - 1 + props.currentPage
      : props.currentPage
  canGo = canSwipes[index] ?? index >= props.pages.length ? "A" : null // ok

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
      touch.clientY - lastStartTouch.clientY
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
      if (props.rightToLeft) next()
      else prev()
    }
    if (
      speedSwipeX < -0.3 ||
      cDiffX < (event.target as HTMLDivElement).offsetWidth * -0.3
    ) {
      if (props.rightToLeft) prev()
      else next()
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

const minDiffX = computed(() => (pWidth.value - oWidth.value) / 2)
const minDiffY = computed(() => (pHeight.value - oHeight.value) / 2)
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
  console.log("mouse down")
}
function onMouseMove(event: MouseEvent) {
  if (!mouseDowned || !lastMouseOff) return

  const [diffX, diffY] = [
    event.clientX - lastMouseOff.x,
    event.clientY - lastMouseOff.y
  ]

  mouseZooming.value = true
  diffXZoom.value = lastMouseDiff.x + diffX
  diffYZoom.value = lastMouseDiff.y + diffY

  last2Mouse = lastMouse
  lastMouse = { x: event.clientX, y: event.clientY }
  last2Time = lastTime
  lastTime = Date.now()

  console.log("log ", [lastMouseDiff.x + diffX, lastMouseDiff.y + diffY], {
    x: diffXZoom.value,
    y: diffYZoom.value
  })
}
function onMouseUp(event: MouseEvent) {
  onMouseUpCheckClick(event)
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
      if (props.rightToLeft) next()
      else prev()
      diffYZoom.value = minDiffY.value
      return
      // next
    }
    if (diffYZoom.value === minDiffY.value && event.deltaY > 0) {
      if (props.rightToLeft) prev()
      else next()
      diffYZoom.value = maxDiffY.value
      return
      // prev
    }
    diffYZoom.value += -event.deltaY / 2
  }
}

useEventListener(window, "mousemove", onMouseMove)
useEventListener(window, "mouseup", onMouseUp)

// precess connect load
const pageRefs = shallowReactive<
  (
    | InstanceType<typeof ChapterPageModeSingle>
    | InstanceType<typeof ChapterPageModeDouble>
    | undefined
  )[]
>([])
watch(
  () => props.pages,
  ({ length }) => {
    pageRefs.splice(length)
  }
)
watch(
  () => props.currentPage,
  (newVal, oldVal) => {
    if (newVal > oldVal) {
      // next
      console.log("emit next")
      pageRefs[newVal + 1]?.startLoad()
      pageRefs[newVal + 2]?.startLoad()
    } else {
      // prev
      console.log("emit prev")
      pageRefs[newVal - 1]?.startLoad()
      pageRefs[newVal - 2]?.startLoad()
    }
  }
)

let mousezooming = true
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
  console.log({ mousezooming })
  if (mousezooming) return

  const directionLeft = mouseDownClientX < pWidthH.value
  if (
    !xor(
      directionLeft,
      (isTouchEvent(event) ? event.changedTouches[0].clientX : event.clientX) <
        pWidthH.value
    )
  ) {
    console.log("click %s", directionLeft ? "L" : "R")

    if (directionLeft) props.rightToLeft ? next() : prev()
    else props.rightToLeft ? prev() : next()
  }

  mousezooming = true
}

useEventListener(window, "mousemove", onMouseMove)
useEventListener(window, "mouseup", onMouseUp)

useEventListener(window, "keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (diffXZoom.value === minDiffX.value)
        props.rightToLeft ? next() : prev()
      else diffXZoom.value -= 15
      break
    case "ArrowRight":
      if (diffXZoom.value === maxDiffX.value)
        props.rightToLeft ? prev() : next()
      else diffXZoom.value += 15
      break
    case "ArrowUp":
      diffYZoom.value += 15
      break
    case "ArrowDown":
      diffYZoom.value -= 15
      break
  }
})
</script>

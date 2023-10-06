<template>
  <div
    v-if="!disabledX"
    class="scrollbar scrollbar-x"
    :class="{ swiping: swipingX }"
    @mousedown.prevent="onMouseDownX"
    @touchstart.passive="onMouseDownX"
    @touchmove.passive="onMouseMoveX"
    @touchend.passive="onMouseUpX"
  >
    <div
      class="thumb"
      :style="{
        left: Math.round(offsetLeft) + 'px',
        width: `${widthThumb}px`
      }"
      @mousedown.prevent="onMouseDownX"
    />
  </div>

  <div
    v-if="!disabledY"
    class="scrollbar scrollbar-y"
    :class="{ swiping: swipingY }"
    @mousedown.prevent="onMouseDownY"
    @touchstart.passive="onMouseDownY"
    @touchmove.passive="onMouseMoveY"
    @touchend.passive="onMouseUpY"
  >
    <div
      class="thumb"
      :style="{
        top: Math.round(offsetTop) + 'px',
        height: `${heightThumb}px`
      }"
      @mousedown.prevent="onMouseDownY"
    />
  </div>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import { useClamp } from "@vueuse/math"

const props = defineProps<{
  pWidth: number
  pHeight: number
  oWidth: number
  oHeight: number

  minX: number
  maxX: number
  scrollX: number

  minY: number
  maxY: number
  scrollY: number

  behavior: ScrollBehavior
}>()
const emit = defineEmits<{
  (name: "update:scroll-x", v: number): void
  (name: "update:scroll-y", v: number): void
  (name: "update:behavior", value: ScrollBehavior): void
}>()

const disabledX = computed(() => props.pWidth >= props.oWidth)
const disabledY = computed(() => props.pHeight >= props.oHeight)

const widthThumb = computed(() =>
  Math.round(Math.max(props.pWidth ** 2 / props.oWidth, 15))
)
const widthThumbH = computed(() => Math.round(widthThumb.value / 2))
const heightThumb = computed(() =>
  Math.round(Math.max(props.pHeight ** 2 / props.oHeight, 15))
)
const heightThumbH = computed(() => Math.round(heightThumb.value / 2))

const spacedX = computed(() => props.pWidth - widthThumb.value)
const spacedY = computed(() => props.pHeight - heightThumb.value)

const offsetLeft = useClamp(0, 0, spacedX)
const offsetTop = useClamp(0, 0, spacedY)

const swipingX = ref(false)
const swipingY = ref(false)

let touchStartY: Touch | MouseEvent | null = null
let offsetTopStart: number | null = null
function onMouseDownY(event: MouseEvent | TouchEvent) {
  touchStartY = isTouchEvent(event) ? event.touches[0] : event
  offsetTopStart = (event.target as HTMLElement | null)?.classList.contains(
    "thumb"
  )
    ? offsetTop.value
    : null
  swipingY.value = true
  emit("update:behavior", "auto")
}
function onMouseMoveY(event: MouseEvent | TouchEvent) {
  if (!touchStartY) return

  const lastIsTouch = isTouch(touchStartY)
  const currIsTouch = isTouchEvent(event)

  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch
    ? findTouch(event.touches, touchStartY as Touch)
    : event
  if (!touch) return

  offsetTop.value =
    offsetTopStart === null
      ? touch.clientY - heightThumbH.value
      : offsetTopStart + touch.clientY - touchStartY.clientY
}
function onMouseUpY(event: MouseEvent | TouchEvent) {
  if (!touchStartY) return

  const lastIsTouch = isTouch(touchStartY)
  const currIsTouch = isTouchEvent(event)

  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch
    ? findTouch(event.changedTouches, touchStartY as Touch)
    : event
  if (!touch) return

  touchStartY = null
  offsetTopStart = null
  swipingY.value = false
  emit("update:behavior", "smooth")
}

useEventListener(window, "mousemove", onMouseMoveY)
useEventListener(window, "mouseup", onMouseUpY)

let touchStartX: Touch | MouseEvent | null = null
let offsetLeftStart: number | null = null
function onMouseDownX(event: MouseEvent | TouchEvent) {
  touchStartX = isTouchEvent(event) ? event.touches[0] : event
  offsetLeftStart = (event.target as HTMLElement | null)?.classList.contains(
    "thumb"
  )
    ? offsetLeft.value
    : null
  swipingX.value = true
  emit("update:behavior", "auto")
}
function onMouseMoveX(event: MouseEvent | TouchEvent) {
  if (!touchStartX) return

  const lastIsTouch = isTouch(touchStartX)
  const currIsTouch = isTouchEvent(event)

  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch
    ? findTouch(event.touches, touchStartX as Touch)
    : event
  if (!touch) return

  offsetLeft.value =
    offsetLeftStart === null
      ? touch.clientX - widthThumbH.value
      : offsetLeftStart + touch.clientX - touchStartX.clientX
}
function onMouseUpX(event: MouseEvent | TouchEvent) {
  if (!touchStartX) return

  const lastIsTouch = isTouch(touchStartX)
  const currIsTouch = isTouchEvent(event)

  if (lastIsTouch !== currIsTouch) return

  const touch = currIsTouch
    ? findTouch(event.changedTouches, touchStartX as Touch)
    : event
  if (!touch) return

  touchStartX = null
  offsetLeftStart = null
  swipingX.value = false
  emit("update:behavior", "smooth")
}

useEventListener(window, "mousemove", onMouseMoveX)
useEventListener(window, "mouseup", onMouseUpX)

// reactive v-model
const ΔX = computed(() => props.maxX - props.minX)
const ΔY = computed(() => props.maxY - props.minY)

let disableReactiveScrollX = false
watch(offsetLeft, async (offsetLeft) => {
  if (disableReactiveOffsetLeft) return

  disableReactiveScrollX = true
  emit("update:scroll-x", (offsetLeft / spacedX.value) * ΔX.value + props.minX)
  await nextTick()
  disableReactiveScrollX = false
})
let disableReactiveOffsetLeft = false
watch(
  () => props.scrollX,
  async (scrollX) => {
    if (disableReactiveScrollX || disabledX.value) return

    disableReactiveOffsetLeft = true
    offsetLeft.value = ((scrollX - props.minX) / ΔX.value) * spacedX.value
    await nextTick()
    disableReactiveOffsetLeft = false
  }
)

let disableReactiveScrollY = false
watch(offsetTop, async (offsetTop) => {
  if (disableReactiveOffsetTop) return

  disableReactiveScrollY = true
  console.log("run update")
  emit("update:scroll-y", (offsetTop / spacedY.value) * ΔY.value + props.minY)
  await nextTick()
  disableReactiveScrollY = false
})
let disableReactiveOffsetTop = false
watch(
  () => props.scrollY,
  async (scrollY) => {
    if (disableReactiveScrollY || disabledY.value) return

    disableReactiveOffsetTop = true
    offsetTop.value = ((scrollY - props.minY) / ΔY.value) * spacedY.value
    await nextTick()
    disableReactiveOffsetTop = false
  }
)
</script>

<style lang="scss" scoped>
.scrollbar {
  @apply absolute z-9999;
  opacity: 0.6;
  transition:
    background-color 0.2s linear,
    opacity 0.2s linear;
  &-x {
    @apply bottom-0 left-0 w-full h-15px;
  }
  &-y {
    @apply top-0 right-0 h-full w-15px;
  }

  &:hover,
  &.swiping {
    background-color: rgba($color: #eee, $alpha: 0.9);
    opacity: 0.9;
  }

  .thumb {
    @apply absolute bg-#aaa rounded-6px opacity-100;
    transition:
      background-color 0.2s linear,
      width 0.2s ease-in-out;
  }
  &-x .thumb {
    @apply h-6px bottom-2px;
  }
  &-y .thumb {
    @apply w-6px right-2px;
  }

  &:hover,
  &.swiping {
    .thumb {
      @apply bg-#999;
    }
  }
  &-x:hover,
  &-x.swiping {
    .thumb {
      @apply h-11px;
    }
  }
  &-y:hover,
  &-y.swiping {
    .thumb {
      @apply w-11px;
    }
  }
}
</style>

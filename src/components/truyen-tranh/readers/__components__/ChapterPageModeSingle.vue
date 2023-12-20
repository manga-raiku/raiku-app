<template>
  <div
    class="w-full h-full display-inline-block overflow-auto relative scrollbar-hide"
    ref="parentRef"
    @mousedown.prevent="onMouseDown"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="relative transition-width,height duration-444ms flex items-center justify-center"
      ref="overflowRef"
      :style="{
        width: `${zoom}%`,
        height: `${zoom}%`,
        transition: touching ? 'none' : undefined
      }"
    >
      <PageView
        class="object-scale-down h-full mx-auto"
        loader-absolute
        :src="src"
        @load="(image) => emit('load', image)"
        ref="pageViewRef"
      >
        <template #loading>
          <slot name="loading" />
        </template>
      </PageView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEventListener, useScroll } from "@vueuse/core"
import type { DomOffset } from "quasar"

import PageView from "./PageView.vue"

defineProps<{
  src: string | Promise<string>
}>()
const emit = defineEmits<{
  (name: "load", image: HTMLImageElement): void
  (name: "update:can-swipe", value: "R" | "L" | "A" | null): void
}>()

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()

const pageViewRef = ref<InstanceType<typeof PageView>>()
defineExpose({
  startLoad: () => pageViewRef.value?.startLoad()
})

const behavior = ref<ScrollBehavior>("smooth")
const scroller = useScroll(parentRef, { behavior })
watch(
  parentRef,
  (ref) => {
    if (!ref) return
    scroller.measure()
  },
  { immediate: true }
)

const zoom = ref(100.0)
const { onTouchStart, onTouchMove, onTouchEnd, scale, touching } =
  useTouchZoom()

watch(scale, (scale) => {
  zoom.value += scale
})

const diffXZoom = scroller.x
const diffYZoom = scroller.y

let mouseStart: MouseEvent | null = null
let scrollStart: Readonly<DomOffset> | null = null
function onMouseDown(event: MouseEvent) {
  mouseStart = event
  scrollStart = { top: diffYZoom.value, left: diffXZoom.value }
}
// let lastMouse: Readonly<{x: number ;y : number}> | null = null
// let last2Mouse: Readonly<{x: number ;y : number}> | null = null
// let lastTime: number | null = null
// let last2Time : number | null = null
function onMouseMove(event: MouseEvent) {
  if (!mouseStart || !scrollStart) return

  const [diffX, diffY] = [
    event.clientX - mouseStart.clientX,
    event.clientY - mouseStart.clientY
  ]
  parentRef.value?.scrollTo({
    top: scrollStart.top - diffY,
    left: scrollStart.left - diffX,
    behavior: "auto"
  })
  // diffXZoom.value = scrollStart.left - diffX
  // console.log({ diffXZoom }, scrollStart.left - diffX)
  // diffYZoom.value = scrollStart.top - diffY

  // last2Mouse = lastMouse
  // lastMouse = { x: event.clientX, y: event.clientY }
  // last2Time = lastTime
  // lastTime = Date.now()
}
function onMouseUp() {
  mouseStart = null
  scrollStart = null
  // if (last2Mouse && last2Time) await scrollInertia(event, last2Mouse, last2Time)
}

useEventListener(window, "mousemove", onMouseMove)
useEventListener(window, "mouseup", onMouseUp)

watch(
  () => [scroller.arrivedState.left, scroller.arrivedState.right],
  ([left, right]) => {
    if (left && right) return emit("update:can-swipe", "A")
    if (left) return emit("update:can-swipe", "L")
    if (right) return emit("update:can-swipe", "R")

    emit("update:can-swipe", null)
  },
  { immediate: true }
)
</script>

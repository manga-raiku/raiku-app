<template>
  <div
    class="w-1/2 h-full display-inline-block overflow-hidden relative !overflow-scroll scrollbar-hide"
    :class="{
      'w-full': true,
    }"
    ref="parentRef"
    @mousedown.prevent="onMouseDown"
  >
    <div
      class="relative transition-width,height duration-444ms"
      ref="overflowRef"
      :style="{
        width: `${zoom}%`,
        height: `${zoom}%`,
      }"
    >
      <PageView
        class="object-scale-down h-full mx-auto"
        :src="src"
        @load="(image) => emit('load', image)"
      >
        <template #loading>
          <slot name="loading" />
        </template>
      </PageView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useElementSize, useEventListener, useScroll } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import type { DomOffset } from "quasar"

defineProps<{
  src: string
}>()
const emit = defineEmits<{
  (name: "load", image: HTMLImageElement): void
  (name: "update:can-swipe", value: "R" | "L" | "A" | null): void
}>()

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()

const behavior = ref<ScrollBehavior>("smooth")
const scroller = useScroll(parentRef, { behavior })

const zoom = ref(100.0)

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
    event.clientY - mouseStart.clientY,
  ]
  parentRef.value?.scrollTo({
    top: scrollStart.top - diffY,
    left: scrollStart.left - diffX,
    behavior: "instant",
  })
  // diffXZoom.value = scrollStart.left - diffX
  // console.log({ diffXZoom }, scrollStart.left - diffX)
  // diffYZoom.value = scrollStart.top - diffY

  // last2Mouse = lastMouse
  // lastMouse = { x: event.clientX, y: event.clientY }
  // last2Time = lastTime
  // lastTime = Date.now()
}
async function onMouseUp(event: MouseEvent) {
  mouseStart = null
  scrollStart = null
  // if (last2Mouse && last2Time) await scrollInertia(event, last2Mouse, last2Time)
}

useEventListener(window, "mousemove", onMouseMove)
useEventListener(window, "mouseup", onMouseUp)
</script>

<template>
  <section
    v-bind="attrs"
    class="h-full overflow-hidden relative"
    ref="parentRef"
    :scrollTop.prop="-diffYZoom"
    :scrollLeft.prop="-(-oWidthH + diffXZoom)"
    @mousedown.prevent="onTouchStart"
    @wheel="onWheel"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <section
      class="transition-width,transform relative top-0 left-1/2"
      :style="{
        width: `${zoom}%`,
        // transform: `translate3d(${-oWidthH + diffXZoom}px, ${
        //   /*-oHeightH +*/ diffYZoom
        // }px, 0)`,
        'transition-property': mouseZooming ? 'width' : 'width,transform',
        'transition-duration': mouseZooming ? '444ms,0ms' : '444ms,170ms',
      }"
      ref="overflowRef"
    >
      <PageView
        v-for="(item, index) in pagesRender"
        :key="item"
        :data-index="index"
        class="object-cover display-block mx-auto"
        :src="item"
        @load="(img, intersection) => onLoadPageView(index, img, intersection)"
        @change:visible="
          $event ? pagesIsVisible.add(index) : pagesIsVisible.delete(index)
        "
        :style="{
          width: sizes.has(index)
            ? `${(sizes.get(index)?.[0]! * zoom) / 100}px`
            : widthImageDefault,
          height: sizes.has(index) ? undefined : heightImageDefault,
        }"
        :ref="
          (ref) => (pageViewRefs[index] = ref as InstanceType<typeof PageView>)
        "
      >
        <template #loading>
          <div class="flex items-center flex-col justify-center">
            <div class="text-20px font-weight-bold">{{ index + 1 }}</div>
            <q-spinner size="40px" color="main-3" />
          </div>
        </template>
      </PageView>

      <router-link
        v-if="nextEpisode"
        class="w-full h-120px flex items-center justify-center"
        :to="nextEpisode"
        @click.stop
        ref="btnNextEpRef"
      >
        Next Chapter
      </router-link>
    </section>
  </section>

  <teleport to="body">
    <r-scrollbar
      :min-y="maxDiffY"
      :max-y="minDiffY"
      v-model:scroll-y="diffYZoom"
      :min-x="maxDiffX"
      :max-x="minDiffX"
      v-model:scroll-x="diffXZoom"
      :p-width="pWidth"
      :p-height="pHeight"
      :o-width="oWidth"
      :o-height="oHeight"
    />
  </teleport>
</template>

<script lang="ts" setup>
import {
  useElementSize,
  useElementVisibility,
  useEventListener,
} from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { debounce } from "quasar"
import { RouterLink } from "vue-router"

import PageView from "./__components__/PageView.vue"

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  pages: string[]
  currentPage: number
  zoom: number
  nextEpisode?: string
}>()
const emit = defineEmits<{
  (name: "update:zoom", value: number): void
  (name: "update:current-page", value: number): void
  (name: "action:next-ch"): void
  // (name: "prev"): void
  // (name: "next"): void
}>()
const attrs = useAttrs()

const sizes = shallowReactive<Map<number, readonly [number, number]>>(new Map())
watch(
  () => props.pages,
  () => sizes.clear(),
)

const pagesRender = computed(() => {
  return props.pages
})
const targetNextChRef = ref<HTMLDivElement>()
const targetNextChIsVisible = useElementVisibility(targetNextChRef)
watch(
  targetNextChIsVisible,
  (visible) => {
    if (visible) {
      console.log("%c next now", "font-size: 20px; color :cyan")
      emit("action:next-ch")
    }
  },
  { immediate: true },
)

watch(
  () => props.currentPage >= props.pages.length,
  () => {
    console.warn("Next chapter")
  },
)

const btnNextEpRef = ref<InstanceType<typeof RouterLink>>()
const btnNextIsVisible = useElementVisibility(btnNextEpRef)
watch(btnNextIsVisible, (visible) => {
  if (visible) emit("action:next-ch")
})

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()
const { width: pWidth, height: pHeight } = useElementSize(parentRef)
const { width: oWidth, height: oHeight } = useElementSize(overflowRef)

const oWidthH = computed(() => oWidth.value / 2)

const widthImageDefault = computed(
  () => sizes.get(0)?.[0] ?? pWidth.value * 0.8,
)
const heightImageDefault = computed(
  () => sizes.get(0)?.[1] ?? pHeight.value * 0.8,
)

const minDiffX = computed(() => Math.min(0, (pWidth.value - oWidth.value) / 2))
const minDiffY = computed(
  () => Math.min(0, pHeight.value - oHeight.value) /* / 2 */,
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

const pageViewRefs = shallowReactive<InstanceType<typeof PageView>[]>([])

let disableReactiveCurrentPage = false

const pagesIsVisible = shallowReactive<Set<number>>(new Set())
watch(
  () =>
    pagesIsVisible.size > 0
      ? Math.max(...pagesIsVisible.values())
      : props.currentPage,
  debounce(async (max: number) => {
    disableReactiveCurrentPage = true
    emit("update:current-page", max)
    await nextTick()
    disableReactiveCurrentPage = false
  }),
  { deep: true, immediate: true },
)

// // create sort map offset?
// const mapOffset = computed(() => {
//   const mov: number[] = new Array(props.pages.length)
//   let currentY = 0

//   const zoom = props.zoom / 100
//   for (let i = 0; i < props.pages.length; i++) {
//     const d = sizes.get(i)

//     mov[i] = currentY
//     currentY += d
//       ? (d[1] / d[0]) * (Math.min(d[0], oWidth.value) * zoom)
//       : heightImageDefault.value
//   }

//   return mov
// })
// watch(
//   diffYZoom,
//   debounce(async (diffYZoom: number) => {
//     const arr = mapOffset.value
//     let left = 0
//     let right = arr.length - 1
//     const positiveDiffYZoom = (-diffYZoom * props.zoom) / 100 + pHeight.value

//     while (left !== right) {
//       const center = left + ~~(right - left) / 2
//       const val = arr[center]

//       if (val <= positiveDiffYZoom) {
//         left = center + 1
//         continue
//       }
//       right = center
//     }

//     disableReactiveCurrentPage = true
//     // emit("update:current-page", left < 1 ? 0 : left - 1)
//     await nextTick()
//     disableReactiveCurrentPage = false
//   }, 200),
// )

watch(
  () => props.currentPage,
  (currentPage) => {
    if (disableReactiveCurrentPage) return
    console.log("traffict emit")
    diffYZoom.value = -(
      pageViewRefs[currentPage].imgRef ?? pageViewRefs[currentPage].$el
    ).offsetTop
    console.log(
      pageViewRefs[currentPage].imgRef ?? pageViewRefs[currentPage].$el,
    )
  },
)

function onLoadPageView(
  index: number,
  image: HTMLImageElement,
  intersection: IntersectionObserverEntry,
) {
  sizes.set(index, [image.naturalWidth, image.naturalHeight])

  if (disableReactiveCurrentPage) return
  if (
    !intersection.isIntersecting &&
    intersection.boundingClientRect.y - intersection.boundingClientRect.width <
      0
  ) {
    diffYZoom.value -=
      (image.naturalHeight / image.naturalWidth) * oWidth.value -
      heightImageDefault.value
  }
}
</script>

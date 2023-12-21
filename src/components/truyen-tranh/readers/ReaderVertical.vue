<template>
  <section
    v-bind="attrs"
    class="fixed top-0 left-0 h-full w-full !overflow-scroll scrollbar-hide"
    ref="parentRef"
    tabindex="0"
    autofocus
    @mousedown.prevent="onMouseDown"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <section
      class="transition-width duration-444ms mx-auto"
      :style="{
        width: `${zoom}%`,
        transition: touching ? 'none' : undefined
      }"
      ref="overflowRef"
    >
      <template v-for="(item, index) in pagesRender" :key="item">
        <!-- v-if="typeof item === 'string'"    @load="
            (img, intersection) => onLoadPageView(index, img, intersection)
          "-->
        <PageView
          class="object-cover display-block mx-auto"
          :src="item"
          @load="sizes.set(index, [$event.naturalWidth, $event.naturalHeight])"
          :style="{
            width: sizes.has(index)
              ? `${(sizes.get(index)?.[0]! * zoom) / 100}px`
              : widthImageDefault,
            height: sizes.has(index) ? undefined : heightImageDefault
          }"
          :ref="
            (ref) =>
              (pageViewRefs[index] = ref as InstanceType<typeof PageView>)
          "
          :observer="observer"
          :index.prop="index"
        >
          <template #loading>
            <div class="flex items-center flex-col justify-center">
              <div class="text-20px font-weight-bold">{{ index + 1 }}</div>
              <q-spinner size="40px" color="sakura3" />
            </div>
          </template>
        </PageView>
        <!--
        <div
          v-else-if="item.$r"
          class="w-full py-20 text-center"
          v-element-visibility="
            () => {
              emit('action:ch', item)
            }
          "
        >
          {{ $t("chuong-name", [item.$r.name]) }}
        </div> -->
      </template>
      <router-link
        v-if="nextEpisode"
        class="w-full h-120px flex items-center justify-center"
        :to="nextEpisode.route"
        :replace="APP_STANDALONE"
        @click.stop
        ref="btnNextEpRef"
      >
        {{ $t("chuong-sau-name", [nextEpisode.name]) }}
      </router-link>
    </section>
  </section>

  <teleport to="body">
    <r-scrollbar
      v-if="activated"
      :min-y="minDiffY"
      :max-y="maxDiffY"
      v-model:scroll-y="diffYZoom"
      :min-x="minDiffX"
      :max-x="maxDiffX"
      v-model:scroll-x="diffXZoom"
      :p-width="pWidth"
      :p-height="pHeight"
      :o-width="oWidth"
      :o-height="oHeight"
      v-model:behavior="behavior"
    />
  </teleport>
</template>

<script lang="ts" setup>
// import { vElementVisibility } from "@vueuse/components"
import {
  useElementSize,
  useElementVisibility,
  useEventListener,
  useScroll
} from "@vueuse/core"
import { type DomOffset } from "quasar"
import type { Chapter } from "raiku-pgs/plugin"
import { APP_STANDALONE } from "src/constants"
import { RouterLink } from "vue-router"

import PageView from "./__components__/PageView.vue"

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  pages: readonly (Promise<string> | string)[]
  currentPage: number
  zoom: number

  nextEpisode: Chapter | null
  prevEpisode: Chapter | null
}>()
const emit = defineEmits<{
  (name: "update:zoom", value: number): void
  (name: "update:current-page", value: number): void
  (name: "action:next-ch"): void
  // (
  //   name: "action:ch",
  //   value: {
  //     $l: {
  //       id: number
  //       name: string
  //       path: string
  //       updated_at: null
  //     }
  //     $r: {
  //       id: number
  //       name: string
  //       path: string
  //       updated_at: null
  //     }
  //   },
  // ): void
  // (name: "prev"): void
  // (name: "next"): void
}>()
const attrs = useAttrs()

const { onTouchStart, onTouchMove, onTouchEnd, scale, touching } =
  useTouchZoom()
const activated = useActivated()

watch(scale, (scale) => {
  emit("update:zoom", props.zoom + scale)
})

defineExpose({
  reset: () => {
    scroller.x.value = 0
    scroller.y.value = 0
  }
})

const sizes = shallowReactive<Map<number, readonly [number, number]>>(new Map())
watch(
  () => props.pages,
  () => sizes.clear()
)

const pagesRender = computed(() => {
  return props.pages
})

watch(
  () => props.currentPage >= props.pages.length,
  () => {
    console.warn("Next chapter")
  }
)

const btnNextEpRef = ref<InstanceType<typeof RouterLink>>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const btnNextIsVisible = useElementVisibility(btnNextEpRef as Ref<any>)
watch(btnNextIsVisible, (visible) => {
  if (visible) emit("action:next-ch")
})

const parentRef = ref<HTMLDivElement>()
const overflowRef = ref<HTMLDivElement>()
const { width: pWidth, height: pHeight } = useElementSize(parentRef)
const { width: oWidth, height: oHeight } = useElementSize(overflowRef)

const behavior = ref<ScrollBehavior>("smooth")
const scroller = useScroll(parentRef, { behavior })

const widthImageDefault = computed(
  () => sizes.get(0)?.[0] ?? pWidth.value * 0.8
)
const heightImageDefault = computed(
  () => sizes.get(0)?.[1] ?? pHeight.value * 0.8
)

const minDiffX = computed(() => 0)
const minDiffY = computed(() => 0)
const maxDiffX = computed(() => oWidth.value - pWidth.value)
const maxDiffY = computed(() => oHeight.value - pHeight.value)

// const diffXZoom = useClamp(0, minDiffX, maxDiffX)
// const diffYZoom = useClamp(0, minDiffY, maxDiffY)
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

const pageViewRefs = shallowReactive<InstanceType<typeof PageView>[]>([])
watch(pagesRender, () => pageViewRefs.splice(0))

const pagesIsVisible = shallowReactive<Set<number>>(new Set())
// let disableEmitCurrentPage = false
watch(
  () =>
    pagesIsVisible.size > 0
      ? Math.max(...pagesIsVisible.values())
      : props.currentPage,
  async (max: number) => {
    // disableEmitCurrentPage = true
    console.log("change max value to %s", max)
    emit("update:current-page", max)

    // disableEmitCurrentPage = false
  },
  { immediate: true }
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

watchImmediate(parentRef, (parentRef, _, cleanUp) => {
  if (!parentRef) return

  const clean = watchImmediate(
    () => props.currentPage,
    (currentPage) => {
      // console.log({ scrolling: scrolling.value, disableEmitCurrentPage })
      if (scroller.isScrolling.value /* || disableEmitCurrentPage */) {
        // disableEmitCurrentPage = false
        return
      }
      console.log("traffic emit")

      // disableEmitCurrentPage = false

      const scrollIntoView = () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pageViewRefs[currentPage].imgRef!.scrollIntoView({
          // behavior: "smooth"
        })
      }
      // // follow items prev
      // const cleaners: WatchStopHandle[] = []
      // let cleaned = 0
      // for (let i = 0; i <= currentPage; i++) {
      //   if (sizes.has(i)) continue

      //   cleaners[i] = watch(
      //     () => sizes.get(i),
      //     (value) => {
      //       if (value) {
      //         // clean
      //         cleaners[i]?.()
      //         delete cleaners[i]
      //         cleaned++
      //         if (cleaned === cleaners.length) {
      //           // run scroll to because first loaded
      //           scrollIntoView()
      //         }
      //       }
      //     }
      //   )
      // }
      // if (cleaned === cleaners.length) {
      // run scroll to because first loaded
      scrollIntoView()
      // }
      // cleanUp(() => cleaners.forEach((cleaner) => cleaner()))
    }
  )

  cleanUp(clean)
})

// function onLoadPageView(
//   index: number,
//   image: HTMLImageElement,
//   intersection: IntersectionObserverEntry
// ) {
//   sizes.set(index, [image.naturalWidth, image.naturalHeight])

//   if (disableReactiveCurrentPage) return
//   if (
//     !intersection.isIntersecting &&
//     intersection.boundingClientRect.y - intersection.boundingClientRect.width <
//       0
//   ) {
//     parentRef.value?.scrollBy({
//       top:
//         (image.naturalHeight / image.naturalWidth) * oWidth.value -
//         heightImageDefault.value
//     })
//   }
// }

watch(
  () => props.pages,
  ({ length }) => {
    pageViewRefs.splice(length)
  }
)
watch(
  () => props.currentPage,
  (newVal, oldVal) => {
    if (newVal > oldVal) {
      // next
      console.log("emit next")
      pageViewRefs[newVal + 1]?.startLoad()
      pageViewRefs[newVal + 2]?.startLoad()
    } else {
      // prev
      console.log("emit prev")
      pageViewRefs[newVal - 1]?.startLoad()
      pageViewRefs[newVal - 2]?.startLoad()
    }
  }
)

const observer = computed((oldValue) => {
  oldValue?.disconnect()
  if (!parentRef.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!(entry.target as unknown as HTMLImageElement).complete) return
        if (entry.isIntersecting) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pagesIsVisible.add((entry.target as unknown as any).index)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pagesIsVisible.delete((entry.target as unknown as any).index)
        }
      })
    },
    { rootMargin: "0px", threshold: 0.1, root: parentRef.value }
  )

  return observer
})
onBeforeUnmount(() => observer.value?.disconnect())

// useEventListener(window, "keydown", (event) => {
//   switch (event.key) {
//     case "ArrowUp":
//       scroller.y.value -= 250
//       break
//     case "ArrowDown":
//       scroller.y.value += 250
//       break
//     case "ArrowLeft":
//       scroller.x.value -= 250
//       break
//     case "ArrowRight":
//       scroller.y.value += 250
//       break
//   }
// })
</script>

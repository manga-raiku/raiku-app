<template>
  <img
    v-if="!error"
    v-bind="attrs"
    :src="srcImage"
    @load="onLoad"
    ref="imgRef"
    class="min-h-1px"
  />
  <div
    v-if="!loaded"
    v-bind="attrs"
    class="text-center w-100% min-h-40vh aspect-ratio-2 flex items-center justify-center"
    :class="loaderAbsolute ? 'absolute top-0 left-0 w-full h-full' : undefined"
  >
    <slot v-if="intersection?.isIntersecting" name="loading" />
  </div>
  <div
    v-else-if="error"
    v-bind="attrs"
    class="w-550px max-w-100% aspect-ratio-2 flex items-center justify-center"
    :class="loaderAbsolute ? 'absolute top-0 left-0 w-full h-full' : undefined"
  >
    <p>
      {{ $t("error-load-image", [error + "" || -1]) }}
    </p>

    <q-btn
      outline
      color="main-3"
      class="mt-2"
      @click="startLoad(src)"
      :label="$t('thu-lai')"
    />
  </div>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core"

defineOptions({
  inheritAttrs: true,
})

const props = defineProps<{
  src: string
  loaderAbsolute?: boolean
}>()
const emit = defineEmits<{
  (
    name: "load",
    img: HTMLImageElement,
    intersection: IntersectionObserverEntry,
  ): void
  (name: "change:visible", value: boolean): void
}>()
const attrs = useAttrs()

const loaded = ref(false)
const error = ref<unknown>()
const srcImage = ref<string | undefined>()
// Free memory
watch(srcImage, (n, o) => {
  if (o?.startsWith("blob:")) URL.revokeObjectURL(o)
})
function onLoad(event: Event) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  emit("load", event.target as HTMLImageElement, intersection.value!)
  const { src } = event.target as HTMLImageElement
  if (src.startsWith("blob:")) URL.revokeObjectURL(src)
}

// ======= controller =======
const imgRef = ref<HTMLImageElement>()
const intersection = shallowRef<IntersectionObserverEntry>()
useIntersectionObserver(
  imgRef,
  ([inter]) => {
    intersection.value = inter
  },
  {
    threshold: 0,
  },
)

watch(
  () => intersection.value?.isIntersecting,
  (visible = false) => {
    emit("change:visible", visible)
    if (visible) startLoad(props.src)
  },
  { immediate: true },
)
defineExpose({ intersection, imgRef })

// ===========================

let srcLoaded: string | null = null
async function startLoad(src: string) {
  if (!intersection.value?.isIntersecting) return
  if (src === srcLoaded) return
  srcLoaded = null

  loaded.value = false
  error.value = null

  try {
    for (let i = 0; i < 5; i++) {
      try {
        await loadImage(src)
        break
      } catch {
        await sleep(300)
      }
    }
    // const response = await fetchRetry(src, {
    //   retries: 5,
    //   retryDelay: 300,
    // })

    // // eslint-disable-next-line functional/no-throw-statement
    // if (!response.ok) throw new Error("die")

    // srcImage.value = URL.createObjectURL(
    //   new Blob([await response.arrayBuffer()]),
    // )
    srcImage.value = src
    srcLoaded = src
  } catch (err) {
    error.value = err

    await sleep(3_000)
    // eslint-disable-next-line no-void
    void startLoad(src)
  } finally {
    loaded.value = true
  }
}

// try use ajax
watch(() => props.src, startLoad, { immediate: true })
</script>

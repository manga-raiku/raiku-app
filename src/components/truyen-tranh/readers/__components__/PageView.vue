<template>
  <img
    v-if="!error"
    v-bind="attrs"
    :src="srcImage"
    loading="lazy"
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
    <slot name="loading" />
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
      class="mt-2 text-black"
      @click="startLoad(src)"
      :label="$t('thu-lai')"
    />
  </div>
</template>

<script lang="ts" setup>
import empty from "src/assets/empty.png?base64"

defineOptions({
  inheritAttrs: true
})

const props = defineProps<{
  src: string | Promise<string>
  loaderAbsolute?: boolean
  observer?: IntersectionObserver
}>()
const emit = defineEmits<{
  (name: "load", img: HTMLImageElement): void
}>()
const attrs = useAttrs()

const loaded = ref(false)
const error = ref<unknown>()
const srcImage = ref<string | undefined>(empty)

async function onLoad(event: Event) {
  console.log("onLoad", srcImage.value?.slice(0, 120), empty)
  if (srcImage.value === empty) {
    return startLoad(await props.src)
  }

  emit("load", event.target as HTMLImageElement)
  const { src } = event.target as HTMLImageElement
  if (src.startsWith("blob:")) URL.revokeObjectURL(src)
}

// ===========================

let srcLoaded: string | null = null
async function startLoad(src: string | Promise<string>) {
  console.log("start load")
  // eslint-disable-next-line functional/no-let
  let rawSrc = await src

  if (rawSrc === srcLoaded) return
  srcLoaded = null

  loaded.value = false
  error.value = null

  try {
    for (let i = 0; i < 5; i++) {
      try {
        const result = await fastProcessImage(rawSrc)
        if (result.startsWith("blob:")) rawSrc = result
        else await loadImage(result)
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
    srcImage.value = rawSrc
    srcLoaded = rawSrc
  } catch (err) {
    error.value = err

    await sleep(3_000)

    void startLoad(rawSrc)
  } finally {
    loaded.value = true
  }
}

const imgRef = ref<HTMLImageElement>()
defineExpose({ imgRef })
watch([() => props.observer, imgRef], ([observer, img], [, old]) => {
  if (!observer) return
  if (old) props.observer?.unobserve(old)
  if (img) props.observer?.observe(img)
})
onBeforeUnmount(() => imgRef.value && props.observer?.unobserve(imgRef.value))
</script>
